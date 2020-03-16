(function($) {
			function getMenu(menu, parent){
				if(!menu || menu.hidden){
					return;
				}
                if(menu.isGroup){
                    var folder = $('<div>').addClass('master_menu_group').addClass('master_menu_group_shrink').append(
                        $('<div>').addClass('master_menu_group_title').attr('id', menu.id || '').append(
                            $('<div>').addClass('master_menu_group_title_front').addClass('master_expandable_front')
                        ).append(
                            $('<div>').addClass('master_expandable_back').append(menu.name || '')
                        ).on('click', function(){
                        	var titleClicked = this;
                            $('.master_menu_group').each(function() {
                            	var group = $(this);
                              	if(group.children('.master_menu_group_title')[0] !== titleClicked){
                              		group.addClass('master_menu_group_shrink');
                              	} else {
                              		group.toggleClass('master_menu_group_shrink');
                              	}
                            });
                        }).hover(function(){
                            addMenuTooltip(this);
                        }, function(){
                            removeMenuTooltip();
                        })
                    );
                    var subs = menu.children || [];
                    for(var i = 0, len = subs.length; i < len; i++){
                        getMenu(subs[i], folder);
                    }
                    folder.appendTo(parent);
                } else {
                    var menuItem = $('<div>').append(
                        $('<div>').addClass((menu.id || '') + '_icon').addClass('master_expandable_front')
                    ).append(
                        $('<div>').append(menu.name || '').addClass('master_expandable_back')
                    ).attr('id', menu.id || '')
                    .attr('attr-meta', menu.meta || '').on('click', function(){
                        $('.master_menu_focus').each(function(){
                         	$(this).removeClass('master_menu_focus');
                        });
                        $(this).addClass('master_menu_focus');
                        if(menu.contents){
                        	addServantMenu(menu);
                        	$('#panel_content').removeClass('servant_shrink').addClass('servant_expand');
                        	$(menuView).trigger('viewresize');
                        } else {
							$('#panel_submenu_container').empty();
                        	$('#panel_content').removeClass('servant_expand').removeClass('servant_shrink');
                        	$(menuView).trigger('viewresize').trigger('entermenu', [menu.id, menu.meta]);
                        }
                    }).hover(function(){
                        addMenuTooltip(this);
                    }, function(){
                        removeMenuTooltip();
                    }).appendTo(parent);
                }
            }

            function addMenuTooltip(obj){
                var tooltip = $(obj).children('.master_expandable_back').text();
                $('<div>').addClass('master_menu_tooltip').append(
                    $('<div>').addClass('master_menu_tooltip_arrow')
                ).append(
                    $('<div>').addClass('master_menu_tooltip_text').append(tooltip)
                ).on('click', function(){
                	return false;
                }).appendTo(obj);
            }

            function removeMenuTooltip(){
                $('.master_menu_tooltip').remove();
            }

            function onServantClick(){
            	$('.servant_menu_focus').each(function(){
             		$(this).removeClass('servant_menu_focus');
             	});
             	var $servant = $(this);
             	$servant.addClass('servant_menu_focus');
             	var id = $servant.attr('id');
             	var meta = $servant.attr('attr-meta');
             	$(menuView).trigger('entermenu', [id, meta]);
            }


		function addServantMenu(menu) {
			var frag = document.createDocumentFragment();
			$('<div>').append(menu.name).addClass('servant_menu_title').appendTo(frag);
			for (var x = 0, xLen = menu.contents.length; x < xLen; x++) {
				var servMenu = menu.contents[x];
				if (!servMenu || servMenu.hidden) {
					continue;
				}
				if(servMenu.fourth){
					var $servGroup = $('<div>').addClass('servant_menu_group').addClass('servant_menu_group_shrink').append(
						$('<div>').addClass('servant_menu_group_title').attr('id', servMenu.id).append(servMenu.name)
						.on('click', function(){
							$(this).parent().toggleClass('servant_menu_group_shrink');
						})
					).appendTo(frag);
					for(var s = 0, sLen = servMenu.fourth.length; s < sLen; s+=1){
						var fourthItem = servMenu.fourth[s];
						if(fourthItem != null && !fourthItem.hidden){
							$('<div>').append(fourthItem.name || '')
							.attr('id', fourthItem.id || '')
							.attr('attr-meta', fourthItem.meta || '')
							.addClass('servant_menu_item')
							.on('click', onServantClick)
							.appendTo($servGroup);
						}
					}
				} else {
					$('<div>').append(servMenu.name || '')
					.attr('id', servMenu.id || '')
					.attr('attr-meta', servMenu.meta || '')
					.addClass('servant_menu_item')
					.on('click', onServantClick)
					.appendTo(frag);
				}
			}
			$('#panel_submenu_container').empty().append(frag);

			if (menuView.currentPage) {
				$('#panel_submenu_container').find('#' + menuView.currentPage).addClass('servant_menu_focus');
			}
		}


        function resizePageContainer(){
        	var spacerWidth = 1;
        	if($('#panel_main').hasClass('master_expand')){
        		spacerWidth += 70;
        	}
        	if($('#panel_content').hasClass('servant_expand')){
        		spacerWidth += 140;
        	}
        	$('.panel_spacer').width(spacerWidth);
        	var callback = menuView.onResize;
        	if(typeof callback === 'function'){
        		callback();
        	}
        }

		var menuEntries = {
			singleQuery: {name: '单人', id: 'single_query'},
			multiDetailList: {name: '多人详单', id: 'multi_detail_list'},
			multiStatistics: {name: '多人统计', id: 'multi_statistics'},
			heatAnalysis: {name: '热度分析', id: 'heat_analysis'},
			exportTask: {name: '导出任务', id: 'export_task'},
			statSetting: {name: '报表设置', id: 'stat_setting'},
			channelRealtime: {name: '频道实时', id: 'channel_realtime'},
			channelHistory: {name: '频道时段', id: 'channel_history'},
			programHistory: {name: '栏目收视', id: 'program_history'},
			userAdmin: {name: '用户', id: 'user_admin'},
			userGroupAdmin: {name: '用户组', id: 'usergroup_admin'},
			userTag: {name: '用户标签库', id: 'user_tag'},
			appAdmin: {name: '应用管理', id: 'app_admin'},
			productPkg: {name: '产品包', id: 'product_package'},
			productOffering: {name: '营销策略', id: 'product_offering'},
			querySupervisor: {name: '请求监控', id: 'query_supervisor'},
			autheSingle: {name: '单人查询', id: 'authe_sing'},
			autheBatch: {name: '多人查询', id: 'authe_batch'},
			autheInfo: {name: '鉴权信息统计', id: 'authe_info'},
			authoSingle: {name: '单人查询', id: 'autho_sing'},
			authoBatch: {name: '多人查询', id: 'autho_batch'},
			authoInfo: {name: '授权信息统计', id: 'autho_info'},
      cancelAuthoSingle: {name: '单人查询', id: 'cancel_autho_sing'},
      cancelAuthoBatch: {name: '多人查询', id: 'cancel_autho_batch'},
			authStats: {name: '授权鉴权统计', id: 'authstats'},
			asset: {name: '节目和节目包', id: 'asset_list'},
			assetShelf: {name: i18n('MENU_ASSET_SHELF'), id: 'asset_shelf'},
			assetDel: {name: '节目删除', id: 'asset_del'},
			setTagByTag: {name: '按标签设置标签', id: 'setTagByTag'},
			assetMeta: {name: '元数据定义', id: 'asset_meta'},
			ticket: {name: '优惠券', id: 'ticket'},
			assetTagLib: {name: '节目标签库', id: 'asset_tag_lib'},
			operateDaySum: {name: i18n('MENU_DAY_SUM'), id: 'entry_day_sum'},
			oaSumDay: {name: i18n('OA_INDEX_SUM_DAY'), id: 'entry_oa_sumday'},
			oaTrendHour: {name: i18n('OA_TREND_HOUR'), id: 'entry_oa_trendhour'},
			oaTrendDay: {name: i18n('OA_TREND_DAY'), id: 'entry_oa_trendday'},
			oaTrendWeek: {name: i18n('OA_TREND_WEEK'), id: 'entry_oa_trendweek'},
			oaTrendMonth: {name: i18n('OA_TREND_MONTH'), id: 'entry_oa_trendmonth'},
			distributionAnalysis: {name: i18n('FENBUFENXI_TITlE'), id: 'entry_distributionAnalysis'},
			trendAnalysis: {name: i18n('TRENDANALYSIS_TITLE'), id: 'entry_trendAnalysis'},
			userAction: {name: i18n('USERACTION_USERACTION'), id: 'entry_userAction'},
      jobManage:{name: i18n("JOBMANAGE_RENWUGUANLI"), id: 'entry_job_manage'},
			navigationManagement: {name: '编排管理', id: 'nav_manage'},
			navigationAudit: {name: '编排审核', id: 'nav_audit'},
			navigationPublish: {name: '版本发布', id: 'nav_publish'},
			navigationVersion: {name: '版本变更', id: 'nav_version'},
      navigationManagementSlider: {name: '轮播编排', id: 'nav_manage_slider'},
			sysUser:{name: i18n("MENU_SYS_USER"), id: 'entry_sys_user'},
			assetImport:{name: i18n("MENU_ASSET_IMPORT"), id: 'entry_asset_import'},
			CMSnavigationManagement:{name: i18n("SYS_USER_NAVIGATE_MNG"), id: 'entry_CMS_nav_manage'},
			CMSnavigationAudit:{name: i18n("SYS_USER_NAVIGATE_AUDIT"), id: 'entry_CMS_nav_audit'},
			CMSnavigationPublish:{name: '版本发布', id: 'entry_CMS_nav_publish'},
			CMSnavigationVersion:{name: '版本变更', id: 'entry_CMS_nav_version'},
			postManageMent:{name: '资讯管理', id: 'entry_post_management'},
			assetUpdateManage: {name: i18n('MENU_ASSET_UPDATE_MANAGE'), id: 'entry_asset_update_manage'},
			assetExportAll: {name: i18n('MENU_ASSET_EXPORT_ALL'), id: 'entry_asset_export_all'},
			channelManage: {name: i18n('MENU_CHANNEL_MANAGE'), id: 'entry_channel_management'},
			channelMetaManage: {name: i18n('MENU_CHANNEL_META_MANAGE'), id: 'entry_channel_meta_manage'},
			abnormalOrder: {name: i18n('MENU_LOG_ABNORMAL_ORDER'), id: 'entry_abnormal_order'}
		};

		var adminMenuData = [{
			name: '产品管理', id: 'product_manage', isGroup: true,
			children: [{
				name: "节目", id: "asset",
				contents: [menuEntries.asset, menuEntries.assetShelf, menuEntries.setTagByTag, menuEntries.assetMeta,
					menuEntries.assetTagLib,menuEntries.assetImport, menuEntries.assetExportAll, menuEntries.assetDel, menuEntries.assetUpdateManage]
			}, {
				name: i18n('MENU_CAT_CHANNELS'), id: 'channels',
				contents: [menuEntries.channelManage, menuEntries.channelMetaManage]
			}, menuEntries.productPkg]
		}, {
			name: '销售管理', id: 'sells_manage', isGroup: true,
			children: [
				menuEntries.productOffering,
				menuEntries.ticket,
			]
		}, {
			name: '编排管理', id: 'navigation', isGroup: true,
			children: [{
				name: '节目编排', id: 'asset_navigation',
				contents: [menuEntries.navigationManagement, menuEntries.navigationAudit,
				menuEntries.navigationPublish, menuEntries.navigationVersion]
			},{
				name: '首页编排', id: 'entry_CMS',
				contents: [menuEntries.CMSnavigationManagement,menuEntries.CMSnavigationAudit,menuEntries.CMSnavigationPublish,menuEntries.CMSnavigationVersion]
			},menuEntries.navigationManagementSlider]
		}, {
			name: '用户管理', id: 'user_manage', isGroup: true,
			children: [menuEntries.userAdmin, menuEntries.userGroupAdmin, menuEntries.userTag]
		},
		{
			name: '审计日志', id: 'audit_log', isGroup: true,
			children: [{
				name: '授权与鉴权', id: 'authorization_and_authetication',
				contents: [{
					name: '授权请求', id: 'authontication_management',
					fourth: [menuEntries.authoSingle, menuEntries.authoBatch, menuEntries.authoInfo]
				}, {
					name: '取消授权请求', id: 'cancel_authontication_management',
					fourth: [menuEntries.cancelAuthoSingle, menuEntries.cancelAuthoBatch]
				}, {
					name: '鉴权请求', id: 'authentication_management',
					fourth: [menuEntries.autheSingle, menuEntries.autheBatch, menuEntries.autheInfo]
				}, menuEntries.authStats, menuEntries.abnormalOrder]
			}, menuEntries.querySupervisor]
		}, {
			name: '系统管理', id: 'system_manage', isGroup: true,
			children: [menuEntries.appAdmin, menuEntries.jobManage, menuEntries.sysUser]
		}, {
			name: '统计分析', id: 'statistic_analysis', isGroup: true,
			children: [{
				name: '点播查询', id: 'broadcast_query',
				contents: [menuEntries.singleQuery, menuEntries.multiDetailList, menuEntries.multiStatistics]
			},
			menuEntries.heatAnalysis,
			menuEntries.exportTask,
			menuEntries.statSetting,
			{
				name: '频道实时', id: 'channel_statistic',
				contents: [menuEntries.channelRealtime, menuEntries.channelHistory, menuEntries.programHistory]
			}]
		}, {
			name: i18n('MENU_OPERATION_ANALYZE'), id: 'entry_operation_analyze', isGroup: true,
			children:[menuEntries.operateDaySum, {
				name: i18n('OA_INDEX'),
				id: 'entry_oa_index',
				contents: [menuEntries.oaSumDay, menuEntries.oaTrendHour, menuEntries.oaTrendDay, menuEntries.oaTrendWeek, menuEntries.oaTrendMonth]
			}, menuEntries.trendAnalysis, menuEntries.distributionAnalysis, menuEntries.userAction]
		},menuEntries.postManageMent
		];

		var dropdownAnchor;

		var menuView = {
			currentPage: null,
			init: function(){
				if(window.login && login.user.user_name){
					this.buildUser();
					window.dropdownHelper && window.dropdownHelper.addDropdownHandler(this);
					dropdownAnchor = $('#main_page_user_dropdown')[0];
				}
				this.buildMenu();
				resizePageContainer();
				this.listenEvents();
				this.enterFirstPage();
			},
			buildMenu: function(){
				var menuData = this.getUserMenu();
				this.menuData = menuData;
				var frag = document.createDocumentFragment();
				for(var i = 0, len = menuData.length; i < len; i++){
					getMenu(menuData[i], frag);
				}
				$('#panel_menu_container').empty().append(frag);
			},
			buildUser: function(){
				var user_icon = 'menu/images/default_user_icon.png';
				var user_name = login.user.user_name;
				var user_role = '';
				$('.main_page_user_container').show();
				$('#main_page_user_icon').css('background-image', 'url(' + user_icon + ')');
				$('#main_page_user_info_name').text(user_name).attr('title', user_name);
				$('#main_page_user_dropdown').show().on('click', function() {
					$(this).toggleClass('main_page_user_dropdown_down');
				});
				$('#main_page_user_logout').on('click', function() {
					navigate.logout();
				});
			},
			handleDropdowns: function(target, delegate) {
				var $dropdown = $('#main_page_user_dropdown');
				var dropdown = $dropdown[0];

				if (!dropdown || dropdown !== dropdownAnchor) {
					window.dropdownHelper.removeDropdownHandler(this);
					return;
				}

				var isChild = window.dropdownHelper.checkIsChild(dropdown, target, delegate);

				if (!isChild && $dropdown.hasClass('main_page_user_dropdown_down')) {
					$dropdown.removeClass('main_page_user_dropdown_down');
				}
			},
			listenEvents: function(){
				$('#panel_master_control').on('click', function(){
					$('#panel_main').toggleClass('master_expand');
					$(menuView).trigger('viewresize');
				});
				$('#panel_servant_control').on('click', function(){
					$('#panel_content').removeClass('servant_expand').addClass('servant_shrink');
                    $(menuView).trigger('viewresize');
				});
				$('#panel_servant_shrink_expand').on('click', function(){
					$('#panel_content').removeClass('servant_shrink').addClass('servant_expand');
					$(menuView).trigger('viewresize');
				});
				$(menuView).on('entermenu', function(ev, id, meta){
					$(window).off('resize').on('resize', function(){
						$(menuView).trigger('viewresize');
					});
					$('#page_container').removeAttr('style');
					menuView.onResize = null;
					menuView.currentPage = id;
					switch(id){
					case 'single_query':
						navigate.toDemandRecord($('#m_20')[0], function(){
							demandRrecord.toSingleQuery($('#demand_record_single_query_container')[0]);
						});
						break;
					case 'multi_detail_list':
						navigate.toDemandRecord($('#m_20')[0], function(){
							demandRrecord.toBatchQuery($('#demand_record_batch_query_container')[0]);
						});
						break;
					case 'multi_statistics':
						navigate.toDemandRecord($('#m_20')[0], function(){
							demandRrecord.toBatchQueryStatistics($('#demand_record_batch_query_container')[0]);
						});
						break;
					case 'export_task':
						navigate.toDemandRecord($('#m_20')[0], function(){
							demandRrecord.toBatchExport($('#demandRrecord_invit_list_container')[0]);
						});
						break;
					case 'stat_setting':
						navigate.toDemandRecord($('#m_20')[0], function(){
							demandRrecord.toBasicSettings($('#demand_record_basicsetting')[0]);
						});
						break;
					case 'channel_realtime':
						navigate.toRealtimeAnalysis($('#realtime_analysis')[0], function(){
							window.JS.auAnalysis.realtimeAnalysis.analyzeChannelRealtime($('#channel_realtime_container')[0]);
						});
						break;
					case 'channel_history':
						navigate.toRealtimeAnalysis($('#realtime_analysis')[0], function(){
							window.JS.auAnalysis.realtimeAnalysis.analyzeChannelHistory($('#channel_history_container')[0]);
						});
						break;
					case 'program_history':
						navigate.toRealtimeAnalysis($('#realtime_analysis')[0], function(){
							window.JS.auAnalysis.realtimeAnalysis.analyzeProgramHistory($('#program_history_container')[0]);
						});
						break;
					case 'user_admin':
						navigate.toUserAdmin();
						break;
					case 'usergroup_admin':
						navigate.toUserGroupAdmin();
						break;
          case 'user_tag':
            navigate.toUserTag();
            break;
            case 'app_admin':
						navigate.toAppAdmin();
						break;
					case 'heat_analysis':
						navigate.toHeatStats();
						break;
					case 'product_package':
						navigate.toProductPkg(function(){
							productPackage.init();
						});
						break;
					case "query_supervisor":
					navigate.toSupervisor(function(){
						supervisor.init()
					});
					break;
					case "authe_sing":
						navigate.toAutheSingle();
					break;
					case "authe_batch":
						navigate.toAutheBatch();
					break;
					case "authe_info":
						navigate.toAutheInfo();
					break;
					case "autho_sing":
						navigate.toAuthoSingle();
					break;
					case "autho_batch":
						navigate.toAuthoBatch();
					break;
					case "autho_info":
						navigate.toAuthoInfo();
					break;
          case "cancel_autho_sing":
            navigate.toCancelAuthoSingle();
            break;
          case "cancel_autho_batch":
            navigate.toCancelAuthoBatch();
            break;
					case "product_offering":
						navigate.toProductOffering(function(){
							productOffering.init();
						});
						break;
					case 'authstats':
						navigate.toAuthStats();
					break;
					case 'asset_list':
						navigate.toAsset(function(){
							AssetManagement.init();
						});
					break;
					case 'asset_del':
						navigate.toAssetDel(function(){
							var dialog = new AssetDel();
						});
					break;
					case 'asset_shelf':
						navigate.toAssetShelf(function(){
							AssetShelf.init();
						});
					break;
				case 'setTagByTag':
						navigate.setTagByTag(function(){
						});
					break;
					case 'asset_meta':
						navigate.toAssetMeta(function(){
							AssetMeta.init();
						});
					break;
					case 'ticket':
						navigate.toLectureTicket(function(){
							LectureTicket.init();
						});
					break;
					case 'asset_tag_lib':
						navigate.toAssetTagLib(function(){
						});
					break;
					case 'nav_manage':
					  navigate.toNavMng(function(){
							navMng.init();
						})
						break;
					case 'nav_audit':
						navigate.toNavigationAudit(function(){
							var dialog = new NavAudit();
						});
						break;
					case 'nav_publish':
						navigate.toNavigationPublish(function(){
							var dialog = new NavPublish();
						});
						break;
					case 'nav_version':
						navigate.toNavigationPublishVersion(function(){
							var dialog = new NavVersion();
						});
						break;
					case 'entry_CMS_nav_audit':
						navigate.toNavigationAudit(function(){
							var dialog = new NavAudit('cms_tree');
						});
						break;
					case 'entry_CMS_nav_publish':
						navigate.toNavigationPublish(function(){
							var dialog = new NavPublish('cms_tree');
						});
						break;
					case 'entry_CMS_nav_version':
						navigate.toNavigationPublishVersion(function(){
							var dialog = new NavVersion('cms_tree');
						});
						break;
          case 'nav_manage_slider':
            navigate.toNavMngSlider()
            break;
					case 'entry_day_sum':
						navigate.toOperateDaySum();
						break;
					case 'entry_distributionAnalysis':
						navigate.toDistributionAnalysis();
						break;
					case 'entry_trendAnalysis':
						navigate.toTrendAnalysis();
						break;
					case 'entry_userAction':
						navigate.toUserAction();
						break;
					case 'entry_oa_sumday':
						navigate.toOASumDay();
						break;
					case 'entry_oa_trendhour':
						navigate.toOATrendHour();
						break;
					case 'entry_oa_trendday':
						navigate.toOATrendDay();
						break;
					case 'entry_oa_trendweek':
						navigate.toOATrendWeek();
						break;
					case 'entry_oa_trendmonth':
						navigate.toOATrendMonth();
						break;
					case 'entry_job_manage':
            navigate.toJobManage();
            break;
					case 'entry_sys_user':
            navigate.toSysUser();
						break;
					case 'entry_asset_import':
						navigate.toAssetImport(function(){
							broadcastAssetImport.init();
						});
						break;
					case 'entry_CMS_nav_manage':
						navigate.toCMSAppAdmin(function(){
							CMSAppAdmin.init();
						});
					break;
					case 'entry_post_management':
						navigate.toPostManagement(function(){
							announcementPostList.init();
						});
						break;
					case 'entry_asset_update_manage':
						navigate.toAssetUpdateManage(function(){
							new AssetUpdateManage();
						});
						break;
					case 'entry_abnormal_order':
						navigate.toAbnormalOrder(function(){
							AbnormalOrders.init();
						});
						break;
					case 'entry_asset_export_all':
						navigate.toAssetExportAll(function(){
							AssetExportAll.init();
						});
						break;
					case 'entry_channel_management':
						navigate.toChannelManagement(function(){
              				// ChannelManagement.init();
						});
						break;
					case 'entry_channel_meta_manage':
						navigate.toChannelMetaManage(function(){
							ChannelMeta.init();
						});
						break;
					default:
						navigate.toDeveloping();
						break;
					}
				}).on('viewresize', function(){
					resizePageContainer();
				});
			},
			getUserMenu: function(){
				var userMenu = adminMenuData;
				if(window.REALTIME_ANALYSIS_HIDDEN){
					// adminMenuData[0].children[4] = null;
					userMenu[6].children[4].hidden = true;
				}
				var rightStr = my.paas.user && my.paas.user.metadata && my.paas.user.metadata.AquaBO_menuUserRight;
				for(var i = 0, len = userMenu.length; i < len; i+=1){
					var item = userMenu[i];
					if(checkMenuRight(item, rightStr)){
						checkMenuSubs(item, 'children', function(child, rightStr){
							if(checkMenuRight(child, rightStr)){
								checkMenuSubs(child, 'contents', function(content, rightStr){
									if(checkMenuRight(content, rightStr)){
										checkMenuSubs(content, 'fourth', checkMenuRight, rightStr);
									}
								}, rightStr);
							}
						}, rightStr);
						checkMenuSubs(item, 'contents', function(content, rightStr){
							if(checkMenuRight(content, rightStr)){
								checkMenuSubs(content, 'fourth', checkMenuRight, rightStr);
							}
						}, rightStr);
					}
				}
				return userMenu;
			},
			enterFirstPage: function(){
				var menuData = this.menuData || [];
				for(var i = 0, len = menuData.length; i < len; i++){
					var item = menuData[i];
					if(item){
						if(item.children){
							$('#' + item.id).click();
							for(var j = 0, jLen = item.children.length; j < jLen; j++){
								var child = item.children[j];
								if(child){
									$('#' + child.id).click();
									if(child.contents){
										for(var k = 0, kLen = child.contents.length; k < kLen; k++){
											var content = child.contents[k];
											if(content){
												$('#' + content.id).click();
												if(content.fourth){
													var fourth = content.fourth[0];
													if(fourth){
														$('#' + fourth.id).click();
													}
												}
												break;
											}
										}
									}
									break;
								}
							}
						} else if(item.contents){
							$('#' + item.id).click();
							for(var x = 0, xLen = item.contents.length; x < xLen; x++){
								var content = item.contents[x];
								if(content){
									$('#' + content.id).click();
									if(content.fourth){
										var fourth = content.fourth[0];
										if(fourth){
											$('#' + fourth.id).click();
										}
									}
									break;
								}
							}
						} else {
							$('#' + item.id).click();
						}
						break;
					}
				}
			},
			enterPage: function(attr){
				var menuPath = this.getMenuPath(attr);
				for(var i = 0, len = menuPath.length; i < len; i++){
					$('#' + menuPath[i]).click();
				}
			},
			getMenuPath: function(attr){
				var entries = menuEntries;
				var entry = entries[attr];
				var menuData = this.menuData || [];
				var found = false;
				var menuPath = [];
				for(var i = 0, len = menuData.length; i < len; i++){
					var item = menuData[i];
					if(item === entry){
						found = true;
						menuPath = [entry.id];
					} else if(item && item.children){
						for(var j = 0, jLen = item.children.length; j < jLen; j++){
							var jtem = item.children[j];
							if(jtem === entry){
								found = true;
								menuPath = [item.id, entry.id];
							} else if(jtem && jtem.contents){
								for(var k = 0, kLen = jtem.contents.length; k < kLen; k++){
									var ktem = jtem.contents[k];
									if(entry === jtem.contents[k]){
										found = true;
										menuPath = [item.id, jtem.id, entry.id];
										break;
									} else if(ktem && ktem.fourth){
										for(var l = 0, lLen = ktem.fourth.length; l < lLen; l++){
											if(entry == ktem.fourth[l]){
												found = true;
												menuPath = [item.id, jtem.id, ktem.id, entry.id];
												break;
											}
										}
									}
								}
							}
							if(found){
								break;
							}
						}
					} else if(item && item.contents){
						for(var x = 0, xLen = item.contents.length; x < xLen; x++){
							var xtem = item.contents[x];
							if(entry === item.contents[x]){
								found = true;
								menuPath = [item.id, entry.id];
								break;
							} else if(xtem && xtem.fourth){
								for(var y = 0, yLen = xtem.fourth.length; y < yLen; y++){
									if(entry == xtem.fourth[y]){
										found = true;
										menuPath = [item.id, xtem.id, entry.id];
										break;
									}
								}
							}
						}
					}
					if(found){
						break;
					}
				}

				return menuPath;
			}
		};

		var menuRightPreArr = [
		{
			label: '产品管理',
			id: 'product_manage',
		}, {
			label:'节目',
			id: 'asset',
		}, {
			label: '节目和节目包',
			id: 'asset_list',
		}, {
			label: '启用禁用(上下架)',
			id: 'asset_shelf',
		}, {
			label: '按标签设置标签',
			id: 'setTagByTag',
		}, {
			label: '元数据定义',
			id: 'asset_meta',
		}, {
			label: '节目标签库',
			id: 'asset_tag_lib',
		}, {
			label: '产品包',
			id: 'product_package',
		}, {
			label: '销售管理',
			id: 'sells_manage',
		}, {
			label: '营销策略',
			id: 'product_offering',
		}, {
			label: '优惠券',
			id: 'ticket',
		}, {
			label: '编排管理',
			id: 'navigation',
		}, {
			label: '编排',
			id: 'nav_manage',
		}, {
			label: '编排审核',
			id: 'nav_audit',
		}, {
			label: '编排发布(版本发布)',
			id: 'nav_publish',
		}, {
			label: '发布变更(版本变更)',
			id: 'nav_version',
		}, {
			label: '用户管理',
			id: 'user_manage',
		}, {
			label: '用户',
			id: 'user_admin',
		}, {
			label: '用户组',
			id: 'usergroup_admin',
		}, {
			label: '用户标签库',
			id: 'user_tag',
		}, {
			label: '审计日志',
			id: 'audit_log',
		}, {
			label: '授权与鉴权',
			id: 'authorization_and_authetication',
		}, {
			label: '授权请求',
			id: 'authontication_management',
		}, {
			label: '单人查询',
			id: 'autho_sing',
		}, {
			label: '多人查询',
			id: 'autho_batch',
		}, {
			label: '授权信息统计',
			id: 'autho_info',
		}, {
			label: '取消授权请求',
			id: 'cancel_authontication_management',
		}, {
			label: '单人查询',
			id: 'cancel_autho_sing',
		}, {
			label: '多人查询',
			id: 'cancel_autho_batch',
		}, {
			label: '鉴权请求',
			id: 'authentication_management',
		}, {
			label: '单人查询',
			id: 'authe_sing',
		}, {
			label: '多人查询',
			id: 'authe_batch',
		}, {
			label: '鉴权信息统计',
			id: 'authe_info',
		}, {
			label: '授权鉴权统计',
			id: 'authstats',
		}, {
			label: '请求监控',
			id: 'query_supervisor',
		}, {
			label: '系统管理',
			id: 'system_manage',
		}, {
			label: '应用管理',
			id: 'app_admin',
		}, {
			label: '任务管理',
			id: 'entry_job_manage',
		}, {
			label: '系统用户',
			id: 'entry_sys_user',
		}, {
			label: '统计分析',
			id: 'statistic_analysis',
		}, {
			label: '点播查询',
			id: 'broadcast_query',
		}, {
			label: '单人',
			id: 'single_query',
		}, {
			label: '多人详单',
			id: 'multi_detail_list',
		}, {
			label: '多人统计',
			id: 'multi_statistics',
		}, {
			label: '热度分析',
			id: 'heat_analysis',
		}, {
			label: '导出任务',
			id: 'export_task',
		}, {
			label: '报表设置',
			id: 'stat_setting',
		}, {
			label: '频道实时',
			id: 'channel_statistic',
		}, {
			label: '频道实时',
			id: 'channel_realtime',
		}, {
			label: '频道时段',
			id: 'channel_history',
		}, {
			label: '栏目收视',
			id: 'program_history',
		}, {
			label: '运营分析',
			id: 'entry_operation_analyze',
		}, {
			label: '当天数据',
			id: 'entry_day_sum',
		}, {
			label: '总体指标',
			id: 'entry_oa_index',
		}, {
			label: '日汇总',
			id: 'entry_oa_sumday',
		}, {
			label: '小时趋势',
			id: 'entry_oa_trendhour',
		}, {
			label: '日趋势',
			id: 'entry_oa_trendday',
		}, {
			label: '周趋势',
			id: 'entry_oa_trendweek',
		}, {
			label: '月趋势',
			id: 'entry_oa_trendmonth',
		}, {
			label: '趋势分析',
			id: 'entry_trendAnalysis',
		}, {
			label: '分布分析',
			id: 'entry_distributionAnalysis',
		}, {
			label: '用户行为',
			id: 'entry_userAction',
		}, {
			label: '节目导入',
			id: 'entry_asset_import'
		}, {
			label: '轮播编排',
			id: 'nav_manage_slider',
		}, {
			label: '节目删除',
			id: 'asset_del',
		}, {
			label: '节目编排',
			id: 'asset_navigation'
		},{
			label: 'CMS(二级菜单)',
			id: 'entry_CMS'
		},{
			label: '编排管理(CMS)',
			id: 'entry_CMS_nav_manage'
		},{
			label: "编排审核",
			id: 'entry_CMS_nav_audit'
		},{
			label: "版本发布",
			id: 'entry_CMS_nav_publish'
		},{
			label: "版本变更",
			id: 'entry_CMS_nav_version'
		},{
			label: "资讯管理",
			id: 'entry_post_management'
		},
		null,
		null,
		null,
		null, {
			label: '节目更新管理',
			id: 'entry_asset_update_manage'
		}, {
			label: '异常订单',
			id: 'entry_abnormal_order'
		}, {
			label: '全量节目导出',
			id: 'entry_asset_export_all'
		}, {
			label: '频道(二级)',
			id: 'channels'
		}, {
			label: '频道(三级)',
			id: 'entry_channel_management'
		}, {
			label: '频道元数据',
			id: 'entry_channel_meta_manage'
		}
		];

		var menuRightIMap = {};
		(function(){
			for(var i = 0, len = menuRightPreArr.length; i < len; i+=1){
				var item = menuRightPreArr[i];
				if(item != null){
					menuRightIMap[item.id] = i;
				}
			}
		})();

		function checkMenuRight(menu, rightStr){
			if(menu != null && menu.id != null && menu.id != '' && rightStr != null){
				var index = menuRightIMap[menu.id];
				var bit = rightStr[index];
				if(bit != null && bit != '' && bit != 'n'){
					return true;
				} else {
					menu.hidden = true;
				}
			} else if(menu != null){
				menu.hidden = true;
			}
			return false;
		}

		function checkMenuSubs(menu, subProp, process, param){
			if(menu != null && subProp != null && typeof process == 'function'){
				var subs = menu[subProp];
				if(subs != null){
					for(var i = 0, len = subs.length; i < len; i+=1){
						var sub = subs[i];
						process(sub, param);
					}
				}
			}
		}

		window.PanelMenu = menuView;

}(jQuery));
