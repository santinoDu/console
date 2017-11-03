import './css/style.css'
import html from './index.html'
import dom from './utils/dom.js'
import drag from './utils/drag.js'

const logBoxSelector = '.-c-content'
const switchBtnSelector = '.-c-switch'
const toolBarSelector = '.-c-toolbar'
const clearClass = '-c-clear'
const hideClass = '-c-hide'
const logItemClass = '-c-log'
const consoleMethods = ['debug', 'error', 'info', 'log', 'warn']

export default class Console {
    constructor () {
        this.render()
        this.prepareProperty()
        this.bindEvent()
        this.core()
    }
    render () {
        const ele = dom.createElement('div', null, html);
        dom.append(dom.$('body'), ele);
    }
    prepareProperty () {
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
        })

        this.switchBtn.addEventListener('click', () => {
            if(this.switchBtn.classList.contains('noClick')) return;
            dom.hide(this.switchBtn).show(this.logBox, this.toolBar)
        })
    }
    pushLog (msg, type) {
        let text = msg.map(val => JSON.stringify(val)).join(' '),
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
