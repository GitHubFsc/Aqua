( function(ns, $, base64Encode, SHA1, utf16to8) {
    var inherit = ( function() {
        var F = function() {

        };
        return function(C, P) {
            F.prototype = P.prototype;
            C.prototype = new F();
            C.uber = P;
            C.prototype.constructor = C;
        };
    }());

    function appendSlash(uri, isPrepend) {
        if ( typeof uri !== 'string') {
            uri = '';
        }
        if (isPrepend && uri.charAt(0) !== '/') {
            uri = '/' + uri;
        }
        if (uri.lastIndexOf('/') !== uri.length - 1) {
            uri = uri + '/';
        }
        return uri;
    };

    function commonObject(obj) {
        $.extend(this, obj);
        this._init();
    };

    commonObject.prototype = {
        _init: function() {
            if ( typeof this.path !== 'string') {
                this.path = '';
            }
            this.path = appendSlash(this.path, true);
            if ( typeof this.name !== 'string') {
                this.name = '';
            }
            if ( typeof this._aquaEnv == 'undefined') {
                this._aquaEnv = new Aqua();
            }
            this.url = this._aquaEnv.restRoot + this.path + this.name;
        },

        _getter: function(obj, async) {
            this._transfer('GET', obj, async, function(data) {
                $.extend(this, data);
            });
        },

        _setter: function(obj, async) {
            this._transfer('PUT', obj, async, function(data) {
                $.extend(this, obj, data);
            }, JSON.stringify(obj));
        },

        _transfer: function(type, obj, async, callback, sendData, errorCallback) {
            var query = this._getDataQuery(obj);
            var url = this.url + query;
            var self = this;
            $.ajax({
                type: type,
                url: url,
                async: !!async,
                dataType: 'json',
                data: sendData,
                headers: this._getAjaxRequestHeaders(type, url, this.contentType),
            }).done(function(data) {
                if ( typeof callback == 'function') {
                    callback.call(self, data);
                }
                if ( typeof self.onAjaxDone == 'function') {
                    self.onAjaxDone();
                }
            }).fail(function(jqXhr) {
                if (jqXhr.status == 204) {
                    if ( typeof callback == 'function') {
                        callback.call(self, null, jqXhr);
                    }
                    if ( typeof self.onAjaxDone == 'function'){
                        self.onAjaxDone();
                    }
                } else {
                    if ( typeof errorCallback == 'function') {
                        errorCallback.call(self, jqXhr);
                    }
                    if ( typeof self.onAjaxFail == 'function') {
                      self.onAjaxFail();
                    }
                }
            }).always(function(){
              if(typeof self.onAjaxAlways == 'function'){
                self.onAjaxAlways();
              }
            });
        },

        _getAjaxRequestHeaders: function(type, url, contentType) {
            return this._aquaEnv.getAjaxRequestHeaders(type, url, contentType);
        },

        _getDataQuery: function(obj) {
            var query = '';
            var queryItems = [];
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                	if (item === 'children'){
                		if(obj[item]){
                			queryItems.push('children:' + obj[item]);
                		} else {
                			queryItems.push('children');
                		}
                	} else if (item !== 'metadata') {
                        queryItems.push(item);
                    } else {
                        var meta = obj[item];
                        var mtemLen = 0;
                        for (var mtem in meta) {
                            if (meta.hasOwnProperty(mtem)) {
                                mtemLen++;
                                queryItems.push('metadata:' + mtem);
                            }
                        }
                        if (mtemLen === 0) {
                            queryItems.push('metadata');
                        }
                    }
                }
            }
            if (queryItems.length > 0) {
                query += ('?' + queryItems.join(';') + ';');
            }
            return query;
        },

        setItem: function(obj) {
            $.extend(this, obj);
            this._init();
            return this;
        },

        isExist: function() {
            var exist = false;
            this._transfer('GET', {
                objectID: ''
            }, false, function() {
                exist = true;
            });
            return exist;
        },

        create: function(async) {
            var obj = {};
            if (this.metadata) {
                obj.metadata = this.metadata;
            }
            this._setter(obj, async);
            return this;
        },

        delObj: function(async) {
            this._transfer('DELETE', {}, async, function(data) {
                this.deleted = true;
            });
            return this;
        },

        getMetadata: function(meta, async) {
            var obj = {
                metadata: meta,
            };
            this._getter(obj, async);
            return this;
        },

        getAllFields: function(obj, async) {
            this._getter(obj, async);
            return this;
        },

        setMetadata: function(meta, async) {
            var obj = {
                metadata: meta,
            };
            this._setter(obj, async);
            return this;
        },

        setAllFields: function(obj, async) {
            this._setter(obj, async);
            return this;
        },

        forceCreate: function() {
            if (this.isExist()) {
                return true;
            } else {
                var parents = this.path.split('/');
                var parentName = parents.pop();
                while (!parentName) {
                    parentName = parents.pop();
                }
                var parentPath = parents.join('/');
                var parentContainer = this._aquaEnv.getContainer({
                    path: parentPath,
                    name: parentName
                });

                if (parentContainer.forceCreate()) {
                    this.create();
                    return true;
                } else {
                    return false;
                }
            }
        },

    };

    function object(obj) {
        this.constructor.uber.call(this, obj);
    };
    inherit(object, commonObject);
    object.prototype.contentType = 'application/cdmi-object';
    object.prototype.copyFrom = function(async, from, successCallback, errorCallback) {
      var self = this;
      var obj = {
        "copy": from,
      };
      var type = "PUT",
        sendData = JSON.stringify(obj);
      var url = this.url;
      url = url + "?synccopy=1"
      $.ajax({
        type: type,
        url: url,
        async: !!async,
        dataType: 'json',
        data: sendData,
        headers: this._getAjaxRequestHeaders(type, url, this.contentType),
      }).done(function (data) {
        if (typeof successCallback == 'function') {
          successCallback.call(self, data);
        }
      }).fail(function (jqXhr) {
        if (jqXhr.status == 204) {
          if (typeof successCallback == 'function') {
            successCallback.call(self, null, jqXhr);
          }
        } else {
          if (typeof errorCallback == 'function') {
            errorCallback.call(self, jqXhr);
          }
        }
      });
    };

    function container(obj) {
        this.constructor.uber.call(this, obj);
    };
    inherit(container, commonObject);
    container.prototype.contentType = 'application/cdmi-container';
    container.prototype._init = function() {
        this.constructor.uber.prototype._init.call(this);
        this.url = appendSlash(this.url);
    };
    container.prototype.listChildren = function(async, range) {
        var obj = {
            children: range || '',
        };
        this._getter(obj, async);
        return this;
    };
    container.prototype.rename = function(rename, async){
        var oldUri = this.path.slice(1) + this.name;
        oldUri = appendSlash(oldUri);
        var obj = {
            move: oldUri
        };
        this.name = rename;
        this._init();
        this._setter(obj, async);
        return this;
    };

    function domain(obj) {
        this.constructor.uber.call(this, obj);
    };
    inherit(domain, commonObject);
    domain.prototype.contentType = 'application/cdmi-domain';
    domain.prototype._init = function() {
        this.constructor.uber.prototype._init.call(this);
        this.url = appendSlash(this.url);
    };
    domain.prototype.create = function() {
        // disable domain creation
    };
    domain.prototype.delObj = function() {
        // disable domain deletion
    };
    domain.prototype.forceCreate = function() {
        // disable domain creation
    };

    function user(obj) {
        this.constructor.uber.call(this, obj);
    };
    inherit(user, commonObject);
    user.prototype.contentType = 'application/cdmi-user';
    user.prototype._init = function() {
        this.constructor.uber.prototype._init.call(this);
        this._login = false;
    };
    user.prototype.forceCreate = function() {
        // disable user force creation
    };
    user.prototype._getAjaxRequestHeaders = function(method, url, contentType) {
        var headers;
        if (this._login) {
            headers = this._getBasicAuthorization();
        } else {
            headers = this._aquaEnv.getAjaxRequestHeaders(method, url, contentType);
            if (headers) {
                headers['x-aqua-user-domain-uri'] = this.domainURI;
            }
        }
        return headers;
    };
    user.prototype._getBasicAuthorization = function() {
        if (!this.name || !this.password || !this.domainURI) {
            return;
        }
        var authorization = base64Encode(utf16to8(this.name + ':' + this.password));
        return {
            'Accept': 'application/cdmi-user',
            'Authorization': 'Basic ' + authorization,
            'x-aqua-user-domain-uri': this.domainURI,
        };
    };
    user.prototype.login = function() {
        this._login = true;
        this.getAllFields();
        this._login = false;
        return this;
    };
    user.prototype.create = function(async) {
        if (!this.name || !this.domainURI || !this.password) {
            return;
        }

        var _user = {
            objectName: this.name,
            domainURI: this.domainURI,
            password: this.password,
            metadata: this.metadata,
            privileges: this.privileges,
        };
        this._transfer('POST', null, async, function(data) {
            $.extend(this, data);
        }, JSON.stringify(_user));
        return this;
    };

    function Aqua(obj) {
        if (!(this instanceof Aqua)) {
            return new Aqua(obj);
        }

        $.extend(this, obj);
        this._init();
    };

    Aqua.prototype = {
        _init: function() {
            if ( typeof this.host !== 'string') {
                this.host = aqua_host;
            }
            this.restRoot = this.host + '/aqua/rest/cdmi';
            if ( typeof this.domainURI !== 'string') {
                this.domainURI = '';
            }
        },

        _getObjectEnv: function(obj) {
            return $.extend({}, obj, {
                _aquaEnv: this
            });
        },

        login: function(obj) {
            var _user = new user(this._getObjectEnv(obj));
            _user.login();
            this.accessKeyId = _user.objectID;
            this.secretAccessKey = _user.secretAccessKey;
            this.domainURI = _user.domainURI;
            return this;
        },

        setItem: function(obj) {
            $.extend(this, obj);
            this._init();
            return this;
        },

        getObject: function(obj) {
            return new object(this._getObjectEnv(obj));
        },

        getContainer: function(obj) {
            return new container(this._getObjectEnv(obj));
        },

        getUser: function(obj) {
            obj = this._getObjectEnv(obj);
            obj.domainURI = this.domainURI;
            return new user(obj);
        },

        getDomain: function(obj) {
            return new domain(this._getObjectEnv(obj));
        },

        getCommonObject: function(obj) {
            return new commonObject(this._getObjectEnv(obj));
        },

        trimURL: function(url) {
            if ( typeof url !== 'string') {
                return '';
            }

            if (url.indexOf('//') > -1) {
                url = url.split('//')[1];
            }

            var tmp1 = url.indexOf("/") >= 0 ? url.indexOf("/") : 0;
            var tmp2 = url.indexOf("?");
            var urlPath = url.substr(tmp1, (tmp2 >= 0 ? tmp2 : url.length) - tmp1);

            return urlPath;
        },

        getAjaxRequestHeaders: function(method, url, contentType) {
            if (!this.accessKeyId || !this.secretAccessKey) {
                return;
            }

            var urlPath = encodeURI(this.trimURL(url));
            var nowDateTime = new Date().getTime();

            var stringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;

            return {
                'Accept': contentType,
                'Content-Type': contentType,
                'Authorization': 'AQUA ' + this.accessKeyId + ":" + base64Encode(SHA1(this.secretAccessKey, stringToSign)),
                'x-aqua-date': nowDateTime,
                'x-aqua-read-reference-redirect': false,
            };
        },

        query: function(option) {
            var parentUri = option && option.parentUri;
            var objectType = option && option.objectType;
            var scope = option && option.scopeSpec;
            var results = option && option.resultsSpec;
            var order = option && option.order;
            var callback = option && option.callback;
            var context = option && option.context;
            var range = option && option.range;
            var preserve = option && option.preserve;
            var async = option && option.async;
            var failCallback = option && option.fail;
            async = !!async;

            if (!parentUri && !scope) {
                return;
            }
            var defaultType = 'application/cdmi-object';
            if (!objectType) {
                objectType = defaultType;
            }
            if (!scope) {
                var defaultScope = [{
                    'objectType': '== ' + objectType,
                    'parentURI': '== ' + parentUri,
                }];
                scope = defaultScope;
            }

            var specs = {
                'cdmi_scope_specification': scope
            };
            if (results) {
                specs['cdmi_results_specification'] = results;
            }

            var query = '', filters = [];
            if (order) {
                filters.push('sort=' + order);
            }
            if (range) {
                filters.push('range=' + range);
            }
            if (filters.length > 0) {
                query += ('?' + filters.join(';') + ';');
            }
            var url = this.restRoot + '/cdmi_query/' + query;
            var _result;

            $.ajax({
                type: 'PUT',
                url: url,
                async: async,
                data: JSON.stringify(specs),
                dataType: 'json',
                headers: this.getAjaxRequestHeaders('PUT', url, objectType),
            }).done(function(data) {
                if (!preserve) {
                    if (objectType == 'application/cdmi-object') {
                        data = data && data.objects;
                    } else if (objectType == 'application/cdmi-container') {
                        data = data && data.container;
                    }
                }

                if ( typeof callback == 'function') {
                    if (context) {
                        data = callback.call(context, data);
                    } else {
                        data = callback(data);
                    }
                }

                _result = data;
            }).fail(function(){
                if(typeof failCallback == 'function'){
                    failCallback();
                }
            });

            return _result;
        },

        getToken: function(url, method, contentType, nowDateTime) {
            var urlPath = encodeURI(this.trimURL(url));

            if (!method) {
                method = 'GET';
            }
            if (contentType === null || typeof contentType === 'undefined') {
                contentType = '';
            }
            if ( typeof nowDateTime === 'undefined') {
                nowDateTime = new Date().getTime();
            }
            var stringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;

            var token = this.accessKeyId + ":" + base64Encode(SHA1(this.secretAccessKey, stringToSign));
            return encodeURIComponent(token);
        },

        getFileToken: function(url, method){
        	var time = new Date().getTime();
        	var token = this.getToken(url, method, null, time);
        	return 'aquatoken=' + token + '&xaquadate=' + time;
        }

    };

    ns.AquaUtil = Aqua;
}(window, window.jQuery, window.my.base64Encode, window.str_hmac_sha1, window.my.utf16to8));