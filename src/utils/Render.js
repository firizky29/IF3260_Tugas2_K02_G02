const Render = {
    rectangle(vertices, colors, corners, rectColor){
        // corners are defined counter clock-wise
        const indices = [0, 1, 2, 0, 2, 3]
        for (let i of indices) {
            for (let j = 0; j < 3; j++) {
                vertices.push(corners[i][j])
                colors.push(rectColor[j])
            }
        }
    }
}

export default Render