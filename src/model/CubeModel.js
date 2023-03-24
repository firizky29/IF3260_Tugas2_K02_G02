import Matrix from '../utils/classes/Matrix.js';
import Converter from '../utils/Converter.js';
import Rotation3D from '../utils/Rotation3D.js';

class CubeModel {
  constructor(center, outerRadiusDistance, innerRadiusDistance) {
    this._center = center || [0, 0, 0]; // arr of [x,y,z]
    this._outerRadiusDistance = outerRadiusDistance || [0.5, 0.5, 0.5];
    this._innerRadiusDistance = innerRadiusDistance || [0.4, 0.4, 0.4]; // array of [x,y,z]
    this._totalVertices = 3 * 2 * 4 * 12;
    this._listVertices = [];
    this._listColors = [];
    this._listNormals = [];

    this._generateModel();
  }

  setOuterRadiusDistance(outerRadiusDistance) {
    this._outerRadiusDistance = outerRadiusDistance;
    return this;
  }

  setInnerRadiusDistance(innerRadiusDistance) {
    this._innerRadiusDistance = innerRadiusDistance;
    return this;
  }

  getModel() {
    return {
      vertices: this._listVertices,
      colors: this._listColors,
      normals: this._listNormals,
    };
  }

  _generateModel() {
    const [centerX, centerY, centerZ] = this._center;
    const [innerRadX, innerRadY, innerRadZ] = this._innerRadiusDistance;
    const [outerRadX, outerRadY, outerRadZ] = this._outerRadiusDistance;

    const frontBottomFace = {
      topLeft: [centerX - innerRadX, centerY - innerRadY, centerZ + outerRadZ],
      bottomLeft: [
        centerX - outerRadX,
        centerY - outerRadY,
        centerZ + outerRadZ,
      ],
      bottomRight: [
        centerX + outerRadX,
        centerY - outerRadY,
        centerZ + outerRadZ,
      ],
      topRight: [centerX + innerRadX, centerY - innerRadY, centerZ + outerRadZ],
    };

    const backBottomInnerFace = {
      topLeft: [centerX - innerRadX, centerY - innerRadY, centerZ - innerRadZ],
      bottomLeft: [
        centerX - innerRadX,
        centerY - outerRadY,
        centerZ - innerRadZ,
      ],
      bottomRight: [
        centerX + innerRadX,
        centerY - outerRadY,
        centerZ - innerRadZ,
      ],
      topRight: [centerX + innerRadX, centerY - innerRadY, centerZ - innerRadZ],
    };

    const blueprintArrVertices = [
      frontBottomFace.topLeft,
      frontBottomFace.bottomLeft,
      frontBottomFace.bottomRight,
      frontBottomFace.bottomRight,
      frontBottomFace.topRight,
      frontBottomFace.topLeft,
      backBottomInnerFace.topLeft,
      backBottomInnerFace.bottomLeft,
      backBottomInnerFace.bottomRight,
      backBottomInnerFace.bottomRight,
      backBottomInnerFace.topRight,
      backBottomInnerFace.topLeft,
    ];

    const blueprintArrNormals = [];
    for (let _ in blueprintArrVertices) {
      blueprintArrNormals.push([0, 0, 1]);
    }

    const blueprintMatrix = {
      vertices: new Matrix(12, 3, blueprintArrVertices),
      normals: new Matrix(12, 3, blueprintArrNormals),
    };

    const fullfaceBlueprintMatrix = this._createModelFromBlueprint(
      blueprintMatrix,
      Rotation3D.transform.zRotate
    );

    const completeModel = [];
    for (let matrix of fullfaceBlueprintMatrix) {
      completeModel.push(
        ...this._createModelFromBlueprint(matrix, Rotation3D.transform.yRotate)
      );
    }

    for (let matrix of fullfaceBlueprintMatrix) {
      completeModel.push(
        ...this._createModelFromBlueprint(
          matrix,
          Rotation3D.transform.xRotate,
          {
            angleInDeg: 90,
            start: 1,
            end: 1,
          }
        )
      );
      completeModel.push(
        ...this._createModelFromBlueprint(
          matrix,
          Rotation3D.transform.xRotate,
          {
            angleInDeg: -90,
            start: 1,
            end: 1,
          }
        )
      );
    }

    for (let component of completeModel) {
      for (let el of component.vertices.flatten()) {
        this._listVertices.push(el);
      }
      for (let el of component.normals.flatten()) {
        this._listNormals.push(el);
      }
    }

    for (let _ in this._listVertices) {
      this._listColors.push(255);
    }

    return this;
  }

  _createModelFromBlueprint(blueprintMatrix, rotateFn, opt = {}) {
    const { angleInDeg = 90, start = 0, end = 3 } = opt;

    let fullModel = [];
    for (let i = start; i <= end; i++) {
      const modelVertices = rotateFn(
        blueprintMatrix.vertices,
        Converter.degToRad(angleInDeg * i)
      );
      const modelNormals = rotateFn(
        blueprintMatrix.normals,
        Converter.degToRad(angleInDeg * i)
      );

      fullModel.push({
        vertices: modelVertices,
        normals: modelNormals,
      });
    }

    return fullModel;
  }
}

export default new CubeModel().getModel();
