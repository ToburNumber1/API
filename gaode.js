/**
 * Created with WebStorm.
 * Author: qiang.niu(http://www.siptea.cn)
 * Date: 2015/8/11 9:35
 */
if (typeof(Lib) == "undefined") {
    Lib = {};
}
Lib.AMap = Lib.AMap || {};
Lib.AMap.CloudDataSearchRender = function() {
    var me = this;
    //me.author="qiang.niu(http://www.siptea.cn)";
    me.autoRender = function(options) { //options.map otpions.panel options.data
        me.clear();
        if (!options || !options.methodName || !options.methodArgumments || (!options.panel && !options.map)) {
            return;
        }
        this.options = options;
        this.callback('complete', options['data']);
    }
    me.callback = function(status, result) {
        me.clear();
        var options = me.options;
        if (options.callback) {
            options.callback(status, result);
        }
        if (status != "complete") {
            return;
        }
        me.result = result;
        if (options.map) {
            me._infoWindow = new AMap.InfoWindow({ //鐐圭殑淇℃伅绐椾綋
                size: new AMap.Size(0, 0),
                isCustom: true,
                offset: new AMap.Pixel(0, -30)
            });
            me._overlays = []; //poi
            me._highlightOverlay = null; //楂樹寒poi
            if (result['datas']) {
                me.drawOverlays(result);
            }
            if (options.methodName == "searchNearBy") { //濡傛灉鏄懆杈规煡璇紝鐢诲嚭鍦嗙殑鑼冨洿
                var a = me.options.methodArgumments;
                me.drawCircle(a[0], a[1]);
            }
            if (options.methodName == "searchInPolygon") { //濡傛灉鏄杈瑰舰锛岀敾鍑哄杈瑰舰
                var a = me.options.methodArgumments;
                me.drawPolygon(a[0]);
            }

        }
        if (options.panel) {
            if (Object.prototype.toString.call(options.panel) == '[object String]') {
                options.panel = document.getElementById(options.panel);
            }
            options.panel.innerHTML = me.view.createPanel(result);
            me.enableListeners();
        }
    }
    me.clear = function() {
        this.clearPanel();
        this.clearOverlays();
        this.clearCircle();
        this.clearPolygon();
    };
    me.drawOverlays = function(result) { //缁樺埗鏈〉鎵€鏈夌殑鐐�
        me.clearOverlays();
        var pois = result.datas;

        me._overlays = this.addOverlays(pois);

        me.options.map.setFitView(this._overlays);
    }
    me.addOverlays = function(points) {
        var map = this.options.map;
        var _overlays = [];
        for (var i = 0, point; i < points.length; i++) { //缁樺埗閫旂粡鐐�
            point = new AMap.Marker({
                map: map,
                topWhenClick: true,
                position: points[i]._location, //鍩虹偣浣嶇疆
                content: '<div class="amap_lib_cloudDataSearch_poi">' + (i + 1) + '</div>'
            });
            point.isOfficial = true;
            points[i].index = i;
            point._data = points[i];
            AMap.event.addListener(point, "click", this.listener.markerClick);
            _overlays.push(point);
        }
        return _overlays;
    }
    me.clearPanel = function() {
        if (this.options && this.options.panel) {
            this.options.panel.innerHTML = '';
        }
    }
    me.clearOverlays = function() {
        if (this._overlays) {
            for (var i = 0, overlay; i < this._overlays.length; i++) {
                overlay = this._overlays[i];
                overlay.setMap(null);
            }
            this._overlays = [];
        }
        if (this._infoWindow) {
            this._infoWindow.close();
        }
    }
    me.setCenter = function(index) {
        var poi = me.result.datas[index];
        poi.index = index;
        me.options.map.setCenter(poi._location);
        me._overlays[index].setTop(true);
        me.listener.markerClick.call({
            _data: poi,
            getPosition: function() {
                return poi._location;
            }
        });
    }
    me.util = {};
    /**
     * 鏍规嵁绫诲悕鑾峰緱鍏冪礌
     * 鍙傛暟璇存槑:
     *      1銆乧lassName 绫诲悕
     *      2銆乼ag 鍏冪礌鍚� 榛樿鎵€鏈夊厓绱�
     *      3銆乸arent 鐖跺厓绱� 榛樿doucment
     */
    me.util.getElementsByClassName = function(className, tag, parent) {
        var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
        //var testClass = new RegExp("(\w|\s)*" + className + "(\w|\s)*");
        var tag = tag || "*";
        var parent = parent || document;
        var elements = parent.getElementsByTagName(tag);
        var returnElements = [];
        for (var i = 0, current; i < elements.length; i++) {
            current = elements[i];
            if (testClass.test(current.className)) {
                returnElements.push(current);
            }
        }
        return returnElements;
    }
    me.enableListeners = function() { //娉ㄥ唽闈㈡澘鏉＄洰鐐瑰嚮浜嬩欢
        var unfocusTitles = me.util.getElementsByClassName("poibox", "*", me.options.panel);
        for (var i = 0, unfocusTitle; i < unfocusTitles.length; i++) {
            unfocusTitle = unfocusTitles[i];
            AMap.event.addDomListener(unfocusTitle, "click", this.listener.unfocusTitleClick); //poi鐐瑰嚮浜嬩欢
        }

        var pageLinks = me.util.getElementsByClassName("pageLink", "*", me.options.panel);
        for (var i = 0, pageLink; i < pageLinks.length; i++) {
            pageLink = pageLinks[i];
            AMap.event.addDomListener(pageLink, "click", me.listener.toPage); //poi鐐瑰嚮浜嬩欢
        }
    }
    me.listener = {};
    me.listener.markerClick = function() {
        var data = this._data;
        me._infoWindow.setContent(me.view.createInfowindowContent(data));
        me._infoWindow.open(me.options.map, this.getPosition());

        me.options.map.setCenter(this.getPosition());
    }
    me.listener.unfocusTitleClick = function() { //鐐瑰嚮poi闈㈡澘鏉＄洰鏃讹紝璐熻矗鎶婃poi绉诲埌鍦板浘涓ぎ锛屽苟涓旀墦寮€鍏朵俊鎭獥浣�
        if (me.last) {
            me.last.className = "poibox";
        }
        me._currentDiv = this;
        var index;
        var children = this.parentNode.children;
        for (var i = 0, child; i < children.length; i++) {
            child = children[i];
            if (child === this) {
                index = i;
                break;
            }
        }
        me._currentIndex = index; //璁板綍褰撳墠poi绱㈠紩鍙�

        var div = me._currentDiv;
        div.className = "poibox active";
        me.last = div;

        if (me.options.map) {
            me.setCenter(me._currentIndex);
        }

    }
    me.listener.toPage = function() {
        var pageNo = this.getAttribute("pageNo");
        me.toPage(pageNo);
    }
    me.toPage = function(pageNo) {
        if (pageNo.length) {
            pageNo = parseInt(pageNo);
        }
        me.options.cloudDataSearchInstance.setPageIndex(pageNo);
        me.options.cloudDataSearchInstance[me.options.methodName].apply(me.options.cloudDataSearchInstance, me.options.methodArgumments);
    }
    me.view = {}; //鍒涘缓dom缁撴瀯绫荤殑鏂规硶

    me.view.createInfowindowContent = function(data) { //鍒涘缓鐐圭殑infowindow鍐呭
        var content = document.createElement('div');
        var div = document.createElement('div');
        div.className = 'amap-content-body';
        var c = [];
        c.push('<div class="amap-lib-infowindow">');
        c.push('    <div class="amap-lib-infowindow-title">' + (data.index + 1) + '.' + data._name + '</div>');
        c.push('    <div class="amap-lib-infowindow-content">');
        c.push('        <div class="amap-lib-infowindow-content-wrap">');
        c.push('             <div>鍦板潃锛�' + data._address + '</div>');
        c.push('             <div>绫诲瀷锛�' + data.type + '</div>');
        if (data._image && data._image.length) {
            c.push('         <img style = "margin-top:5px;width:100%;height:100px" src="' + data['_image'][0]['_preurl'] + '""></img>');
        }
        c.push('        </div>');
        c.push('    </div>');
        c.push('</div>');
        div.innerHTML = c.join('');

        var sharp = document.createElement('div');
        sharp.className = 'amap-combo-sharp';
        div.appendChild(sharp);

        var close = document.createElement('div');
        close.className = 'amap-combo-close';
        div.appendChild(close);
        close.href = 'javascript: void(0)';

        AMap.event.addDomListener(close, 'touchend', function(e) {
            me._infoWindow['close']();
        }, this);
        AMap.event.addDomListener(close, 'click', function(e) {
            me._infoWindow['close']();
        }, this);
        content.appendChild(div);
        content.appendChild(close);
        content.appendChild(sharp);
        return content;
    }
    me.view.createPanel = function(result) { //鏍规嵁鏈嶅姟鎻掍欢Amap.CloudDataSearch鐨勮繑鍥炵粨鏋滐紝鐢熸垚panel
        if (result.info == "OK" && result.datas && result.datas.length > 0) {

        } else {
            return "<div class='amap_lib_cloudDataSearch'>鎶辨瓑锛屾湭鎼滅储鍒版湁鏁堢殑缁撴灉銆�</div>";
        }
        var pois = result.datas;
        var c = [];
        c.push("<div class=\"amap_lib_cloudDataSearch\">");
        c.push("    <div class=\"amap_lib_cloudDataSearch_list\">");
        c.push("        <ul>");
        for (var i = 0, poi; i < pois.length; i++) {
            poi = pois[i];
            c.push("            <li class=\"poibox\">");
            c.push("                <div class=\"amap_lib_cloudDataSearch_poi poibox-icon\">" + (i + 1) + "</div>");
            c.push("                <h3 class=\"poi-title\">");
            c.push("                	<span class=\"poi-name\">" + poi._name + "</span>");
            c.push("                </h3>");
            c.push("                <div class=\"poi-info\">");
            c.push("                	<p class=\"poi-addr\">鍦板潃锛�" + poi._address + "</p>");
            c.push("                </div>");
            c.push("            </li>");
        }
        c.push("        </ul>");
        c.push("    </div>");
        c.push("    <div class=\"amap_lib_cloudDataSearch_page\">");
        c.push("        <div>");
        c.push("            <p>");
        var poiList = result.poiList,
            count = result.count, //493
            pageIndex = me.options.pageIndex ? me.options.pageIndex : 1,
            pageSize = me.options.pageSize ? me.options.pageSize : 500,
            pageCount = Math.ceil(count / pageSize);
        if (pageIndex > 3) {
            c.push(me.view.createPageButton(1, "棣栭〉"));
        }
        if (pageIndex > 1) {
            c.push(me.view.createPageButton(pageIndex - 1, "涓婁竴椤�"));
        }
        if (pageIndex - 2 >= 1) {
            c.push(me.view.createPageButton(pageIndex - 2, pageIndex - 2));
        }
        if (pageIndex - 1 >= 1) {
            c.push(me.view.createPageButton(pageIndex - 1, pageIndex - 1));
        }
        c.push("                <span>" + pageIndex + "</span>");
        if (pageIndex + 1 <= pageCount) {
            c.push(me.view.createPageButton(pageIndex + 1, pageIndex + 1));
        }
        if (pageIndex + 2 <= pageCount) {
            c.push(me.view.createPageButton(pageIndex + 2, pageIndex + 2));
        }
        if (pageIndex < pageCount) {
            c.push(me.view.createPageButton(pageIndex + 1, "涓嬩竴椤�"));
        }
        c.push("            </p>");
        c.push("        </div>");
        c.push("    </div>");
        c.push("</div>");
        return c.join("");
    }

    var circleOptions = {
        id: 'cloudData-search-circle',
        radius: 3000,
        strokeColor: '#72ccff',
        strokeOpacity: .7,
        strokeWeight: 1,
        fillColor: '#d0e7f8',
        fillOpacity: .5
    };

    me.drawCircle = function(center, radius) { //涓哄懆杈规煡璇㈢敾鍦�
        me.clearCircle();

        circleOptions.map = me.options.map;
        circleOptions.center = center;
        circleOptions.radius = radius;

        me.searchCircle = new AMap.Circle(circleOptions);
        me.searchCircle.isOfficial = true;
    };

    me.clearCircle = function() {
        if (me.searchCircle) {
            me.searchCircle.setMap(null);
            me.searchCircle = null;
        }
    };

    var polygonOptions = {
        id: 'cloudData-search-bound',
        strokeColor: '#72ccff',
        strokeOpacity: .7,
        strokeWeight: 1,
        fillColor: '#d0e7f8',
        fillOpacity: .2
    };
    me.drawPolygon = function(polygon) { //涓哄杈瑰舰鏌ョ敾澶氳竟褰�
        me.clearPolygon();
        polygonOptions.path = polygon;
        polygonOptions.map = me.options.map;
        var polygon = new AMap.Polygon(polygonOptions);
        polygon.isOfficial = true;
        me.searchPolygon = polygon;
    };

    me.clearPolygon = function() {
        if (me.searchPolygon) {
            me.searchPolygon.setMap(null);
            me.searchPolygon = null;
        }
    };

    me.view.createPageButton = function(pageNum, text) {
        //return "<span><a pageNo=" + pageNum + " class=\"pageLink\" href=\"javascript:void(0)\">" + text + "</a></span>";
        return "<span><a pageNo=" + pageNum + " class=\"pageLink\" >" + text + "</a></span>";
    }
}