"use strict";

const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";
const devtools = { open: false };
const element = new Image();
Object.defineProperty(element, 'id', {
    get: function () {
        devtools.open = true;
    }
});
console.log(element);

window.addEventListener(
	"pointermove",
	(e) => {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		rad = 0;
	},
	false
);

const resize = () => {
	width = window.innerWidth;
	height = window.innerHeight;
};

let width, height;
window.addEventListener("resize", () => resize(), false);
resize();

const prepend = (use, i) => {
	const elem = document.createElementNS(xmlns, "use");
	elems[i].use = elem;
	elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
	screen.prepend(elem);
};

const N = 40;

const elems = [];
for (let i = 0; i < N; i++) elems[i] = { use: null, x: width / 2, y: 0 };
const pointer = { x: width / 2, y: height / 2 };
const radm = Math.min(pointer.x, pointer.y) - 20;
let frm = Math.random();
let rad = 0;

for (let i = 1; i < N; i++) {
	if (i === 1) prepend("Cabeza", i);
	else if (i === 8 || i === 14) prepend("Aletas", i);
	else prepend("Espina", i);
}

const run = () => {
	requestAnimationFrame(run);
	let e = elems[0];
	const ax = (Math.cos(3 * frm) * rad * width) / height;
	const ay = (Math.sin(4 * frm) * rad * height) / width;
	e.x += (ax + pointer.x - e.x) / 10;
	e.y += (ay + pointer.y - e.y) / 10;
	for (let i = 1; i < N; i++) {
		let e = elems[i];
		let ep = elems[i - 1];
		const a = Math.atan2(e.y - ep.y, e.x - ep.x);
		e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4;
		e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4;
		const s = (162 + 4 * (1 - i)) / 50;
		e.use.setAttributeNS(
			null,
			"transform",
			`translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
				(180 / Math.PI) * a
			}) translate(${0},${0}) scale(${s},${s})`
		);
	}
	if (rad < radm) rad++;
	frm += 0.003;
	if (rad > 60) {
		pointer.x += (width / 2 - pointer.x) * 0.05;
		pointer.y += (height / 2 - pointer.y) * 0.05;
	}
};

run();
