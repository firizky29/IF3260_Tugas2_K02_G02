import Matrix from './utils/classes/Matrix.js';
import MatrixOp from './utils/MatrixOp.js';

const m1 = new Matrix(3, 3, [
  [1, 2, 3],
  [4, 5, 6],
  [1, 2, 3],
]);

const m2 = new Matrix(3, 3, [
  [3, 2, 1],
  [6, 4, 3],
  [1, 2, 3],
]);

console.log(MatrixOp.multiply(m1, m2));
