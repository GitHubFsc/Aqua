var i18nData = {};
function i18n(t){
	return i18nData[t];
}

function patchHTML(html){
    return html.replace(/{{(\w+)}}/g, function(match, key){
        return i18n(key);
    });
}

var localeLanguage = 'zh-CN.json';
// var use_locale_zh_CN = navigator.userAgent.toLocaleLowerCase().indexOf('chrome/25') > -1;
// if(navigator.language.indexOf('en') > -1 && !use_locale_zh_CN){
	// localeLanguage = 'en-US.json';
// }

(function(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'i18n/' + localeLanguage, false);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			try {
				i18nData = JSON.parse(xhr.responseText);
			} catch(e){
				console.log(e.message);
			}
		}
	};
	xhr.send();
}());
