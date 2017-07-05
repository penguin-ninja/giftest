import _ from 'lodash';
import Promise from 'promise';

export default class FacebookEndpointPromises {

    constructor(facebook_core, config = {}) {
        this.fb = facebook_core;

        this.global_config = _.extend({
            max_items: 100,
            limit: 25,
            bulk_max_items: 20,
        }, config);
    }

    /**
     * this promise returns /albums from a specific fb node
     * @param node
     * @param albums_settings
     * @param albums_config
     */
    get_albums(node = '/me', albums_settings, albums_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        albums_settings = _.extend({
            fields: 'id,type,name,count',
            limit: _this.global_config.limit,
        }, albums_settings);

        albums_config = _.extend({
            skip_empty_albums: true,
            skip_app_albums: true,
            include_albums: undefined,
            compare_parameter: undefined,
            max_items: _this.global_config.max_items,
        }, albums_config);

        return new Promise((resolve, reject) => {

            this.fb.recursive_p(
                this.fb.api_p(`${node}/albums`, 'get', albums_settings),
                {
                    max_items: albums_config.max_items,
                }
            ).then(function (response) {
                let albums = [];

                response.forEach((album) => {
                    if (typeof album === 'undefined') {
                        return;
                    }
                    if (albums_config.skip_app_albums === true && album.type === 'app') {
                        return;
                    }
                    if (isNaN(album.id)) {
                        return;
                    }

                    if (typeof albums_config.include_albums !== 'undefined' && Array.isArray(albums_config.include_albums)) {
                        if (_.intersection([album[albums_config.compare_parameter]], albums_config.include_albums).length < 1) {
                            return;
                        }
                    }

                    if (albums_config.skip_empty_albums) {
                        if (typeof album.count !== 'undefined') {
                            if (album.count < 1) {
                                return;
                            }
                        }
                    }

                    albums.push(album);
                });

                resolve(albums);
            }).catch(error => {
                reject(error);
            });

        });
    }

    /**
     * this promise returns /photos from a specific fb node
     * @param node
     * @param photos_settings
     * @param photos_config
     */
    get_photos(node = '/me', photos_settings, photos_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        photos_settings = _.extend({
            limit: _this.global_config.limit,
            fields: 'id,source,name,created_time,images,place{id,name}',
        }, photos_settings);

        photos_config = _.extend({
            skip_without_place_id: false,
            max_items: _this.global_config.max_items,
        }, photos_config);

        return new Promise((resolve, reject) => {

            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/photos`, 'get', photos_settings),
                {
                    max_items: photos_config.max_items,
                }
            ).then(function (response) {
                let photos = [];

                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((photo) => {
                        if (photos_config.skip_without_place_id === true) {
                            if (!photo.place || !photo.place.id) {
                                return;
                            }
                        }
                        photos.push(photo);
                    });
                }

                resolve(photos);
            }).catch(error => {
                reject(error);
            });

        });
    }

    /**
     * this promise returns /friends from a specific fb node
     * @param node
     * @param friends_settings
     * @param friends_config
     */
    get_friends(node = '/me', friends_settings, friends_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        friends_settings = _.extend({
            limit: _this.global_config.limit,
            fields: 'id,first_name,last_name,gender',
        }, friends_settings);

        friends_config = _.extend({
            max_items: _this.global_config.max_items,
        }, friends_config);

        return new Promise((resolve, reject) => {

            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/friends`, 'get', friends_settings),
                {
                    max_items: friends_config.max_items,
                }
            ).then(function (response) {
                let friends = [];
                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((friend) => {
                        friends.push(friend);
                    });
                }

                resolve(friends);
            }).catch(error => {
                reject(error);
            });

        });
    }

    /**
     * this promise returns /posts from a specific fb node
     * @param node
     * @param posts_settings
     * @param posts_config
     */
    get_posts(node = '/me', posts_settings, posts_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        posts_settings = _.extend({
            limit: _this.global_config.limit,
            fields: 'id,message,created_time,place,full_picture,picture',
        }, posts_settings);

        posts_config = _.extend({
            skip_without_place_id: false,
            skip_without_message: false,
            max_items: _this.global_config.max_items,
        }, posts_config);

        return new Promise((resolve, reject) => {

            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/posts`, 'get', posts_settings, posts_config),
                {
                    max_items: posts_config.max_items,
                }
            ).then(function (response) {
                let posts = [];
                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((post) => {
                        if (posts_config.skip_without_place_id === true && (!post.place || !post.place.id)) {
                            return;
                        }
                        if (posts_config.skip_without_message === true && !post.message) {
                            return;
                        }

                        posts.push(post);
                    });
                }
                resolve(posts);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * this promise returns /tagged_places from a specific fb node
     * @param node
     * @param places_settings
     * @param places_config
     */
    get_tagged_places(node = '/me', places_settings, places_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        places_settings = _.extend({
            limit: _this.global_config.limit,
            fields: 'id,place{id,location,name,cover,photos{images.limit(1)},picture},created_time',
            since: 0,
        }, places_settings);

        places_config = _.extend({
            max_items: _this.global_config.max_items,
        }, places_config);

        return new Promise((resolve, reject) => {
            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/tagged_places`, 'get', places_settings),
                {
                    max_items: places_config.max_items,
                }
            ).then(function (response) {
                let places = [];
                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((place) => {
                        places.push(place);
                    });
                }
                resolve(places);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * this promise returns /permissions from a specific fb node
     * @param node
     * @param permissions_settings
     * @param permissions_config
     */
    get_permissions(node = '/me', permissions_settings, permissions_config) {
        let _this = this;

        permissions_settings = _.extend({
            fields: 'status,permission',
        }, permissions_settings);

        permissions_config = _.extend({
            include_granted: true,
            include_declined: true,
        }, permissions_config);

        return new Promise((resolve, reject) => {
            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/permissions`, 'get', permissions_settings)
            ).then(function (response) {
                let permissions = [];
                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((permission) => {
                        if (permissions_config.include_granted === false && permission.status === 'granted') {
                            return;
                        }
                        if (permissions_config.include_declined === false && permission.status === 'declined') {
                            return;
                        }
                        permissions.push(permission);
                    });
                }
                resolve(permissions);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * this promise returns /events from a specific fb node
     * @param node
     * @param events_settings
     * @param events_config
     */
    get_events(node = '/me', events_settings, events_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        events_settings = _.extend({
            limit: _this.global_config.limit,
            fields: 'place,name,start_time,timezone,id,rsvp_status,cover,photos.limit(1)',
            since: 0,
        }, events_settings);

        events_config = _.extend({
            skip_without_place_id: false,
            max_items: _this.global_config.max_items,
        }, events_config);

        return new Promise((resolve, reject) => {
            _this.fb.recursive_p(
                _this.fb.api_p(`${node}/events`, 'get', events_settings),
                {
                    max_items: events_config.max_items,
                }
            ).then(function (response) {
                let events = [];
                if (typeof response !== 'undefined' && Array.isArray(response)) {
                    response.forEach((event) => {
                        if (typeof event !== 'undefined') {
                            if (events_config.skip_without_place_id === true && (!event.place || !event.place.id)) {
                                return;
                            }
                            events.push(event);

                        }
                    });
                }
                resolve(events);
            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * this promise returns all /photos and /{album-id}/photos for all albums from a specific fb node
     * @param node
     * @param albums_settings
     * @param photos_settings
     * @param albums_config
     * @param photos_config
     */
    get_all_photos(node = '/me', albums_settings = {}, photos_settings = {}, albums_config = {}, photos_config = {}) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        return new Promise((resolve, reject) => {

            this.get_albums(node, albums_settings, albums_config)
                .then(function (response) {

                    let promises = [];

                    // get tagged photos
                    if (typeof albums_config.include_albums === 'undefined' || (Array.isArray(albums_config.include_albums) && albums_config.include_albums.length === 0)) {
                        promises.push(_this.get_photos(node, photos_settings, photos_config));
                    }

                    // get photos of all albums
                    if (typeof response !== 'undefined' && Array.isArray(response)) {
                        response.forEach((album) => {
                            if (typeof album.id !== 'undefined' && !isNaN(album.id)) {
                                promises.push(_this.get_photos(album.id, photos_settings, photos_config));
                            }
                        });
                    }

                    Promise.all(promises.map(p => p.catch(e => e)))
                        .then(albums => {
                            let photos = [];

                            albums.forEach((album) => {
                                if (typeof album !== 'undefined' && typeof album.error === 'undefined' && Array.isArray(album)) {
                                    photos = photos.concat(album);
                                }
                            });

                            //remove doubles
                            photos = _.uniqBy(photos, 'id');
                            resolve(photos);
                        });

                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
     * this promise returns all locations from a specific fb node by requests to different endpoints
     * @param node
     * @param locations_settings
     * @param locations_config
     */
    get_all_locations(node = '/me', locations_settings, locations_config) {
        let _this = this;

        if (node !== '' && node.split('')[0] !== '/') {
            node = `/${node}`;
        }

        locations_settings = _.extend({
            fields: 'id,name,cover,photos.limit(1){images},picture',
        }, locations_settings);

        locations_config = _.extend({
            use_images: true,
            use_posts: true,
            use_tagged_places: true,
            use_events: true,
            bulk_max_items: _this.global_config.bulk_max_items,
        }, locations_config);

        return new Promise((resolve, reject) => {
            let promises = [];

            if (locations_config.use_images) {
                const albums_settings = {};
                const photos_settings = {
                    fields: 'id,created_time,name,source,place{id,name}'
                };
                const albums_config = {
                    max_items: locations_config.bulk_max_items,
                };
                const photos_config = {
                    skip_without_place_id: true,
                    max_items: locations_config.bulk_max_items,
                };
                promises.push(_this.get_all_photos(node, albums_settings, photos_settings, albums_config, photos_config));
            }

            if (locations_config.use_tagged_places) {
                const places_settings = {};
                const places_config = {
                    max_items: locations_config.bulk_max_items,
                };
                promises.push(_this.get_tagged_places(node, places_settings, places_config));
            }

            if (locations_config.use_events) {
                const events_settings = {};
                const events_config = {
                    skip_without_place_id: true,
                    max_items: locations_config.bulk_max_items,
                };
                promises.push(_this.get_events(node, events_settings, events_config));
            }

            if (locations_config.use_posts) {
                const posts_settings = {};
                const posts_config = {
                    skip_without_place_id: true,
                    max_items: locations_config.bulk_max_items,
                };
                promises.push(_this.get_posts(node, posts_settings, posts_config));
            }

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(function (data) {

                    let initArray = [];

                    data.forEach((item) => {
                        if (typeof item.error === 'undefined') {
                            initArray.push(item);
                        }
                    });

                    let tempArray = [];

                    initArray.forEach((item) => {
                        item.forEach((innerItem) => {
                            if (innerItem.place) {
                                tempArray.push(innerItem.place);
                            }
                        });
                    });

                    const groupedArray = _.groupBy(tempArray, 'id');
                    const orderedArray = _.orderBy(groupedArray, ['length'], ['desc']);

                    let middleArray = [];

                    orderedArray.forEach((item) => {
                        item[0].amount = item.length; // helper property
                        middleArray.push(item[0]);
                    });

                    middleArray = _.uniqBy(middleArray, 'id');

                    const locationsEndpoint = '';

                    _this.fb.bulk_api_p(middleArray, locationsEndpoint, locations_settings)
                        .then(function (innerData) {
                            resolve({
                                data: innerData,
                                src: middleArray,
                            });
                        });
                });

        });
    }
}