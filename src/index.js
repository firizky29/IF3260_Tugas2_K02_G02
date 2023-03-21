import WebGL2Handler from './utils/classes/WebGL2Handler.js';
import Converter from './utils/Converter.js';
import UIHandler from './utils/UIHandler.js';
// import {position, colors} from './model/InterwinedTriangleGenerator.js';

const oRadius = 1.0;
const cornerW = 0.05;
const cornerH = 0.2;

const octaHedron = [
	[0, oRadius, 0],
	[0, 0, -oRadius],
	[oRadius, 0, 0],
	[0, 0, oRadius],
	[-oRadius, 0, 0],
	[0, -oRadius, 0]
]
// for(let i=0; i<6; i++){
//   for(let j=0; j<3; j++){
//     octaHedron[i][j] += oRadius;
//   }
// }
let upperMid = [], lowerMid = [], middleMid = []
const upper = octaHedron[0]
const lower = octaHedron[5]
for (let i = 1; i < 5; i++) {
	let currentUpper = [];
	let currentLower = [];
	let currentMiddle = [];
	for (let j = 0; j < 3; j++) {
		currentUpper.push((upper[j] + octaHedron[i][j]) / 2)
		currentLower.push((lower[j] + octaHedron[i][j]) / 2)
		currentMiddle.push((octaHedron[i][j] + octaHedron[(i % 4) + 1][j]) / 2)
	}
	upperMid.push(currentUpper)
	lowerMid.push(currentLower)
	middleMid.push(currentMiddle)
}

let triangles = [[], [], [], []]
for (let i = 0; i < 4; i++) {
	let corners = []
	corners.push(upperMid[i])
	corners.push(middleMid[(i + 2) % 4])
	corners.push(lowerMid[(i + 1) % 4])

	// direction of width adalah vector normal dari segitiga
	// direction of height adalah vector OX, O adalah origin, X adalah titik sudut segitiga

	// cari normal vector dari segitiga
	let u = [], v = []
	for (let j = 0; j < 3; j++) {
		u.push(corners[0][j] - corners[1][j])
		v.push(corners[2][j] - corners[1][j])
	}
	let normal = []
	normal.push(u[1] * v[2] - u[2] * v[1])
	normal.push(u[2] * v[0] - u[0] * v[2])
	normal.push(u[0] * v[1] - u[1] * v[0])

	// normilize normal vector
	let normalLength = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2])
	let dirWidth = [[], [], []]
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			dirWidth[j].push(normal[k] / normalLength)
		}
	}

	let dirHeight = [[], [], []]
	let mid = []
	for (let j = 0; j < 3; j++) {
		mid.push((corners[0][j] + corners[1][j] + corners[2][j]) / 3)
	}
	let dirY = [[], [], []]
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			dirY[j].push(corners[j][k] - mid[k])
		}
	}
	// console.log(dirY)
	for (let j = 0; j < 3; j++) {
		let length = Math.sqrt(dirY[j][0] * dirY[j][0] + dirY[j][1] * dirY[j][1] + dirY[j][2] * dirY[j][2])
		for (let k = 0; k < 3; k++) {
			dirHeight[j].push(dirY[j][k] / length)
		}
	}

	for (let j = 0; j < 3; j++) {
		let dx = [1, 1, -1, -1]
		let dy = [1, -1, -1, 1]
		let cornerRect = []
		for (let k = 0; k < 4; k++) {
			let corner = []
			for (let l = 0; l < 3; l++) {
				corner.push(corners[j][l] + dx[k] * cornerW * dirWidth[j][l] + dy[k] * cornerH * dirHeight[j][l])
			}
			cornerRect.push(corner)
		}
		triangles[i].push(cornerRect)
	}
}
let position = []
let colors = []
// let position = [1, 0, 0, 0, 1, 0, 1, 1, 0]
// let colors = [0, 255, 0, 255, 0, 0, 0,0,255]
// for(let i=0; i<4; i++){
//   for(let j=0; j<3; j++){
//       // console.log(triangles[i][j])
//       for(let k=0; k<3; k++){
//           for(let l=0; l<3; l++){
//               position.push(triangles[i][j][k][l])
//           }
//       }
//       for(let l=0; l<3; l++){
//           position.push(triangles[i][j][0][l])
//       }

//       for(let l=0; l<3; l++){
//         position.push(triangles[i][j][2][l])
//       }

//       for(let k=0; k<3; k++){
//           position.push(triangles[i][j][3][k])
//       }

//       let color = []
//       for(let k=0; k<3; k++){
//           color.push(Math.round(Math.random()*255))
//       }
//       for(let k=0; k<6; k++){
//           for(let l=0; l<3; l++){
//               colors.push(color[l])
//           }
//       }
//   }
// }
// for(let i=0; i<4; i++){
//   let color = []
//   for(let j=0; j<3; j++){
//     color.push(Math.round(Math.random()*255))
//   }
//   for(let k=0; k<4; k++){
//     let id1 = k;
//     let id2 = (k+1)%4;
//     for(let j=0; j<3; j++){
//       let idx1 = j;
//       let idx2 = (j+1)%3;
//       let c = triangles[i][idx1][id1]
//       let d = triangles[i][idx1][id2]
//       let a = triangles[i][idx2][id2]
//       let b = triangles[i][idx2][id1]
//       position.push(a[0], a[1], a[2])
//       position.push(b[0], b[1], b[2])
//       position.push(c[0], c[1], c[2])
//       position.push(a[0], a[1], a[2])
//       position.push(c[0], c[1], c[2])
//       position.push(d[0], d[1], d[2])
//       console.log(i, j, k)
//       for(let l=0; l<6; l++){
//         colors.push(color[0], color[1], color[2])
//       }
//     }
//     // for(let j=0; j<3; j++){
//     //   for(let l=0; l<3; l++){
//     //     position.push(triangles[i][j][k][l])
//     //     colors.push(color[l])
//     //   }
//     // }
//   }
// }
let x = 0
let indices = [0, 1, 2, 0, 2, 3]
const red = [255, 0, 0]
const green = [0, 255, 0]
const blue = [0, 0, 255]
const yellow = [255, 255, 0]
const colors1 = [red, green, blue, red, blue, yellow]
for (let i = x; i <= x; i++) {
	for(let i1=1; i1<=1; i1++){
		let idx1 = 0;
		let idx2 = 3;
		for (let j = 0; j < 3; j++) {
			let id1 = j;
			let id2 = (j + 1) % 3;
			let corners = []
			corners.push(triangles[i][id1][idx1])
			corners.push(triangles[i][id1][idx2])
			corners.push(triangles[i][id2][idx2])
			corners.push(triangles[i][id2][idx1])
			for (let k of indices) {
				for (let l = 0; l < 3; l++) {
					position.push(corners[k][l])
				}
			}
			for(let i=0; i<6; i++){
				colors.push(colors1[i][0], colors1[i][1], colors1[i][2])
			}

		}
	}
}

// for (let i = x; i <= x+1; i++) {
// 	for(let i1=1; i1<=1; i1++){
// 		let idx1 = 2;
// 		let idx2 = 3;
// 		for (let j = 0; j < 3; j++) {
// 			let id1 = j;
// 			let id2 = (j + 1) % 3;
// 			let corners = []
// 			corners.push(triangles[i][id1][idx1])
// 			corners.push(triangles[i][id1][idx2])
// 			corners.push(triangles[i][id2][idx2])
// 			corners.push(triangles[i][id2][idx1])
// 			for (let k of indices) {
// 				for (let l = 0; l < 3; l++) {
// 					position.push(corners[k][l])
// 					colors.push(0)
// 				}
// 			}
// 		}
// 	}
// }

// let indices = [0, 1, 2, 0, 2, 3]
// for (let i = x; i <= x+1; i++) {
// 	for(let i1=1; i1<=1; i1++){
// 		let idx1 = 2;
// 		let idx2 = 1;
// 		for (let j = 0; j < 3; j++) {
// 			let id1 = j;
// 			let id2 = (j + 1) % 3;
// 			let corners = []
// 			corners.push(triangles[i][id1][idx1])
// 			corners.push(triangles[i][id1][idx2])
// 			corners.push(triangles[i][id2][idx2])
// 			corners.push(triangles[i][id2][idx1])
// 			for (let k of indices) {
// 				for (let l = 0; l < 3; l++) {
// 					position.push(corners[k][l])
// 					colors.push(0)
// 				}
// 			}
// 		}
// 	}
// }

// for (let i = x; i <= x+1; i++) {
// 	for(let i1=1; i1<=1; i1++){
// 		let idx1 = 1;
// 		let idx2 = 0;
// 		for (let j = 0; j < 3; j++) {
// 			let id1 = j;
// 			let id2 = (j + 1) % 3;
// 			let corners = []
// 			corners.push(triangles[i][id1][idx1])
// 			corners.push(triangles[i][id1][idx2])
// 			corners.push(triangles[i][id2][idx2])
// 			corners.push(triangles[i][id2][idx1])
// 			for (let k of indices) {
// 				for (let l = 0; l < 3; l++) {
// 					position.push(corners[k][l])
// 					colors.push(0)
// 				}
// 			}
// 		}
// 	}
// }




// const position = [
//   // left column
//   0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0,

//   // top rung front
//   30, 0, 0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0,

//   // middle rung front
//   30, 60, 0, 67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0,

//   // left column back
//   0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

//   // top rung back
//   30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

//   // middle rung back
//   30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

//   // top
//   0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

//   // top rung right
//   100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

//   // under top rung
//   30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

//   // between top rung and middle
//   30, 30, 0, 30, 30, 30, 30, 60, 30, 30, 30, 0, 30, 60, 30, 30, 60, 0,

//   // top of middle rung
//   30, 60, 0, 30, 60, 30, 67, 60, 30, 30, 60, 0, 67, 60, 30, 67, 60, 0,

//   // right of middle rung
//   67, 60, 0, 67, 60, 30, 67, 90, 30, 67, 60, 0, 67, 90, 30, 67, 90, 0,

//   // bottom of middle rung.
//   30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

//   // right of bottom
//   30, 90, 0, 30, 90, 30, 30, 150, 30, 30, 90, 0, 30, 150, 30, 30, 150, 0,

//   // bottom
//   0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

//   // left side
//   0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
// ];
const transformationProps = {
	translation: [0, 0, 0],
	rotation: [
		Converter.degToRad(0),
		Converter.degToRad(0),
		Converter.degToRad(0),
	],
	scale: [1, 1, 1],
};
// const colors = [
//   // left column front
//   200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
//   120,

//   // top rung front
//   200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
//   120,

//   // middle rung front
//   200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70,
//   120,

//   // left column back
//   80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

//   // top rung back
//   80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

//   // middle rung back
//   80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

//   // top
//   70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200,
//   210,

//   // top rung right
//   200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200,
//   200, 70,

//   // under top rung
//   210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
//   100, 70,

//   // between top rung and middle
//   210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210,
//   160, 70,

//   // top of middle rung
//   70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180,
//   210,

//   // right of middle rung
//   100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,
//   210,

//   // bottom of middle rung.
//   76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210,
//   100,

//   // right of bottom
//   140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140,
//   210, 80,

//   // bottom
//   90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130,
//   110,

//   // left side
//   160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
//   160, 160, 220,
// ];

// console.log(position)

const webgl2 = new WebGL2Handler(document.querySelector('canvas')).init();
const renderSettings = {
	primitiveType: webgl2.getGl().TRIANGLES,
	drawCounter: 16 * 2 * 3,
};

const eventHandler = {
	updatePosition(index) {
		return (event, value) => {
			transformationProps.translation[index] = value;
			webgl2.clearBuffer().render(renderSettings, transformationProps);
		};
	},

	updateRotation(index) {
		return (event, value) => {
			const angleInDegrees = value;
			const angleInRadians = Converter.degToRad(angleInDegrees);
			transformationProps.rotation[index] = angleInRadians;
			webgl2.clearBuffer().render(renderSettings, transformationProps);
		};
	},

	updateScale(index) {
		return (event, value) => {
			transformationProps.scale[index] = value;
			webgl2.clearBuffer().render(renderSettings, transformationProps);
		};
	},
};

UIHandler.initSlider('#tx', {
	initialValue: transformationProps.translation[0],
	handlerFn: eventHandler.updatePosition(0),
});

UIHandler.initSlider('#ty', {
	initialValue: transformationProps.translation[1],
	handlerFn: eventHandler.updatePosition(1),
});

UIHandler.initSlider('#tz', {
	initialValue: transformationProps.translation[2],
	handlerFn: eventHandler.updatePosition(2),
});

UIHandler.initSlider('#rx', {
	initialValue: transformationProps.rotation[0],
	handlerFn: eventHandler.updateRotation(0),
});

UIHandler.initSlider('#ry', {
	initialValue: transformationProps.rotation[1],
	handlerFn: eventHandler.updateRotation(1),
});

UIHandler.initSlider('#rz', {
	initialValue: transformationProps.rotation[2],
	handlerFn: eventHandler.updateRotation(2),
});

UIHandler.initSlider('#sx', {
	initialValue: transformationProps.scale[0],
	handlerFn: eventHandler.updateScale(0),
});

UIHandler.initSlider('#sy', {
	initialValue: transformationProps.scale[1],
	handlerFn: eventHandler.updateScale(1),
});

UIHandler.initSlider('#sz', {
	initialValue: transformationProps.scale[2],
	handlerFn: eventHandler.updateScale(2),
});
console.log(position, colors)
webgl2
	.clearBuffer()
	.setPosition(position)
	.setColor(colors)
	.render(renderSettings, transformationProps);
