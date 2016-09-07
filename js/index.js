chrome.cookies.get({"url": "http://weibo.com", "name": "SSOLoginState"}, function (cookie) {
  //检查登录状态
  if (cookie) {
    //显示登录后界面
    $('.after-login').show();

    var uidString = "";
    var uids = [];

    //从 Local Storage 取出保存的 uid
    chrome.storage.local.get('uidString', function (data) {
      if(data && data.uidString){
        uidString = data.uidString;
        //console.log(uidString);
        uids = uidString.split(';');

        //从微博取得每个 uid 对应的信息，填充到页面
        for (var x in uids) {
          var uid = uids[x];
          $("#following").append("<div class='user' uid='" + uid + "'>加载中，如果长时间未能显示请刷新</div>");
          $.get("http://weibo.com/aj/v6/user/newcard?id=" + uid, function (data) {
            data = data.replace('try{(', '');
            data = data.replace(')}catch(e){};', '');
            var dataJSON = $.parseJSON(data);
            var tempDom = $('<output>').append($.parseHTML(dataJSON.data));
            var avatar = tempDom.find('img');
            var imgURL = avatar.attr("src");
            var name = avatar.attr("title");
            var uid = avatar.attr("uid");
            var linkToAlbums = "albums.html?uid=" + uid + "&name=" + encodeURIComponent(name);
            $("div[uid='" + uid + "']").html("<div><a href='" + linkToAlbums + "'><img class='avatar' src='" + imgURL + "'></a></div><div><a href='" + linkToAlbums + "'>" + name + "</a></div>");
          }, "text");
        }
      }

      //给添加关注用户按钮绑定事件
      $(document).on("click", "#add-name-button", function () {

        var nameToAdd = $("input[name='add-name']").val();
        if (nameToAdd !== "") {
          //以用户名作为参数，从微博获得 uid 信息，保存到 Local Storage
          $.get("http://weibo.com/aj/v6/user/newcard?name=" + nameToAdd, function (data) {
            data = data.replace('try{(', '');
            data = data.replace(')}catch(e){};', '');
            var dataJSON = $.parseJSON(data);
            //console.log(dataJSON.msg);
            if (dataJSON.data !== "") {
              var tempDom = $('<output>').append($.parseHTML(dataJSON.data));
              var avatar = tempDom.find('img');
              var uid = avatar.attr("uid");
              if (uids.length == 0 || uids.indexOf(uid) < 0) {
                uids.push(uid);
                saveUids(uids);
                location.reload(true);
              }
              else {
                alert("已关注该用户");
              }
            }
            else {
              alert("用户不存在，请检查用户名是否正确");
            }
          }, "text");
        }
        else {
          alert("请输入用户名");
        }
      });
    });
  }
  else {
    //显示登录提示
    $(".login").show();
    //alert("微博未登录，请先在 http://weibo.com/login 进行登录，然后再刷新本页面");
  }
});
