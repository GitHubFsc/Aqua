function setNav() {
	var titles = document.getElementsByTagName('h2');
	var frag = document.createDocumentFragment();
	for (var i = 0, len = titles.length; i < len; i += 1) {
		var $h2 = titles[i];
		var navId = 'n' + (i + 1);
		$h2.setAttribute('id', navId);
		var nav = document.createElement('li');
		var $a = document.createElement('a');
		$a.textContent = $h2.textContent;
		$a.href = '#' + navId;
		nav.appendChild($a);
		frag.appendChild(nav);
	}
	document.getElementById('navs').appendChild(frag);
}