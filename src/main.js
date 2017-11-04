import './css/style.css'
import html from './index.html'
import dom from './utils/dom.js'
import drag from './utils/drag.js'
import ProxyXMLHttpRequest from './utils/xhr.js'
import fetchIntercept from './utils/fetch.js'
import isError from './utils/type';

const logBoxSelector = '.-c-content'
const switchBtnSelector = '.-c-switch'
const toolBarSelector = '.-c-toolbar'
const clearClass = '-c-clear'
const hideClass = '-c-hide'
const ajaxClass = '-c-ajax'
const logItemClass = '-c-log'
const consoleMethods = ['debug', 'error', 'info', 'log', 'warn']

export default class Console {
    constructor () {
        this.render()
        this.prepareProperty()
        this.bindEvent()
        this.catchAjax()
        this.core()
    }
    render () {
        const ele = dom.createElement('div', null, html);
        dom.append(dom.$('body'), ele);
    }
    prepareProperty () {
        this.ajaxEnable = false;
        this.switchBtn = dom.$(switchBtnSelector);
        // 设置 Switch Button 初始位置, 并使其可以 Drag
        this.switchBtn.style.left = document.documentElement.clientWidth - this.switchBtn.offsetWidth - 10 + "px";
        this.switchBtn.style.top = document.documentElement.clientHeight - this.switchBtn.offsetHeight - 10 + "px";
        drag(this.switchBtn);
        this.toolBar = dom.$(toolBarSelector)
        this.logBox = dom.$(logBoxSelector)
    }
    bindEvent () {
        this.toolBar.addEventListener('click', (e) => {
            let target = e.target
            if(target.classList.contains(clearClass)){
                dom.html(this.logBox, '')
            }else if(target.classList.contains(hideClass)){
                dom.hide(this.logBox, this.toolBar).show(this.switchBtn)
            }
            if(target.classList.contains(ajaxClass)){
                this.ajaxEnable = !this.ajaxEnable;
                if (this.ajaxEnable) {
                    target.innerText = 'AJAX(ON)'
                } else {
                    target.innerText = 'AJAX(OFF)'
                }
            }
        })

        this.switchBtn.addEventListener('click', () => {
            dom.hide(this.switchBtn).show(this.logBox, this.toolBar)
        })

        // 捕获页面错误
        const _onerror = window.onerror || function noop(){};

        window.onerror = (msg, url, lineNo, columnNo, error) => {
            _onerror();
            const message = [
                'Message: ' + msg,
                'URL: ' + url,
                'Line: ' + lineNo,
                'Column: ' + columnNo,
                'Error object: ' + error
            ].join(' <br/> ');

            this.pushLog([message], 'Exception');
        };
    }

    catchAjax() {
        // 捕获 xhr 错误
        // TODO 添加 REQUEST BODY 和 RESPONSE DATA
        const _this = this;
        ProxyXMLHttpRequest.fn = function (xhr) {
            if (!_this.ajaxEnable) return;
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    _this.pushLog([`[AJAX] ${xhr.open_fn_parmas.method} ${xhr.open_fn_parmas.url} ${xhr.status} (${xhr.statusText})`], 'AJAXSUCCESS');
                } else {
                    _this.pushLog([`[AJAX] ${xhr.open_fn_parmas.method} ${xhr.open_fn_parmas.url} ${xhr.status} (${xhr.statusText})`], 'AJAXFAILURE');
                }
            }
        };
        window.XMLHttpRequest = ProxyXMLHttpRequest;

        // 捕获 fetch 错误
        const unregister = fetchIntercept.register({
            response: function ({request, response}) {
                if (!_this.ajaxEnable) return;
                if (response.status >= 200 && response.status <= 299) {
                    _this.pushAjaxLog(request, response, 'AJAXSUCCESS');
                } else {
                    _this.pushAjaxLog(request, response, 'AJAXFAILURE');
                }
                return response;
            },
            responseError: function ({request, responseError}) {
                // TODO 待确定
                if (!_this.ajaxEnable) return;
                _this.pushLog([`[AJAX] ${request.method} ${request.url} ${responseError.status} (${responseError.statusText})`], 'AJAXFAILURE');
                return Promise.reject(responseError);
            }
        });
    }

    pushAjaxLog(request, response, type) {
        try {
            request = request.clone();
            response = response.clone();
            Promise.all([request.json(), response.json()]).then(data => {
                this.pushLog([`[AJAX] ${request.method} ${request.url} ${response.status} (${response.statusText})`], type);
                data[0] && this.pushLog([`[REQUEST BODY] ${data[0]}`], type);
                data[1] && this.pushLog([`[RESPONSE DATA] ${data[1]}`], type);
            }).catch(err => {
                this.pushLog([`[AJAX] ${request.method} ${request.url} ${response.status} (${response.statusText})`], type);
            });
        } catch(err) {
            this.pushLog([`[AJAX] ${request.method} ${request.url} ${response.status} (${response.statusText})`], type);
        }
    }

    pushLog (msg, type) {
        let text = msg.map(val => {
            return isError(val) ? `${val.stack}` : JSON.stringify(val);
        }).join(' '),
            log = dom.createElement('div', {class: `${logItemClass} ${type}`}, text)
        dom.append(this.logBox, log)
        this.logBox.scrollTop = this.logBox.scrollHeight
    }
    core () {
        consoleMethods.forEach((method) => {
            let original = window.console[method]
            window.console[method] = (...args) => {
                this.pushLog(args, method)
                original.apply(console, args)
            }
        })
    }
}

window.MobileConsole = Console;
