function $$(query, anchor){
  if(typeof query !== 'string'){
    return null;
  }

  if(query.length < 1){
    return null;
  }

  var type = query.charAt(0);
  var target = query.slice(1);
  if(type === '#'){
    return document.getElementById(target);
  } else if(type === '.'){
    if(anchor != null){
      return anchor.getElementsByClassName(target);
    }
    return document.getElementsByClassName(target);
  } else {
    return document.getElementsByTagName(query);
  }
}

function $_(name){
	return document.createElement(name);
}

function $_f(){
	return document.createDocumentFragment();
}

function $_t(str){
	return document.createTextNode(str);
}

function $_id(id){
	return document.getElementById(id);
}

function $_class(str, el){
	if(el != null){
		return el.getElementsByClassName(str);
	} else {
		return document.getElementsByClassName(str);
	}
}

function makeRequest (obj){
    var type = obj.type || 'GET';
    var url = obj.url;
    var async = obj.async;
    var done = obj.done;
    var fail = obj.fail;
    var always = obj.always;
    var data = obj.data || null;
    var headers = obj.headers;
    var timeout = obj.timeout;
    var xhr;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.open(type, url, async);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr._timeout != null){
                clearTimeout(xhr._timeout);
                xhr._timeout = null;
            }
            if(xhr.status == 200 || xhr.status == 201){
                if(typeof done === 'function'){
                    done(xhr.responseText);
                }
            } else {
                if(typeof fail === 'function'){
                    fail(xhr);
                }
            }
            if(typeof always === 'function'){
                always(xhr);
            }
        }
    };
    // xhr.overrideMimeType("text/html;charset=utf-8");
    if(headers){
        for(var item in headers){
            if(headers.hasOwnProperty(item)){
                xhr.setRequestHeader(item, headers[item]);
            }
        }
    }
    if(timeout != null){
        xhr._timeout = setTimeout(function(){
            clearTimeout(xhr._timeout);
            xhr._timeout = null;
            xhr.abort();
        }, timeout);
    }
    xhr.send(data);
    return xhr;
}

function getURLParameter(name, search){
	search = search != null ? search : window.location.search;
	var ret = (new RegExp("[\\?&#]" + name + "=([^&#]*)")).exec(search);
	return ret ? ret[1] : "";
}

function preZero(str, num){
	num = num != null ? num : 2;
	str = str.toString();
	while(str.length < num){
		str = '0' + str;
	}
	return str;
}

function parseStringToDate(str) {
	var ret = null;
	//         1       2       3      4     5       6       7        8  9     10     11
	var mat = /(\d{4})-(\d{2})-(\d{2})([T\s](\d{2}):(\d{2}):(\d{2}))?(Z|([+-])(\d{2})(\d{2})?)?/.exec(str);
	if(mat != null){
		var _y = +mat[1];
		var _m = +mat[2] - 1;
		var _d = +mat[3];

		if(mat[4] != null){
			var _h = +mat[5];
			var _min = +mat[6];
			var _s = +mat[7];
		}

		var tmp = new Date(_y, _m, _d, _h, _min, _s);

		if(mat[8] != null){
			var _thisOffset = tmp.getTimezoneOffset();
			var _targetOffset = 0;
			if(mat[8] != 'Z'){
				_targetOffset = mat[10] * 60 + (mat[11] != null ? +mat[11] : 0);
				if(mat[9] == '+'){
					_targetOffset = 0 - _targetOffset;
				}
			}
			var relMills = tmp.getTime() + (_targetOffset - _thisOffset ) * 60 * 1000;

			ret = new Date(relMills);

		} else {
			ret = tmp;
		}

	}
	return ret;
}

function log(str){
	if(window.showLog){
		if(window.iPanel && typeof iPanel.debug == 'function'){
			iPanel.debug(str);
		} else if(window.console != null && typeof console.log == 'function'){
			console.log(str);
		}
		var $el = $$('#log');
		if($el != null){
			$el.innerHTML += str + '<br>';
			while($el.scrollHeight > $el.clientHeight){
				$el.removeChild($el.childNodes[0]);
			}
		}
	}
}

function getTimeStamp(){
	return (new Date().toISOString()).substr(0,19) + 'Z';
}

function getByteLen(val) {
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		var length = val.charCodeAt(i);
		if(length >=0 && length <= 128){
			len += 1;
		} else {
			len += 2;
		}
	}
	return len;
}

function checkToMarquee(str){
	return '<span class="txt_marquee_placer">'+ str +'</span>';
}

function wrapToMarquee(str){
	var $mar = $_('marquee');
	$mar.className = 'txt_marquee';
	$mar.setAttribute('direction', 'left');
	$mar.setAttribute('behavior', 'scroll');
	$mar.setAttribute('scrollamount', '2');
	$mar.setAttribute('startposition', '90%');
	$mar.appendChild($_t(str));
	return $mar;
}

function clearMarquee(){
	var $mar = $_class('txt_marquee')[0];
	if($mar != null){
		$mar.parentNode.removeChild($mar);
	}
}
