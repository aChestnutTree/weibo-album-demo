chrome.cookies.get({"url": "http://weibo.com", "name": "SSOLoginState"}, function (cookie) {
  //检查登录状态
  if (cookie) {
    //显示登录后界面
    $('.after-login').show();

    var uids = [];

    //从 Local Storage 取出保存的 uid
    chrome.storage.local.get('uidString', function (data) {
      if(data && data.uidString){
        var uidString = data.uidString;
        //console.log(uidString);
        uids = uidString.split(';');
        //遍历 uid，生成显示信息和删除按钮，填充到页面
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
            $("div[uid='" + uid + "']").html("<div><img class='avatar' src='" + imgURL + "'></div><div>" + name + "</div><button class='unfollow' type='button' uid='" + uid + "'>删除</button>");

          }, "text");
        }
      }

      //给删除用户关注按钮绑定事件
      $(document).on("click", ".unfollow", function () {
        var idToDelete = $(this).attr("uid");
        var indexToDelete = uids.indexOf(idToDelete);
        uids.splice(indexToDelete, 1);
        saveUids(uids);
        location.reload(true);
      });
      //给添加关注用户按钮绑定事件
      $(document).on("click", "#add-name-button", function () {
        var nameToAdd = $("input[name='add-name']").val();
        if (nameToAdd !== "") {
          $.get("http://weibo.com/aj/v6/user/newcard?name=" + nameToAdd, function (data) {
            data = data.replace('try{(', '');
            data = data.replace(')}catch(e){};', '');
            var dataJSON = $.parseJSON(data);
            //console.log(dataJSON.msg);
            if (dataJSON.data !== "") {
              var tempDom = $('<output>').append($.parseHTML(dataJSON.data));
              var avatar = tempDom.find('img');
              var uid = avatar.attr("uid");
              if (uids.indexOf(uid) < 0) {
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
      //导入导出关注列表到文件
      $(document).on("click", "#export-following", function () {
        var fileName = 'weibo-ids.txt';
        var dataURL = 'data:text/plain;charset=US-ASCII,' + uidsToString(uids);
        chrome.downloads.download({
          url: dataURL,
          filename: fileName,
          saveAs: true
        });
      });
      $(document).on("click", "#import-following", function () {
        $('#import-id-dialog').show();
      });
      $(document).on("click", "#abandon-import", function () {
        $('#import-id-dialog').hide();
      });
      $(document).on("click", "#import-file", function () {
        if ($("input[name='import-file-input']").val() === "") {
          alert("请选择文件");
          return;
        }
        var file = $("input[name='import-file-input']")[0].files[0];
        //console.log(file);
        var reader = new FileReader();
        reader.onload = function (e) {
          var result = reader.result;
          //console.log(result);
          var uids = result.split(';');
          if (uids!=null && uids.length>0){
            var re = /^[1-9]\d*$/;
            for(x in uids){
              if(re.test(uids[x])){
                continue;
              }
              else{
                alert("文件有误，请重新选择文件");
                return;
              }
            }
          }
          else{
            alert("文件有误，请重新选择文件");
            return;
          }
          chrome.storage.local.set({
            uidString: result
          }, function () {

          });
          location.reload(true);
        };
        reader.readAsText(file, 'US-ASCII');
      });
    });
  }
  else {
    //显示登录提示
    $(".login").show();
    //alert("微博未登录，请先在 http://weibo.com/login 进行登录，然后再刷新本页面");
  }
});
