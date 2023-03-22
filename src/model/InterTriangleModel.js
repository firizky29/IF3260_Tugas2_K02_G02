import MathOp from "../utils/MathOp.js";
import Render from "../utils/Render.js";

class InterTriangle {
	constructor(oRadius = 1.0, cornerW = 0.05, cornerH = 0.15) {
		this._oRadius = oRadius;
		this._cornerW = cornerW;
		this._cornerH = cornerH;
		// const red = [255, 0, 0];
		const color = [255, 255, 255];
		this._triangles = [[], [], [], []]
		this._triangleColors = [color, color, color, color];
	}

	init() {
		this.genTriangles()
		return this
	}

	setOpt(opt){
		if(opt.oRadius) this._oRadius = opt.oRadius
		if(opt.cornerW) this._cornerW = opt.cornerW
		if(opt.cornerH) this._cornerH = opt.cornerH
		this.genTriangles()
	}

	genTriangles() {
		const octaHedron = [
			[0, this._oRadius, 0],
			[0, 0, -this._oRadius],
			[this._oRadius, 0, 0],
			[0, 0, this._oRadius],
			[-this._oRadius, 0, 0],
			[0, -this._oRadius, 0]
		]
		let upperMid = [], lowerMid = [], middleMid = []
		const upper = octaHedron[0]
		const lower = octaHedron[5]
		for (let i = 1; i < 5; i++) {
			const currentUpper = MathOp.pivot([upper, octaHedron[i]]);
			const currentLower = MathOp.pivot([lower, octaHedron[i]]);
			const currentMiddle = MathOp.pivot([octaHedron[i], octaHedron[(i % 4) + 1]]);

			upperMid.push(currentUpper)
			lowerMid.push(currentLower)
			middleMid.push(currentMiddle)
		}

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

			// find direction of width
			const normal = MathOp.triangleNormal(corners[0], corners[1], corners[2])
			let dirW = []
			for (let j = 0; j < 3; j++) {
				dirW.push(normal)
			}

			let OX = []
			let dirH = []
			const trianglePivot = MathOp.pivot(corners)
			for (let j = 0; j < 3; j++) {
				OX.push(MathOp.normalize(MathOp.subtract(corners[j], trianglePivot)))
			}
			for (let j = 0; j < 3; j++) {
				dirH.push(OX[j])
			}

			const dw = [1, 1, -1, -1]
			const dh = [1, -1, -1, 1]
			for (let j = 0; j < 3; j++) {
				let cornerRect = []
				for (let k = 0; k < 4; k++) {
					let corner = corners[j]
					const directionW = MathOp.multiplyByScalar(dirW[j], dw[k] * this._cornerW)
					const directionH = MathOp.multiplyByScalar(dirH[j], dh[k] * this._cornerH)

					corner = MathOp.add(corner, directionW)
					corner = MathOp.add(corner, directionH)

					cornerRect.push(corner)
				}
				this._triangles[i].push(cornerRect)
			}
		}
	}

	getModel() {
		let vertices = []
		let colors = []
		let normals = []
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				let idx1 = j;
				let idx2 = (j + 3) % 4;
				for (let k = 0; k < 3; k++) {
					let id1 = k;
					let id2 = (k + 1) % 3;
					let corners = []
					corners.push(this._triangles[i][id1][idx1])
					corners.push(this._triangles[i][id1][idx2])
					corners.push(this._triangles[i][id2][idx2])
					corners.push(this._triangles[i][id2][idx1])
					Render.rectangle(vertices, colors, normals, corners, this._triangleColors[i])
				}
			}
		}

		return {
			vertices: vertices,
			colors: colors,
			normals: normals
		}
	}
}


export default new InterTriangle().init().getModel()




