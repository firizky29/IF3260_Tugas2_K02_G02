import * as fs from 'fs';
import InterTriangle from './model/InterTriangleModel.js';


const data = JSON.stringify(InterTriangle, null, '\t')
    .replace(/(\[[\d.\-,\n\s]+\])/g, (match) => {
        return match.replace(/\s*,\s*/g, ",").trim().split(",").reduce((prev, curr, index) => {
            return index % 3 === 0 && index !== 0 ? prev + ",\n\t\t" + curr : prev + ", " + curr;
        });
    });

// Write data in 'interlocked-triangle.json' .
fs.writeFile('test/interlocked-triangle.json', data, (err) => {
    if (err) {
        console.log(err);
    }
})