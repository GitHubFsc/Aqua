/* gradual change */
var intTimeStep = 20;
var isIe = (window.ActiveXObject) ? true : false;
var intAlphaStep = (isIe) ? 5 : 0.05;
var curSObj = null;
var curOpacity = null;
var willCreatePage = null;
var willReloadPage = false;
var willRemoveArray = null;
var willShowNavigationBar = false;

function startCloseVisibleAndShowNavigationBar(objId){
    willShowNavigationBar = true;
    curSObj = objId; //document.getElementById(objId);
    curOpacity = 1;
    setObjClose();    
}

function removeUnneededPage(){
    if (pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pIPage != null && pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pIPage.needBack == false) {
    	// if (pageManage.currentPage.currentDiv == pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pDiv){
    		// pageManage.currentPage = null;
    	// }
    	
    	//pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pIPage.destroyPageFunction
    	if (pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pIPage.destroyPageFunction){
    	    console.log('Do destroyPageFunction on_removeUnneededPage');
    	    pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pIPage.destroyPageFunction();
    	}
    	
    	removeHTML(pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pDiv);
    	removeJs(pageManage.pageStack[parseInt(pageManage.pageStack.length)-1].pScript);
        pageManage.pageStack.pop();
    }
}

function startCloseVisibleAndReload(objId,_removeArray){
    willReloadPage = true;
    willRemoveArray = _removeArray;
    curSObj = objId; //document.getElementById(objId);
    curOpacity = 1;
    setObjClose();    
}


function startCloseVisibleAndCreate(objId,_willCreatePage){
    willCreatePage = _willCreatePage;
    curSObj = objId; //document.getElementById(objId);
    curOpacity = 1;
    setObjClose();    
}

function startCloseVisible(objId){
    curSObj = objId; //document.getElementById(objId);
    curOpacity = 1;
    setObjClose();    
}

function startOpenVisible(objId){
    curSObj = objId; //document.getElementById(objId);
    curOpacity = 0;
    setObjOpen();    
}

function setObjOpen() {
    if (curSObj.style.display == "none"){curSObj.style.display = ""};
    if (isIe) {
        curSObj.filters.alpha.opacity += intAlphaStep;
        if (curSObj.filters.alpha.opacity < 100)
            setTimeout('setObjOpen()', intTimeStep);
    } else {
        curOpacity += intAlphaStep;
        curSObj.style.opacity = curOpacity;
        if (curOpacity < 1)
            setTimeout('setObjOpen()', intTimeStep);
    }
}

function setObjClose() {
    document.getElementById('main_table_middle_top').style.display="";//-----wall-----
    if (isIe) {
        curSObj.filters.alpha.opacity -= intAlphaStep;
        if (curSObj.filters.alpha.opacity > 0) {
            setTimeout('setObjClose()', intTimeStep);
        } else {
            curSObj.style.display = "none";
            removeUnneededPage();
            if(willCreatePage != null){loadHTMLAndJs(willCreatePage);willCreatePage = null;}
            if (willReloadPage) {
                pageManage.currentPage.show(); 
                if (pageManage.currentPage && pageManage.currentPage.reloadPageFunction !=null){pageManage.currentPage.reloadPageFunction();}
                if (willRemoveArray != null){removeArray(willRemoveArray);willRemoveArray = null;}
                willReloadPage = false;
            }
            if(willShowNavigationBar){
                willShowNavigationBar = false;
                showNavigationBar();
            }
            document.getElementById('main_table_middle_top').style.display="none";//-----wall-----
        }
    } else {
        curOpacity -= intAlphaStep;
        if (curOpacity > 0) {
            curSObj.style.opacity = curOpacity;
            setTimeout('setObjClose()', intTimeStep);
        } else {
            curSObj.style.display = 'none';
            removeUnneededPage();
            if(willCreatePage != null){loadHTMLAndJs(willCreatePage);willCreatePage = null;}
            if (willReloadPage) {
                pageManage.currentPage.show();
                if (pageManage.currentPage && pageManage.currentPage.reloadPageFunction !=null){pageManage.currentPage.reloadPageFunction();}
                if (willRemoveArray != null){removeArray(willRemoveArray);willRemoveArray = null;} 
                willReloadPage = false;
            }
            if(willShowNavigationBar){
                willShowNavigationBar = false;
                showNavigationBar();
            }
            document.getElementById('main_table_middle_top').style.display="none";//-----wall-----
        }
    }
}

function removeArray(_pMpS){
    for (var i = parseInt(_pMpS) + 1; i <= pageManage.pageStack.length - 1; i++) {
        //pageManage.pageStack[i].pIPage
        if (pageManage.pageStack[i].pIPage && pageManage.pageStack[i].pIPage.destroyPageFunction){
            console.log('Do destroyPageFunction on_removeArray');
            pageManage.pageStack[i].pIPage.destroyPageFunction();
        }
        removeHTML(pageManage.pageStack[i].pDiv);
        removeJs(pageManage.pageStack[i].pScript);
    };
    pageManage.pageStack.splice(parseInt(_pMpS) + 1);
}
