import _ from 'lodash';
import Promise from 'promise';

export default class DatasourcesCore {
    constructor(config = {}) {
        this.fb_core = config.fb_core;
        this.fb_promises = config.fb_promises;
    }

    /**
     * this promise returns some facebook node information, especially for a user node
     * @param nodes
     * @param config
     */
    get_nodes_data(nodes, config) {

        config = _.extend({
            img_size_low: 320,
            img_size_high: 960,
        }, config);

        let _this = this;

        return new Promise((resolve, reject) => {

            if (nodes.length === 0) {
                resolve([]);
            }

            let batch_array = [];

            //change this, if you are adding or removing batch requests per node
            const REQUESTS_PER_NODE = 3;

            nodes.forEach((node) => {
                batch_array.push({
                    method: 'GET',
                    relative_url: node + '?fields=id,name,first_name,last_name,gender,locale,birthday'
                });
                batch_array.push({
                    method: 'GET',
                    relative_url: node + '/picture?height=' + config.img_size_low + '&width=' + config.img_size_low + '&type=large&redirect=false'
                });
                batch_array.push({
                    method: 'GET',
                    relative_url: node + '/picture?height=' + config.img_size_high + '&width=' + config.img_size_high + '&type=large&redirect=false'
                });
            });

            const batch_config = {
                split: 50 //splits the batch_arrays in seperate requests, with the size of 50
            };

            _this.fb_core.batch_p(batch_array, batch_config)
                .then(response => {
                    let result_array = [];
                    let users_data = [];
                    for (let i = 0; i < response.length; i++) {
                        users_data.push(response[i]);
                        if ((i + 1) % REQUESTS_PER_NODE === 0) {
                            result_array.push(users_data);
                            users_data = [];
                        }
                    }
                    resolve(result_array);
                })
                .catch(error => {
                    reject();
                });
        });
    };

    /**
     * this promise returns a list of soulmates of a facebook node, especially of a user node
     * @param node
     * @param soulmate_points
     */
    get_ordered_soulmates(node = '/me', soulmate_points) {

        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        soulmate_points = _.extend({
            appfriend: 1,
            photo_many: 1,
            photo_one: 3,
            photo_two: 2,
            photos_limit: 50,
            post_comment: 2,
            post_comment_withtags: 1,
            post_like: 3,
            post_like_withtags: 1,
            post_mention: 3,
            post_tag: 2,
            posts_limit: 50
        }, soulmate_points);

        let candidates = [];

        function get_candidates() {
            return candidates;
        }

        function gather_candidates(id, chance) {
            if (candidates[id]) {
                // candidate exists, increase his chance to be soulmate
                candidates[id]['chance'] += chance;
            } else {
                candidates[id] = {id: id, chance: chance};
            }

        }

        function analyze_photos() {
            return new Promise((resolve, reject) => {
                const photos_settings = {
                    fields: 'id,tags',
                    limit: 25,
                };
                const photos_config = {
                    max_items: soulmate_points.photos_limit
                };

                _this.fb_promises.get_photos(node, photos_settings, photos_config)
                    .then(function (response) {
                        for (let img in response) {
                            let photo = response[img];

                            if (photo.tags && photo.tags.data && photo.tags.data.length > 0) {
                                for (let photo_tag in photo.tags.data) {
                                    if (photo.tags.data[photo_tag] && photo.tags.data[photo_tag].id) {
                                        if (photo.tags.data.length <= 2) {
                                            gather_candidates(photo.tags.data[photo_tag].id, soulmate_points.photo_one);
                                        } else if (photo.tags.data.length <= 3) {
                                            gather_candidates(photo.tags.data[photo_tag].id, soulmate_points.photo_two);
                                        } else if (photo.tags.data.length <= 10) {
                                            gather_candidates(photo.tags.data[photo_tag].id, soulmate_points.photo_many);
                                        }
                                    }
                                }
                            }
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        reject();
                    });

            });
        };

        function analyze_friends() {
            return new Promise((resolve, reject) => {
                const friends_settings = {
                    fields: 'id',
                    limit: 25,
                };
                const friends_config = {
                    max_items: 150
                };

                _this.fb_promises.get_friends(node, friends_settings, friends_config)
                    .then(function (response) {
                        for (let f in response) {
                            gather_candidates(response[f].id, soulmate_points.appfriend);
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        reject();
                    });
            });
        }

        function analyze_posts() {
            return new Promise((resolve, reject) => {
                const posts_settings = {
                    fields: 'id,likes,comments,with_tags,to',
                    limit: 25,
                };
                const posts_config = {
                    max_items: soulmate_points.posts_limit
                };

                _this.fb_promises.get_posts(node, posts_settings, posts_config)
                    .then(function (response) {
                        for (let stat in response) {
                            try {

                                if (response[stat]) {
                                    let interaction = response[stat];

                                    // comments
                                    if (interaction.comments && interaction.comments.data.length > 0) {
                                        for (let com in interaction.comments.data) {
                                            if (interaction.comments.data[com] && interaction.comments.data[com].from && interaction.comments.data[com].from.id) {
                                                if (interaction.with_tags && interaction.with_tags.data.length > 0) {
                                                    gather_candidates(interaction.comments.data[com].from.id, soulmate_points.post_comment_withtags);
                                                } else {
                                                    gather_candidates(interaction.comments.data[com].from.id, soulmate_points.post_comment);
                                                }
                                            }
                                        }
                                    }

                                    // likes
                                    if (interaction.likes && interaction.likes.data.length > 0) {
                                        for (let like in interaction.likes.data) {
                                            if (interaction.likes.data[like] && interaction.likes.data[like].id) {
                                                if (interaction.with_tags && interaction.with_tags.data.length > 0) {
                                                    gather_candidates(interaction.likes.data[like].id, soulmate_points.post_like_withtags);
                                                } else {
                                                    gather_candidates(interaction.likes.data[like].id, soulmate_points.post_like);
                                                }
                                            }
                                        }
                                    }

                                    // with tags
                                    if (interaction.with_tags && interaction.with_tags.data.length > 0) {
                                        for (let wtag in interaction.with_tags.data) {
                                            if (interaction.with_tags.data[wtag] && interaction.with_tags.data[wtag].id) {
                                                gather_candidates(interaction.with_tags.data[wtag].id, soulmate_points.post_tag);
                                            }
                                        }
                                    }

                                    // to
                                    if (interaction.to && interaction.to.data.length > 0) {
                                        for (let to in interaction.to.data) {
                                            if (interaction.to.data[to] && interaction.to.data[to].id) {
                                                gather_candidates(interaction.to.data[to].id, soulmate_points.post_mention);
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                // instead of rejecting, just continue with next interaction
                            }
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        reject();
                    });
            });
        }

        function filter_soulmate_users() {
            let soulmate_array = get_candidates();

            return new Promise((resolve, reject) => {

                    let batch_array = [];

                    for (let key in soulmate_array) {
                        const item = soulmate_array[key];
                        batch_array.push({method: 'GET', relative_url: item.id + '?metadata=1&fields=id,metadata{type}'});
                    }

                    const config = {
                        split: 50 //splits the batch_arrays in seperate requests, with the size of 50
                    };

                    _this.fb_core.batch_p(batch_array, config)
                        .then(response => {
                            for (let key in response) {
                                const item = response[key];
                                if (item.metadata.type !== 'user') {
                                    delete soulmate_array[key];
                                }
                            }

                            resolve(soulmate_array);
                        });
                }
            );
        }

        return new Promise((resolve, reject) => {
            const promises = [
                analyze_photos(),
                analyze_friends(),
                analyze_posts()
            ];

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(response => {

                    filter_soulmate_users()
                        .then(function (soulmates) {

                            let ordered_soulmates = Object.keys(soulmates).sort(function (a, b) {
                                return soulmates[b]['chance'] - soulmates[a]['chance'];
                            });

                            _this.get_nodes_data(ordered_soulmates)
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject();
                                });
                        });
                });
        });

    };

}
