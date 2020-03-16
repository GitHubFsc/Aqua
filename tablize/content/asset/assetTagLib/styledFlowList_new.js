( function($) {
    function AssetTagLibStyledFlowList(obj) {
        $.extend(this, obj);
        this.init();
    }


    AssetTagLibStyledFlowList.prototype = {
        init: function() {
            this.minRows = this.minRows || 0;
            this.title = this.title || {
                label: ''
            };
            this.data = this.data || [];
            this.container = $(this.container);
						this.resourceData=this.resourceData || [];
        },

        create: function() {
            this.setEventHandler();
            this.container.empty().append(this.getList());
            $('.styled-flow-list-content-container').mCustomScrollbar({
                theme:"my-theme"
            });
        },

        setEventHandler: function() {
            var self = this;
            this.container.on('change', 'input', function(ev) {
                var $box = $(this);
                var pos = $box.attr('name');
                if (pos === 'styled-flow-list-head-item') {
                    if (this.checked) {
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            this.checked = true;
                        });
                    } else {
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            this.checked = false;
                        });
                    }
                } else if (pos === 'styled-flow-list-body-item') {
                    if (this.checked) {
                        var checks = [];
                        self.container.find('input[name="styled-flow-list-body-item"]').each(function(index) {
                            checks.push(this);
                        });
                        if (checks.every(function(item) {
                            if (item.checked) {
                                return true;
                            } else {
                                return false;
                            }
                        })) {
                            self.container.find('input[name="styled-flow-list-head-item"]').first().prop('checked', true);
                        }
                    } else {
                        self.container.find('input[name="styled-flow-list-head-item"]').first().prop('checked', false);
                    }
                }
            });
        },
        switchRadio:function(obj,index_){
					var resourceData=this.resourceData;
				  var jq=jQuery;
					var containerId=this.container.attr("id");
					if(jq(obj).children().css("display")=="none"){
						jq("#"+containerId+"_choosedRadioButton").children().eq(0).css("display","none");
						jq("#"+containerId+"_choosedRadioButton").attr("id","");
						jq(obj).children().eq(0).css("display","block");
						jq(obj).attr("id",""+containerId+"_choosedRadioButton");
					}
					document.getElementById("addTagToProduct_choosedTagTitle").innerHTML=jq(obj).closest("tr").children().eq(2).text()
					if(resourceData[index_]){
						this.initCalendar(resourceData[index_])
					}
				},
				initCalendar:function(data){
					var jq=jQuery;
					var validBginInputId="addTagForProduct_Popup_validTimeBegin-datepicker-input";
					var validEndInputId="addTagForProduct_Popup_validTimeEnd-datepicker-input";
					var effective_time=(data.effective_time&&data.effective_time!=null)?data.effective_time:"";
					jq("#"+validBginInputId+"").val(effective_time.substring(0,10));
					if(data.expiration_time&&data.expiration_time!=null&data.expiration_time!=""){
						jq("#addTagForProduct_Popup_alwaysValid").children().css("display","none");
						document.getElementById(validBginInputId).removeAttribute("disabled");
						document.getElementById(validEndInputId).removeAttribute("disabled");
						jq("#"+validBginInputId+"").css("background-color","");
						jq("#"+validEndInputId+"").css("background-color","");
						jq("#"+validEndInputId+"").val(data.expiration_time.substring(0,10));
					}
					else{//永久有效
						jq("#addTagForProduct_Popup_alwaysValid").children().css("display","block");
						document.getElementById(validBginInputId).setAttribute("disabled","disabled");
						document.getElementById(validEndInputId).setAttribute("disabled","disabled");
						jq("#"+validBginInputId+"").css("background-color","#efefef");
						jq("#"+validEndInputId+"").css("background-color","#efefef").val("");
					};
				},
        getList: function() {
            var headStr = '<tr>';
            headStr += '<th></th>';
            headStr += '<th><input type="checkbox" style="display:none" name="styled-flow-list-head-item"/></th>';
            headStr += '<th>' + this.title.label + '</th>';
            headStr += '</tr>';
            var bodyStr = '';
            var lmt = Math.max(this.data.length, this.minRows);
            for (var i = 0; i < lmt; i++) {
                var item = this.data[i];
                var rowStr = '<tr>';
                rowStr += '<td>' + (i + 1) + '</td>';
                if (item) {
								    var display_=(i==0)?"block":"none";
										var containerId=this.container.attr("id");
										var id_=(i==0)?""+containerId+"_choosedRadioButton":"";
                    rowStr += "<td><div id=\""+id_+"\" style=\"margin:auto;border-radius:10px;width:14px;height:14px;border:1px #bcc1c5 solid;cursor:pointer\" name=\"styled-flow-list-body-item\" data-index=\""+i+"\"><div style=\"display:"+display_+";border-radius:10px;background-color:#4eb5d6;width:10px;height:10px;margin:2px\"></div><div class=\"storedName\" style=\"display:none\">"+item.storedName+"</div></div>";
                    rowStr += '<td>' + item.label + '</td>';
                } else {
                    rowStr += '<td></td><td></td>';
                }
                rowStr += '</tr>';
                bodyStr += rowStr;
            }
            var tableheadStr = '<table>';
            tableheadStr += headStr;
            tableheadStr += '</table>';
            var tableStr = '<div class = "styled-flow-list-content-container"><table>';
            tableStr += bodyStr;
            tableStr += '</table></div>';
            var $frag = $(document.createDocumentFragment());
            $frag.append(tableheadStr);
            $frag.append(tableStr);
            return $frag;
        },

        getChecked: function() {
            var self = this;
            var checked = [];
            this.container.find('input[name="styled-flow-list-body-item"]').each(function() {
                if (this.checked) {
                    checked.push(self.data[$(this).attr('data-index')]);
                }
            });
            return checked;
        },

        getData: function() {
            return this.data;
        },

        update: function(data) {
				    var jq=jQuery;
				    var that=this;
            this.data = data || [];
            this.container.empty().append(this.getList());
						this.container.find('[name="styled-flow-list-body-item"]').each(function() {
							jq(this).unbind().bind('click', function () {
								var index_=jQuery("#sucai_dialog_sucaizu_selectable").find(".styled-flow-list-content-container table tr").index(jq(this).closest("tr"));
								that.switchRadio(this,index_)
							})
						})
            $('.styled-flow-list-content-container').mCustomScrollbar({
                theme:"my-theme"
            });
        }

    };

    window.AssetTagLibStyledFlowList = AssetTagLibStyledFlowList;
}(jQuery));
