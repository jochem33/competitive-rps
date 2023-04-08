// initialize some vars
let oldMouseX = 0
let oldMouseY = 0

let screenW = window.innerWidth
let screenH = window.innerHeight


// create the canvas
function setup() {
    let canvasHeight = screenH * 0.7
    let canvasWidth = screenH
    let renderer = createCanvas(canvasWidth, canvasHeight)
    renderer.parent(document.getElementById("canvasContainer"))
}



// function for drawing the lines
function draw() {
    background(255)

    for(let i = 0; i < lines.length; i++){
        line(lines[i].oldX, lines[i].oldY, lines[i].x, lines[i].y)
    }
}


// save startpoint of line segment
function mousePressed() {
    if(drawingEnabled) {
        console.log("mouse Pressed")
        oldMouseX = mouseX
        oldMouseY = mouseY
    }
}


// funtion for saving a linesegment and starting a new one
function mouseDragged() {
    if(drawingEnabled) {
        let newLine = {
            oldX: oldMouseX,
            oldY: oldMouseY,
            x: mouseX,
            y: mouseY
        }
        lines.push(newLine)

        socket.emit("addLine", newLine)

        oldMouseX = mouseX
        oldMouseY = mouseY
    }
}



function clearCanvas(){
    lines = []
}