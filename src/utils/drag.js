export default function drag(obj) {
	obj.onmousedown = function (evt) {

		if (obj.setCapture) {
			obj.setCapture()
		}

		var e = evt || window.event;
		var disX = e.clientX - this.offsetLeft;
		var disY = e.clientY - this.offsetTop;

		document.onmousemove = function (evt) {
			obj.classList.add('noClick');
			var e = evt || window.event;

			var L = e.clientX - disX;
			var T = e.clientY - disY;

			if (T < 0) {
				T = 0;
			} else if (T > document.documentElement.clientHeight - obj.offsetHeight) {
				T = document.documentElement.clientHeight - obj.offsetHeight;
			}

			if (L < 0) {
				L = 0;
			} else if (L > document.documentElement.clientWidth - obj.offsetWidth) {
				L = document.documentElement.clientWidth - obj.offsetWidth;
			}

			obj.style.left = L + "px";
			obj.style.top = T + "px";
			// obj.style.cssText += `-webkit-transform: translate2d(${L}px, ${T}px);`
		};

		document.onmouseup = function () {
			document.onmousemove = document.onmouseup = null;
			if (obj.releaseCapture) {
				obj.releaseCapture();
			}
		};

		obj.classList.remove('noClick');
		return false;
	}
}
