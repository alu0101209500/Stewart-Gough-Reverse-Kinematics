const DEG = Math.PI/180

function createModel(rbase, rplatform, anglebase, angleplatform, x, y, z, alfa, beta, gamma) {
    console.log(rbase);
    console.log(rplatform);
    console.log(anglebase);
    console.log(angleplatform);
    console.log(x);
    console.log(y);
    console.log(z);
    console.log(alfa);
    console.log(beta);
    console.log(gamma);
    let bpR = [
        [(Math.cos(DEG*alfa) * Math.cos(DEG*beta)), (Math.cos(DEG*alfa)*Math.sin(DEG*beta)*Math.sin(DEG*gamma) - Math.sin(DEG*alfa)*Math.cos(DEG*gamma)), (Math.cos(DEG*alfa)*Math.sin(DEG*beta)*Math.cos(DEG*gamma) + Math.sin(DEG*alfa)*Math.sin(DEG*gamma))],
        [(Math.sin(DEG*alfa) * Math.cos(DEG*beta)), (Math.sin(DEG*alfa)*Math.sin(DEG*beta)*Math.sin(DEG*gamma) + Math.cos(DEG*alfa)*Math.cos(DEG*gamma)), (Math.sin(DEG*alfa)*Math.sin(DEG*beta)*Math.cos(DEG*gamma) - Math.cos(DEG*alfa)*Math.sin(DEG*gamma))],
        [(-Math.sin(DEG*beta)), (Math.cos(DEG*beta)*Math.sin(DEG*gamma)), (Math.cos(DEG*beta)*Math.cos(DEG*gamma))]
    ]

    let bbase = definePlatform(rbase, anglebase);
    let pplat = definePlatform(rplatform, angleplatform);

    let bx = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    let bplat = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    let bp = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
    let l = [];

    for(let i = 0; i < 6; i++) {
        bx[i] = [x - bbase[i][0], y - bbase[i][1], z];
        bplat[i] = [(bpR[0][0]*pplat[i][0] + bpR[0][1]*pplat[i][1]), (bpR[1][0]*pplat[i][0] + bpR[1][1]*pplat[i][1]), (bpR[2][0]*pplat[i][0] + bpR[2][1]*pplat[i][1])]
    }

    for(let i = 0; i < 6; i++) {
        l.push(Math.sqrt( Math.pow((bx[i][0] + bplat[i][0]), 2) + Math.pow((bx[i][1] + bplat[i][1]), 2) + Math.pow((bx[i][2] + bplat[i][2]), 2) ));
        bp[i] = [x + bplat[i][0], y + bplat[i][1], z + bplat[i][2]];
    }

    return {
        base: bbase,
        platform: bp,
        l: l
    }
}

function definePlatform(r, angle) {
    let result = [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]];
    let angles = [0, 0, 0, 0, 0, 0];
    for(let i = 0; i < 6; i++) {
        if(i%2 == 0){
            angles[i] = 60*(i+1) - (angle/2);
        } else {
            angles[i] = angles[i-1] + angle;
        }
    }
    for(let i = 0; i < 6; i++) {
        result[i][0] = r*Math.cos(DEG*angles[i]);
        result[i][1] = r*Math.sin(DEG*angles[i]);   
    }

    return result;
}