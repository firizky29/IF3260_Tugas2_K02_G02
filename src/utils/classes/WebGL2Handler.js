import CONFIG from '../../global/config.js';
import MatrixOp from '../MatrixOp.js';
import { Transform, TransformationMatrix4D } from '../Transformation4D.js';

export default class WebGL2Handler {
  constructor(canvas) {
    this._canvas = canvas;
    this._gl = this._canvas.getContext('webgl2');
    this._glComponent = {};
  }

  init() {
    const vertexShader = this._createShader(
      this._gl.VERTEX_SHADER,
      CONFIG.VERTEX_SHADER
    );
    const fragmentShader = this._createShader(
      this._gl.FRAGMENT_SHADER,
      CONFIG.FRAGMENT_SHADER
    );

    this._glComponent.program = this._createProgram(
      vertexShader,
      fragmentShader
    );

    this._gl.enable(this._gl.DEPTH_TEST); // enabled by default, but let's be SURE.

    this._glComponent.vertexBuffer = this._gl.createBuffer();

    this._glComponent.colorBuffer = this._gl.createBuffer();

    this._glComponent.normalBuffer = this._gl.createBuffer();
    this._glComponent.camIndicesBuffer = this._gl.createBuffer();
    this._glComponent.camPositionBuffer = this._gl.createBuffer();

    this._gl.useProgram(this._glComponent.program);
    return this;
  }

  setVertices(vertices) {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this._gl.STATIC_DRAW
    );

    return this;
  }

  setColors(colors) {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Uint8Array(colors),
      this._gl.STATIC_DRAW
    );

    return this;
  }

  setNormals(normals) {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(normals),
      this._gl.STATIC_DRAW
    );

    return this;
  }

  getGl() {
    return this._gl;
  }

  clearBuffer() {
    this._gl.clearColor(0, 0, 0, 1.0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    return this;
  }

  render(settings, state) {
    const positionAttributeLocation = this._gl.getAttribLocation(
      this._glComponent.program,
      'a_position'
    );

    const colorAttributeLocation = this._gl.getAttribLocation(
      this._glComponent.program,
      'a_color'
    );

    const normalAttributeLocation = this._gl.getAttribLocation(
      this._glComponent.program,
      'a_normal'
    );

    const matrixLocation = this._gl.getUniformLocation(
      this._glComponent.program,
      'modelView'
    );

    const projectionMatrixLocation = this._gl.getUniformLocation(
      this._glComponent.program,
      'projection'
    );

    const normalMatrixLocation = this._gl.getUniformLocation(
      this._glComponent.program,
      'normalMat'
    );

    const useLighting = this._gl.getUniformLocation(
      this._glComponent.program,
      'useLighting'
    );

    const fudgeFactor = this._gl.getUniformLocation(
      this._glComponent.program,
      'fudgeFactor'
    );

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

    const {
      size = 3,
      type = this._gl.FLOAT,
      normalize = false,
      stride = 0,
      offset = 0,
      primitiveType,
      drawCounter,
    } = settings;

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.vertexBuffer);

    this._gl.enableVertexAttribArray(positionAttributeLocation);
    this._gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.colorBuffer);

    this._gl.enableVertexAttribArray(colorAttributeLocation);
    this._gl.vertexAttribPointer(
      colorAttributeLocation,
      size,
      this._gl.UNSIGNED_BYTE,
      true,
      stride,
      offset
    );

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.normalBuffer);

    this._gl.enableVertexAttribArray(normalAttributeLocation);
    this._gl.vertexAttribPointer(
      normalAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    let matrix = TransformationMatrix4D.projection(
      this._gl.canvas.clientWidth,
      this._gl.canvas.clientHeight,
      400
    );
    matrix = Transform.translate(matrix, ...state.translation);
    matrix = Transform.xRotate(matrix, state.rotation[0]);
    matrix = Transform.yRotate(matrix, state.rotation[1]);
    matrix = Transform.zRotate(matrix, state.rotation[2]);
    matrix = Transform.scale(matrix, ...state.scale);

    const projectionMatrix = TransformationMatrix4D.projection(
      state.projectionType,
      state.obliqueTetha,
      state.obliquePhi
    );

    const normalMatrix = MatrixOp.copy(matrix).invert().transpose();

    this._gl.uniformMatrix4fv(matrixLocation, false, matrix.flatten());
    this._gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      projectionMatrix.flatten()
    );
    this._gl.uniformMatrix4fv(
      normalMatrixLocation,
      false,
      normalMatrix.flatten()
    );

    this._gl.uniform1i(useLighting, state.useLighting);
    this._gl.uniform1f(fudgeFactor, state.fudgeFactor);

    this._gl.drawArrays(primitiveType, offset, drawCounter);
  }

  _createShader(type, source) {
    const shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);

    const isSuccess = this._gl.getShaderParameter(
      shader,
      this._gl.COMPILE_STATUS
    );

    if (!isSuccess) {
      console.error(this._gl.getShaderInfoLog(shader));
      this._gl.deleteShader(shader);
    }

    return shader;
  }

  _createProgram(vertexShader, fragmentShader) {
    const program = this._gl.createProgram();
    this._gl.attachShader(program, vertexShader);
    this._gl.attachShader(program, fragmentShader);
    this._gl.linkProgram(program);

    const isSuccess = this._gl.getProgramParameter(
      program,
      this._gl.LINK_STATUS
    );

    if (!isSuccess) {
      console.log(this._gl.getProgramInfoLog(program));
      this._gl.deleteProgram(program);
    }

    return program;
  }

  // prettier-ignore
  _createCameraBufferInfo(scale = 1) {
    const positions = [
      -1, -1, 1,  // cube vertices
      1, -1, 1,
      -1, 1, 1,
      1, 1, 1,
      -1, -1, 3,
      1, -1, 3,
      -1, 1, 3,
      1, 1, 3,
      0, 0, 1,  // cone tip
    ];

    const indices = [
      0, 1, 1, 3, 3, 2, 2, 0, // cube indices
      4, 5, 5, 7, 7, 6, 6, 4,
      0, 4, 1, 5, 3, 7, 2, 6,
    ];

    const numSegments = 6;
    const coneBaseIndex = positions.length / 3;
    const coneTipIndex = coneBaseIndex - 1;
    for (let i = 0; i < numSegments; ++i) {
      const u = i / numSegments;
      const angle = u * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      positions.push(x, y, 0);
      // line from tip to edge
      indices.push(coneTipIndex, coneBaseIndex + i);
      // line from point on edge to next point on edge
      indices.push(coneBaseIndex + i, coneBaseIndex + (i + 1) % numSegments);
    }

    positions.forEach((v, idx) => {
      positions[idx] *= scale;
    });

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.camPositionBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this._gl.STATIC_DRAW
    );

    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._glComponent.camIndicesBuffer);
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(indices),
      this._gl.STATIC_DRAW
    );
  }
}
