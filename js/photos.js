chrome.cookies.get({"url": "http://weibo.com", "name": "SSOLoginState"}, function (cookie) {
  //检查登录状态
  if (cookie) {
    //显示登录后界面
    $('.after-login').show();

    //从 URL 取出 uid、相册 id、翻页情况等信息
    var uid = getUrlParameter("uid");
    var albumId = getUrlParameter("album_id");
    var count = getUrlParameter("count");
    var page = getUrlParameter("page");
    var type = getUrlParameter("type");
    var name = decodeURIComponent(getUrlParameter("name"));
    var caption = decodeURIComponent(getUrlParameter("caption"));

    //从微博取得图片信息，填充到页面
    $.getJSON("http://photo.weibo.com/photos/get_all?uid=" + uid + "&album_id=" + albumId + "&count=" + count + "&page=" + page + "&type=" + type, function (data) {
      var total = data.data.total;
      for (var x in data.data.photo_list) {
        var picHost = data.data.photo_list[x].pic_host;
        var picName = data.data.photo_list[x].pic_name;
        var createdAt = data.data.photo_list[x].created_at;
        $("#photos").append("<div class='photo'><img class='photo-image' style='max-width:" + $(window).width() + "px;' src=\"" + picHost + "/large/" + picName + "\">" + createdAt + "</div>");
      }
      //生成翻页信息
      if (parseInt(page) * count > total) {
        $("#next-page").hide();
      }
      else {
        $("#next-page").show();
      }
      $("#current-page").text("第" + page + "页 / 共" + (total % count > 0 ? Math.floor(total / count) + 1 : total / count) + "页");
    });

    $("#previous-page").attr("href", "photos.html?uid=" + uid + "&album_id=" + albumId + "&page=" + (parseInt(page) - 1) + "&count=" + count + "&type=" + type + "&name=" + encodeURIComponent(name) + "&caption=" + encodeURIComponent(caption));
    $("#next-page").attr("href", "photos.html?uid=" + uid + "&album_id=" + albumId + "&page=" + (parseInt(page) + 1) + "&count=" + count + "&type=" + type + "&name=" + encodeURIComponent(name) + "&caption=" + encodeURIComponent(caption));
    if (page === "1") {
      $("#previous-page").hide();
    }
    else {
      $("#previous-page").show();
    }

    $("#uname").html("<a href='albums.html?uid=" + uid + "&name=" + encodeURIComponent(name) + "'>" + name + "的相册专辑</a>");
    $("#album-name").text(caption);

}
else {
  //显示登录提示
  $(".login").show();
  //alert("微博未登录，请先在 http://weibo.com/login 进行登录，然后再刷新本页面");
}
});
