;(function (window) {

    var html = '<div id="__console">' +
        '<div class="-c-switch">Console</div>' +
        '<div class="-c-content"></div>' +
        '<div class="-c-toolbar">' +
        '<div class="-c-tool -c-clear">Clear</div>' +
        '<div class="-c-tool -c-hide">Hide</div>' +
        '</div>' +
        '</div>';

    var css = '.-c-switch{display:block;position:fixed;right:10px;bottom:10px;z-index:2147483647;border-radius:4px;box-shadow:0 0 8px rgba(0,0,0,.4);padding:8px 16px;line-height:1;font-size:14px;color:#fff;background-color:#04be02}.-c-content,.-c-toolbar{display:none;position:fixed;left:0;z-index:2147483647;background-color:#fff;right:0}.-c-content{bottom:40px;border-top:1px solid #eee;overflow-x:hidden;overflow-y:auto;max-height:50%;-webkit-overflow-scrolling:touch}.-c-log{margin:0;border-bottom:1px solid #eee;padding:6px 8px;overflow:hidden;line-height:1.3;word-break:break-word}.-c-toolbar{bottom:0;line-height:40px}.-c-tool{position:relative;float:left;width:50%;text-align:center;text-decoration:none;color:#000}.-c-clear::before{content:"";position:absolute;top:7px;bottom:7px;right:0;border-left:1px solid #d9d9d9}';

    var createElement = function (tag, attrs, content) {
        var el = document.createElement(tag),
            i;
        for( i in attrs){
            if(attrs.hasOwnProperty(i)){
                el.setAttribute(i, attrs[i])
            }
        }

        if(content){
            el.innerHTML = content
        }

        return el
    }

    var pushLog = function (msg) {
        var log = createElement('div', {class: '-c-log'}, JSON.stringify(msg.join(' ')).slice(1, -1))
        logBox.appendChild(log)
    }

    var init = function () {
        var el = createElement('div', {}, html)
        var style = createElement('style', {}, css)
        document.head.appendChild(style)
        document.body.appendChild(el)
    }

    init()

    var logBox = document.querySelector('.-c-content');
    var toolBar = document.querySelector('.-c-toolbar');
    var switchBtn = document.querySelector('.-c-switch');

    switchBtn.addEventListener('click', function () {
        logBox.style.display = 'block'
        toolBar.style.display = 'block'
        switchBtn.style.display = 'none'
    })

    toolBar.addEventListener('click', function (e) {
        var target = e.target;
        if(target.classList.contains('-c-clear')){
            logBox.innerHTML = ''
        }else if(target.classList.contains('-c-hide')){
            logBox.style.display = 'none'
            toolBar.style.display = 'none'
            switchBtn.style.display = 'block'
        }
    })

    ;['debug', 'error', 'info', 'log', 'warn'].forEach(function(method){
        var original = window.console[method]
        window.console[method] = function () {
            pushLog(Array.prototype.slice.call(arguments))
            original.apply(console, arguments);
        }
    })
}(window));