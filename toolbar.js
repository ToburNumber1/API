/**
 * Created by lixuefeng on 16-1-12.
 */
window.onload = function() {
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });
}
