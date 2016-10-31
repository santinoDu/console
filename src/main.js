import './css/style.css'
import html from './index.html'
import dom from './utils/dom.js'

const logBoxSelector = '.-c-content'
const switchBtnSelector = '.-c-switch'
const toolBarSelector = '.-c-toolbar'
const clearClass = '-c-clear'
const hideClass = '-c-hide'
const logItemClass = '-c-log'
const consoleMethods = ['debug', 'error', 'info', 'log', 'warn']

class Console {
    constructor () {
        this.render()
        this.switchBtn = dom.$(switchBtnSelector)
        this.toolBar = dom.$(toolBarSelector)
        this.logBox = dom.$(logBoxSelector)
        this.bindEvent()
        this.core()
    }
    render () {
        dom.append(dom.$('body'), dom.createElement('div', null, html))
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
            dom.hide(this.switchBtn).show(this.logBox, this.toolBar)
        })
    }
    pushLog (msg) {
        let text = msg.map(val => JSON.stringify(val)).join(' '),
            log = dom.createElement('div', {class: logItemClass}, text)
        dom.append(this.logBox, log)
        this.logBox.scrollTop = this.logBox.scrollHeight
    }
    core () {
        consoleMethods.forEach((method) => {
            let original = window.console[method]
            window.console[method] = (...args) => {
                this.pushLog(args)
                original.apply(console, args)
            }
        })
    }
}

new Console()
