window.onload=function(){
    getLocation()
    show_street_list()
    //search_near()
    //displayPOI()
}
function getLocation() {
    var map, geolocation;
//加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 10),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
}
//function displayPOI() {
//    map.addOverlay(new AMap.Circle(mPoint, 0));        //添加一个圆形覆盖物
//    myGeo.getLocation(mPoint,
//        function mCallback(rs) {
//            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
//            for (i = 0; i < allPois.length; ++i) {
//                document.getElementById("panel").innerHTML += "<div class='list' id="+allPois[i].title+"><div class='site'>" + allPois[i].title +"</div><div class='site_down'>" + allPois[i].address + "</div><span class='right'><img class='tex'  src='../API/outstyle091100004.jpg' id="+allPois[i].title+"></span></div></div>";
//                map.addOverlay(new AMap.Marker(allPois[i].point));
//
//            }
//
//        }, mOption
//    );
//}
function show_street_list() {
    $.getJSON("../API/gaode.json", function (date) {

        date["Address"].forEach(function (name) {
            var map_html="<div class='list' id="+name.site+"><div class='site'>"+name.site+"</div><div class='site_down'>"+name.street+"</div><span class='right'><img class='tex'  src='../API/outstyle091100004.jpg' id="+name.site+"></span></div>"
            $("#view").append(map_html);

            $(document).ready(function(){
                $('#'+name.site).click(function(){
                    $('.tex').css('display','none');
                    $('#'+name.site).show();

                });
                //$("tex").click(function(){
                //
                //
                //
                //});


            });

        })
    })
}

//searchNearBy(center:LngLat,radius:number,
//    callback:function(status:String,result:info/CloudDataSearchResult))
//function getLocation()
//{
//    if (navigator.geolocation)
//    {
//        navigator.geolocation.getCurrentPosition(showPosition,showError);
//    }
//
//}

//function showPosition(position)
//{
//    lat=position.coords.latitude;
//    lon=position.coords.longitude;
//    latlon=new google.maps.LatLng(lat, lon)
//    mapholder=document.getElementById('mapholde')
//    mapholder.style.height='250px';
//    mapholder.style.width='500px';
//
//    var myOptions={
//        center:latlon,zoom:14,
//        mapTypeId:google.maps.MapTypeId.ROADMAP,
//        mapTypeControl:false,
//        navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
//    };
//    var map=new google.maps.Map(document.getElementById("mapholde"),myOptions);
//    var marker=new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
//}
//
//function showError(error)
//{
//    switch(error.code)
//    {
//        case error.PERMISSION_DENIED:
//            x.innerHTML="User denied the request for Geolocation."
//            break;
//        case error.POSITION_UNAVAILABLE:
//            x.innerHTML="Location information is unavailable."
//            break;
//        case error.TIMEOUT:
//            x.innerHTML="The request to get user location timed out."
//            break;
//        case error.UNKNOWN_ERROR:
//            x.innerHTML="An unknown error occurred."
//            break;
//    }
//}