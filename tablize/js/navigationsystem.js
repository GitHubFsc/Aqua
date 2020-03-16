//normal or mouseover pic, Must be followed width=240px height=79px or 114px
//buttons pic, Must be followed width=109px height=109px

var navigationSystemTab = null;

//------------------navigationSystemTab_blue-----------------------
var navigationSystemTab_blue = {
    "systemMenu1" : {//会议室管理
        normal : 'url(images/blue/systemmenu01nor.png)',
        mouseover : 'url(images/blue/systemmenu01mo.png)',
        tipsURL : 'menutip_blue1',
        execls : {
            // html : 'demo/demochart.html',
            // js : 'demo/demochart.js'
        },
        buttons : {
            button01 : {//创建会议室
                normal : 'url(images/blue/systemmenu01btn01nor.png)',
                mouseover : 'url(images/blue/systemmenu01btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "classrooms/classroom_create.html",
                            jsURL : "classrooms/classroom_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//会议室列表
                normal : 'url(images/blue/systemmenu01btn02nor.png)',
                mouseover : 'url(images/blue/systemmenu01btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "classrooms/classroom_list.html",
                            jsURL : "classrooms/classroom_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }
            // ,
            // button03 : { //会议主题确认失败统计
            // normal : 'url(images/blue/systemmenu01btn03nor.png)',
            // mouseover : 'url(images/blue/systemmenu01btn03mo.png)',
            // click : function() {
            // }
            // }
        }
    },
    "systemMenu2" : {//区域管理
        normal : 'url(images/blue/systemmenu02nor.png)',
        mouseover : 'url(images/blue/systemmenu02mo.png)',
        tipsURL : 'menutip_blue2',
        execls : {
            html : 'execl/sys_region_management.html',
            js : 'execl/sys_region_management.js'        },
        buttons : {
            button01 : {//创建区域
                normal : 'url(images/blue/systemmenu02btn01nor.png)',
                mouseover : 'url(images/blue/systemmenu02btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "area_manage/area_create.html",
                            jsURL : "area_manage/area_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//分配并发会议数量
                normal : 'url(images/blue/systemmenu02btn02nor.png)',
                mouseover : 'url(images/blue/systemmenu02btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "classrooms/system_administrator_assign_classroom.html",
                            jsURL : "classrooms/system_administrator_assign_classroom.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button03 : {//区域列表
                normal : 'url(images/blue/systemmenu02btn03nor.png)',
                mouseover : 'url(images/blue/systemmenu02btn03mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "area_manage/area_list.html",
                            jsURL : "area_manage/area_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }
        }

    },
    "systemMenu3" : {//组织管理
        normal : 'url(images/blue/systemmenu03nor.png)',
        mouseover : 'url(images/blue/systemmenu03mo.png)',
        tipsURL : 'menutip_blue3',
        execls : {},
        buttons : {
            button01 : {//创建组织
                normal : 'url(images/blue/systemmenu03btn01nor.png)',
                mouseover : 'url(images/blue/systemmenu03btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "organization/organization_create.html",
                            jsURL : "organization/organization_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//组织列表
                normal : 'url(images/blue/systemmenu03btn02nor.png)',
                mouseover : 'url(images/blue/systemmenu03btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "organization/organization_list.html",
                            jsURL : "organization/organization_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }
        }

    },
    "systemMenu6" : {//管理员管理
        normal : 'url(images/blue/systemmenu06nor.png)',
        mouseover : 'url(images/blue/systemmenu06mo.png)',
        tipsURL : 'menutip_blue6',
        execls : {},
        buttons : {
            button01 : {//创建管理员
                normal : 'url(images/blue/systemmenu06btn01nor.png)',
                mouseover : 'url(images/blue/systemmenu06btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "administrators/system_admin_create.html",
                            jsURL : "administrators/system_admin_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//管理员管理列表
                normal : 'url(images/blue/systemmenu06btn02nor.png)',
                mouseover : 'url(images/blue/systemmenu06btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "administrators/system_admin_list.html",
                            jsURL : "administrators/system_admin_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }
        }
    },
    "systemMenu4" : {//用户管理
        normal : 'url(images/blue/systemmenu04nor.png)',
        mouseover : 'url(images/blue/systemmenu04mo.png)',
        tipsURL : 'menutip_blue4',
        execls : {},
        buttons : {
            button01 : {//用户列表
                normal : 'url(images/blue/systemmenu04btn01nor.png)',
                mouseover : 'url(images/blue/systemmenu04btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "user/user_manager_list.html",
                            jsURL : "user/user_manager_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }            
        }
    },
  "systemMenu5" : {//配置管理
    normal : 'url(images/blue/systemmenu05nor.png)',
    mouseover : 'url(images/blue/systemmenu05mo.png)',
    tipsURL : 'menutip_blue5',
    execls : {},
    buttons : {
      button01 : {//会议中心
        normal : 'url(images/blue/systemmenu05btn01nor.png)',
        mouseover : 'url(images/blue/systemmenu05btn01mo.png)',
        click : function() {
          hideNavigationSystem();
          onHideNavigationSystemAndBar = function() {
            var egPage = new iPage({
              htmlURL : "config/meeting_center.html",
              jsURL : "config/meeting_center.js",
              parameters : {
                isMenuEnter : true
              },
              needBack : true
            });
            egPage.open();
          }
        }
      },
      button02 : {//资料中心
        normal : 'url(images/blue/systemmenu05btn02nor.png)',
        mouseover : 'url(images/blue/systemmenu05btn02mo.png)',
        click : function() {
          hideNavigationSystem();
          onHideNavigationSystemAndBar = function() {
            var egPage = new iPage({
              htmlURL : "config/document_center.html",
              jsURL : "config/document_center.js",              
              parameters : {
                isMenuEnter : true
              },
              needBack : true
            });
            egPage.open();
          }
        }
      },
      button03 : {//消息中心
        normal : 'url(images/blue/systemmenu05btn03nor.png)',
        mouseover : 'url(images/blue/systemmenu05btn03mo.png)',
        click : function() {
          hideNavigationSystem();
          onHideNavigationSystemAndBar = function() {
            var egPage = new iPage({
              htmlURL : "config/message_center.html",
              jsURL : "config/message_center.js",
              parameters : {
                isMenuEnter : true
              },
              needBack : true
            });
            egPage.open();
          }
        }
      },

      button04 : {//媒体中心
        normal : 'url(images/blue/systemmenu05btn04nor.png)',
        mouseover : 'url(images/blue/systemmenu05btn04mo.png)',
        click : function() {
          hideNavigationSystem();
          onHideNavigationSystemAndBar = function() {
            var egPage = new iPage({
              htmlURL : "config/media_center.html",
              jsURL : "config/media_center.js",
              parameters : {
                isMenuEnter : true
              },
              needBack : true
            });
            egPage.open();
          }
        }
      }

    }
  }
}

//------------------navigationSystemTab_green-----------------------
var navigationSystemTab_green = {
    "systemMenu1" : {//并发会议上限管理
        normal : 'url(images/green/systemmenu01nor.png)',
        mouseover : 'url(images/green/systemmenu01mo.png)',
        tipsURL : 'menutip_green1',
        execls : {
            html : 'execl/org_class_management.html',
            js : 'execl/org_class_management.js'
        },
        buttons : {
            button01 : {// 提高并发会议上限
                normal : 'url(images/green/systemmenu01btn01nor.png)',
                mouseover : 'url(images/green/systemmenu01btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "classrooms/organization_administrator_assign_classroom.html",
                            jsURL : "classrooms/organization_administrator_assign_classroom.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            // button02 : {// 收回并发会议数量
            // normal : 'url(images/green/systemmenu01btn02nor.png)',
            // mouseover : 'url(images/green/systemmenu01btn02mo.png)',
            // click : function() {
            // }
            // },
            button03 : {// 并发会议分布表
                normal : 'url(images/green/systemmenu01btn03nor.png)',
                mouseover : 'url(images/green/systemmenu01btn03mo.png)',
                click : function() {
                  hideNavigationSystem();
                  onHideNavigationSystemAndBar = function() {
                    var egPage = new iPage({
                      htmlURL : "classrooms/classroom_distribution.html",
                      jsURL : "classrooms/classroom_distribution.js",
                      parameters : {
                        isMenuEnter : true
                      },
                      needBack : true
                    });
                    egPage.open();
                  }
                }
            }
        }
    },
    "systemMenu2" : {//资费管理
        normal : 'url(images/green/systemmenu02nor.png)',
        mouseover : 'url(images/green/systemmenu02mo.png)',
        tipsURL : 'menutip_green2',
        execls : {},
        buttons : {}

    },
    "systemMenu3" : {//组织管理
        normal : 'url(images/green/systemmenu03nor.png)',
        mouseover : 'url(images/green/systemmenu03mo.png)',
        tipsURL : 'menutip_green3',
        execls : {},
        buttons : {
            button01 : {//创建下属组织
                normal : 'url(images/green/systemmenu03btn01nor.png)',
                mouseover : 'url(images/green/systemmenu03btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "organization/add_affiliated_organization.html",
                            jsURL : "organization/add_affiliated_organization.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//组织信息修改
            normal : 'url(images/green/systemmenu03btn02nor.png)',
            mouseover : 'url(images/green/systemmenu03btn02mo.png)',
            click : function() {
                hideNavigationSystem();
                onHideNavigationSystemAndBar = function() {
                    var egPage = new iPage({
                        htmlURL : "organization/modify_own_organization.html",
                        jsURL : "organization/modify_own_organization.js",
                        parameters : {
                            isMenuEnter : true
                        },
                        needBack : false
                    });
                    egPage.open();
                }
            }
            },
            button03 : {//组织成员管理
                status : "submenu", //enable , disable , submenu
                normal : 'url(images/green/systemmenu03btn03nor.png)',
                mouseover : 'url(images/green/systemmenu03btn03mo.png)',
                click : buttonClickToSubMenu,
                execls : {
                },
                buttons : {
                    button01 : {//创建会议主持人
                    normal : 'url(images/green/systemmenu03btn03sub01nor.png)',
                    mouseover : 'url(images/green/systemmenu03btn03sub01mo.png)',
                    click : function() {
                            hideNavigationSystem();
                            onHideNavigationSystemAndBar = function() {
                                var egPage = new iPage({
                                    htmlURL : "teacher/teacher_create.html",
                                    jsURL : "teacher/teacher_create.js",
                                    parameters : {
                                        isMenuEnter : true
                                    },
                                    needBack : false
                                });
                                egPage.open();
                            }
                        }
                    },
                    button02 : {//会议主持人组管理
                        status : "submenu",
                        normal : 'url(images/green/systemmenu03btn03sub02nor.png)',
                        mouseover : 'url(images/green/systemmenu03btn03sub02mo.png)',
                        click : buttonClickToSubMenu,
                        buttons : {
                            button01 : {//创建会议主持人组
                                normal : 'url(images/green/systemmenu03btn03sub02_01nor.png)',
                                mouseover : 'url(images/green/systemmenu03btn03sub02_01mo.png)',
                                click : function() {
                                    hideNavigationSystem();
                                    onHideNavigationSystemAndBar = function() {
                                        var egPage = new iPage({
                                            htmlURL : "teacher_group/teacher_group_create.html",
                                            jsURL : "teacher_group/teacher_group_create.js",
                                            parameters : {
                                                isMenuEnter : true
                                            },
                                            needBack : false
                                        });
                                        egPage.open();
                                    }
                                }
                            },
                            button02 : {//会议主持人组列表
                                normal : 'url(images/green/systemmenu03btn03sub02_02nor.png)',
                                mouseover : 'url(images/green/systemmenu03btn03sub02_02mo.png)',
                                click : function() {
                                    hideNavigationSystem();
                                    onHideNavigationSystemAndBar = function() {
                                        var egPage = new iPage({
                                            htmlURL : "teacher_group/teacher_group_list.html",
                                            jsURL : "teacher_group/teacher_group_list.js",
                                            parameters : {
                                                isMenuEnter : true
                                            },
                                            needBack : true
                                        });
                                        egPage.open();
                                    }
                                }
                            }
                        }
                    },
                    button03 : {//创建与会人员
                    normal : 'url(images/green/systemmenu03btn03sub03nor.png)',
                    mouseover : 'url(images/green/systemmenu03btn03sub03mo.png)',
                    click : function() {
                            hideNavigationSystem();
                            onHideNavigationSystemAndBar = function() {
                                var egPage = new iPage({
                                    htmlURL : "student/student_create.html",
                                    jsURL : "student/student_create.js",
                                    parameters : {
                                        isMenuEnter : true
                                    },
                                    needBack : false
                                });
                                egPage.open();
                            }
                        }
                    },
                    button04 : {//与会人员组管理
                        status : "submenu",
                        normal : 'url(images/green/systemmenu03btn03sub04nor.png)',
                        mouseover : 'url(images/green/systemmenu03btn03sub04mo.png)',
                        click : buttonClickToSubMenu,
                        buttons : {
                            button01 : {//创建与会人员组
                                normal : 'url(images/green/systemmenu03btn03sub04_01nor.png)',
                                mouseover : 'url(images/green/systemmenu03btn03sub04_01mo.png)',
                                click : function() {
                                    hideNavigationSystem();
                                    onHideNavigationSystemAndBar = function() {
                                        var egPage = new iPage({
                                            htmlURL : "student_group/student_group_create.html",
                                            jsURL : "student_group/student_group_create.js",
                                            parameters : {
                                                isMenuEnter : true
                                            },
                                            needBack : false
                                        });
                                        egPage.open();
                                    }
                                }
                            },
                            button02 : {//与会人员组列表
                                normal : 'url(images/green/systemmenu03btn03sub04_02nor.png)',
                                mouseover : 'url(images/green/systemmenu03btn03sub04_02mo.png)',
                                click : function() {
                                    hideNavigationSystem();
                                    onHideNavigationSystemAndBar = function() {
                                        var egPage = new iPage({
                                            htmlURL : "student_group/student_group_list.html",
                                            jsURL : "student_group/student_group_list.js",
                                            parameters : {
                                                isMenuEnter : true
                                            },
                                            needBack : true
                                        });
                                        egPage.open();
                                    }
                                }
                            }
                        }
                    },
                    /******************added at 2014-05-29 start********************/
                    button_cpr : {//创建纯接收者
	                    normal : 'url(images/green/menu_create_pure_receive_normal.png)',
	                    mouseover : 'url(images/green/menu_create_pure_receive_on.png)',
	                    click : function() {
	                        hideNavigationSystem();
	                        onHideNavigationSystemAndBar = function() {
	                            var egPage = new iPage({
	                                htmlURL : "pureReceiver/pure_receive_create.html",
	                                jsURL : "pureReceiver/pure_receive_create.js",
	                                parameters : {
	                                    isMenuEnter : true
	                                },
	                                needBack : false
	                            });
	                            egPage.open();
	                        };
	                    }
	                },
                    button_prgm : {//纯接收者组管理
                        status : "submenu",
                        normal : 'url(images/green/menu_level2_pure_receive_normal.png)',
        	            mouseover : 'url(images/green/menu_level2_pure_receive_on.png)',
                        click : buttonClickToSubMenu,
                        buttons : {
                        	button01 : {//创建纯接收者组
        	                    normal : 'url(images/green/menu_create_pure_receive_grp_normal.png)',
        	                    mouseover : 'url(images/green/menu_create_pure_receive_grp_on.png)',
        	                    click : function() {
        	                        hideNavigationSystem();
        	                        onHideNavigationSystemAndBar = function() {
        	                            var egPage = new iPage({
        	                                htmlURL : "pureReceiveGroup/pure_receive_group_create.html",
        	                                jsURL : "pureReceiveGroup/pure_receive_group_create.js",
        	                                parameters : {
        	                                    isMenuEnter : true
        	                                },
        	                                needBack : false
        	                            });
        	                            egPage.open();
        	                        };
        	                    }
        	                },
        	                button02 : {//纯接收者组列表
        	                    normal : 'url(images/green/menu_pure_receive_grp_list_normal.png)',
        	                    mouseover : 'url(images/green/menu_pure_receive_grp_list_on.png)',
        	                    click : function() {
        	                        hideNavigationSystem();
        	                        onHideNavigationSystemAndBar = function() {
        	                            var egPage = new iPage({
        	                                htmlURL : "pureReceiveGroup/pure_receive_group_list.html",
        	                                jsURL : "pureReceiveGroup/pure_receive_group_list.js",
        	                                parameters : {
        	                                    isMenuEnter : true
        	                                },
        	                                needBack : true
        	                            });
        	                            egPage.open();
        	                        };
        	                    }
        	                }
                        }
                    },
                    /******************added at 2014-05-29 end********************/
                    button05 : {//组织成员管理列表
                        normal : 'url(images/green/systemmenu03btn03sub05nor.png)',
                        mouseover : 'url(images/green/systemmenu03btn03sub05mo.png)',
                        click : function() {
                            hideNavigationSystem();
                            onHideNavigationSystemAndBar = function() {
                                var egPage = new iPage({
                                    htmlURL : "organization/manage_organization_member.html",
                                    jsURL : "organization/manage_organization_member.js",
                                    parameters : {
                                        isMenuEnter : true
                                    },
                                    needBack : true
                                });
                                egPage.open();
                            }
                        }
                    },
                    button06 : {//查看出勤记录
                    normal : 'url(images/green/systemmenu03btn03sub06nor.png)',
                    mouseover : 'url(images/green/systemmenu03btn03sub06mo.png)',
                    click : function() {
                        hideNavigationSystem();
                        onHideNavigationSystemAndBar = function() {
                            var egPage = new iPage({
                                htmlURL : "course/attendance_view.html",
                                jsURL : "course/attendance_view.js",
                                parameters : {
                                    isMenuEnter : true
                                },
                                needBack : true
                            });
                            egPage.open();
                        }
                    }
                },
                    button07 : {//查看考试记录
                    normal : 'url(images/green/systemmenu03btn03sub07nor.png)',
                    mouseover : 'url(images/green/systemmenu03btn03sub07mo.png)',
                    click : function() {
                        hideNavigationSystem();
                        onHideNavigationSystemAndBar = function() {
                            var egPage = new iPage({
                                htmlURL : "course/exam_view.html",
                                jsURL : "course/exam_view.js",
                                parameters : {
                                    isMenuEnter : true
                                },
                                needBack : true
                            });
                            egPage.open();
                        }
                    }
                } 
               }
            },
            button04 : {//授权码生成
            normal : 'url(images/green/systemmenu03btn04nor.png)',
            mouseover : 'url(images/green/systemmenu03btn04mo.png)',
            click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "organization/generate_authorization_code.html",
                            jsURL : "organization/generate_authorization_code.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button05 : {//组织管理列表
                normal : 'url(images/green/systemmenu03btn05nor.png)',
                mouseover : 'url(images/green/systemmenu03btn05mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "organization/organization_management.html",
                            jsURL : "organization/organization_management.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }
        }
    },
    "systemMenu4" : {//管理员管理
        normal : 'url(images/green/systemmenu04nor.png)',
        mouseover : 'url(images/green/systemmenu04mo.png)',
        tipsURL : 'menutip_green4',
        execls : {},
        buttons : {
            button01 : {//创建管理员
                normal : 'url(images/green/systemmenu04btn01nor.png)',
                mouseover : 'url(images/green/systemmenu04btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "administrators/organization_admin_create.html",
                            jsURL : "administrators/organization_admin_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },            
            button02 : {//管理员管理列表
                normal : 'url(images/green/systemmenu04btn02nor.png)',
                mouseover : 'url(images/green/systemmenu04btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                  onHideNavigationSystemAndBar = function() {
                    var egPage = new iPage({
                      htmlURL : "administrators/organization_admin_list.html",
                      jsURL : "administrators/organization_admin_list.js",
                      parameters : {
                        isMenuEnter : true
                      },
                      needBack : true
                    });
                    egPage.open();
                  }
                }
            }            
        }
    },
    "systemMenu5" : {//账单管理
        normal : 'url(images/green/systemmenu05nor.png)',
        mouseover : 'url(images/green/systemmenu05mo.png)',
        tipsURL : 'menutip_green5',
        execls : {},
        buttons : {}
    }
}

//------------------navigationSystemTab_purple-----------------------
var navigationSystemTab_purple = {
    "systemMenu1" : {//会议管理
        normal : 'url(images/purple/systemmenu01nor.png)',
        mouseover : 'url(images/purple/systemmenu01mo.png)',
        tipsURL : 'menutip_purple1',
        execls : {
            html : 'execl/course_class_management.html',
            js : 'execl/course_class_management.js'
        },
        buttons : {
            button01 : {//创建周期会议
                normal : 'url(images/purple/systemmenu01btn01nor.png)',
                mouseover : 'url(images/purple/systemmenu01btn01mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                       var egPage = new iPage({
                            htmlURL : "meeting/meeting_create.html",
                            jsURL : "meeting/meeting_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button02 : {//创建单次会议
                normal : 'url(images/purple/systemmenu01btn02nor.png)',
                mouseover : 'url(images/purple/systemmenu01btn02mo.png)',
                click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "meeting/single_meeting_create.html",
                            jsURL : "meeting/single_meeting_create.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : false
                        });
                        egPage.open();
                    }
                }
            },
            button03 : { //会议分布
            normal : 'url(images/purple/systemmenu01btn03nor.png)',
            mouseover : 'url(images/purple/systemmenu01btn03mo.png)',
            click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "lesson/lesson_distribution.html",
                            jsURL : "lesson/lesson_distribution.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            },
            button04 : { //会议管理列表
            normal : 'url(images/purple/systemmenu01btn04nor.png)',
            mouseover : 'url(images/purple/systemmenu01btn04mo.png)',
            click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "course/course_list.html",
                            jsURL : "course/course_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            },
            button05 : { //会议邀请列表
            normal : 'url(images/purple/systemmenu01btn05nor.png)',
            mouseover : 'url(images/purple/systemmenu01btn05mo.png)',
            click : function() {
                    hideNavigationSystem();
                    onHideNavigationSystemAndBar = function() {
                        var egPage = new iPage({
                            htmlURL : "course/invite_course_list.html",
                            jsURL : "course/invite_course_list.js",
                            parameters : {
                                isMenuEnter : true
                            },
                            needBack : true
                        });
                        egPage.open();
                    }
                }
            }			
        }
    },

//    "systemMenu2" : {//会议管理
//        normal : 'url(images/purple/systemmenu02nor.png)',
//        mouseover : 'url(images/purple/systemmenu02mo.png)',
//        tipsURL : 'menutip_purple2',
//        execls : {},
//        buttons : {}
//    },
/*   
    "systemMenu3" : {//用户管理
        normal : 'url(images/purple/systemmenu03nor.png)',
        mouseover : 'url(images/purple/systemmenu03mo.png)',
        tipsURL : 'menutip_purple3',
        execls : {},
        buttons : {}

    },
 */
   
  "systemMenu4" : {//日程管理
    normal : 'url(images/purple/systemmenu04nor.png)',
    mouseover : 'url(images/purple/systemmenu04mo.png)',
    tipsURL : 'menutip_purple4',
    execls : {
    },
    buttons : {
      button01 : { //日程管理列表
        normal : 'url(images/purple/systemmenu04btn01nor.png)',
        mouseover : 'url(images/purple/systemmenu04btn01mo.png)',
        click : function() {
          hideNavigationSystem();
          onHideNavigationSystemAndBar = function() {
            var egPage = new iPage({
              htmlURL : "course_hour/course_hour_list.html",
              jsURL : "course_hour/course_hour_list.js",
              parameters : {
                isMenuEnter : true
              },
              needBack : true
            });
            egPage.open();
          }
        }
      }
    }
  }    
}

var buttonClickToSubMenu = function(_whichButtons) {
    createNavigationSystemButtons(null, _whichButtons);
}
/*
//------------------navigation system menu level(v 1.0)------------------
var naviSysButtonLevel = function() {
    this.value = [];
    this.del = function() {
        if (this.value.length > 0) {
            this.value.pop();
        }
    };
    this.add = function(Obj, Str) {
        this.value.push({
            obj : Obj,
            name : Str
        });
    };
    this.lastButtonObj = function() {
        if (this.value.length > 0) {
            return this.value[this.value.length - 1].obj;
        }
    };
    this.lastButtonName = function() {
        if (this.value.length > 0) {
            return this.value[this.value.length - 1].name;
        }
    };
    this.beforLastButtonName = function() {//must see Array
        if (this.value.length > 2) {
            return this.value[this.value.length - 2].name;
        }
    };
    this.initLevel = function(_whichTab, _whichButtons) {
        this.value = [{
            obj : navigationSystemTab,
            name : "navigationSystemTab." + _whichTab
        }, {
            obj : navigationSystemTab[_whichTab],
            name : "navigationSystemTab." + _whichTab + ".buttons"
        }];
    };
};
*/
//------------------navigation system menu level(v 1.1)------------------
var naviSysButtonLevel = function() {
    this.value = [];
    this.menuArray = {
        systemMenu1:null,
        systemMenu2:null,
        systemMenu3:null,
        systemMenu4:null,
        systemMenu5:null
    }
    
    this.del = function() {
        if (this.value.length > 0) {
            this.value.pop();
        }
    };
    this.add = function(Obj, Str) {
        this.value.push({
            obj : Obj,
            name : Str
        });
    };
    this.lastButtonObj = function() {
        if (this.value.length > 0) {
            return this.value[this.value.length - 1].obj;
        }
    };
    this.lastButtonName = function() {
        if (this.value.length > 0) {
            return this.value[this.value.length - 1].name;
        }
    };
    this.beforLastButtonName = function() {//must see Array
        if (this.value.length > 2) {
            return this.value[this.value.length - 2].name;
        }
    };
    this.initLevel = function(_whichTab, _whichButtons) {
        if (_whichTab != null){
            if (this.menuArray[_whichTab] == null){
                this.menuArray[_whichTab] = [{
                    obj : navigationSystemTab,
                    name : "navigationSystemTab." + _whichTab
                }, {
                    obj : navigationSystemTab[_whichTab],
                    name : "navigationSystemTab." + _whichTab + ".buttons"
                }];
                this.value = this.menuArray[_whichTab];
            }
            else{
                this.value = this.menuArray[_whichTab];
            }
        }
    };
};

var naviSysButtonLevelArray = new naviSysButtonLevel();

function createNavigationSystemButtons(_whichTab, _whichButtons) {
    if (_whichTab != null) {
        naviSysButtonLevelArray.initLevel(_whichTab, _whichButtons);
        _whichButtons = naviSysButtonLevelArray.lastButtonObj().buttons; //add for navigation system menu level(v 1.1)  
    }
    var _navigationSystemButtons = new Array();
    _navigationSystemButtons.push('<table style="width:100%;height:100%"><tr><td style="vertical-align: top;text-align: left;">');

    for (var i in _whichButtons) {
        if (_whichButtons[i].status == "submenu") {
            _navigationSystemButtons.push('<div style="float: left;margin:10px 0px 10px 15px;width:109px;height:109px;' 
            + 'background: ' + _whichButtons[i].normal + ' no-repeat;cursor: pointer;" ' 
            + 'onmouseover="this.style.background=\'' + _whichButtons[i].mouseover + ' no-repeat\'" ' 
            + 'onmouseout="this.style.background=\'' + _whichButtons[i].normal + ' no-repeat\'" ' 
            + 'onclick="naviSysButtonLevelArray.add(' + naviSysButtonLevelArray.lastButtonName() + '.' + i + ',\'' + naviSysButtonLevelArray.lastButtonName() + '.' + i + '.buttons\');' 
            + 'buttonClickToSubMenu(' + naviSysButtonLevelArray.lastButtonName() + '.' + i + '.buttons);"></div>');
        } else {
            _navigationSystemButtons.push('<div style="float: left;margin:10px 0px 10px 15px;width:109px;height:109px;' 
            + 'background: ' + _whichButtons[i].normal + ' no-repeat;cursor: pointer;" ' 
            + 'onmouseover="this.style.background=\'' + _whichButtons[i].mouseover + ' no-repeat\'" ' 
            + 'onmouseout="this.style.background=\'' + _whichButtons[i].normal + ' no-repeat\'" ' 
            + 'onclick="' + naviSysButtonLevelArray.lastButtonName() + '.' + i + '.click();"></div>');
        }
    }

    if (naviSysButtonLevelArray.value.length > 2) {
        _navigationSystemButtons.push('</td><td style="width:129px;vertical-align: top; text-align:right;">' 
        + '<div style="background:url(images/' + pageManage.globalVariable.userCss + '/back.png) no-repeat;width:109px;height:109px; cursor: pointer;margin:10px 10px 20px 20px" ' 
        + 'onclick="naviSysButtonLevelArray.del();buttonClickToSubMenu(' + naviSysButtonLevelArray.beforLastButtonName() + ');"></div>');
    }

    _navigationSystemButtons.push('</td></tr></table>');
    dojo.byId('navigationSystemButtons').innerHTML = _navigationSystemButtons.join('');

    setNavigationSystemDivWindowHW();
    createNavigationSystemDivWindow(naviSysButtonLevelArray.lastButtonObj());
}

//------------------navigation system Tips------------------
function loadNavigationSystemLeftTips(_tipsURL, _addToWhere) {
    if (_tipsURL != '') {
        dojo.xhrGet({
            url : _tipsURL,
            timeout : 5000,
            sync : true,
            //handleAs : "text",
            load : function(response, ioArgs) {
                if (response) {
                    dojo.byId(_addToWhere).innerHTML = response;
                }
            },
            error : function(response, ioArgs) {
                dojo.byId(_addToWhere).innerHTML = '';
            }
        });
    } else {
        dojo.byId(_addToWhere).innerHTML = '';
    }
}

function createNavigationSystemLeftTips(_tipsURL) {
    document.getElementById('navigationSystemLeftTips').innerHTML = document.getElementById(_tipsURL).innerHTML
}

//------------------navigation system DivWindows level------------------
var naviSysDivWindowsArray = [];

function createNavigationSystemDivWindow(_lastObj) {
    var _matched = false;
    var _matchedArray = null;
    if (_lastObj && _lastObj.execls && _lastObj.execls.html && _lastObj.execls.js) {

        for (var i in naviSysDivWindowsArray) {
            naviSysDivWindowsArray[i].htmlHandle.style.display = "none";
            if (naviSysDivWindowsArray[i].html == _lastObj.execls.html) {
                _matched = true;
                _matchedArray = naviSysDivWindowsArray[i];
            }
        }

        if (_matched) {
            _matchedArray.htmlHandle.style.display = "";
            if (_matchedArray.refreshFunction) {
                _matchedArray.refreshFunction();
            }
        } else {
            dojo.xhrGet({
                url : _lastObj.execls.html,
                timeout : 5000,
                sync : true,
                //handleAs : "json",
                load : function(response, ioArgs) {
                    if (response) {
                        //_navigationSystemExecls.push(response);

                        var _position_of_the_array = naviSysDivWindowsArray.push({
                            html : _lastObj.execls.html,
                            js : _lastObj.execls.js,
                            htmlHandle : null,
                            jsHandle : null
                        }) - 1;

                        var table = document.createElement("table");
                            table.style.width = "100%";
                            table.style.height = "100%";
                            table.border = 0;
                            //table.setAttribute('name','mytable');
                        var tbody = document.createElement("tbody");
                        var tr = document.createElement("tr");
                            tr.style.width = "100%";
                            tr.style.height = "100%";
                        var td = document.createElement("td");
                            td.style.width = "100%";
                            td.style.height = "100%";
                            td.innerHTML = response;
                            //td.style.color = "#FF0000";
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                            table.appendChild(tbody);
                        dojo.byId('navigationSystemDivWindow').appendChild(table);

                        var newScript = document.createElement("script");
                            newScript.type = 'text/javascript';
                            newScript.language = 'javascript';
                            //newScript.id = "navigationSystemDivWindowJs";
                            newScript.src = _lastObj.execls.js;
                        document.getElementsByTagName("head")[0].appendChild(newScript);

                        naviSysDivWindowsArray[_position_of_the_array].htmlHandle = table;
                        naviSysDivWindowsArray[_position_of_the_array].jsHandle = newScript;

                    }
                },
                error : function(response, ioArgs) {
                    for (var i in naviSysDivWindowsArray) {naviSysDivWindowsArray[i].htmlHandle.style.display = "none";}
                }
            });
        }

    } else {
        for (var i in naviSysDivWindowsArray) {naviSysDivWindowsArray[i].htmlHandle.style.display = "none";}
    }
}

//------------------navigation system Tabs------------------
function createNavigationSystemTab() {
    var _navigationSystemTab = new Array();
    _navigationSystemTab.push('<table border="0" cellpadding="0" cellspacing="0" style="width:100%;height:100%;">');
    //first... focus
    var _style = 1;
    for (var i in navigationSystemTab) {
        //console.info(navigationSystemTab[i].mouseover);
        if (_style == 1) {
            //second... normal
            _style = 2;
            _navigationSystemTab.push('<tr><td id="' + i + '" class="navigationSystemFocusTab" style="height:114px;background:' + navigationSystemTab[i].mouseover + ' no-repeat;" onmouseover="setLeftSystemTabFocus(\'' + i + '\');"></td></tr>');

            //add buttons
            createNavigationSystemLeftTips(navigationSystemTab[i].tipsURL);
            createNavigationSystemButtons(i, navigationSystemTab[i].buttons);
            //setNavigationSystemDivWindowHW();
            //createNavigationSystemDivWindow(navigationSystemTab[i].execls);
        } else {
            _navigationSystemTab.push('<tr><td id="' + i + '" class="navigationSystemDownTab" style="height:79px;background:' + navigationSystemTab[i].normal + ' no-repeat;" onmouseover="setLeftSystemTabFocus(\'' + i + '\');"></td></tr>');
        }
    };
    _navigationSystemTab.push('<tr><td id="systemMenuOfEnd" class="navigationSystemDownTab" style="background: url(images/' + pageManage.globalVariable.userCss + '/systemmenu_bg.png)" ></td></tr>');
    _navigationSystemTab.push('</table>');
    dojo.byId('navigationSystemTab').innerHTML = _navigationSystemTab.join('');

}

//createNavigationSystemTab();
function setNavigationSystemDivWindowHW() {
    dojo.byId('navigationSystemDivWindow').style.height = (552 - dojo.byId('navigationSystemButtons').offsetHeight - 20) + "px";
    // console.info(dojo.byId('navigationSystemTab').offsetHeight);
    // console.info(dojo.byId('navigationSystemButtons').offsetHeight);
    // console.info(dojo.byId('navigationSystemDivWindow').offsetHeight);
    // console.info('-----------------------------------------');
}

function setLeftSystemTabFocus(_id) {
    if (!dojo.hasClass(_id, "navigationSystemFocusTab")) {
        var _style = 1;
        for (var i in navigationSystemTab) {
            dojo.removeClass(dojo.byId(i), "navigationSystemUpTab");
            dojo.removeClass(dojo.byId(i), "navigationSystemDownTab");
            dojo.removeClass(dojo.byId(i), "navigationSystemFocusTab");
            if (i == _id) {
                dojo.addClass(dojo.byId(i), "navigationSystemFocusTab");
                dojo.byId(i).style.height = "114px";
                // dojo.byId(i).style.background.replace('nor.png','mo.png');
                dojo.byId(i).style.background = navigationSystemTab[i].mouseover;
                _style = 2;

                //add buttons
                createNavigationSystemLeftTips(navigationSystemTab[i].tipsURL);
                createNavigationSystemButtons(i, navigationSystemTab[i].buttons);
                //setNavigationSystemDivWindowHW();
                //createNavigationSystemDivWindow(navigationSystemTab[i].execls);
            } else {
                switch(_style) {
                    case 1:
                        dojo.addClass(dojo.byId(i), "navigationSystemUpTab");
                        break;
                    case 2:
                        dojo.addClass(dojo.byId(i), "navigationSystemDownTab");
                        break;
                    // default:
                    // default_statement;
                }
                dojo.byId(i).style.height = "79px";
                // dojo.byId(i).style.background.replace('mo.png','nor.png');
                dojo.byId(i).style.background = navigationSystemTab[i].normal;
            }
        }
    }
};

//registration naviSysDivWindowsArray's event
function reg_naviSysDivWindowsEvent(_parameter){ 
    for (var i in naviSysDivWindowsArray){
        if (naviSysDivWindowsArray[i].js == _parameter.id){
            naviSysDivWindowsArray[i].refreshFunction = _parameter.refreshFunction; 
        }
    }
}