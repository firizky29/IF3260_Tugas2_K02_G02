import CONFIG from '../../global/config.js';
import CameraOp from '../CameraOp.js';
import Converter from '../Converter.js';
import MatrixOp from '../MatrixOp.js';
import Matrix from './Matrix.js';
import { Transform, TransformationMatrix4D } from '../Transformation4D.js';

export default class WebGL2Handler {
  constructor(canvas) {
    this._canvas = canvas;
    this._gl = this._canvas.getContext('webgl2');
    this._glComponent = {};
  }

  init() {
    const shadersConfig = [
      {
        type: this._gl.VERTEX_SHADER,
        source: CONFIG.VERTEX_SHADER,
      },
      {
        type: this._gl.FRAGMENT_SHADER,
        source: CONFIG.FRAGMENT_SHADER,
      },
    ];
    const buffers = [
      'vertexBuffer',
      'normalBuffer',
      'colorBuffer',
      'camPositionBuffer',
      'camIndicesBuffer',
    ];

    this._glComponent.program = this._createProgram(shadersConfig);

    this._createBuffers(buffers);

    this._gl.enable(this._gl.DEPTH_TEST); // enabled by default, but let's be SURE.

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

    // Camera properties
    const aspect = 1;
    const near = 0.5;
    const far = 5;
    const radius = state.cameraRadius;

    const camSettings = {
      camFieldOfView: 70,
      camRotation: state.cameraRotation,
    };

    let worldMatrix = TransformationMatrix4D.yRotation(camSettings.camRotation);

    const target = new Matrix(1, 3, [[0, 0, 0]]);
    const up = new Matrix(1, 3, [[0, 1, 0]]);
    let cameraMatrix = TransformationMatrix4D.yRotation(
      camSettings.camRotation
    );
    cameraMatrix = Transform.translate(cameraMatrix, 0, 0, radius * 1.5);
    let cameraObjData = cameraMatrix.getPropsToObj().data;

    const cameraPos = new Matrix(1, 3, [
      [cameraObjData[3][0], cameraObjData[3][1], cameraObjData[3][2]],
    ]);

    cameraMatrix = CameraOp.lookAt(cameraPos, target, up);

    const viewMatrix = cameraMatrix.invert();
    // -----------------------

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);

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
    let projectionMatrix = TransformationMatrix4D.projection(
      state.projectionType,
      state.obliqueTetha,
      state.obliquePhi
    );

    if (state.projectionType === 'perspective') {
      let perspectiveProjectionMatrix = CameraOp.perspective(
        Converter.degToRad(camSettings.camFieldOfView),
        aspect,
        near,
        far
      );

      projectionMatrix = MatrixOp.multiply(
        viewMatrix,
        perspectiveProjectionMatrix
      );

      projectionMatrix = Transform.scale(projectionMatrix, -1, 1, 1);
    }

    projectionMatrix = MatrixOp.multiply(worldMatrix, projectionMatrix);

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

    console.log(drawCounter)

    this._gl.drawArrays(primitiveType, offset, drawCounter);
  }

  renderAnimation(settings, state) {
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

    // Camera properties
    const aspect = 1;
    const near = 0.5;
    const far = 5;
    const radius = state.cameraRadius;

    const camSettings = {
      camFieldOfView: 70,
      camRotation: state.cameraRotation,
    };

    let worldMatrix = TransformationMatrix4D.yRotation(camSettings.camRotation);

    const target = new Matrix(1, 3, [[0, 0, 0]]);
    const up = new Matrix(1, 3, [[0, 1, 0]]);
    let cameraMatrix = TransformationMatrix4D.yRotation(
      camSettings.camRotation
    );
    cameraMatrix = Transform.translate(cameraMatrix, 0, 0, radius * 1.5);
    let cameraObjData = cameraMatrix.getPropsToObj().data;

    const cameraPos = new Matrix(1, 3, [
      [cameraObjData[3][0], cameraObjData[3][1], cameraObjData[3][2]],
    ]);

    cameraMatrix = CameraOp.lookAt(cameraPos, target, up);

    const viewMatrix = cameraMatrix.invert();
    // -----------------------

    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);

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

    var rotation = [Converter.degToRad(190), Converter.degToRad(40), Converter.degToRad(320)];
    var rotationSpeed = 1.2;

    drawScene();

    function drawScene() {
      rotation[1] += rotationSpeed / 60.0;
      matrix = Transform.translate(matrix, ...state.translation);
      matrix = Transform.xRotate(matrix, rotation[0]);
      matrix = Transform.yRotate(matrix, rotation[1]);
      matrix = Transform.zRotate(matrix, rotation[2]);
      matrix = Transform.scale(matrix, ...state.scale);
      let projectionMatrix = TransformationMatrix4D.projection(
        state.projectionType,
        state.obliqueTetha,
        state.obliquePhi
      );
  
      if (state.projectionType === 'perspective') {
        let perspectiveProjectionMatrix = CameraOp.perspective(
          Converter.degToRad(camSettings.camFieldOfView),
          aspect,
          near,
          far
        );
  
        projectionMatrix = MatrixOp.multiply(
          viewMatrix,
          perspectiveProjectionMatrix
        );
  
        projectionMatrix = Transform.scale(projectionMatrix, -1, 1, 1);
      }
  
      projectionMatrix = MatrixOp.multiply(worldMatrix, projectionMatrix);
  
      const normalMatrix = MatrixOp.copy(matrix).invert().transpose();
  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);
      WebGL2Handler._gl.uniformMatrix4fv(matrixLocation, false, matrix.flatten());
      WebGL2Handler._gl.uniformMatrix4fv(
        projectionMatrixLocation,
        false,
        projectionMatrix.flatten()
      );
      WebGL2Handler._gl.uniformMatrix4fv(
        normalMatrixLocation,
        false,
        normalMatrix.flatten()
      );
  
      WebGL2Handler._gl.uniform1i(useLighting, state.useLighting);
      WebGL2Handler._gl.uniform1f(fudgeFactor, state.fudgeFactor);
  
      WebGL2Handler._gl.drawArrays(primitiveType, offset, drawCounter);

      // Call drawScene again next frame
      requestAnimationFrame(drawScene);
    }
    
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

  _createProgram(shadersConfig) {
    const program = this._gl.createProgram();
    for (let shaderConfig of shadersConfig) {
      const shader = this._createShader(shaderConfig.type, shaderConfig.source);
      this._gl.attachShader(program, shader);
    }
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

  _createBuffers(buffers) {
    for (let buffer of buffers) {
      this._glComponent[buffer] = this._gl.createBuffer();
    }
  }

  _draw(projectionMatrix, worldMatrix, viewMatrix) {}
}
