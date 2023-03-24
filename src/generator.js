import * as fs from 'fs';
import InterTriangle from './model/InterTriangleModel.js';
import CubeModel from './model/CubeModel.js';

const data = JSON.stringify(CubeModel, null, '\t').replace(
  /(\[[\d.\-,e\n\s]+\])/g,
  (match) => {
    return match
      .replace(/\s*,\s*/g, ',')
      .trim()
      .split(',')
      .reduce((prev, curr, index) => {
        return index % 3 === 0 && index !== 0
          ? prev + ',\n\t\t' + curr
          : prev + ', ' + curr;
      });
  }
);

// Write data in 'interlocked-triangle.json' .
fs.writeFile('../test/cube.json', data, (err) => {
  if (err) {
    console.log(err);
  }
});
