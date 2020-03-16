var API = (function(){
  var cacheArray = [];
  var cacheObj = {};

  var api = {
    get: function(url, callback){
      my.paas.getNavigation(url, function(data){
        if ( typeof callback == 'function') {
          callback(data);
        }
      });
    },
    getFromKey: function(key, callback){
      var id;
      if(key){
        var url = NavigationRoot + '/' + key;
        this.get(url, callback);
      }else{
        callback();
        return;
      }
    },
    addImageCache: function(url){
      if(cacheObj[url]){
        return;
      }else{
        var cache = new Image();
        cache.src = url;
        cacheArray.push(cache);
        cacheObj[url] = true;
      }
    },
    getMusic: function(callback){
      var result = [
        {title:"第 一 篇　你 好 祖 国",data:[
          {title: '1、你好祖国',pics: "./img/test.jpg"},
          {title: '2、共和国从这里走来',pics: "./img/test.jpg"},
          {title: '3、美丽中国',pics: "./img/test.jpg"},
          {title: '4、中国赞',pics: "./img/test.jpg"},
          {title: '5、为人民点赞',pics: "./img/test.jpg"},
          {title: '6、献给母亲 献给祖国',pics: "./img/test.jpg"},
          {title: '7、每当我们仰望红旗',pics: "./img/test.jpg"},
          {title: '8、红旗',pics: "./img/test.jpg"},
          {title: '9、五星红旗',pics: "./img/test.jpg"},
          {title: '10、中国新声',pics: "./img/test.jpg"},
          {title: '11、祖国生日永不忘记',pics: "./img/test.jpg"},
        ]},
        {title:"第 二 篇　英 魂 长 存",data:[
          {title: '12、向烈士致敬',pics: "./img/test.jpg"},
          {title: '13、天下乡亲',pics: "./img/test.jpg"},
          {title: '14、太行山',pics: "./img/test.jpg"},
          {title: '15、英雄',pics: "./img/test.jpg"},
          {title: '16、火焰',pics: "./img/test.jpg"},
          {title: '17、顺着这条路走吧',pics: "./img/test.jpg"},
          {title: '18、红军想念毛泽东',pics: "./img/test.jpg"},
          {title: '19、陈毅将军到石湾',pics: "./img/test.jpg"},
          {title: '20、岁月回荡一支歌',pics: "./img/test.jpg"},
          {title: '21、忆狼牙山五壮士',pics: "./img/test.jpg"},
        ]},
      ];
      if ( typeof callback == 'function') {
        callback(result);
      }
    },
  };
  return api;
})();