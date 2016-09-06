// jshint esversion:6
var API = function (config) {
    this.apiKey = config.key;
    this.baseUrl = config.baseUrl;
    this.templates = {
        "issues": "/issues.json",
        "issue": "/issues/{id}.json",
        "users": "/users.json",
        "user": "/users/{id}.json",
        "current_user": "/users/current.json",
        "time_entries": "/time_entries.json",
        "time_entry": "/time_entries/{id}.json"
    };
};

API.prototype = {
    get: function (api, config, callback) {
        config.method = "GET";
        var reqCfg = this.getRequestConfig(api, config);
        this.request(reqCfg, callback);
    },

    set: function (api, config, callback) {
        config.method = "POST";
        var reqCfg = this.getRequestConfig(api, config);
        this.request(reqCfg, callback);
    },

    getRequestConfig: function (api, config) {
        var url = this.buildUrl(api, config),
            headers = {
                "Content-Type": "application/json",
                "X-Redmine-API-Key": this.apiKey
            },
            data;

        if (url.method === "GET") {
            url += this.encodeUrlParams(config.params);
        } else {
            data = this.preparePostData(config.params);
        }

        return {
            method: config.method,
            headers: headers,
            url: url,
            data: data
        };
    },

    buildUrl: function (api, config) {
        return this.baseUrl + this.applyTemplate(api, config);
    },

    applyTemplate: function (api, config) {
        var tpl = this.templates[api];
        
        if (!tpl) {
            throw new Error("Incorrect template");
        }

        return tpl.replace(/{[\w]+}/g, function (item) {
            item = item.replace(/[{}]/g,'');

            if (!config[item]) {
                throw new Error("Incorrect template parameter: " + item);
            }

            return config[item];
        });
    },

    encodeUrlParams: function (params) {
        var encoded = [];
        params = params || [];

        for(let one in params) {
            if (params.hasOwnProperty(one)) {
                encoded.push(encodeURIComponent(one) + "=" + encodeURIComponent(params[one]));
            }
        }

        return encoded.length > 0 ? "?" + encoded.join("&") : "";
    },

    preparePostData: function (params) {
        return JSON.stringify(params);
    },

    request: function (config, callback) {
        var request = new XMLHttpRequest(),
            headers = config.headers;

        request.open(config.method, config.url, true);

        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                request.setRequestHeader(key, headers[key]);
            }
        }

        request.onload = function () {
            var result = {
                success: true,
                data: {}
            };

            try {
                result.data = JSON.parse(this.responseText);
            } catch (e) {
                result.success = false;
            } finally {
                result.code = this.status;
                result.text = this.responseText;
            }
            
            callback(result);
        };

        request.send(config.data);
    }
};