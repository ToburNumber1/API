/**
 * Created by lixuefeng on 16-1-25.
 */

window.onload = function () {
    input();
    getLocation();
    click();
    search();
}
function input() {
    function addListener(element, e, fn) {
        if (element.addEventListener) {
            element.addEventListener(e, fn, false);
        }
        else {
            element.attachEvent("on" + e, fn);
        }
    }

    var tipinput = document.getElementById("tipinput");
    addListener(tipinput, "click", function () {
        tipinput.value = "";
    })
    addListener(tipinput, "blur", function () {
        tipinput.value = "  搜索地点";
    })
}

var map, geolocation;
//加载地图，调用浏览器定位服务
var autoOptions = {
    input: "tipinput"
};
function click() {
    var clickEventListener = map.on('click', function (e) {

        var map = {latitude: e.lnglat.getLat(), longitude: e.lnglat.getLng()}
        localStorage.setItem("data", JSON.stringify(map));
        near_address()
    });
}


function search() {
    var auto = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        map: map
    });  //构造地点查询类


    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
        var poiArr = e.poi.name;
        localStorage.setItem("name", JSON.stringify(poiArr));
        var geocoder = new AMap.Geocoder({
            //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });

        geocoder.getLocation(JSON.parse(localStorage.getItem("name")), function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });
    }
}
function geocoder_CallBack(data) {
    var map = new BMap.Map("containe");
    $(document).ready(function () {
        $("#panel").remove();
    });
    $("#panl").empty();
    var geocode = data.geocodes;
    var dress = JSON.parse(localStorage.getItem("info"))
    var obj_info = {latitude: geocode[0].location.getLat(), longitude: geocode[0].location.getLng()}//gaiII
    localStorage.setItem("data", JSON.stringify(obj_info));

    get_address()

}
function getLocation() {
    map = new AMap.Map('container', {
        resizeEnable: true
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
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
    });
    $('.amap-logo').css('display', 'none');
    $('.amap-copyright').css('display', 'none');
    //$('.amap-geo').css('display', 'none');
}
function showPosition(position) {
    var obj_info = {latitude: position.coords.latitude, longitude: position.coords.longitude};
    localStorage.setItem("info", JSON.stringify(obj_info));
    displayPOI()
}
function near_address() {

    $(document).ready(function () {

        $("#panel").remove();
    });
    $("#panl").empty();
    get_address()

}
function get_address() {
    var map = new BMap.Map("containe");
    var ee = JSON.parse(localStorage.getItem("data"))
    var mPoint = new BMap.Point(ee.longitude + 0.0065, ee.latitude + 0.0060);
    var mOption = {
        poiRadius: 2500,           //半径为1000米内的POI,默认100米
        numPois: 30             //列举出50个POI,默认10个
    }
    map.centerAndZoom(mPoint, 50);
    map.enableScrollWheelZoom();
    var myGeo = new BMap.Geocoder();        //创建地址解析实例
    myGeo.getLocation(mPoint,
        function mCallback(rs) {
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            allPois.forEach(function (place) {
                var html = "<div class='list' ><div class='site' id=" + place.title + ">" + place.title + "</div><div class='site_down'>" + place.address + "</div><span class='right'><img class='tex'  src='../API/outstyle091100004.jpg' id=" + place.title + "></span></div></div>";
                $("#panl").append(html);
                $($.parseHTML(html, document, true)).appendTo("body");
                $(document).ready(function () {
                    $('#' + place.title).click(function () {
                        $('.tex').css('display', 'none');
                        $('#' + place.title).show();
                    });
                });

            })

        }, mOption
    );
}

function displayPOI() {
    var mPoint = new BMap.Point(JSON.parse(localStorage.getItem("info")).longitude + 0.0065, JSON.parse(localStorage.getItem("info")).latitude + 0.0060);
    ss(mPoint)
}
function ss(mPoint) {
    var map = new BMap.Map("containe");
    var mOption = {
        poiRadius: 2500,           //半径为1000米内的POI,默认100米
        numPois: 30             //列举出50个POI,默认10个
    }
    map.centerAndZoom(mPoint, 15);
    map.enableScrollWheelZoom();
    var myGeo = new BMap.Geocoder();        //创建地址解析实例
    map.addOverlay(new BMap.Circle(mPoint, 0));        //添加一个圆形覆盖物
    myGeo.getLocation(mPoint,
        function mCallback(rs) {
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            allPois.forEach(function (place) {
                var html = "<div class='list' ><div class='site' id=" + place.title + ">" + place.title + "</div><div class='site_down'>" + place.address + "</div><span class='right'><img class='tex'  src='../API/outstyle091100004.jpg' id=" + place.title + "></span></div></div>";
                $("#panel").append(html);
                $(document).ready(function () {
                    $('#' + place.title).click(function () {
                        $('.tex').css('display', 'none');
                        $('#' + place.title).show();
                    });
                });

            })

        }, mOption
    );
}
