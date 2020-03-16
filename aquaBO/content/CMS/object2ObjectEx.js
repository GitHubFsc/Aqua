/**
 * @author hua
 */
if (!window.object2ObjectEx) {
  window.Object2ObjectEx = {
    "titleItem2TitleItemEx": function (titleItemObject, titleItemTemplateObject) {
      console.log("titleItem2TitleItemEx() Enter");
      console.log("titleItemObject:");
      console.log(titleItemObject);
      console.log("titleItemTemplateObject:");
      console.log(titleItemTemplateObject);
      let titleItem = null;
      if (titleItemObject && titleItemTemplateObject) {
        titleItem = {};
        var data = {};
        if (titleItemObject.normal) {
          if (titleItemObject.normal.type && titleItemObject.normal.type === "text") {
            if (titleItemTemplateObject.text && titleItemTemplateObject.text.normal) {
              titleItem.normal = this.objectClone(titleItemTemplateObject.text.normal);
              data.normalText = String(titleItemObject.normal.text);
              if (titleItemObject.normal.textColor) {
                data.normalTextColor = String(titleItemObject.normal.textColor);
              }
              if (titleItemObject.normal.shapeBgColor) {
                data.normalShapeBgColor = String(titleItemObject.normal.shapeBgColor);
              }
              if (titleItemObject.normal.shapeBorderColor) {
                data.normalShapeBorderColor = String(titleItemObject.normal.shapeBorderColor);
              }
            }
          } else if (titleItemObject.normal.type && titleItemObject.normal.type === "image") {
            if (titleItemTemplateObject.image && titleItemTemplateObject.image.normal) {
              titleItem.normal = this.objectClone(titleItemTemplateObject.image.normal);
              data.normalPoster = String(titleItemObject.normal.url);
            }
          }
        }
        if (titleItemObject.focus) {
          if (titleItemObject.focus.type && titleItemObject.focus.type === "text") {
            if (titleItemTemplateObject.text && titleItemTemplateObject.text.focus) {
              titleItem.focus = this.objectClone(titleItemTemplateObject.text.focus);
              data.focusText = String(titleItemObject.focus.text);
              if (titleItemObject.focus.textColor) {
                data.focusTextColor = String(titleItemObject.focus.textColor);
              }
              if (titleItemObject.focus.shapeBgColor) {
                data.focusShapeBgColor = String(titleItemObject.focus.shapeBgColor);
              }
              if (titleItemObject.focus.shapeBorderColor) {
                data.focusShapeBorderColor = String(titleItemObject.focus.shapeBorderColor);
              }
            }
          } else if (titleItemObject.focus.type && titleItemObject.focus.type === "image") {
            if (titleItemTemplateObject.image && titleItemTemplateObject.image.focus) {
              titleItem.focus = this.objectClone(titleItemTemplateObject.image.focus);
              data.focusPoster = String(titleItemObject.focus.url);
            }
          }
        }
        if (titleItemObject.selected) {
          if (titleItemObject.selected.type && titleItemObject.selected.type === "text") {
            if (titleItemTemplateObject.text && titleItemTemplateObject.text.selected) {
              titleItem.selected = this.objectClone(titleItemTemplateObject.text.selected);
              data.selectText = String(titleItemObject.selected.text);
              if (titleItemObject.selected.textColor) {
                data.selectTextColor = String(titleItemObject.selected.textColor);
              }
              if (titleItemObject.selected.shapeBgColor) {
                data.selectShapeBgColor = String(titleItemObject.selected.shapeBgColor);
              }
              if (titleItemObject.selected.shapeBorderColor) {
                data.selectShapeBorderColor = String(titleItemObject.selected.shapeBorderColor);
              }
            }
          } else if (titleItemObject.selected.type && titleItemObject.selected.type === "image") {
            if (titleItemTemplateObject.image && titleItemTemplateObject.image.selected) {
              titleItem.selected = this.objectClone(titleItemTemplateObject.image.selected);
              data.selectPoster = String(titleItemObject.selected.url);
            }
          }
        }
        if (titleItemObject.content && titleItemObject.content.type && titleItemObject.content.type.length > 0
          && titleItemTemplateObject.titleItemActionIntent) {
          titleItem.data = this.objectConcat(data, titleItemObject.content);
          titleItem.actionIntent = this.objectClone(titleItemTemplateObject.titleItemActionIntent);
        } else if (titleItemTemplateObject.emptyTitleItemContent && titleItemTemplateObject.emptyTitleItemContent.actionIntent
          && titleItemTemplateObject.emptyTitleItemContent.data) {
          titleItem.data = this.objectConcat(data, titleItemTemplateObject.emptyTitleItemContent.data);
          titleItem.actionIntent = this.objectClone(titleItemTemplateObject.emptyTitleItemContent.actionIntent);
        } else {
          titleItem.data = data;
        }
      }
      console.log("titleItem2TitleItemEx() Leave");
      console.log("titleItem:");
      console.log(titleItem);
      return titleItem;
    },
    "app2AppEx": function (appObject, pageTitleItemTemplateObject, stringReplaceMapings) {
      console.log("app2AppEx() Enter");
      console.log("appObject:");
      console.log(appObject);
      console.log("pageTitleItemTemplateObject:");
      console.log(pageTitleItemTemplateObject);
      console.log("stringReplaceMapings:");
      console.log(stringReplaceMapings);
      if (stringReplaceMapings && stringReplaceMapings.length > 0) {
        if (appObject && appObject.pages && appObject.pages.length > 0) {
          for (var i = 0; i < appObject.pages.length; i++) {
            const page = appObject.pages[i];
            if (page && page.bgImage) {
              page.bgImage = this.stringReplace(page.bgImage, stringReplaceMapings);
            }
            if (page && page.pageUrl) {
              page.pageUrl = this.stringReplace(page.pageUrl, stringReplaceMapings);
            }
            if (page && page.titleItem && page.titleItem.normal && page.titleItem.normal.url) {
              page.titleItem.normal.url = this.stringReplace(page.titleItem.normal.url, stringReplaceMapings);
            }
            if (page && page.titleItem && page.titleItem.focus && page.titleItem.focus.url) {
              page.titleItem.focus.url = this.stringReplace(page.titleItem.focus.url, stringReplaceMapings);
            }
            if (page && page.titleItem && page.titleItem.selected && page.titleItem.selected.url) {
              page.titleItem.selected.url = this.stringReplace(page.titleItem.selected.url, stringReplaceMapings);
            }
            if (page && page.titleItem && page.titleItem.content) {
              for (const x in page.titleItem.content) {
                if (page.titleItem.content[x] && typeof page.titleItem.content[x] == "string") {
                  page.titleItem.content[x] = this.stringReplace(page.titleItem.content[x], stringReplaceMapings);
                }
              }
            }
          }
        }
      }
      console.log("appObject:");
      console.log(appObject);
      const appExObject = {
        "designScreenWidth": appObject.screenWidth,
        "designScreenHeight": appObject.screenHeight,
        "topNavigationWidth": appObject.navigationWidth,
        "topNavigationHeight": appObject.navigationHeight
      };
      if (appObject.pages && appObject.pages.length > 0) {
        appExObject.templates = [];
        for (const x in appObject.pages) {
          const page = appObject.pages[x];
          if (page && page.pageName) {
            const template = {
              "id": page.pageName,
              "bgImage": page.bgImage,
              "templateUrl": page.pageUrl
            };
            if (page.titleItem && pageTitleItemTemplateObject) {
              const titleItem = this.titleItem2TitleItemEx(page.titleItem, pageTitleItemTemplateObject);
              if (titleItem) {
                template.titleItem = titleItem;
              }
            }
            console.log("template:" + page.pageName);
            console.log(template);
            appExObject.templates.push(template);
          }
        }
      }
      console.log("app2AppEx() Leave");
      console.log("appExObject:");
      console.log(appExObject);
      return appExObject;
    },
    "page2PageEx": function (pageObject, cardTitleItemTemplateObject, cardLayoutTemplateObjects, stringReplaceMapings) {
      console.log("page2PageEx() Enter");
      console.log("pageObject:");
      console.log(pageObject);
      console.log("cardTitleItemTemplateObject:");
      console.log(cardTitleItemTemplateObject);
      console.log("cardLayoutTemplateObjects:");
      console.log(cardLayoutTemplateObjects);
      console.log("stringReplaceMapings:");
      console.log(stringReplaceMapings);
      if (stringReplaceMapings && stringReplaceMapings.length > 0) {
        if (pageObject && pageObject.cards && pageObject.cards.length > 0) {
          for (var i = 0; i < pageObject.cards.length; i++) {
            const card = pageObject.cards[i];
            if (card && card.titleItem && card.titleItem.normal && card.titleItem.normal.url) {
              card.titleItem.normal.url = this.stringReplace(card.titleItem.normal.url, stringReplaceMapings);
            }
            if (card && card.cardLayout && card.cardLayout.items && card.cardLayout.items.length > 0) {
              for (var j = 0; j < card.cardLayout.items.length; j++) {
                const item = card.cardLayout.items[j];
                if (item && item.defaultBgImage) {
                  item.defaultBgImage = this.stringReplace(item.defaultBgImage, stringReplaceMapings);
                }
                if (item && item.defaultImage) {
                  item.defaultImage = this.stringReplace(item.defaultImage, stringReplaceMapings);
                }
                if (item && item.content) {
                  for (const x in item.content) {
                    if (item.content[x] && typeof item.content[x] == "string") {
                      item.content[x] = this.stringReplace(item.content[x], stringReplaceMapings);
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log("pageObject:");
      console.log(pageObject);

      if (pageObject && pageObject.pageName && cardLayoutTemplateObjects && cardLayoutTemplateObjects.length > 0) {
        var pageExObject = {
          "id": pageObject.pageName,
        };
        if (pageObject.cards && pageObject.cards.length > 0) {
          pageExObject.cards = [];
          for (var k = 0; k < pageObject.cards.length; k++) {
            var card = pageObject.cards[k];
            if (card) {
              var cardEx = {
                "type": "standard",
                "id": card.id,
                "name": card.name,
                "width": card.width,
                "height": card.height,
                "top": card.top,
                "left": card.left,
                "right": card.right,
                "bottom": card.bottom
              };

              if (card.titleItem && cardTitleItemTemplateObject) {
                var titleItem = this.titleItem2TitleItemEx(card.titleItem, cardTitleItemTemplateObject);
                if (titleItem) {
                  cardEx.titleItem = titleItem;
                }
              }

              if (card.cardLayout && card.cardLayout.layoutTemplateName && card.cardLayout.items && card.cardLayout.items.length > 0) {
                for (var i = 0; i < cardLayoutTemplateObjects.length; i++) {
                  if (card.cardLayout.layoutTemplateName === cardLayoutTemplateObjects[i].name) {
                    if (card.cardLayout.items.length <= cardLayoutTemplateObjects[i].items.length) {
                      var cardLayoutObjectEx = this.objectClone(cardLayoutTemplateObjects[i]);
                      for (var j = 0; j < card.cardLayout.items.length; j++) {
                        var item = card.cardLayout.items[j];
                        var itemEx = cardLayoutObjectEx.items[j];
                        itemEx.focusEnable = item.focusEnable;
                        itemEx.defaultBgImage = item.defaultBgImage;
                        itemEx.defaultBgColor = item.defaultBgColor;
                        itemEx.defaultImage = item.defaultImage;
                        itemEx.defaultFocusScale = item.defaultFocusScale;
                        itemEx.defaultFocusBorderColor = item.defaultFocusBorderColor;
                        itemEx.defaultFocusBorderWidth = item.defaultFocusBorderWidth;
                        itemEx.defaultFocusBorderRadius = item.defaultFocusBorderRadius;
                        itemEx.defaultFocusZ = item.defaultFocusZ;
                        if (item.content && item.content.type && item.content.type === "custom") {
                          itemEx.type = item.content.type;
                          itemEx.name = item.content.name;
                          var tmp = this.objectClone(item.content);
                          delete tmp.type;
                          delete tmp.name;
                          if (Object.getOwnPropertyNames(tmp).length > 0) {
                            itemEx.param = JSON.stringify(tmp);
                          }
                          delete itemEx.dataItem;
                        } else if (item.content && item.content.type && item.content.type.length > 0) {
                          if (itemEx.dataItem) {
                            itemEx.dataItem.data = this.objectClone(item.content);
                          }
                        }

                        console.log("cardLayoutObjectEx.items[" + j + "]:");
                        console.log(cardLayoutObjectEx.items[j]);
                      }
                      cardEx.subLayouts = [];
                      cardEx.subLayouts.push(cardLayoutObjectEx);
                    }
                    break;
                  }
                }
              }
              console.log("cardEx:");
              console.log(cardEx);
              pageExObject.cards.push(cardEx);
            }
          }
        }
      }
      console.log("page2PageEx() Leave");
      console.log("pageExObject:");
      console.log(pageExObject);
      return pageExObject;
    },
    "stringReplace": function (str, mapings) {
      console.log("stringReplace Enter:" + str);
      var ret = null;
      if (str != null && str.length > 0 && typeof str == "string" && mapings != null && mapings.length > 0) {
        ret = str + "";
        for (i = 0; i < mapings.length; i++) {
          var map = mapings[i];
          if (map != null && map.length == 2) {
            var tmp = ret;
            ret = "";
            while (tmp.length > 0) {
              var start = tmp.indexOf(map[0]);
              var end = start + map[0].length;
              if (start >= 0) {
                ret += tmp.substr(0, end).replace(map[0], map[1]);
                tmp = tmp.substr(end);
              } else {
                ret += tmp;
                tmp = "";
              }
            }
          }
        }
      }
      console.log("stringReplace Leave:" + ret);
      return ret;
    },
    "objectClone": function (object) {
      var cloneObject;
      if (object == null || typeof object == "undefined") {
        cloneObject = object;
      } else {
        console.log("objectClone()typeof object=" + typeof object);
        if (typeof object == "string") {
          cloneObject = String(object);
        } else if (typeof object == "number") {
          cloneObject = object;
        } else if (typeof object == "boolean") {
          cloneObject = object;
        } else if (typeof object == "object") {
          if (object instanceof Array) {
            console.log("objectClone()object instanceof Array=true");
            cloneObject = [];
            for (var i = 0; i < object.length; i++) {
              cloneObject.push(this.objectClone(object[i]));
            }
          } else if (object instanceof Object) {
            console.log("objectClone()object instanceof Object=true");
            cloneObject = {};
            for (const x in object) {
              cloneObject[x] = this.objectClone(object[x]);
            }
          } else {
            cloneObject = object;
          }
        } else {
          cloneObject = object;
        }
      }
      return cloneObject;
    },
    "objectConcat": function (obj1, obj2) {
      if (obj1 && typeof obj1 == "object") {
        if (obj2 && typeof obj2 == "object") {
          for (const x in obj2) {
            obj1[x] = obj2[x];
          }
        }
        return obj1;
      } else if (obj2 && typeof obj2 == "object") {
        return obj2;
      } else {
        return null;
      }
    }
  };
}
