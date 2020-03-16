function navigationBar_onclick(){
    document.getElementById("navigationBarClose").onclick=function(){};
    document.getElementById('main_table_middle_top').style.display=""; //-----wall-----
    if(document.getElementById('navigationBar').style.marginLeft == '0px'){
        hideNavigationSystem();
        //hideNavigationBar();
    }else{
        if (pageManage.currentPage && pageManage.currentPage.currentDiv != null && pageManage.currentPage.currentDiv.style.display != 'none') {
            //alert('close page first');
            if (pageManage.currentPage && pageManage.currentPage.beforeCloseFunction) {
                pageManage.currentPage.beforeCloseFunction();
            }
            startCloseVisibleAndShowNavigationBar(pageManage.currentPage.currentDiv);
        }else{
            showNavigationBar();
        }
    }
}

function showNavigationBar() {
    var barMarginLeft = -1 * (parseInt(document.getElementById("navigationBar").style.width.replace('px',''))-67); 
    //init(initialization) navigationSystemShell 
    document.getElementById('navigationSystem').style.display = "";
    document.getElementById('navigationSystem').style.height = "556px";
    document.getElementById('navigationSystem').style.marginTop = "-560px";

    document.getElementById('navigationSystemShell').style.display = "";
    document.getElementById('navigationSystemShell').style.top = (parseInt(document.getElementById('navigationBar').style.top.replace("px","")) + 47)+"px";
    document.getElementById('navigationSystemShell').style.width = (parseInt(document.getElementById('navigationBar').style.width.replace("px","")) - 90)+"px";
    document.getElementById('navigationSystemShell').style.left = "90px";

    //201211021052 -->
    //document.getElementById("navigationBarClose").style.background = 'url(images/'+ pageManage.globalVariable.userCss +'/navigationBar_cross.png)';
    dojo.removeClass(dojo.byId('navigationBarClose'), "navigationBarClose_t");
    dojo.addClass(dojo.byId('navigationBarClose'), "navigationBarClose_c");    
    //201211021052 <--   

    document.getElementById("navigationBarClose").onclick=function(){};
    if (document.getElementById("navigationSystemTab").innerHTML == ""){
        createNavigationSystemTab();
    }
                        
    var intervalID = setInterval(function() {
        barMarginLeft += 100;
        document.getElementById("navigationBar").style.marginLeft = barMarginLeft + "px";
        if (barMarginLeft > -100) {
            document.getElementById("navigationBar").style.marginLeft = "0px";
            window.clearInterval(intervalID);
            //afterShowNavigationBar();
            //document.getElementById("navigationBarClose").onclick=navigationBar_onclick;
            showNavigationSystem();
            document.getElementById('main_table_middle_top').style.display="none"; //-----wall-----
        }
    }, 40);
}

function hideNavigationBar(){
    var barMarginLeft = 0;
    var _barMarginLeft = -1 * (parseInt(document.getElementById("navigationBar").style.width.replace('px',''))-45);
    document.getElementById("navigationBarClose").onclick=function(){};
    
    var intervalID = setInterval(function() {
        barMarginLeft -= 100;
        document.getElementById("navigationBar").style.marginLeft = barMarginLeft + "px";
        if (barMarginLeft < _barMarginLeft) {
            document.getElementById("navigationBar").style.marginLeft = _barMarginLeft + "px";
            window.clearInterval(intervalID);
            //afterhideNavigationBar();
            document.getElementById("navigationBarClose").onclick=navigationBar_onclick;

            //201211021052 -->   
            //document.getElementById("navigationBarClose").style.background = 'url(images/'+ pageManage.globalVariable.userCss +'/navigationBar_triangle.png)';
            dojo.removeClass(dojo.byId('navigationBarClose'), "navigationBarClose_c");
            dojo.addClass(dojo.byId('navigationBarClose'), "navigationBarClose_t");
            //201211021052 <--
            
            document.getElementById("navigationSystemShell").style.display='none';
            onHideNavigationSystemAndBar();
            onHideNavigationSystemAndBar = function(){};
            document.getElementById('main_table_middle_top').style.display="none"; //-----wall-----
        }
    }, 40);
}

function showNavigationSystem() {
    var barMarginTop = parseInt(document.getElementById("navigationSystem").style.marginTop.replace('px',''));
    var intervalID = setInterval(function() {
        barMarginTop += 100;
        document.getElementById("navigationSystem").style.marginTop = barMarginTop + "px";
        if (barMarginTop > -100) {
            document.getElementById("navigationSystem").style.marginTop = "0px";
            window.clearInterval(intervalID);
        }
    }, 40);
}

function hideNavigationSystem() {
    var barMarginTop = 0; 
    var _barMarginTop = -1 * parseInt(document.getElementById("navigationSystem").style.height.replace('px',''))-4;
    var intervalID = setInterval(function() {
        barMarginTop -= 100;
        document.getElementById("navigationSystem").style.marginTop = barMarginTop + "px";
        if (barMarginTop < _barMarginTop) {
            document.getElementById("navigationSystem").style.marginTop = _barMarginTop + "px";
            window.clearInterval(intervalID);
            hideNavigationBar();
        }
    }, 40);
}

var onHideNavigationSystemAndBar = function(){};
            
