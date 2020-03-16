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

    function appendSlash(uri) {
        if ( typeof uri !== 'string') {
            uri = '';
        }
        if (uri.charAt(0) !== '/') {
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
            this.path = appendSlash(this.path);
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
            }).fail(function(jqXhr) {
                if (jqXhr.status == 204) {
                    if ( typeof callback == 'function') {
                        callback.call(self, null, jqXhr);
                    }
                } else {
                    if ( typeof errorCallback == 'function') {
                        errorCallback.call(self, jqXhr);
                    }
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
                    if (item !== 'metadata') {
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
    container.prototype.listChildren = function(async) {
        var obj = {
            children: '',
        };
        this._getter(obj, async);
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
                this.host = '';
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

    };

    ns.AquaUtil = Aqua;

  var contentTypeMap = {
    "001": "application/x-001",
    "301": "application/x-301",
    "323": "text/h323",
    "906": "application/x-906",
    "907": "drawing/907",
    "a11": "application/x-a11",
    "acp": "audio/x-mei-aac",
    "ai": "application/postscript",
    "aif": "audio/aiff",
    "aifc": "audio/aiff",
    "aiff": "audio/aiff",
    "anv": "application/x-anv",
    "asa": "text/asa",
    "asf": "video/x-ms-asf",
    "asp": "text/asp",
    "asx": "video/x-ms-asf",
    "au": "audio/basic",
    "avi": "video/avi",
    "awf": "application/vnd.adobe.workflow",
    "biz": "text/xml",
    "bmp": "application/x-bmp",
    "bot": "application/x-bot",
    "c4t": "application/x-c4t",
    "c90": "application/x-c90",
    "cal": "application/x-cals",
    "cat": "application/vnd.ms-pki.seccat",
    "cdf": "application/x-netcdf",
    "cdr": "application/x-cdr",
    "cel": "application/x-cel",
    "cer": "application/x-x509-ca-cert",
    "cg4": "application/x-g4",
    "cgm": "application/x-cgm",
    "cit": "application/x-cit",
    "class": "java/*",
    "cml": "text/xml",
    "cmp": "application/x-cmp",
    "cmx": "application/x-cmx",
    "cot": "application/x-cot",
    "crl": "application/pkix-crl",
    "crt": "application/x-x509-ca-cert",
    "csi": "application/x-csi",
    "css": "text/css",
    "cut": "application/x-cut",
    "dbf": "application/x-dbf",
    "dbm": "application/x-dbm",
    "dbx": "application/x-dbx",
    "dcd": "text/xml",
    "dcx": "application/x-dcx",
    "der": "application/x-x509-ca-cert",
    "dgn": "application/x-dgn",
    "dib": "application/x-dib",
    "dll": "application/x-msdownload",
    "doc": "application/msword",
    "dot": "application/msword",
    "drw": "application/x-drw",
    "dtd": "text/xml",
    "dwf": "Model/vnd.dwf",
    "dwf": "application/x-dwf",
    "dwg": "application/x-dwg",
    "dxb": "application/x-dxb",
    "dxf": "application/x-dxf",
    "edn": "application/vnd.adobe.edn",
    "emf": "application/x-emf",
    "eml": "message/rfc822",
    "ent": "text/xml",
    "epi": "application/x-epi",
    "eps": "application/x-ps",
    "eps": "application/postscript",
    "etd": "application/x-ebx",
    "exe": "application/x-msdownload",
    "fax": "image/fax",
    "fdf": "application/vnd.fdf",
    "fif": "application/fractals",
    "fo": "text/xml",
    "frm": "application/x-frm",
    "g4": "application/x-g4",
    "gbr": "application/x-gbr",
    "gcd": "application/x-gcd",
    "gif": "image/gif",
    "gl2": "application/x-gl2",
    "gp4": "application/x-gp4",
    "hgl": "application/x-hgl",
    "hmr": "application/x-hmr",
    "hpg": "application/x-hpgl",
    "hpl": "application/x-hpl",
    "hqx": "application/mac-binhex40",
    "hrf": "application/x-hrf",
    "hta": "application/hta",
    "htc": "text/x-component",
    "htm": "text/html",
    "html": "text/html",
    "htt": "text/webviewhtml",
    "htx": "text/html",
    "icb": "application/x-icb",
    "ico": "image/x-icon,application/x-ico",
    "iff": "application/x-iff",
    "ig4": "application/x-g4",
    "igs": "application/x-igs",
    "iii": "application/x-iphone",
    "img": "application/x-img",
    "ins": "application/x-internet-signup",
    "isp": "application/x-internet-signup",
    "IVF": "video/x-ivf",
    "java": "java/*",
    "jfif": "image/jpeg",
    "jpe": "image/jpeg,application/x-jpe",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg,application/x-jpg",
    "js": "application/x-javascript",
    "jsp": "text/html",
    "la1": "audio/x-liquid-file",
    "lar": "application/x-laplayer-reg",
    "latex": "application/x-latex",
    "lavs": "audio/x-liquid-secure",
    "lbm": "application/x-lbm",
    "lmsff": "audio/x-la-lms",
    "ls": "application/x-javascript",
    "ltr": "application/x-ltr",
    "m1v": "video/x-mpeg",
    "m2v": "video/x-mpeg",
    "m3u": "audio/mpegurl",
    "m4e": "video/mpeg4",
    "mac": "application/x-mac",
    "man": "application/x-troff-man",
    "math": "text/xml",
    "mdb": "application/msaccess,application/x-mdb",
    "mfp": "application/x-shockwave-flash",
    "mht": "message/rfc822",
    "mhtml": "message/rfc822",
    "mi": "application/x-mi",
    "mid": "audio/mid",
    "midi": "audio/mid",
    "mil": "application/x-mil",
    "mml": "text/xml",
    "mnd": "audio/x-musicnet-download",
    "mns": "audio/x-musicnet-stream",
    "mocha": "application/x-javascript",
    "movie": "video/x-sgi-movie",
    "mp1": "audio/mp1",
    "mp2": "audio/mp2",
    "mp2v": "video/mpeg",
    "mp3": "audio/mp3",
    "mp4": "video/mpeg4",
    "mpa": "video/x-mpg",
    "mpd": "application/vnd.ms-project",
    "mpe": "video/x-mpeg",
    "mpeg": "video/mpg",
    "mpg": "video/mpg",
    "mpga": "audio/rn-mpeg",
    "mpp": "application/vnd.ms-project",
    "mps": "video/x-mpeg",
    "mpt": "application/vnd.ms-project",
    "mpv": "video/mpg",
    "mpv2": "video/mpeg",
    "mpw": "application/vnd.ms-project",
    "mpx": "application/vnd.ms-project",
    "mtx": "text/xml",
    "mxp": "application/x-mmxp",
    "net": "image/pnetvue",
    "nrf": "application/x-nrf",
    "nws": "message/rfc822",
    "odc": "text/x-ms-odc",
    "out": "application/x-out",
    "p10": "application/pkcs10",
    "p12": "application/x-pkcs12",
    "p7b": "application/x-pkcs7-certificates",
    "p7c": "application/pkcs7-mime",
    "p7m": "application/pkcs7-mime",
    "p7r": "application/x-pkcs7-certreqresp",
    "p7s": "application/pkcs7-signature",
    "pc5": "application/x-pc5",
    "pci": "application/x-pci",
    "pcl": "application/x-pcl",
    "pcx": "application/x-pcx",
    "pdf": "application/pdf",
    "pdx": "application/vnd.adobe.pdx",
    "pfx": "application/x-pkcs12",
    "pgl": "application/x-pgl",
    "pic": "application/x-pic",
    "pko": "application/vnd.ms-pki.pko",
    "pl": "application/x-perl",
    "plg": "text/html",
    "pls": "audio/scpls",
    "plt": "application/x-plt",
    "png": "image/png,application/x-png",
    "pot": "application/vnd.ms-powerpoint",
    "ppa": "application/vnd.ms-powerpoint",
    "ppm": "application/x-ppm",
    "pps": "application/vnd.ms-powerpoint",
    "ppt": "application/vnd.ms-powerpoint,application/x-ppt",
    "pr": "application/x-pr",
    "prf": "application/pics-rules",
    "prn": "application/x-prn",
    "prt": "application/x-prt",
    "ps": "application/x-ps",
    "ps": "application/postscript",
    "ptn": "application/x-ptn",
    "pwz": "application/vnd.ms-powerpoint",
    "r3t": "text/vnd.rn-realtext3d",
    "ra": "audio/vnd.rn-realaudio",
    "ram": "audio/x-pn-realaudio",
    "ras": "application/x-ras",
    "rat": "application/rat-file",
    "rdf": "text/xml",
    "rec": "application/vnd.rn-recording",
    "red": "application/x-red",
    "rgb": "application/x-rgb",
    "rjs": "application/vnd.rn-realsystem-rjs",
    "rjt": "application/vnd.rn-realsystem-rjt",
    "rlc": "application/x-rlc",
    "rle": "application/x-rle",
    "rm": "application/vnd.rn-realmedia",
    "rmf": "application/vnd.adobe.rmf",
    "rmi": "audio/mid",
    "rmj": "application/vnd.rn-realsystem-rmj",
    "rmm": "audio/x-pn-realaudio",
    "rmp": "application/vnd.rn-rn_music_package",
    "rms": "application/vnd.rn-realmedia-secure",
    "rmvb": "application/vnd.rn-realmedia-vbr",
    "rmx": "application/vnd.rn-realsystem-rmx",
    "rnx": "application/vnd.rn-realplayer",
    "rp": "image/vnd.rn-realpix",
    "rpm": "audio/x-pn-realaudio-plugin",
    "rsml": "application/vnd.rn-rsml",
    "rt": "text/vnd.rn-realtext",
    "rtf": "application/msword,application/x-rtf",
    "rv": "video/vnd.rn-realvideo",
    "sam": "application/x-sam",
    "sat": "application/x-sat",
    "sdp": "application/sdp",
    "sdw": "application/x-sdw",
    "sit": "application/x-stuffit",
    "slb": "application/x-slb",
    "sld": "application/x-sld",
    "slk": "drawing/x-slk",
    "smi": "application/smil",
    "smil": "application/smil",
    "smk": "application/x-smk",
    "snd": "audio/basic",
    "sol": "text/plain",
    "sor": "text/plain",
    "spc": "application/x-pkcs7-certificates",
    "spl": "application/futuresplash",
    "spp": "text/xml",
    "ssm": "application/streamingmedia",
    "sst": "application/vnd.ms-pki.certstore",
    "stl": "application/vnd.ms-pki.stl",
    "stm": "text/html",
    "sty": "application/x-sty",
    "svg": "text/xml",
    "swf": "application/x-shockwave-flash",
    "tdf": "application/x-tdf",
    "tg4": "application/x-tg4",
    "tga": "application/x-tga",
    "tif": "image/tiff,application/x-tif",
    "tiff": "image/tiff",
    "tld": "text/xml",
    "top": "drawing/x-top",
    "torrent": "application/x-bittorrent",
    "tsd": "text/xml",
    "txt": "text/plain",
    "uin": "application/x-icq",
    "uls": "text/iuls",
    "vcf": "text/x-vcard",
    "vda": "application/x-vda",
    "vdx": "application/vnd.visio",
    "vml": "text/xml",
    "vpg": "application/x-vpeg005",
    "vsd": "application/vnd.visio,application/x-vsd",
    "vss": "application/vnd.visio",
    "vst": "application/vnd.visio",
    "vst": "application/x-vst",
    "vsw": "application/vnd.visio",
    "vsx": "application/vnd.visio",
    "vtx": "application/vnd.visio",
    "vxml": "text/xml",
    "wav": "audio/wav",
    "wax": "audio/x-ms-wax",
    "wb1": "application/x-wb1",
    "wb2": "application/x-wb2",
    "wb3": "application/x-wb3",
    "wbmp": "image/vnd.wap.wbmp",
    "wiz": "application/msword",
    "wk3": "application/x-wk3",
    "wk4": "application/x-wk4",
    "wkq": "application/x-wkq",
    "wks": "application/x-wks",
    "wm": "video/x-ms-wm",
    "wma": "audio/x-ms-wma",
    "wmd": "application/x-ms-wmd",
    "wmf": "application/x-wmf",
    "wml": "text/vnd.wap.wml",
    "wmv": "video/x-ms-wmv",
    "wmx": "video/x-ms-wmx",
    "wmz": "application/x-ms-wmz",
    "wp6": "application/x-wp6",
    "wpd": "application/x-wpd",
    "wpg": "application/x-wpg",
    "wpl": "application/vnd.ms-wpl",
    "wq1": "application/x-wq1",
    "wr1": "application/x-wr1",
    "wri": "application/x-wri",
    "wrk": "application/x-wrk",
    "ws": "application/x-ws",
    "ws2": "application/x-ws",
    "wsc": "text/scriptlet",
    "wsdl": "text/xml",
    "wvx": "video/x-ms-wvx",
    "xdp": "application/vnd.adobe.xdp",
    "xdr": "text/xml",
    "xfd": "application/vnd.adobe.xfd",
    "xfdf": "application/vnd.adobe.xfdf",
    "xhtml": "text/html",
    "xls": "application/vnd.ms-excel,application/x-xls",
    "xlw": "application/x-xlw",
    "xml": "text/xml",
    "xpl": "audio/scpls",
    "xq": "text/xml",
    "xql": "text/xml",
    "xquery": "text/xml",
    "xsd": "text/xml",
    "xsl": "text/xml",
    "xslt": "text/xml",
    "xwd": "application/x-xwd",
    "x_b": "application/x-x_b",
    "x_t": "application/x-x_t"
  };
  var getContentType = function (str) {
    var ret = "application/octet-stream";
    var a = str.split(".");
    if (a.length > 0) {
      if (contentTypeMap[a[a.length - 1].toLowerCase()]) {
        ret = contentTypeMap[a[a.length - 1].toLowerCase()];
      }
    }
    return ret;
  }
}(window, window.jQuery, window.my.base64Encode, window.str_hmac_sha1, window.my.utf16to8));