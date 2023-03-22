import WebGL2Handler from './utils/classes/WebGL2Handler.js';
import Converter from './utils/Converter.js';
import UIHandler from './utils/UIHandler.js';





// const vertices = [
// 	// left column
// 	0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0,

// 	// top rung front
// 	30, 0, 0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0,

// 	// middle rung front
// 	30, 60, 0, 67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0,

// 	// left column back
// 	0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

// 	// top rung back
// 	30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

// 	// middle rung back
// 	30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

// 	// top
// 	0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

// 	// top rung right
// 	100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

// 	// under top rung
// 	30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

// 	// between top rung and middle
// 	30, 30, 0, 30, 30, 30, 30, 60, 30, 30, 30, 0, 30, 60, 30, 30, 60, 0,

// 	// top of middle rung
// 	30, 60, 0, 30, 60, 30, 67, 60, 30, 30, 60, 0, 67, 60, 30, 67, 60, 0,

// 	// right of middle rung
// 	67, 60, 0, 67, 60, 30, 67, 90, 30, 67, 60, 0, 67, 90, 30, 67, 90, 0,

// 	// bottom of middle rung.
// 	30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

// 	// right of bottom
// 	30, 90, 0, 30, 90, 30, 30, 150, 30, 30, 90, 0, 30, 150, 30, 30, 150, 0,

// 	// bottom
// 	0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

// 	// left side
// 	0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
// ];

// const colors = [
// 	// left column front
// 	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
// 	120,

// 	// top rung front
// 	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
// 	120,

// 	// middle rung front
// 	200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
// 	120,

// 	// left column back
// 	80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

// 	// top rung back
// 	80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

// 	// middle rung back
// 	80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

// 	// top
// 	70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200,
// 	210,

// 	// top rung right
// 	200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200,
// 	200, 70,

// 	// under top rung
// 	210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
// 	100, 70,

// 	// between top rung and middle
// 	210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210,
// 	160, 70,

// 	// top of middle rung
// 	70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180,
// 	210,

// 	// right of middle rung
// 	100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,
// 	210,

// 	// bottom of middle rung.
// 	76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210,
// 	100,

// 	// right of bottom
// 	140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140,
// 	210, 80,

// 	// bottom
// 	90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130,
// 	110,

// 	// left side
// 	160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
// 	160, 160, 220,
// ];

// console.log(position)

const webgl2 = new WebGL2Handler(document.querySelector('canvas')).init();
const state = {
	model: {vertices: [], colors: [], normals: []},
	translation: [0, 0, 0],
	rotation: [
		Converter.degToRad(0),
		Converter.degToRad(0),
		Converter.degToRad(0),
	],
	scale: [1, 1, 1],
};
const renderSettings = {
	primitiveType: webgl2.getGl().TRIANGLES,
	drawCounter: state.model.vertices.length
};


const eventHandler = {
	updatePosition(index) {
		return (event, value) => {
			state.translation[index] = value;
			webgl2.clearBuffer().render(renderSettings, state);
		};
	},

	updateRotation(index) {
		return (event, value) => {
			const angleInDegrees = value;
			const angleInRadians = Converter.degToRad(angleInDegrees);
			state.rotation[index] = angleInRadians;
			webgl2.clearBuffer().render(renderSettings, state);
		};
	},

	updateScale(index) {
		return (event, value) => {
			state.scale[index] = value;
			webgl2.clearBuffer().render(renderSettings, state);
		};
	},

	openModel() {
		return (event) => {
			var input = document.createElement('input');
			input.type = 'file';
			input.setAttribute('accept', 'application/json, .txt');
			input.onchange = (e) => {
				var file = e.target.files[0];

				if (!file) {
					return
				}

				var reader = new FileReader();
				reader.readAsText(file, 'UTF-8');

				reader.onload = readerEvent => {
					var content = readerEvent.target.result;
					state.model = JSON.parse(content);
					renderSettings.drawCounter = state.model.vertices.length;
					webgl2
						.clearBuffer()
						.setVertices(state.model.vertices)
						.setColors(state.model.colors)
						.setNormals(state.model.normals)
						.render(renderSettings, state);
				}
			}
			input.click();
		}
	}
}

UIHandler.initSlider('#tx', {
	initialValue: state.translation[0],
	handlerFn: eventHandler.updatePosition(0),
});

UIHandler.initSlider('#ty', {
	initialValue: state.translation[1],
	handlerFn: eventHandler.updatePosition(1),
});

UIHandler.initSlider('#tz', {
	initialValue: state.translation[2],
	handlerFn: eventHandler.updatePosition(2),
});

UIHandler.initSlider('#rx', {
	initialValue: state.rotation[0],
	handlerFn: eventHandler.updateRotation(0),
});

UIHandler.initSlider('#ry', {
	initialValue: state.rotation[1],
	handlerFn: eventHandler.updateRotation(1),
});

UIHandler.initSlider('#rz', {
	initialValue: state.rotation[2],
	handlerFn: eventHandler.updateRotation(2),
});

UIHandler.initSlider('#sx', {
	initialValue: state.scale[0],
	handlerFn: eventHandler.updateScale(0),
});

UIHandler.initSlider('#sy', {
	initialValue: state.scale[1],
	handlerFn: eventHandler.updateScale(1),
});

UIHandler.initSlider('#sz', {
	initialValue: state.scale[2],
	handlerFn: eventHandler.updateScale(2),
});

UIHandler.initButton('#model', {
	handlerFn: eventHandler.openModel(),
})

webgl2
	.clearBuffer()
	.setVertices(state.model.vertices)
	.setColors(state.model.colors)
	.setNormals(state.model.normals)
	.render(renderSettings, state);
