const oRadius = 1.0;
const cornerW = 0.1;
const cornerH = 0.1;

const octaHedron = [
    [0, 0, oRadius],
    [oRadius, 0, 0],
    [0, oRadius, 0],
    [-oRadius, 0, 0],
    [0, -oRadius, 0],
    [0, 0, -oRadius]
]
let upperMid = [], lowerMid = [], middleMid = []
for(let i=1; i<5; i++){
    let upper = octaHedron[0]
    let lower = octaHedron[5]
    let currentUpper = [];
    let currentLower = [];
    let currentMiddle = [];
    for(let j=0; j<3; j++){
        currentUpper.push((upper[j]+octaHedron[i][j])/2)
        currentLower.push((lower[j]+octaHedron[i][j])/2)
        currentMiddle.push((octaHedron[i][j]+octaHedron[(i%4)+1][j])/2)
    }
    upperMid.push(currentUpper)
    lowerMid.push(currentLower)
    middleMid.push(currentMiddle)
}

let triangles = [[], [], [], []]
for(let i=0; i<4; i++){
    let corners = []
    corners.push(upperMid[i])
    corners.push(middleMid[(i+2)%4])
    corners.push(lowerMid[(i+3)%4])

    // direction of width adalah vector normal dari segitiga
    // direction of height adalah vector OX, O adalah origin, X adalah titik sudut segitiga

    // cari normal vector dari segitiga
    let u = [], v = []
    for(let j=0; j<3; j++){
        u.push(corners[0][j]-corners[1][j])
        v.push(corners[2][j]-corners[1][j])
    }
    let normal = []
    normal.push(u[1]*v[2]-u[2]*v[1])
    normal.push(u[2]*v[0]-u[0]*v[2])
    normal.push(u[0]*v[1]-u[1]*v[0])

    // normilize normal vector
    let normalLength = Math.sqrt(normal[0]*normal[0]+normal[1]*normal[1]+normal[2]*normal[2])
    let dirWidth = [[], [], []]
    for(let j=0; j<3; j++){
        for(let k=0; k<3; k++){
            dirWidth[j].push(normal[k]/normalLength)
        }
    }

    let dirHeight = [[], [], []]
    let mid = []
    for(let j=0; j<3; j++){
        mid.push((corners[0][j]+corners[1][j]+corners[2][j])/3)
    }
    let dirY = [[], [], []]
    for(let j=0; j<3; j++){
        for(let k=0; k<3; k++){
            dirY[j].push(corners[j][k]-mid[k])
        }
    }
    // console.log(dirY)
    for(let j=0; j<3; j++){
        let length = Math.sqrt(dirY[j][0]*dirY[j][0]+dirY[j][1]*dirY[j][1]+dirY[j][2]*dirY[j][2])
        for(let k=0; k<3; k++){
            dirHeight[j].push(dirY[j][k]/length)
        }
    }

    for(let j=0; j<3; j++){
        let dx = [1, 1, -1, -1]
        let dy = [1, -1, -1, 1]
        let cornerRect = []
        for(let k=0; k<4; k++){
            let corner = []
            for(let l=0; l<3; l++){
                corner.push(corners[j][l]+dx[k]*cornerW*dirWidth[j][l]+dy[k]*cornerH*dirHeight[j][l])
            }
            cornerRect.push(corner)
        }
        triangles[i].push(cornerRect)
    }
}

let position = []
let colors = []
for(let i=0; i<4; i++){
    for(let j=0; j<3; j++){
        // console.log(triangles[i][j])
        for(let k=0; k<3; k++){
            for(let l=0; l<3; l++){
                position.push(triangles[i][j][k][l])
            }
        }
        for(let k=2; k>=1; k--){
            for(let l=0; l<3; l++){
                position.push(triangles[i][j][k][l])
            }
        }

        for(let k=0; k<3; k++){
            position.push(triangles[i][j][3][k])
        }
        
        let color = []
        for(let k=0; k<3; k++){
            color.push(Math.round(Math.random()*255))
        }
        for(let k=0; k<6; k++){
            for(let l=0; l<3; l++){
                colors.push(color[l])
            }
        }
    }
}



