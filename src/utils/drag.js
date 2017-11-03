export default function drag(obj) {

	obj.ontouchstart = function (evt) {

		const e = evt.targetTouches[0];
		const disX = e.clientX - this.offsetLeft;
		const disY = e.clientY - this.offsetTop;

		const handleMove = function (evt) {
			evt.preventDefault();
			const e = evt.targetTouches[0];

			let L = e.clientX - disX;
			let T = e.clientY - disY;

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
		};

		document.addEventListener("touchmove", handleMove, false);

		const handleEnd = function () {
			document.removeEventListener("touchmove", handleMove, false);
			document.removeEventListener("touchend", handleEnd, false);
		};

		document.addEventListener("touchend", handleEnd, false);

	}
}
