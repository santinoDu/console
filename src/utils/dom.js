export default {
    $ (selector) {
        return document.querySelector(selector)
    },
    createElement (tag, attrs, content) {
        let el = document.createElement(tag),
            i;
        for( i in attrs ){
            if(attrs.hasOwnProperty(i)){
                el.setAttribute(i, attrs[i])
            }
        }
        if(content){
            el.innerHTML = content
        }
        return el
    },
    show (...els) {
        els.forEach(el => {
            el.style.display = 'block'
        })
        return this
    },
    hide (...els) {
        els.forEach(el => {
            el.style.display = 'none'
        })
        return this
    },
    append (parent, ...els) {
        els.forEach(el => {
            parent.appendChild(el)
        })
        return this
    },
    html (el, content) {
        el.innerHTML = content
    }
}