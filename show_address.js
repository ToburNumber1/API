window.onload = function () {
    displayPOI()
    getLocation()
//        regeocoder()

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

}
function showPosition(position) {
//        x.innerHTML="Latitude: " + position.coords.latitude +
//                "<br />Longitude: " + position.coords.longitude;

    var obj_info = {latitude: position.coords.latitude, longitude: position.coords.longitude};

    localStorage.setItem("info", JSON.stringify(obj_info));
//        for(var i=0;i<20;i++){
//
//        }
//        var array_info = JSON.parse(localStorage.getItem("info")) || [];

}

var dress = JSON.parse(localStorage.getItem("info"))

var map = new BMap.Map("container");

var mPoint = new BMap.Point(dress.longitude, dress.latitude);
map.centerAndZoom(mPoint, 15);
map.enableScrollWheelZoom();        //启用滚轮缩放

var mOption = {
    poiRadius: 2500,           //半径为1000米内的POI,默认100米
    numPois: 20              //列举出50个POI,默认10个
}

var myGeo = new BMap.Geocoder();        //创建地址解析实例
function displayPOI() {
    map.addOverlay(new BMap.Circle(mPoint, 0));        //添加一个圆形覆盖物
    myGeo.getLocation(mPoint,
        function mCallback(rs) {
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            for (i = 0; i < allPois.length; ++i) {
                document.getElementById("panel").innerHTML += "<div class='list' id="+allPois[i].title+"><div class='site'>" + allPois[i].title +"</div><div class='site_down'>" + allPois[i].address + "</div><span class='right'><img class='tex'  src='../API/outstyle091100004.jpg' id="+allPois[i].title+"></span></div></div>";
                map.addOverlay(new BMap.Marker(allPois[i].point));
                $('.anchorBL').css('display','none');
            }

        }, mOption
    );
}