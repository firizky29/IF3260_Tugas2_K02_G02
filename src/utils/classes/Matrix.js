export default class Matrix {
  constructor(rows, cols, data) {
    this._rows = rows;
    this._cols = cols;
    this._data = data;
  }

  getRows() {
    return this._rows;
  }

  getCols() {
    return this._cols;
  }

  getData() {
    return this._data;
  }

  getPropsToObj() {
    return {
      rows: this._rows,
      cols: this._cols,
      data: this._data,
    };
  }

  setData(data) {
    this._data = data;
  }

  flatten() {
    const flattenMatrix = [];
    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._cols; j++) {
        flattenMatrix.push(this._data[i][j]);
      }
    }

    return flattenMatrix;
  }
}
