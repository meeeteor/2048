/**
 * STRUCTURE:
 * 
 * JSON
 * CANVAS INITIALISATION
 * VARIABLES AND CONSTANTS
 * EVENTLISTENERS
 * OBJECTS
 * FUNCTIONS
 * INIT
 */

//////JSON//////
function loadJSON(callback){
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'colors.json', true);
    xobj.onreadystatechange = function () {
        if(xobj.readyState == 4 && xobj.status == "200"){
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

let colorData = new Array();
loadJSON(function (response) {
    colorData = JSON.parse(response);
});


//////CANVAS INIT//////
let canvas = document.getElementById('myCanvas');
const WIDTH = canvas.width = 500;
const HEIGHT = canvas.height = WIDTH;
let c = canvas.getContext('2d');

//////VARIABLES AND CONSTANTS//////
//constants
const CELLSIZE = canvas.width/4;
//variables
let beginValues = [
    [0, 8, 0, 0],
    [4, 0, 0, 0],
    [2, 8, 2, 0],
    [0, 16, 2, 0]
]

let currentScreen = [
    [],
    [],
    [],
    []
];

let history = new Array();
let timesUndone = 0;
//////EVENT LISTENERS//////
window.addEventListener('keydown', (event) => {
    if(event.repeat){return};
    switch (event.key) {
        case "ArrowUp":
            addToHistory();
            console.log('up');
            for(let k=0;k<3;k++){
                for(let i=0;i<4;i++){
                    for(let j=0;j<4;j++){
                        if(k===0 || k===2) currentScreen[i][j].compress('up');
                        if(k===1) currentScreen[i][j].merge('up');
                    }
                }
            }
            {let screenChanged = false;
            for(let i=0;i<4;i++){
                for(let j=0;j<4;j++){
                    if(currentScreen[i][j].val !== history[history.length-1][i][j]) screenChanged = true;
                }
            }
            if(screenChanged) newNumber();}
            break;
        case "ArrowDown":
            addToHistory();
            console.log('down');
            for(let k=0;k<3;k++){
                for(let i=3;i>-1;i--){
                    for(let j=3;j>-1;j--){
                        if(k===0 || k===2) currentScreen[i][j].compress('down');
                        if(k===1) currentScreen[i][j].merge('down');
                    }
                }
            }
            {let screenChanged = false;
            for(let i=0;i<4;i++){
                for(let j=0;j<4;j++){
                    if(currentScreen[i][j].val !== history[history.length-1][i][j]) screenChanged = true;
                }
            }
            if(screenChanged) newNumber();}
            break;
        case "ArrowLeft":
            addToHistory();
            console.log('left');
            for(let k=0;k<3;k++){
                for(let i=0;i<4;i++){
                    for(let j=0;j<4;j++){
                        if(k===0 || k===2) currentScreen[i][j].compress('left');
                        if(k===1) currentScreen[i][j].merge('left');
                    }
                }
            }
            {let screenChanged = false;
            for(let i=0;i<4;i++){
                for(let j=0;j<4;j++){
                    if(currentScreen[i][j].val !== history[history.length-1][i][j]) screenChanged = true;
                }
            }
            if(screenChanged) newNumber();}
            break;
        case "ArrowRight":
            addToHistory();
            console.log('right');
            for(let k=0;k<3;k++){
                for(let i=3;i>-1;i--){
                    for(let j=3;j>-1;j--){
                        if(k===0 || k===2) currentScreen[i][j].compress('right');
                        if(k===1) currentScreen[i][j].merge('right');
                    }
                }
            }
            {let screenChanged = false;
            for(let i=0;i<4;i++){
                for(let j=0;j<4;j++){
                    if(currentScreen[i][j].val !== history[history.length-1][i][j]) screenChanged = true;
                }
            }
            if(screenChanged) newNumber();}
            break;

        default:
            break;
    }

});


//////OBJECTS//////
class Cell{
    constructor(i,j,val){
        this.col = j;
        this.row = i;
        this.val = val;


        this.draw = () => {
            c.save();
                c.beginPath();
                c.rect(this.col*(CELLSIZE),this.row*(CELLSIZE),CELLSIZE,CELLSIZE);
                c.fillStyle = colorData.find(color => color.value === this.val).color;
                c.strokeStyle = colorData.find(color => color.value === -1).color;
                c.lineWidth = 10;
                c.fill();
                c.stroke();

                c.textAlign = "center";
                c.textBaseline = "middle";
                let fontScale;
                if(this.val == 131072) fontScale = .25;
                if(this.val <= 65536) fontScale = .3;
                if(this.val <= 8196) fontScale = .35;
                if(this.val <= 512) fontScale = .45;
                if(this.val <= 64) fontScale = .5;
                c.font = (CELLSIZE*fontScale) + "px ClearSans-Medium";
                c.fillStyle = (this.val <= 4) ? 'black' : 'white';
                if(this.val > 0) c.fillText(this.val, this.col*CELLSIZE + CELLSIZE/2, this.row*CELLSIZE + CELLSIZE*.6);
            c.restore();
        }
        this.update = () => {

            this.draw();
        }

        this.compress = (dir) => {
            if(dir === 'up'){
                let shift = 0;
                for(let i=1; i<4; i++){
                    if(this.row-i>=0){
                        if(currentScreen[this.row-i][this.col].val != 0) break;
                        shift = i;
                    }
                }
                if(shift != 0){
                    currentScreen[this.row-shift][this.col].val = this.val;
                    this.val = 0;
                }
            }
            if(dir === 'down'){
                let shift = 0;
                for(let i=1; i<4; i++){
                    if(this.row+i<=3){
                        if(currentScreen[this.row+i][this.col].val != 0) break;
                        shift = i;
                    }
                }
                if(shift != 0){
                    currentScreen[this.row+shift][this.col].val = this.val;
                    this.val = 0;
                }
            }

            if(dir === 'left'){
                let shift = 0;
                for(let i=1; i<4; i++){
                    if(this.col-i>=0){
                        if(currentScreen[this.row][this.col-i].val != 0) break;
                        shift = i;
                    }
                }
                if(shift != 0){
                    currentScreen[this.row][this.col-shift].val = this.val;
                    this.val = 0;
                }
            }

            if(dir === 'right'){
                let shift = 0;
                for(let i=1; i<4; i++){
                    if(this.col+i<=3){
                        if(currentScreen[this.row][this.col+i].val != 0) break;
                        shift = i;
                    }
                }
                if(shift != 0){
                    currentScreen[this.row][this.col+shift].val = this.val;
                    this.val = 0;
                }
            }
        }
        this.merge = (dir) => {
            if(dir === 'up'){
                if(this.row-1 < 0) return;
                if(currentScreen[this.row-1][this.col].val === this.val){
                    currentScreen[this.row-1][this.col].val *= 2;
                    this.val = 0;
                }
            }
            if(dir === 'down'){
                if(this.row+1 > 3) return;
                if(currentScreen[this.row+1][this.col].val === this.val){
                    currentScreen[this.row+1][this.col].val *= 2;
                    this.val = 0;
                }
            }
            if(dir === 'left'){
                if(this.col-1 < 0) return;
                if(currentScreen[this.row][this.col-1].val === this.val){
                    currentScreen[this.row][this.col-1].val *= 2;
                    this.val = 0;
                }
            }
            if(dir === 'right'){
                if(this.col+1 > 3) return;
                if(currentScreen[this.row][this.col+1].val === this.val){
                    currentScreen[this.row][this.col+1].val *= 2;
                    this.val = 0;

                }
            }
        }
    }
}
//////FUNCTIONS//////
function addToHistory(){
    let currentValues = [
        [],[],[],[]
    ]
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            currentValues[i][j] = currentScreen[i][j].val;
        }
    }
    history.push(currentValues);
}

function newNumber(){
    timesUndone -= (timesUndone === 0) ? 0 : 1;

    let emptyCells = new Array();
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            if(currentScreen[i][j].val === 0){
                emptyCells.push([i,j]);
            }
        }
    }
    let emptyCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
    //[i,j]
    if(Math.random() < .9){
        currentScreen[emptyCell[0]][emptyCell[1]].val = 2;
    } else {
        currentScreen[emptyCell[0]][emptyCell[1]].val = 4;
    }
    return emptyCell;
}

function undo(){
    if(history.length == 0 || timesUndone == 5){return;}
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            currentScreen[i][j].val = history[history.length-1][i][j];
        }
    }
    history.pop();
    timesUndone++;
}
//////INIT//////
function init(){    
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            currentScreen[i].push(new Cell(i,j,beginValues[i][j]));
        }
    }

}
function animate(){
    requestAnimationFrame(animate);
    c.save();
    c.clearRect(0,0,WIDTH,HEIGHT);
    c.restore();

    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            currentScreen[i][j].update();
        }
    }
}
init();
animate();



console.log('running');