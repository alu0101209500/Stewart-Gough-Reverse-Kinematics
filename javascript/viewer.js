const cubeCoordinates = [[80,80,0],[-80,80,0],[-80,-80,0],[80,-80,0],[80,80,80],[-80,80,80],[-80,-80,80],[80,-80,80]]
const PERSPECTIVA = 500*0.8;
window.addEventListener('DOMContentLoaded', (_) => {
    let viewer = document.getElementById("viewer");
    viewer.width = 500;
    viewer.height = 500;
    let ctx = viewer.getContext("2d");
    let render = document.getElementById("render");
    let form = document.getElementById("params");

    renderIsCalled(form, ctx)

    form. addEventListener("change", (_) => {
        renderIsCalled(form, ctx);
    });
    render.addEventListener("click", (_) => {
        renderIsCalled(form, ctx);
    });
});

function renderIsCalled(form, ctx) {
    let inputvals = form.getElementsByTagName("input");
    let params = { 
        rbase: Number(inputvals[6].value), 
        rplatform: Number(inputvals[8].value), 
        anglebase: Number(inputvals[7].value), 
        angleplatform: Number(inputvals[9].value), 
        x: Number(inputvals[0].value),
        y: Number(inputvals[1].value),
        z: Number(inputvals[2].value), 
        alfa: Number(inputvals[5].value), 
        beta: Number(inputvals[4].value), 
        gamma: Number(inputvals[3].value)
    }
    renderModel(params, ctx)
}

//Función principal
function renderModel(params, ctx) {
    let origin = [250, 250];
    
    //Limpia el lienzo
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, viewer.width, viewer.height);
    ctx.strokeStyle = "red";
    ctx.strokeRect(0, 0, viewer.width-1, viewer.height-1);
    
    //Crea el modelo
    let model = createModel(Number(params.rbase), Number(params.rplatform), Number(params.anglebase), Number(params.angleplatform), Number(params.x), Number(params.y), Number(params.z), Number(params.alfa), Number(params.beta), Number(params.gamma));

    //Imprime el modelo
    drawModel(model, origin, ctx)
}

// Renderizado del modelo

function drawModel(model, origin, ctx) {
    let projectedModel = projectModel(model, origin, -80)
    //Trazado de la base
    drawShape(projectedModel.base, "red", true, ctx);
    
    //Trazado de los actuadores lineales
    
    ctx.beginPath()
    for(let i = 0; i < projectedModel.base.length; i++) {
        ctx.moveTo(projectedModel.base[i][0], projectedModel.base[i][1]);
        ctx.lineTo(projectedModel.platform[i][0], projectedModel.platform[i][1]);
       
    }
       
    ctx.strokeStyle = "green"
    ctx.stroke();

    //Etiquetado de los actuadores
    ctx.font = "16px Arial";
    ctx.fillStyle = "black"
    for(let i = 0; i < projectedModel.base.length; i++) {
        ctx.fillText("L"+ String(i+1), projectedModel.base[i][0], projectedModel.base[i][1] + 10)
    }
    
    //Trazado de la plataforma
    drawShape(projectedModel.platform, "red", true, ctx);

    //Impresión de medidas
    ctx.font = "14px Arial";
    ctx.fillStyle = "black"

    ctx.fillText("Medidas de los actuadores", 10, 390)

    
    for(let i = 0; i < projectedModel.base.length; i++) {
        ctx.fillText("L"+ String(i+1) + ": " + String(model.l[i]), 10, 406 + 16*i)
    }
}

function projectModel(model, origin, zCorrection) {
    projectedBase = [];
    projectedPlat = [];
    projectedBase.length = model.base.length;
    projectedPlat.length = model.platform.length;
    for(let i = 0; i < projectedBase.length; i++) {
        projectedBase[i] = [...model.base[i]];
        projectedBase[i][2] += zCorrection;
        projectedPlat[i] = [...model.platform[i]];
        projectedPlat[i][2] += zCorrection;

        projectedBase[i] = p(projectedBase[i], origin);
        projectedPlat[i] = p(projectedPlat[i], origin);
    }

    return {
        base: projectedBase,
        platform: projectedPlat,
        l: [...model.l]
    }
}

function p(point, origin) {   
    let scaleProjected = PERSPECTIVA / (PERSPECTIVA + point[1]);
    let xProjected = (point[0] * scaleProjected) + origin[0];
    let yProjected = (-point[2] * scaleProjected) + origin[1];
    
    return([xProjected, yProjected])
}

function drawPoints(points, color, size, ctx) {
    ctx.fillStyle = color
    for(let i = 0; i < points.length; i++) {
        ctx.fillRect(points[i][0] - size, points[i][1] - size, size, size);
    }
}

function drawShape(points, color, showPoints, ctx) {
    if(showPoints) {
        drawPoints(points, color, 2, ctx)
    }

// Relleno

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fillStyle = "rgba(11,3,252,0.5)";
    ctx.fill();

// Contorno

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.strokeStyle = color;
    ctx.stroke();

}
