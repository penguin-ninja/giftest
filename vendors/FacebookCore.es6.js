import _ from 'lodash';
import Promise from 'promise';

export default class FacebookCore {

    constructor(fb_sdk) {
        this.fb = fb_sdk;
    }

    /**
     * promise wrapper for `FB.login()`
     * @param params
     */
    login_p(params = {}) {
        return new Promise((resolve, reject) => {
            this.fb.login(function (response) {
                if (response && response.authResponse) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }, params);
        });
    }

    /**
     * promise wrapper for `FB.logout()`
     */
    logout_p() {
        return new Promise((resolve, reject) => {
            this.fb.logout(function (response) {
                resolve(response);
            });
        });
    }

    /**
     * promise wrapper for `FB.getLoginStatus()`
     */
    get_login_status_p() {
        return new Promise((resolve, reject) => {
            this.fb.getLoginStatus(function (response) {
                resolve(response);
            });
        });
    }

    /**
     * promise wrapper for `FB.api()`
     * @param path
     * @param method
     * @param params
     */
    api_p(path, method = 'get', params = {}) {
        return new Promise((resolve, reject) => {
            this.fb.api(path, method, params, (response) => {
                let isError = false;
                let errorMessage = '';

                // FB.api call doesnt return a response at all
                if (!response) {
                    isError = true;
                    errorMessage = 'Response is empty';
                } else {
                    // FB.api call returns an unknown status
                    // according error message gets created
                    if (response.status === 'unknown') {
                        isError = true;
                        errorMessage = 'Unknown error';

                        // FB.api call returns a response error
                        // according error message gets created depending on the return type
                    } else if (response.error || response === 'error') {
                        isError = true;
                        errorMessage = response.error;
                    }
                }
                if (isError) {
                    reject({
                        error: errorMessage,
                        path: path,
                        method: method,
                        params: params
                    });
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * recursive promise wrapper for `this.api_p`
     * @param promise
     * @param config
     */
    recursive_p(promise, config) {
        let _this = this;

        config = _.extend({
            max_items: 250,
        }, config);

        if (isNaN(config.max_items) || config.max_items < 1) {
            config.max_items = undefined;
        } else {
            config.max_items = Math.round(config.max_items);
        }
        let started = false;

        return new Promise((resolve, reject) => {

            let temp_result_array = [];

            function recursive(inner_promise) {
                function call(response) {

                    if (response && !response.error) {
                        started = true;

                        if (Array.isArray(response.data)) {
                            temp_result_array = temp_result_array.concat(response.data);
                        } else {
                            if (Array.isArray(response)) {
                                temp_result_array = temp_result_array.concat(response);
                            } else if (typeof response === 'object') {
                                temp_result_array.push(response);
                            }
                        }
                        if (response.paging && response.paging.next && (!config.max_items || temp_result_array.length < config.max_items)) {
                            recursive(_this.api_p(response.paging.next));
                        } else {
                            if (config.max_items) {
                                temp_result_array = temp_result_array.slice(0, config.max_items);
                            }
                            resolve(temp_result_array);
                        }
                    } else {
                        if (!started) {
                            reject(response);
                        }

                        if (config.max_items) {
                            temp_result_array = temp_result_array.slice(0, config.max_items);
                        }
                        resolve(temp_result_array);
                    }
                }

                inner_promise
                    .then(response => {
                        call(response);
                    }).catch(response => {
                    call(response);
                });
            }

            recursive(promise);
        });
    }

    /**
     * The promise `bulk_api_p()` helps you to access the same endpoint for an array of nodes
     * @param nodes
     * @param endpoint
     * @param bulk_settings
     */
    bulk_api_p(nodes, endpoint = '', bulk_settings) {
        let _this = this;

        bulk_settings = _.extend({}, bulk_settings);

        if (endpoint !== '' && endpoint.split('')[0] !== '/') {
            endpoint = `/${endpoint}`;
        }

        return new Promise((resolve, reject) => {

            let promises = [];

            nodes.forEach((item) => {
                if (item && item.id) {
                    promises.push(_this.api_p(`/${item.id}${endpoint}`, 'get', bulk_settings));
                }
            });

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(response => {
                    let objects = [];
                    if (typeof response !== 'undefined' && Array.isArray(response)) {
                        response.forEach((object) => {
                            if (typeof object.error === 'undefined') {
                                objects.push(object);
                            }
                        });
                    }
                    resolve(objects);
                });

        });
    }

    /**
     * this promise helps you perform bulk requests on the graph api
     * @param requests
     * @param config
     */
    batch_p(requests = [], config) {
        let _this = this;

        config = _.extend({
            split: 42,
        }, config);

        return new Promise((resolve, reject) => {
            if (!Array.isArray(requests)) {
                reject({error: {message: 'TypeError'}});
            }

            let promises = [];

            while (requests.length) {
                let promises_part = requests.splice(0, config.split);
                promises.push(_this.api_p('/', 'post', {batch: promises_part}));
            }

            Promise.all(promises.map(p => p.catch(e => e)))
                .then(response => {
                    let result = [];

                    response.forEach((response_array) => {
                        response_array.forEach((item) => {
                            try {
                                result.push(JSON.parse(item.body));
                            } catch (e) {
                                result.push({error: {message: 'JSON.parse() of item.body failed', item: item}});
                            }
                        });
                    });

                    resolve(result);
                });

        });
    }
}