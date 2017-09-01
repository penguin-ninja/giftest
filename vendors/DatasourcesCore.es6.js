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
            request_highres: true,
            request_birthday: true,
            batch_split: 50,
        }, config);

        let _this = this;

        return new Promise((resolve, reject) => {

            if (nodes.length === 0) {
                resolve([]);
            }

            let batch_array = [];

            //change this, if you are adding or removing batch requests per node
            const REQUESTS_PER_NODE = config.request_highres ? 3 : 2;

            nodes.forEach((node) => {
                let birthday_string_part = '';
                if (config.request_birthday === true) {
                    birthday_string_part = ',birthday';
                }
                batch_array.push({
                    method: 'GET',
                    relative_url: `${node}?fields=id,name,first_name,last_name,gender,locale${birthday_string_part}`
                });
                batch_array.push({
                    method: 'GET',
                    relative_url: `${node}/picture?height=${config.img_size_low}&width=${config.img_size_low}&type=large&redirect=false`
                });
                if (config.request_highres === true) {
                    batch_array.push({
                        method: 'GET',
                        relative_url: `${node}/picture?height=${config.img_size_high}&width=${config.img_size_high}&type=large&redirect=false`,
                    });
                }
            });

            const batch_config = {
                split: config.batch_split //splits the batch_arrays in seperate requests, with the size of 50
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
                    reject(error);
                });
        });
    };

    /**
     * this promise returns a list of soulmates of a facebook node, especially of a user node
     * @param node
     * @param soulmate_points
     */
    get_ordered_soulmates(node = '/me', soulmate_points, config) {

        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        soulmate_points = _.extend({
            //photos
            photo_one: 6,
            photo_two: 4,
            photo_many: 2,
            photos_limit: 50,

            //posts
            post_comment: 4,
            post_comment_withtags: 1,
            post_like: 6,
            post_like_withtags: 1,
            post_mention: 6,
            post_tag: 4,
            posts_limit: 40,

            //friends
            appfriend: 2,
        }, soulmate_points);

        config = _.extend({
            //photos
            use_photos: true,
            photos_limit: 25,
            photos_max_items: 50,
            photos_request_highres: true,

            //posts
            use_posts: true,
            posts_limit: 25,
            posts_max_items: 50,

            //friends
            use_friends: true,
            friends_limit: 25,
            friends_max_items: 150,

            //general
            batch_split: 50,
        }, config);

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
                    limit: config.photos_limit,
                };
                const photos_config = {
                    max_items: config.photos_max_items,
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
                        reject(error);
                    });

            });
        }

        function analyze_friends() {
            return new Promise((resolve, reject) => {
                const friends_settings = {
                    fields: 'id',
                    limit: config.friends_limit,
                };
                const friends_config = {
                    max_items: config.friends_max_items
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
                    limit: config.posts_limit,
                };
                const posts_config = {
                    max_items: config.posts_max_items
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
            const promises = [];

            if (config.use_friends === true) {
                promises.push(analyze_friends());
            }

            if (config.use_posts === true) {
                promises.push(analyze_posts());
            }

            if (config.use_photos === true) {
                promises.push(analyze_photos());
            }

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(response => {

                    filter_soulmate_users()
                        .then(function (soulmates) {

                            let ordered_soulmates = Object.keys(soulmates).sort(function (a, b) {
                                return soulmates[b]['chance'] - soulmates[a]['chance'];
                            });

                            const get_nodes_data_config = {
                                request_birthday: false,
                                request_highres: config.photos_request_highres,
                                batch_split: config.batch_split,
                            };

                            _this.get_nodes_data(ordered_soulmates, get_nodes_data_config)
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        });
                });
        });

    };

}
