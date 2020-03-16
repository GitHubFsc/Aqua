var common = new Object();

//token有效期2周(14天)时间
var expires_valid_date  = 14 * 24 * 60 * 60 * 1000;

/*
 * _mode:
 * 不传就是使用默认样式
 * 否则根据该值来使用相应样式
 */
function createMyButton(_text, _n_icon, _f_icon, _mode, _n_arrow, _f_arrow) {
    var myButtonObj = document.createElement("div");
    if (_mode && _mode == 1) {
        var strTable = [];
        strTable.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%;"><tbody><tr>');
        strTable.push('<td class="header_btn_left_normal"></td>');

        if (_n_icon && _n_icon != "" && _f_icon && _f_icon != "") {
            strTable.push('<td valign="center" class="header_btn_middle_normal">');
            strTable.push('<table border="0" cellpadding="0" cellspacing="0" style="height:100%;"><tbody><tr>');
            strTable.push('<td valign="center" style="padding-top:7px;"><img src="' + _n_icon + '" /></td>');
            if (_text && _text != "") {
                strTable.push('<td valign="center" style="padding-left:7px; padding-bottom:3px;"><span class="button_text_normal">' + _text + '</span></td>');
            }
            strTable.push('</tr></tbody></table>');
        }
        else {
            strTable.push('<td valign="center" style="padding-bottom:3px;" class="header_btn_middle_normal">');
            if (_text && _text != "") {
                strTable.push('<span class="button_text_normal">' + _text + '</span>');
            }
            strTable.push('</td>');
        }
        strTable.push('<td class="header_btn_right_normal"></td>');
        strTable.push('</tr><tbody></table>');
        myButtonObj.innerHTML = strTable.join("");

        myButtonObj.onmouseover = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "header_btn_middle_focus";
            if (_f_icon && _f_icon != "") {
                myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _f_icon;
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_focus";
                }
            }
            else {
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].className = "button_text_focus";
                }
            }
            myButtonObj.children[0].children[0].children[0].children[0].className = "header_btn_left_focus";
            myButtonObj.children[0].children[0].children[0].children[2].className = "header_btn_right_focus";
        }
        myButtonObj.onmouseout = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "header_btn_middle_normal";
            if (_n_icon && _n_icon != "") {
                myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _n_icon;
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_normal";
                }
            }
            else {
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].className = "button_text_normal";
                }
            }
            myButtonObj.children[0].children[0].children[0].children[0].className = "header_btn_left_normal";
            myButtonObj.children[0].children[0].children[0].children[2].className = "header_btn_right_normal";
        }
    }
    else if (_mode && _mode == 2) {
        var strTable = [];
        strTable.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%;"><tbody><tr>');
        strTable.push('<td class="header_btn_left_normal"></td>');

        strTable.push('<td valign="center" class="header_btn_middle_normal">');
        strTable.push('<table border="0" cellpadding="0" cellspacing="0" style="height:100%;"><tbody><tr>');
        strTable.push('<td valign="center" style="padding-top:0px;"><img src="' + _n_icon + '" /></td>');
        strTable.push('<td valign="center" style="padding-left:7px; padding-bottom:3px; padding-right:6px;"><span class="button_text_normal">' + _text + '</span></td>');
        strTable.push('<td valign="center" style="padding-top:0px;"><img src="' + _n_arrow + '" /></td>');
        strTable.push('</tr></tbody></table>');

        strTable.push('<td class="header_btn_right_normal"></td>');
        strTable.push('</tr><tbody></table>');
        myButtonObj.innerHTML = strTable.join("");

        myButtonObj.onmouseover = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "header_btn_middle_focus";
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _f_icon;
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_focus";
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].src = _f_arrow;
            myButtonObj.children[0].children[0].children[0].children[0].className = "header_btn_left_focus";
            myButtonObj.children[0].children[0].children[0].children[2].className = "header_btn_right_focus";
        }
        myButtonObj.onmouseout = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "header_btn_middle_normal";
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _n_icon;
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_normal";
            myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[2].children[0].src = _n_arrow;
            myButtonObj.children[0].children[0].children[0].children[0].className = "header_btn_left_normal";
            myButtonObj.children[0].children[0].children[0].children[2].className = "header_btn_right_normal";
        }
    }
    else {
        var strTable = [];
        strTable.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%;"><tbody><tr>');
        strTable.push('<td class="btn_left_normal"></td>');

        if (_n_icon && _n_icon != "" && _f_icon && _f_icon != "") {
            strTable.push('<td valign="center" class="btn_middle_normal">');
            strTable.push('<table border="0" cellpadding="0" cellspacing="0" style="height:100%;"><tbody><tr>');
            strTable.push('<td valign="center" style="padding-top:7px;"><img src="' + _n_icon + '" /></td>');
            if (_text && _text != "") {
                strTable.push('<td valign="center" style="padding-left:7px; padding-bottom:3px;"><span class="button_text_normal">' + _text + '</span></td>');
            }
            strTable.push('</tr></tbody></table>');
        }
        else {
            strTable.push('<td valign="center" style="padding-bottom:3px;" class="btn_middle_normal">');
            if (_text && _text != "") {
                strTable.push('<span class="button_text_normal">' + _text + '</span>');
            }
            strTable.push('</td>');
        }
        strTable.push('<td class="btn_right_normal"></td>');
        strTable.push('</tr><tbody></table>');
        myButtonObj.innerHTML = strTable.join("");

        myButtonObj.onmouseover = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "btn_middle_focus";
            if (_f_icon && _f_icon != "") {
                myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _f_icon;
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_focus";
                }
            }
            else {
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].className = "button_text_focus";
                }
            }
            myButtonObj.children[0].children[0].children[0].children[0].className = "btn_left_focus";
            myButtonObj.children[0].children[0].children[0].children[2].className = "btn_right_focus";
        }
        myButtonObj.onmouseout = function() {
            myButtonObj.children[0].children[0].children[0].children[1].className = "btn_middle_normal";
            if (_n_icon && _n_icon != "") {
                myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].src = _n_icon;
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[1].children[0].className = "button_text_normal";
                }
            }
            else {
                if (_text && _text != "") {
                    myButtonObj.children[0].children[0].children[0].children[1].children[0].className = "button_text_normal";
                }
            }
            myButtonObj.children[0].children[0].children[0].children[0].className = "btn_left_normal";
            myButtonObj.children[0].children[0].children[0].children[2].className = "btn_right_normal";
        }
    }
    return myButtonObj;
}

function formatFileSize(_size) {
    var ret = "";
    if (_size < 1024) {
        ret = _size + "B";
    }
    else if (_size >= 1024 && _size < 1048576) {
        ret = ((_size / 1024).toFixed(1)) + "KB";
    }
    else if (_size >= 1048576 && _size < 1073741824) {
        ret = ((_size / 1024 / 1024).toFixed(1)) + "MB";
    }
    else if (_size >= 1073741824 && _size < 1099511627776) {
        ret = ((_size / 1024 / 1024 / 1024).toFixed(1)) + "GB";
    }
    else if (_size >= 1099511627776) {
        ret = ((_size / 1024 / 1024 / 1024 / 1024).toFixed()) + "TB";
    }
    return ret;
}

/*
 * _mode: 0->大图标   1->小图标
 * _str: 文件名
 */
function fileSuffixNameFormatImage(_mode, _str) {
    var ret = {
        "name" : "",
        "type" : ""
    };
    if (_str && _str != "") {
        var tmpArray = _str.split(".");
        if (tmpArray && tmpArray[tmpArray.length - 1] && tmpArray[tmpArray.length - 1] != "") {
            var tmpStr = tmpArray[tmpArray.length - 1].toLowerCase();
            switch (tmpStr) {
                case "bmp":
                case "jpg":
                case "tiff":
                case "gif":
                case "pcx":
                case "tga":
                case "exif":
                case "fpx":
                case "svg":
                case "psd":
                case "cdr":
                case "pcd":
                case "dxf":
                case "ufo":
                case "eps":
                case "ai":
                case "raw":
                case "png":
                    if (_mode == 0) {
                        ret.name = "large_icon_image.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_image.png";
                    }
                    ret.type = "image";
                    break;
                case "mpeg":
                case "mp4":
                case "3gp":
                case "avi":
                case "mkv":
                case "wmv":
                case "mpg":
                case "vob":
                case "flv":
                case "swf":
                case "mov":
                case "xv":
                case "rmvb":
                case "webm":
                case "f4v":
                case "rm":
                case "ram":
                case "navi":
                case "asf":
                    if (_mode == 0) {
                        ret.name = "large_icon_video.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_video.png";
                    }
                    ret.type = "video";
                    break;
                case "wave":
                case "wav":
                case "aiff":
                case "au":
                case "mp3":
                case "midi":
                case "wma":
                case "realaudio":
                case "vqf":
                case "aac":
                case "ape":
                    if (_mode == 0) {
                        ret.name = "large_icon_audio.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_audio.png";
                    }
                    ret.type = "audio";
                    break;
                case "exe":
                case "msi":
                case "apk":
                    if (_mode == 0) {
                        ret.name = "large_icon_app.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_app.png";
                    }
                    ret.type = "app";
                    break;
                case "doc":
                case "docx":
                case "pdf":
                case "chm":
                case "txt":
                case "xls":
                case "xlsx":
                case "ppt":
                case "pptx":
                    if (_mode == 0) {
                        ret.name = "large_icon_text.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_text.png";
                    }
                    ret.type = "text";
                    break;
                default:
                    if (_mode == 0) {
                        ret.name = "large_icon_default_file.png";
                    }
                    else if (_mode == 1) {
                        ret.name = "list_mode_icon_default_file.png";
                    }
                    ret.type = "default";
                    break;
            }
        }
    }
    return ret;
}

/*
 * _mode: 0->filedetaillist  1->viewlist
 */
common.moreDropDownTable = null;
common.showMoreDropDown = function(_mode, _domObj) {
    if (common.dropDownTable == null) {
        common.dropDownTable = document.createElement("table");
        common.dropDownTable.setAttribute("border", "0");
        common.dropDownTable.setAttribute("cellpadding", "0");
        common.dropDownTable.setAttribute("cellspacing", "0");
        common.dropDownTable.appendChild(document.createElement("tr"));
        common.dropDownTable.children[0].appendChild(document.createElement("td"));
        common.dropDownTable.children[0].children[0].setAttribute("colspan", "3");
        common.dropDownTable.children[0].children[0].style.height = "10px";

        //重命名rename
        common.dropDownTable.appendChild(document.createElement("tr"));
        common.dropDownTable.children[1].appendChild(document.createElement("td"));
        common.dropDownTable.children[1].children[0].appendChild(document.createElement("div"));
        common.dropDownTable.children[1].children[0].children[0].style.width = "18px";
        common.dropDownTable.children[1].appendChild(document.createElement("td"));
        common.dropDownTable.children[1].children[1].innerHTML = my.localization("filelist").rename_text;
        common.dropDownTable.children[1].children[1].onclick = function(e) {
            if (this.className == "dropdownTxt") {
                if (_mode == 1) {
                    document.getElementById("dropDownDiv").style.display = "none";
                    if (document.removeEventListener) {
                        document.removeEventListener('mousemove', mouseMove, true);
                    }
                    else if (document.detachEvent) {
                        document.detachEvent('onmousemove', mouseMove);
                    }

                    var checkBoxs = dojo.query("input[listCheckBox='true']", document.getElementById("icons_body_table"));
                    for (var i = 0; i < checkBoxs.length; i++) {
                        if (checkBoxs[i].checked == true) {
                            var currObj = null;
                            currObj = checkBoxs[i].parentNode.parentNode;
                            currObj.children[1].children[1].style.display = "none";
                            currObj.children[1].children[2].style.display = "";
                            currObj.children[1].children[2].children[0].children[0].children[0].children[0].focus();
                            break;
                        }
                    }
                }
                else if (_mode == 0) {

                }
            }
        };
        common.dropDownTable.children[1].appendChild(document.createElement("td"));
        common.dropDownTable.children[1].children[2].appendChild(document.createElement("div"));
        common.dropDownTable.children[1].children[2].children[0].style.width = "18px";

        common.dropDownTable.appendChild(document.createElement("tr"));
        common.dropDownTable.children[common.dropDownTable.children.length - 1].appendChild(document.createElement("td"));
        common.dropDownTable.children[common.dropDownTable.children.length - 1].children[0].setAttribute("colspan", "3");
        common.dropDownTable.children[common.dropDownTable.children.length - 1].children[0].style.height = "10px";
    }

    if (_mode == 1) {
        if (fileList.mutiChoiceItems.length == 1 && fileList.mutiChoiceItems[0].type == "aquaFile") {
            common.dropDownTable.children[1].children[1].className = "dropdownTxt"
        }
        else {
            common.dropDownTable.children[1].children[1].className = "dropdownTxtDisabled";
        }
    }
    else if (_mode == 0) {
        if (fileList.mutiChoiceItems.length == 1 && fileList.mutiChoiceItems[0].type == "aquaFile") {
            common.dropDownTable.children[1].children[1].className = "dropdownTxt"
        }
        else {
            common.dropDownTable.children[1].children[1].className = "dropdownTxtDisabled";
        }
    }

    document.getElementById("dropDownDiv").children[0].style.height = _domObj.offsetHeight + "px";
    document.getElementById("dropDownDiv").children[0].style.display = "";
    document.getElementById("dropDownDiv").children[2].style.display = "none";
    var box = my.getObjAbsolutePosition(_domObj);
    document.getElementById("dropDownDiv").style.left = box.x + 1 + "px";
    document.getElementById("dropDownDiv").style.top = box.y - 4 + "px";

    if (document.getElementById("dropDownContentTd").children[0] != common.dropDownTable) {
        document.getElementById("dropDownContentTd").innerHTML = "";
        document.getElementById("dropDownContentTd").appendChild(common.dropDownTable);
    }

    document.getElementById("dropDownDiv").style.display = "";

    if (document.documentElement.clientHeight - box.y < document.getElementById("dropDownDiv").offsetHeight) {
        document.getElementById("dropDownDiv").children[2].style.height = _domObj.offsetHeight + "px";
        document.getElementById("dropDownDiv").children[2].style.display = "";
        document.getElementById("dropDownDiv").children[0].style.display = "none";
        document.getElementById("dropDownDiv").style.top = box.y + 4 + _domObj.offsetHeight - document.getElementById("dropDownDiv").offsetHeight + "px";
    }

    if (document.addEventListener) {
        document.addEventListener('mousemove', mouseMove, true);
    }
    else if (document.attachEvent) {
        document.attachEvent('onmousemove', mouseMove);
    }

    function mouseMove(e) {
        if (!e) {
            e = window.event;
        }
        var box = {
            x : parseInt(document.getElementById("dropDownDiv").style.left),
            y : parseInt(document.getElementById("dropDownDiv").style.top),
            w : document.getElementById("dropDownDiv").offsetWidth,
            h : document.getElementById("dropDownDiv").offsetHeight
        };
        if (e.clientX < box.x || e.clientX > box.x + box.w || e.clientY < box.y || e.clientY > box.y + box.h) {
            document.getElementById("dropDownDiv").style.display = "none";
            if (document.removeEventListener) {
                document.removeEventListener('mousemove', mouseMove, true);
            }
            else if (document.detachEvent) {
                document.detachEvent('onmousemove', mouseMove);
            }
        }
    }

}

showReqErrorDialog = function(_response) {
    if (_response) {
        var errorString = "";
        if (_response.responseText != "") {
            var errorText = null;
            try {
                errorText = dojo.fromJson(_response.responseText);
            }
            catch(e) {
                console.log(e);
            }
            if (errorText && errorText.items && errorText.items[0] && errorText.items[0].errorMessage && errorText.items[0].errorMessage != "") {
                errorString = errorText.items[0].errorMessage;
            }
        }

        if (errorString == "" && _response.message) {
            errorString = _response.message;
        }

        if (errorString != "") {
            my.dialogManage.showMessageDialog({
                title : words.teacher_group_add_word_43,
                messageTxt : errorString,
                buttons : [{
                    showName : words.user_manager_list_word_32,
                    func : function() {
                        this.hide();
                    }
                }]
            });
        }
    }
}
formatMaintainStatus = function(_value) {
    var ret = "";
    if (_value && _value != "") {
        switch (_value) {
            case '1':
                ret = '';
                break;
            case '2':
                ret = words.common_word_262;
                break;
            case '3':
                ret = words.common_word_263;
                break;
            case '4':
                ret = words.common_word_264;
                break;
            case '5':
                ret = words.common_word_265;
                break;
            default:
                break;
        }
    }
    return ret;
}
formatRunningStatus = function(_value) {
    var ret = "";
    if (_value && _value != "") {
        switch (_value) {
            case '1':
                ret = words.common_word_266;
                break;
            case '2':
                ret = words.common_word_267;
                break;
            default:
                break;
        }
    }
    return ret;
}
formatTreeMachineStatus = function(_value) {
    var ret = "";
    if (_value && _value != "") {
        switch (_value) {
            case '1':
                ret = words.common_word_268;
                break;
            case '2':
                ret = words.common_word_269;
                break;
            case '3':
                ret = words.common_word_270;
                break;
            case '4':
                ret = words.teacher_group_add_word_43;
                break;
            default:
                break;
        }
    }
    return ret;
}
formatOrganizationType = function(_value) {
    var ret = "";
    if (_value && _value != "") {
        switch (_value) {
            case '0':
                ret = words.common_word_271;
                break;
            case '1':
                ret = words.organization_list_word_124;
                break;
            default:
                break;
        }
    }
    return ret;
}
addTooltipToText = function() {
    var paramCount = arguments.length;
    var str = new Array();
    if (paramCount > 0 && arguments[0] && arguments[0] != "") {
        str.push("<div style='text-overflow:ellipsis;overflow:hidden;white-space: nowrap;' title='");
        str.push(arguments[0]);
        str.push("'>");
        if (paramCount == 2) {
            str.push("<a href='" + arguments[1] + "'>");
        }
        str.push(arguments[0]);
        if (paramCount == 2) {
            str.push("</a>");
        }
        str.push("</div>");
    }
    return str.join("");
}
formatterGridInformation = function(value) {
    var result = '';
    if (value && value != '') {
        result = addTooltipToText(value);
    }
    return result;
}
getCurrUserInfo = function() {
    var ret = {
        "organizationCode" : "",
        "userType" : 3,
        "userID" : "",
        "userName" : "",
        "userType_original" : ""
    };
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);

    ret.organizationCode = t[0]["@organizationCode"];
    if(t.length > 1)
    	ret.organizationCode = MANAGER.organizationCode;

    if (my.aqua.userID) {
        ret.userID = my.aqua.userID;
    }
    if (my.aqua.userName) {
        ret.userName = my.aqua.userName;
    }
    ret.userType_original = t[0]["@userType"];
    return ret;
}

setUserType = function(_userType){
    var tempUserType = null;
    switch ("1"){
        case _userType.slice(0,1) :
            tempUserType = "1";
            break;
        case _userType.slice(1,2) :
            tempUserType = "2";
            break;
        case _userType.slice(2,3) :
            tempUserType = "3";
            break;
    }
    return tempUserType;
}

getCurrUserAuthority = function() {
    var ret = {
        "isClassAll" : false,
        "isClassView" : false,
        "isUserAll" : false,
        "isUserView" : false,
        "isOrgAll" : false,
        "isOrgView" : false,
        "isClassRoomAll" : false,
        "isClassRoomView" : false,
        "isRegionAll" : false,
        "isRegionView" : false,
        "isCourseAll" : false,
        "isCourseView" : false,
        "isCourseHourAll" : false,
        "isCourseHourView" : false,
        "isConfigurationAll" : false,
        "isConfigurationView" : false
    };
//    if (pageManage && pageManage.globalVariable && pageManage.globalVariable.userInfo && pageManage.globalVariable.userInfo.currentAuthority) {
    if (true) {
        var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
        var tmpData = null

        if (dojo.isArray(t[0].basicAuthorities.basicAuthority)) {
            tmpData = t[0].basicAuthorities.basicAuthority;
        }
        else {
            tmpData = [t[0].basicAuthorities.basicAuthority];
        }

        if (tmpData && tmpData != null) {
            dojo.forEach(tmpData, function(item) {
                if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450010" || item["@ID"] == "BA450106")) {
                    ret.isClassAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450009" || item["@ID"] == "BA450105")) {
                    ret.isClassView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450008" || item["@ID"] == "BA450104")) {
                    ret.isUserAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450007" || item["@ID"] == "BA450103")) {
                    ret.isUserView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450006" || item["@ID"] == "BA450102")) {
                    ret.isOrgAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && (item["@ID"] == "BA450005" || item["@ID"] == "BA450101")) {
                    ret.isOrgView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450004") {
                    ret.isClassRoomAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450003") {
                    ret.isClassRoomView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450002") {
                    ret.isRegionAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450001") {
                    ret.isRegionView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450202") {
                    ret.isCourseAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450201") {
                    ret.isCourseView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450204") {
                    ret.isCourseHourAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450203") {
                    ret.isCourseHourView = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450012") {
                    ret.isConfigurationAll = true;
                }
                else if (item["@ID"] && item["@ID"] != "" && item["@ID"] == "BA450011") {
                    ret.isConfigurationView = true;
                }
            });
        }
    }
    var ret = {
        "isClassAll" : true,
        "isClassView" : true,
        "isUserAll" : true,
        "isUserView" : true,
        "isOrgAll" : true,
        "isOrgView" : true,
        "isClassRoomAll" : true,
        "isClassRoomView" : true,
        "isRegionAll" : true,
        "isRegionView" : true,
        "isCourseAll" : true,
        "isCourseView" : true,
        "isCourseHourAll" : true,
        "isCourseHourView" : true,
        "isConfigurationAll" : true,
        "isConfigurationView" : true
    };
    return ret;
}
/*
 * _items：统计图例数据（没转换过的）
 * _mode：需要转换成那种图形的数据。
 * "1"：系统管理员->区域管理->会议室统计图表_1(转换成曲线图数据)
 * "2"：系统管理员->区域管理->会议室统计图表_2(转换成柱状图数据)
 * "3"：组织管理员->并发会议数量管理->并发会议数量统计图表_1(转换成曲线图数据)
 * "4"：组织管理员->并发会议数量管理->与会人员组和会议主持人组统计图表_1(转换成圆饼图数据)
 * "5"：组织管理员->并发会议数量管理->与会人员和会议主持人统计图表_1(转换成圆饼图数据)
 * "6"：会议管理员->会议主题管理->并发会议数量已占满时间段统计图表_1(转换成timeCalendar使用的数据)
 */
changeChartData = function(_items, _mode) {
    var items = dojo.clone(_items);
    if (items != null) {
        //if (dojo.isArray(items) && items.length > 0) {
        switch (_mode) {
            case "1":
                chartDataBuffer.system_admin_area_classroom_Chart_1 = items[0];
                break;
            case "2":
                chartDataBuffer.system_admin_area_classroom_Chart_2 = items[0];
                break;
            case "3":
                chartDataBuffer.org_admin_class_class_Chart_1 = items[0];
                break;
            case "4":
                chartDataBuffer.org_admin_class_student_teacher_group_Chart_1 = items[0];
                break;
            case "5":
                chartDataBuffer.org_admin_class_student_teacher_Chart_1 = items[0];
                break;
            case "6":
                chartDataBuffer.course_admin_course_lesson_Chart_1 = items[0];
                break;
        }
    };
    //}
}
/**
 * needFixedColumn:  true:需要固定列 false 不需要固定列
 * model：multiple ---enable multiple lines selection
 *        single   ---enable single lines selection
 */
gridwithscrollbar = function(gridDivId, storeIdentifier, layout, themesColor, gridWidth, gridHeight,selectId,needFixedColumn,mode) {
    if (gridDivId == null) {
        console.error("In createDojoDataGrid(), 'gridDivId' is null.");
        return null;
    }

    if (storeIdentifier == null) {
        console.error("In createDojoDataGrid(), 'store identifier' is null.");
        return null;
    }

    if (layout == null) {
        console.error("In createDojoDataGrid(), 'layout' is null.");
        return null;
    }

    if ( ! dojo.isArray(layout)) {
        console.error("In createDojoDataGrid(), 'layout' is not an array.");
        return null;
    }

    if (themesColor == null) {
        console.info("In createDojoDataGrid(), 'themesColor' is null.");
        return null;
    }

    if (gridWidth == null)
    {
        console.info("In createDojoDataGrid(), 'gridWidth' is null.");
        return null;
    }

    if (gridHeight == null)
    {
        console.info("In createDojoDataGrid(), 'gridHeight' is null.");
        return null;
    }

    if (mode == null)
    {
        mode ="single";
    }

    var dataItems = [];

    var datas = {
        identifier: storeIdentifier,
        items: dataItems
    };

    var dataStore = new dojo.data.ItemFileWriteStore({
        data:datas
    })
    //////////// process layout ////////////////
    if (needFixedColumn){
        if(themesColor=="green" && layout.length>0){
            if(layout[0]["cells"].length>0){
                for(var j=0;j<layout[0]["cells"].length;j++){
                    layout[0]["cells"][j].headerClasses =  "grid_with_scroll_bar_header_div_green";
                    layout[0]["cells"][j].cellClasses = "grid_with_scroll_bar_content_div_green";
                }
            }

            if(layout.length>1){
                for(var i=1; i<layout.length; i++){
                    if(layout[i]["cells"].length>0){
                        for(var j=0;j<layout[i]["cells"].length;j++){
                            layout[i]["cells"][j].headerClasses = "grid_with_scroll_bar_header_div_green grid_with_scroll_bar_header_div_other_font_size ";
                            layout[i]["cells"][j].cellClasses =  " grid_with_scroll_bar_content_div_green";
                        }
                    }
                }
            }
        }

        if(themesColor=="purple" && layout.length>0){
            if(layout.length>1){
                for(var i=0; i<layout.length; i++){
                    if(layout[i]["cells"]== undefined){
                        layout[i].headerClasses = "grid_with_scroll_bar_header_div_purple";
                        layout[i].cellClasses = "grid_with_scroll_bar_content_div_purple";
                    }else{
                        for(var j=0;j<layout[i]["cells"].length;j++){
                            layout[i]["cells"][j].headerClasses = "grid_with_scroll_bar_header_div_purple";
                            layout[i]["cells"][j].cellClasses =  "grid_with_scroll_bar_content_div_purple";
                        }
                    }
                }
            }

        }
        if(themesColor=="blue" && layout.length>0){
            if(layout.length>1){
                for(var i=0; i<layout.length; i++){
                    if(layout[i]["cells"]== undefined){
                        layout[i].headerClasses = "grid_with_scroll_bar_header_div_blue";
                        layout[i].cellClasses = "grid_with_scroll_bar_content_div_blue";
                    }else{
                        for(var j=0;j<layout[i]["cells"].length;j++){
                            layout[i]["cells"][j].headerClasses = "grid_with_scroll_bar_header_div_blue";
                            layout[i]["cells"][j].cellClasses =  "grid_with_scroll_bar_content_div_blue";
                        }
                    }
                }
            }

        }
    }else{
        if(themesColor=="green" && layout.length>0){
            for (i=0; i<layout.length; i++) {
                layout[i].headerClasses = "grid_with_scroll_bar_header_div_green";
                layout[i].cellClasses = "grid_with_scroll_bar_content_div_green";
            }
        }
        if(themesColor=="purple" && layout.length>0){
            for (i=0; i<layout.length; i++) {
                layout[i].headerClasses = "grid_with_scroll_bar_header_div_purple";
                layout[i].cellClasses = "grid_with_scroll_bar_content_div_purple";
            }
        }
        if(themesColor=="blue" && layout.length>0){
            for (i=0; i<layout.length; i++) {
                layout[i].headerClasses = "grid_with_scroll_bar_header_div_blue";
                layout[i].cellClasses = "grid_with_scroll_bar_content_div_blue";
            }
        }
    }

    ////////////// initialize dojo datagrid ///////////
    var dojoDataGrid = new dojox.grid.DataGrid({
        store: dataStore,
        //query: { "@courseHourID": "*" },

        structure: layout,

        selectionMode: mode, // enable multiple lines selection

        selectable: false,         // disable text selection

        height: gridHeight,

        onCellClick: function(event) {  // override onCellClick()
            if(mode=="multiple"){
                this.onRowClick(event); // skip cell click event, forward event to onRowClick()
            }
        },

        canSort : function(col) { //disable sort
            return false;
        }
    }, gridDivId);

    dojoDataGrid.rows.grid.keepRows    = 2000;

    dojoDataGrid.selection.onSelected = function(index) {
        var selectedItem = dojoDataGrid.getItem(index);
        if (selectedItem.__checked__ != undefined) {
            dojoDataGrid.store.setValue(selectedItem, "__checked__", true);
        }
    };
    dojoDataGrid.selection.onDeselected = function(index) {
        var selectedItem = dojoDataGrid.getItem(index);
        if (selectedItem.__checked__ != undefined) {
            dojoDataGrid.store.setValue(selectedItem, "__checked__", false);
            if(selectId!="" || selectId != null){
                var selectObj=dojo.byId(selectId);
                if(selectObj&&selectObj.checked==true){
                    selectObj.checked=false;
                }
            }

        }
    };


    ////// start dojo data grid
    dojoDataGrid.startup();

    ////// disable header focus event, then grid is not scrolled on in horizontal
    dojoDataGrid.focus.focusGrid = function(inSkipFocusCell) {
    };
    dojoDataGrid.focus.focusGridView = function() {
    };
    dojoDataGrid.focus.focusHeader = function() {
    };
    dojoDataGrid.focus.doColHeaderFocus = function() {
    };
    //////////////////// return //////////////
    return dojoDataGrid;
}


/**
 * 点击页面左侧栏会议 首先先登录 否则会报401错误
 * @returns true: 用户拥有管理员权限并且登录该用户
 *          false: 用户无管理员权限 直接返回
 */
function meetingLoginUser(){
//    var tifName = my.tifAdmin.meetingUserName ;
//    var tifPassword = my.tifAdmin.meetingPwd;
    var loginTifError = false;
    //判断用户是否拥有管理员权限
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
    var role = t[0]["@userType"];

    if (role != "") {
        role = role.substr(2, 1);
    }
    if(role == "1") {
        var tifName = my.tifAdmin.loginUsingValue ;


        var regEpxForEmail = /^[^\\\/\:\@\*\?\'\"\<\>\|\s]+[\@][^\\\/\:\@\*\?\'\"\<\>\|\s]+[\.][^\\\/\:\@\*\?\'\"\<\>\|\s]+$/;
        var regEpxForPhone = /^\d{11}$/;
        var isEmail = regEpxForEmail.test(tifName);
        var isPhone = regEpxForPhone.test(tifName);

        var list = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
        var organizationCode = list[0]["@organizationCode"];

        var userType = 3;
        var loadData;
        //Is email
        if(isEmail){
            loadData = {
                "@email" : tifName,
                "@domain" : domainStr,
                "@hashValue" : hashValue,
                "@type" : "loginModel"
            };
        }
        //Is mobile phone
        else if(isPhone){
            loadData = {
                "@cellPhoneNumber" : tifName,
                "@domain" : my.tifAdmin.domainStr,
                "@hashValue" : my.tifAdmin.hashValue,
                "@type" : "loginModel"
            };
        }
        //Not email nor phone, is alias
        else{
            loadData = {
                "@accountName" : tifName,
                "@domain" : my.tifAdmin.domainStr,
                "@hashValue" : my.tifAdmin.hashValue,
                "@type" : "loginModel"
            };
        }

        dojo.xhrPost({
            url : my.tifAdmin.restRoot + "/user/user/login;jsessionid=" + my.tifAdmin.jsessionId,
            timeout : 5000,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            sync : true,
            putData : dojo.toJson(loadData),
            load : function(response, isArg) {
                if (response && response.items && response.items[0] && response.items[0].UserInOrganizationList && response.items[0].UserInOrganizationList.UserInOrganization && response.items[0].UserInOrganizationList.UserInOrganization[0] && response.items[0].UserInOrganizationList.UserInOrganization[0]["@organizationName"]) {
                    my.tifAdmin.organizationName = response.items[0].UserInOrganizationList.UserInOrganization[0]["@organizationName"];
                }
            },
            error : function(response, isArg) {
            }
        });

        //http://10.50.8.240:7077/rest/dojo/liveevent/user/user/login/setcurrentorganizationandusertype?organizationCode=XORME&userType=3
        dojo.xhrGet({
            url : my.tifAdmin.restRoot + "/user/user/login/setcurrentorganizationandusertype;jsessionid=" + my.tifAdmin.jsessionId+"?organizationCode="+organizationCode+"&userType="+userType,
            timeout : 5000,
            sync : true,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            load : function(response, isArg) {
            },
            error : function(response, isArg) {
            }
        });
        loginTifError = true;
    }

    return loginTifError;
}

/*判断两个时间段是否交叉*/

function isDateCross(oldBegin, oldEnd, newBegin, newEnd) {
    var ret = false;
    var oldBeginTime = new Date(oldBegin).getTime();
    var oldEndTime = new Date(oldEnd).getTime();

    var newBeginTime = new Date(newBegin).getTime();
    var newEndTime = new Date(newEnd).getTime();

    if(newBeginTime>=oldBeginTime && newBeginTime<=oldEndTime )
    {
        ret = true;
    }
    if(newEndTime >=oldBeginTime && newEndTime <=oldEndTime )
    {
        ret = true;
    }
    if(newEndTime >=oldEndTime && newBeginTime <=oldBeginTime )
    {
        ret = true;
    }
    return ret;
}

/**
 * 登录Tif组织管理
 * @returns 3 用户拥有管理员权限并且登录该用户
 *          <3 用户无管理员权限 或登录失败
 */
function tifGroupAdminLogin(org_code){
	var loginTifError = 0;
    //判断用户是否拥有管理员权限
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
    var role = t[0]["@userType"];

    if (role != "") {
        role = role.substr(2, 1);
    }
    //if(role == "1") {
    	var tifName = MANAGER.account;
    	var _domain = MANAGER.domainURI;
    	var _hash = my.base64Encode(tifName + "_" + _domain);
    	var _password = MANAGER.password;
    	var organizationCode = org_code ? org_code : MANAGER.organizationCode;
    	var userType = 2;

    	var regEpxForEmail = /^[^\\\/\:\@\*\?\'\"\<\>\|\s]+[\@][^\\\/\:\@\*\?\'\"\<\>\|\s]+[\.][^\\\/\:\@\*\?\'\"\<\>\|\s]+$/;
    	var regEpxForPhone = /^\d{11}$/;
    	var isEmail = regEpxForEmail.test(tifName);
    	var isPhone = regEpxForPhone.test(tifName);

    	var loadData;
    	//Is email
    	if(isEmail){
       		loadData = {
            	"@email" : tifName,
            	"@password" : _password,
            	"@type" : "loginModel"
        	};
    	}
    	//Is mobile phone
    	else if(isPhone){
        	loadData = {
            	"@cellPhoneNumber" : tifName,
            	"@password" : _password,
            	"@type" : "loginModel"
        	};
    	}
    	//Not email nor phone, is alias
    	else{
        	loadData = {
            "@accountName" : tifName,
            "@password" : _password,
            "@type" : "loginModel"
        	};
    	}

    	dojo.xhrPost({
        	url : my.tifAdmin.restRoot + "/user/user/login;jsessionid=" + my.tifAdmin.jsessionId,
        	timeout : 5000,
       		handleAs : "json",
        	headers : {
            	"Content-Type" : "application/json"
        	},
        	sync : true,
        	putData : dojo.toJson(loadData),
        	load : function(response, isArg) {
         		loginTifError |= 2;
        	},
        	error : function(response, isArg) {
         		loginTifError &= 1;
        	}
    	});

    	//http://10.50.8.240:7077/rest/dojo/liveevent/user/user/login/setcurrentorganizationandusertype?organizationCode=XORME&userType=3
    	dojo.xhrGet({
        	url : my.tifAdmin.restRoot + "/user/user/login/setcurrentorganizationandusertype;jsessionid=" + my.tifAdmin.jsessionId+"?organizationCode="+organizationCode+"&userType="+userType,
        	timeout : 5000,
        	sync : true,
        	handleAs : "json",
        	headers : {
            	"Content-Type" : "application/json"
        	},
        	load : function(response, isArg) {
         		loginTifError |= 1;
        	},
        	error : function(response, isArg) {
          		loginTifError &= 2;
        	}
    	});
    //}
    return loginTifError;
}

/**
 * 登录Tif超级用户
 * @returns 3 用户拥有管理员权限并且登录该用户
 *          <3 用户无管理员权限 或登录失败
 */
function tifGroupAdminLoginSuper(){
  	var loginTifError = 0;
    //判断用户是否拥有管理员权限
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
    var role = t[0]["@userType"];

    if (role != "") {
        role = role.substr(2, 1);
    }
    //if(role == "1") {
        var tifName = TIF_SUPER_USER.account;//my.tifAdmin.loginUsingValue ;
    	var _password = TIF_SUPER_USER.password;
		var organizationCode = TIF_SUPER_USER.organizationCode;
		var userType = 1;

        var regEpxForEmail = /^[^\\\/\:\@\*\?\'\"\<\>\|\s]+[\@][^\\\/\:\@\*\?\'\"\<\>\|\s]+[\.][^\\\/\:\@\*\?\'\"\<\>\|\s]+$/;
        var regEpxForPhone = /^\d{11}$/;
        var isEmail = regEpxForEmail.test(tifName);
        var isPhone = regEpxForPhone.test(tifName);

        var loadData;
        //Is email
        if(isEmail){
            loadData = {
                "@email" : tifName,
                "@password" : _password,
                "@type" : "loginModel"
            };
        }
        //Is mobile phone
        else if(isPhone){
            loadData = {
                "@cellPhoneNumber" : tifName,
                "@password" : _password,
                "@type" : "loginModel"
            };
        }
        //Not email nor phone, is alias
        else{
            loadData = {
                "@accountName" : tifName,
                "@password" : _password,
                "@type" : "loginModel"
            };
        }

        dojo.xhrPost({
            url : my.tifAdmin.restRoot + "/user/user/login;jsessionid=" + my.tifAdmin.jsessionId,
            timeout : 5000,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            sync : true,
            putData : dojo.toJson(loadData),
            load : function(response, isArg) {
            	loginTifError |= 2;
            },
            error : function(response, isArg) {
            	loginTifError &= 1;
            }
        });

        //http://10.50.8.240:7077/rest/dojo/liveevent/user/user/login/setcurrentorganizationandusertype?organizationCode=XORME&userType=3
        dojo.xhrGet({
            url : my.tifAdmin.restRoot + "/user/user/login/setcurrentorganizationandusertype;jsessionid=" + my.tifAdmin.jsessionId+"?organizationCode="+organizationCode+"&userType="+userType,
            timeout : 5000,
            sync : true,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            load : function(response, isArg) {
            	loginTifError |= 1;
            },
            error : function(response, isArg) {
            	loginTifError &= 2;
            }
        });

	//}

    return loginTifError;
}


/**
 * Tif管理员以会议管理员身份登录
 * @returns 3 登录成功
 * 			<3 无权限或登录失败
 */
function tifMeetingLogin(){
    var loginTifError = 0;
//    //判断用户是否拥有管理员权限
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
//    var role = t[0]["@userType"];
//
//    if (role != "") {
//        role = role.substr(2, 1);
//    }
//    if(role == "1") {
        var tifName = MANAGER.account;//my.tifAdmin.loginUsingValue ;
        var _domain = MANAGER.domainURI;
        var _hash =  my.base64Encode(tifName + "_" + _domain);
        var _password = MANAGER.password;
        var list = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);

        var organizationCode = list[0]["@organizationCode"];

     	if((my.tifAdmin.tifName == tifName) || (list.length > 1)){
     		organizationCode = MANAGER.organizationCode;
     		var isAvailable = false;
     		for(var i = 0; i < list.length; i++){
     			if(list[i]['@organizationCode'] == MANAGER.organizationCode){
     				localStorage[navigate.session.userName + '_webpanel_UserInOrganization'] = JSON.stringify([list[i]]);
     				isAvailable = true;
     				break;
     			}
     		}
     	}

        var userType = 3;

        var regEpxForEmail = /^[^\\\/\:\@\*\?\'\"\<\>\|\s]+[\@][^\\\/\:\@\*\?\'\"\<\>\|\s]+[\.][^\\\/\:\@\*\?\'\"\<\>\|\s]+$/;
        var regEpxForPhone = /^\d{11}$/;
        var isEmail = regEpxForEmail.test(tifName);
        var isPhone = regEpxForPhone.test(tifName);

        var loadData;
        //Is email
        if(isEmail){
            loadData = {
                "@email" : tifName,
                "@password" : _password,
                "@domain" : _domain,
                "@hashValue" : _hash,
                "@type" : "loginModel"
            };
        }
        //Is mobile phone
        else if(isPhone){
            loadData = {
                "@cellPhoneNumber" : tifName,
                "@password" : _password,
                "@domain" : _domain,
                "@hashValue" : _hash,
                "@type" : "loginModel"
            };
        }
        //Not email nor phone, is alias
        else{
            loadData = {
                "@accountName" : tifName,
                "@password" : _password,
                "@domain" : _domain,
                "@hashValue" : _hash,
                "@type" : "loginModel"
            };
        }

        dojo.xhrPost({
            url : my.tifAdmin.restRoot + "/user/user/login;jsessionid=" + my.tifAdmin.jsessionId,
            timeout : 5000,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            sync : true,
            putData : dojo.toJson(loadData),
            load : function(response, isArg) {
            	my.tifAdmin.organizationName = list[0]["@organizationName"];
                loginTifError |= 2;
            },
            error : function(response, isArg) {
                loginTifError &= 1;
            }
        });

        //http://10.50.8.240:7077/rest/dojo/liveevent/user/user/login/setcurrentorganizationandusertype?organizationCode=XORME&userType=3
        dojo.xhrGet({
            url : my.tifAdmin.restRoot + "/user/user/login/setcurrentorganizationandusertype;jsessionid=" + my.tifAdmin.jsessionId+"?organizationCode="+organizationCode+"&userType="+userType,
            timeout : 5000,
            sync : true,
            handleAs : "json",
            headers : {
                "Content-Type" : "application/json"
            },
            load : function(response, isArg) {
                loginTifError |= 1;
            },
            error : function(response, isArg) {
                loginTifError &= 2;
            }
        });

    //}
    return loginTifError;
}

/**
 * 从Aqua Domain获取MANAGER账户信息
 */
function setupManager(){
	//获取
    var method = "GET";
    //var contentType = "application/cdmi-object";
    var contentType = "application/cdmi-domain";
    var nowDateTime = new Date().getTime();
    var urlPath = "/aqua/rest/cdmi" + my.aqua.xgxDomainURI;
    var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
	jQuery.ajax({
        type: method,
        url:urlPath + "?metadata;",
        async : false,
        dataType: "json",
        headers: {
            "Accept": contentType,
            "Content-Type": contentType,
            "Authorization": "AQUA " + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign_netdisk)),
            "x-aqua-date": nowDateTime,
            "X-CDMI-Specification-Version": "1.0.2"
        }
    }).done(function (data) {
    	MANAGER.account = data.metadata.tif_org_manager;
    	MANAGER.password = data.metadata.tif_org_managerpwd;
    	MANAGER.organizationCode = data.metadata.tif_org_code;
    	MANAGER.organizationName = data.metadata.tif_organization;
    	MANAGER.region = data.metadata.tif_org_region;
    	MANAGER.aquaAcc = data.metadata.rhtx_admin;
    	MANAGER.aquaPwd = data.metadata.rhtx_adminpwd;
    	MANAGER.userRoutingKeyFirstStr = data.metadata.rhtx_userRoutingKeyFirstStr;

    	if(data.metadata.rhtx_type == 'EDU'){
    		wsp_flag = FOR_EDU;
    		words = EDU;
    	}else if(data.metadata.rhtx_type == 'ENT'){
    		wsp_flag = FOR_VDU;
    		words = VID;
    	}

    }).fail(function(jqXHR, textStatus) {
        console.log("用户无权限读取aqua的metadata信息！");
    });

	var authStrToEncode = MANAGER.aquaAcc + ":" + MANAGER.aquaPwd;

	//登陆
    jQuery.ajax({
        type: "GET",
        url: "/aqua/rest/cdmi/cdmi_users/" + MANAGER.aquaAcc,
        async : false,
        dataType: "json",
        headers: {
            "Accept": "application/cdmi-user",
            "Authorization": "Basic " + my.base64Encode(authStrToEncode),
            "x-aqua-user-domain-uri": my.aqua.xgxDomainURI,
            "X-CDMI-Specification-Version": "1.0.2"
        }
    }).done(function (data) {
        MANAGER.aquaSecretAccessKey = data.secretAccessKey;
        MANAGER.aquaAccessKeyId = data.objectID;
    });

    var	loadData = {
    	"@accountName" : MANAGER.account,
        "@password" : MANAGER.password,
        "@type" : "loginModel"
    };

	dojo.xhrPost({
        url : my.tifAdmin.restRoot + "/user/user/login;",
        timeout : 5000,
        handleAs : "json",
        headers : {
            "Content-Type" : "application/json"
        },
        sync : true,
        putData : dojo.toJson(loadData),
        load : function(response, isArg) {
			var user = (response && response.items && response.items[0]) ? response.items[0] : {};
			my.tifAdmin.managerJsessionId = user["@jsessionId"];
			MANAGER.userID = user["@userID"];
			MANAGER.userName = user["@userName"];
			MANAGER.cellphone = user["@cellPhoneNumber"];
        },
        error : function(response, isArg) {

        }
    });
}

/*
 * Manager登陆Tif管理
 */
function tifAdminLogin(org_code, user_type){
	var loginTifError = 0;
    //判断用户是否拥有管理员权限
    var t = JSON.parse(localStorage[navigate.session.userName + '_webpanel_UserInOrganization']);
    var role = t[0]["@userType"];

    if (role != "") {
        role = role.substr(2, 1);
    }
    //if(role == "1") {
    	var tifName = MANAGER.account;
    	var _domain = MANAGER.domainURI;
    	var _hash = my.base64Encode(tifName + "_" + _domain);
    	var _password = MANAGER.password;
    	var organizationCode = org_code || MANAGER.organizationCode;
    	var userType = user_type || 2;

    	var regEpxForEmail = /^[^\\\/\:\@\*\?\'\"\<\>\|\s]+[\@][^\\\/\:\@\*\?\'\"\<\>\|\s]+[\.][^\\\/\:\@\*\?\'\"\<\>\|\s]+$/;
    	var regEpxForPhone = /^\d{11}$/;
    	var isEmail = regEpxForEmail.test(tifName);
    	var isPhone = regEpxForPhone.test(tifName);

    	var loadData;
    	//Is email
    	if(isEmail){
       		loadData = {
            	"@email" : tifName,
            	"@password" : _password,
            	"@type" : "loginModel"
        	};
    	}
    	//Is mobile phone
    	else if(isPhone){
        	loadData = {
            	"@cellPhoneNumber" : tifName,
            	"@password" : _password,
            	"@type" : "loginModel"
        	};
    	}
    	//Not email nor phone, is alias
    	else{
        	loadData = {
            "@accountName" : tifName,
            "@password" : _password,
            "@type" : "loginModel"
        	};
    	}

    	dojo.xhrPost({
        	url : my.tifAdmin.restRoot + "/user/user/login;jsessionid=" + my.tifAdmin.managerJsessionId,
        	timeout : 5000,
       		handleAs : "json",
        	headers : {
            	"Content-Type" : "application/json"
        	},
        	sync : true,
        	putData : dojo.toJson(loadData),
        	load : function(response, isArg) {
        		var jssnId = response.items[0]['@jsessionId'];
        		if(jssnId != my.tifAdmin.managerJsessionId)
        			my.tifAdmin.managerJsessionId = jssnId;
         		loginTifError |= 2;
        	},
        	error : function(response, isArg) {
         		loginTifError &= 1;
        	}
    	});

    	//http://10.50.8.240:7077/rest/dojo/liveevent/user/user/login/setcurrentorganizationandusertype?organizationCode=XORME&userType=3
    	dojo.xhrGet({
        	url : my.tifAdmin.restRoot + "/user/user/login/setcurrentorganizationandusertype;jsessionid=" + my.tifAdmin.managerJsessionId+"?organizationCode="+organizationCode+"&userType="+userType,
        	timeout : 5000,
        	sync : true,
        	handleAs : "json",
        	headers : {
            	"Content-Type" : "application/json"
        	},
        	load : function(response, isArg) {
         		loginTifError |= 1;
        	},
        	error : function(response, isArg) {
          		loginTifError &= 2;
        	}
    	});
    //}
    return loginTifError;
}

function tifUserReLogin(){
	var loginTifError = true;

	var loadData = {
		"@accountName": my.tifAdmin.loginUsingValue,
		"@domain": my.tifAdmin.domainStr,
		"@hashValue": my.tifAdmin.hashValue,
		"@type": "loginModel"
	};

	dojo.xhrPost({
        	url : my.tifAdmin.restRoot + "/user/user/teacherstudentlogin;jsessionid=" + my.tifAdmin.jsessionId,
        	timeout : 5000,
       		handleAs : "json",
        	headers : {
            	"Content-Type" : "application/json"
        	},
        	sync : true,
        	putData : dojo.toJson(loadData),
        	load : function(response, isArg) {
        		var jssnId = response.items[0]['@jsessionId'];
        		if(jssnId != my.tifAdmin.jsessionId)
        			my.tifAdmin.jsessionId = jssnId;
        	},
        	error : function(response, isArg) {
         		loginTifError = false;
        	}
    	});

    return loginTifError;
}


function setDataByAqua(){
    //获取
    var method = "GET";
    //var contentType = "application/cdmi-object";
    var contentType = "application/cdmi-domain";
    var nowDateTime = new Date().getTime();
    var urlPath = "/aqua/rest/cdmi" + my.aqua.xgxDomainURI;
    var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
    jQuery.ajax({
        type: method,
        url:urlPath + "?metadata;",
        async : false,
        dataType: "json",
        headers: {
            "Accept": contentType,
            "Content-Type": contentType,
            "Authorization": "AQUA " + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign_netdisk)),
            "x-aqua-date": nowDateTime,
            "X-CDMI-Specification-Version": "1.0.2"
        }
    }).done(function (data) {
        MANAGER.account = data.metadata.tif_org_manager;
        MANAGER.password = data.metadata.tif_org_managerpwd;
        MANAGER.organizationCode = data.metadata.tif_org_code;
        MANAGER.organizationName = data.metadata.tif_organization;
        MANAGER.region = data.metadata.tif_org_region;
        MANAGER.aquaAcc = data.metadata.rhtx_admin;
        MANAGER.aquaPwd = data.metadata.rhtx_adminpwd;
        MANAGER.userRoutingKeyFirstStr = data.metadata.rhtx_userRoutingKeyFirstStr;

        if(data.metadata.rhtx_type == 'EDU'){
            wsp_flag = FOR_EDU;
        }else if(data.metadata.rhtx_type == 'ENT'){
            wsp_flag = FOR_VDU;
        }
    }).fail(function(jqXHR, textStatus) {
        console.log("用户无权限读取aqua的metadata信息！");
    });
}

function convertTimeString(str) {
	var ret = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|([+-])(\d{2})(\d{2})?)/.exec(str);
	if (ret) {
		var tmpYear = Number(ret[1]);
		var tmpMonth = Number(ret[2]) - 1;
		var tmpDate = Number(ret[3]);
		var tmpHours = Number(ret[4]);
		var tmpMins = Number(ret[5]);
		var tmpSecs = Number(ret[6]);
		var tmpTimeInMyZone = new Date(tmpYear, tmpMonth, tmpDate, tmpHours, tmpMins, tmpSecs);

		var myZoneOffset = tmpTimeInMyZone.getTimezoneOffset();
		var origZoneOffset = 0;
		if (ret[7] != 'Z') {
			origZoneOffset = Number(ret[9]) * 60 + (ret[10] ? Number(ret[10]) : 0);
			if (ret[8] == '+') {
				origZoneOffset = 0 - origZoneOffset;
			}
		}
		var origToMyOffset = origZoneOffset - myZoneOffset;
		var timeMillSecs = tmpTimeInMyZone.getTime() + origToMyOffset * 60 * 1000;
		var timeInMyZone = new Date(timeMillSecs);

		var myZoneStr = '';
		var year = timeInMyZone.getFullYear();
		var month = timeInMyZone.getMonth();
		var date = timeInMyZone.getDate();
		var hours = timeInMyZone.getHours();
		var mins = timeInMyZone.getMinutes();
		var secs = timeInMyZone.getSeconds();

		myZoneStr += year;
		myZoneStr += '-';
		myZoneStr += month > 8 ? month + 1 : '0' + (month + 1);
		myZoneStr += '-';
		myZoneStr += date > 9 ? date : '0' + date;
		myZoneStr += ' ';
		myZoneStr += hours > 9 ? hours : '0' + hours;
		myZoneStr += ':';
		myZoneStr += mins > 9 ? mins : '0' + mins;
		myZoneStr += ':';
		myZoneStr += secs > 9 ? secs : '0' + secs;

		return myZoneStr;
	}
	return '';
}

function addLoadingLayer(){
    jQuery('.loading_layer').remove();
    jQuery('<div>').addClass('loading_layer').appendTo(document.body);
}

function removeLoadingLayer(){
    jQuery('.loading_layer').remove();
}
