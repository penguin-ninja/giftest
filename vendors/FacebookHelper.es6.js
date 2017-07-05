'use strict';

import _ from 'lodash';

export default class FacebookHelper {

    /**
     * stringifies objects & array in fb style
     * @param attributes
     * @returns {string}
     */
    static stringify_fb_style(attributes) {

        return _.map(attributes, function (value, prop) {
            if (Array.isArray(value)) {
                var res = '';
                value.forEach((item, key) => {
                    res = res + _.map(item, function (val, pro) {
                            return val;
                        }) + ',';
                });
                value = res;
            }

            return `${prop}=${value}`;
        });
    }

    /**
     * returns the image quality of a facebook node
     * @param facebook_node
     * @returns {int}
     */
    static get_image_quality(facebook_node) {
        if (facebook_node) {
            if (facebook_node.photos && facebook_node.photos.data && facebook_node.photos.data[0] && facebook_node.photos.data[0].images && facebook_node.photos.data[0].images.length > 0) {
                return 2 + facebook_node.photos.data[0].images.length;
            }
            if (facebook_node.cover && facebook_node.cover.source) {
                return 2;
            }
            if (facebook_node.picture && facebook_node.picture.data && facebook_node.picture.data.url && !facebook_node.picture.data.is_silhouette) {
                return 1;
            }
        }
        return false;
    };

    /**
     * returns an array of images of a facebook node
     * @param facebook_node
     * @param img_property_name
     * @returns {object}
     */
    static get_images_array(facebook_node, img_property_name = 'source') {

        function get_difference(a, b) {
            try {
                return (a > b) ? a - b : b - a;
            } catch (e) {
                return 0;
            }

        }

        let returnObject = {
            normal: {
                url: undefined, // 500px if possible
                width: undefined,
                height: undefined,
            },
            highres: {
                url: undefined, //best resolution
                width: undefined,
                height: undefined,
            },
        };

        let images_array;

        if (facebook_node.photos && facebook_node.photos.data && facebook_node.photos.data[0] && facebook_node.photos.data[0].images && facebook_node.photos.data[0].images.length > 0) {
            images_array = facebook_node.photos.data[0].images;
        }

        if (facebook_node.images && facebook_node.images.length > 0) {
            images_array = facebook_node.images;
        }

        if (images_array) {
            images_array.forEach((value) => {
                if (typeof value[img_property_name] !== 'undefined') {
                    if (typeof returnObject.normal.url === 'undefined') {
                        returnObject.normal.url = value[img_property_name];
                        returnObject.normal.width = value.width;
                        returnObject.normal.height = value.height;
                    } else {
                        if (
                            get_difference(returnObject.normal.width, 500) > get_difference(value.width, 500)
                            &&
                            value.width >= 500
                        ) {
                            returnObject.normal.url = value[img_property_name];
                            returnObject.normal.width = value.width;
                            returnObject.normal.height = value.height;
                        }
                    }

                    if (typeof returnObject.highres.url === 'undefined') {
                        returnObject.highres.url = value[img_property_name];
                        returnObject.highres.width = value.width;
                        returnObject.highres.height = value.height;
                    } else {
                        if (value.width > returnObject.highres.width) {
                            returnObject.highres.url = value[img_property_name];
                            returnObject.highres.width = value.width;
                            returnObject.highres.height = value.height;
                        }
                    }
                }
            });

            return returnObject;
        }

        if (facebook_node.source) {
            returnObject.normal.url = facebook_node.source;
            returnObject.highres.url = facebook_node.source;
            return returnObject;
        }
        if (facebook_node.cover) {
            returnObject.normal.url = facebook_node.cover.source;
            returnObject.highres.url = facebook_node.cover.source;
            return returnObject;
        }
        if (facebook_node.picture && facebook_node.picture.data && facebook_node.picture.data.url && !facebook_node.picture.data.is_silhouette) {
            returnObject.normal.url = facebook_node.picture.data.url;
            returnObject.highres.url = facebook_node.picture.data.url;
        }
        return returnObject;
    }

    /**
     * returns the amount of actions of a facebook node
     * @param facebook_node
     * @param actions
     * @returns {number}
     */
    static get_actions_amount(facebook_node, actions = ['likes', 'comments', 'sharedposts', 'tags', 'reactions']) {
        let sum = 0;

        if (typeof facebook_node !== 'undefined' && facebook_node !== null && typeof facebook_node === 'object') {
            actions.forEach((action) => {
                if (facebook_node[action] && facebook_node[action].data && facebook_node[action].data.length) {
                    sum += facebook_node[action].data.length;
                }
            });
        }
        return sum;
    }
}
