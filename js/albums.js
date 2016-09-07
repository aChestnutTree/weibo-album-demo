chrome.cookies.get({"url": "http://weibo.com", "name": "SSOLoginState"}, function (cookie) {
  //检查登录状态
  if (cookie) {
    //显示登录后界面
    $('.after-login').show();

    //从 URL 取出 uid 和用户名
    var uid = getUrlParameter("uid");
    var name = decodeURIComponent(getUrlParameter("name"));

    //从微博取得 uid 对应的相册列表信息，填充到页面
    $.getJSON("http://photo.weibo.com/albums/get_all?uid=" + uid + "&page=1&count=20", function (data) {
      //var albumCount = data.data.total;
      for (var x in data.data.album_list) {
        var albumId = data.data.album_list[x].album_id;
        var caption = data.data.album_list[x].caption;
        var coverPic = data.data.album_list[x].cover_pic;
        var updatedAt = data.data.album_list[x].updated_at;
        var photoCount = data.data.album_list[x].count.photos;
        var type = data.data.album_list[x].type;
        if (data.data.album_list[x].count.photos > 0) {
          var linkToPhotos = "photos.html?uid=" + uid + "&album_id=" + albumId + "&page=1&count=10&type=" + type + "&name=" + encodeURIComponent(name) + "&caption=" + encodeURIComponent(caption);
          $("#album-list").append("<div class='album'><div class='cover'><div><a href='" + linkToPhotos + "'><img class='cover-image' src='" + coverPic + "'></a></div><div><a href='" + linkToPhotos + "'>" + caption + "</a></div>" + photoCount + "张<br>更新于" + updatedAt + "</div>");
        }
        else {
          coverPic = "images/empty-album.png";
          $("#album-list").append("<div class='album'><div class='cover'><img class='cover-image' src='" + coverPic + "'></div>" + caption + "<br>" + photoCount + "张" + "<br>更新于" + updatedAt + "</div>");
        }
      }
    });
    $("#uname").text(name + "的相册专辑");
  }
  else {
    //显示登录提示
    $(".login").show();
    //alert("微博未登录，请先在 http://weibo.com/login 进行登录，然后再刷新本页面");
  }
});
