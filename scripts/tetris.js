//  * TETRIS
// Constructors

class LandedShape extends Array {
  draw(){
    if (!this.length){
      return
    }
    this.forEach(cell=>{
      playMatrix[cell.address[0]][cell.address[1]].style.backgroundColor = cell.fillColor
    })
  }
  newRow(length = playMatrixWidth){
    const newRowArray = []
    newRowArray.fullCells = 0
    for (let i = 0; i < length;i++){
      newRowArray.push({})
    }
    this.push(newRowArray)
  }
}

function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// DOM Elements

const playMatrixView = document.querySelector('.play-matrix')
// **************************************************************************
// Variables

const playMatrixHeight = 20
const playMatrixWidth = 16
const playMatrix = []
let landedShape = new LandedShape()

const tetrominoSpawnXY = [7,20]

let gameTimer = null
const gameTickTime = 100
let isGameOngoing = false

let activeTetromino = null

// **************************************************************************
// Controls
// define behaviour for a control
const playerControls = {
  moveLeft: {
    name: 'Move Left',
    keydown(){
      activeTetromino.move([0,-1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  moveRight: {
    name: 'Move Right',
    keydown(){
      activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  speedUpPlay: {
    name: 'Speed Up',
    keydown(){
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 5)
      }
    },
    keyup(){
      if (isGameOngoing){
        setTickSpeed() 
      }
    },
  },
  dropPiece: {
    name: 'Drop',
    keydown(){
      if (isGameOngoing){
        setTickSpeed(gameTickTime / 100)
      }
    },
    keyup(){
      return 'event inactive'
    },
  },
}
// attach input to abstract control behaviour
const playerInputScheme = {
  ArrowLeft: {
    name: '&#8592;',
    control: playerControls.moveLeft,
  },
  ArrowRight: {
    name: '&#8594;',
    control: playerControls.moveRight,
  },
  ArrowDown: {
    name: '&#8595;',
    control: playerControls.speedUpPlay,
  },
  ArrowUp: {
    name: '&#8593;',
    control: playerControls.dropPiece,
  },
}

// **************************************************************************
// * From this point on, location arrays are referenced in the form [y,x],
// * so that each member of the outer array represents a row of the gamespace
// **************************************************************************



// **************************************************************************
// Build play window
const tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]

function buildPlayMatrix(height, width){
  for (let y = 0; y < height; y++){
    playMatrix.push([])
    landedShape.newRow(width)
    for (let x = 0; x < width; x++){
      const playCell = document.createElement('div')
      playCell.textContent = `${x}, ${y}`
      
      playMatrixView.appendChild(playCell)
      playMatrix[y].push(playCell)
    }
  }
  return playMatrix
}

buildPlayMatrix(playMatrixHeight + 2, playMatrixWidth) //todo: refactor to use return

// inject control scheme
for (const controlKey in playerInputScheme) {
  const controlLegend = document.querySelector('.player1 .controls')

  const controlLegendItem = document.createElement('div')
  controlLegendItem.classList.add('control-key')
  controlLegendItem.innerHTML = `<p><span>${playerInputScheme[controlKey].name}</span>${playerInputScheme[controlKey].control.name}</p>`

  controlLegend.appendChild(controlLegendItem)
}

// **************************************************************************
// Functions
class Tetromino {
  constructor(shapeOffsets, fillColor, baseLocation = tetrominoSpawnYX) {
    this.baseLocation = baseLocation
    this.shapeOffsets = shapeOffsets
    this.occupiedSpaces = []
    this.fillColor = fillColor
    this.nextOccupiedSpaces = []

    //initialise shape
    this.update()
  }
  update(){
    this.clearCurrentLocation()
    this.updateOccupiedSpaces()
    this.colorPlayMatrixView()
  }
  clearCurrentLocation(){
    this.occupiedSpaces.forEach(space=>{
      playMatrix[space[0]][space[1]].style.backgroundColor = 'inherit'
    })
  }
  updateOccupiedSpaces(){
    if (!this.nextOccupiedSpaces.length){
      this.occupiedSpaces = this.mapOccupiedSpaces(this.baseLocation)
      return
    }
    this.occupiedSpaces = [...this.nextOccupiedSpaces]
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      playMatrix[space[0]][space[1]].style.backgroundColor = this.fillColor
    })
  }
  mapOccupiedSpaces(address){
    return this.shapeOffsets.map(offset=>{
      return [address[0] + offset[0],address[1] + offset[1]]
    })
  }
  checkNextOccupiedSpaces(){
    return  this.nextOccupiedSpaces.every(nextMoveCell=>{
      return nextMoveCell[0] >= 0 &&
        nextMoveCell[1] >= 0 &&
        nextMoveCell[1] < playMatrixWidth &&
        !landedShape[nextMoveCell[0]][nextMoveCell[1]].fillColor
    })
  }
  moveDown(){
    const nextLocation = [this.baseLocation[0] - 1, this.baseLocation[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(nextLocation)

    const noIntercepts = this.checkNextOccupiedSpaces()

    if (!noIntercepts){
      console.log('intercept')
      this.addToLandedShape()
      return
    }
    this.baseLocation = nextLocation
    this.update()
  }
  addToLandedShape(){
    this.occupiedSpaces.every(cell=>{
      if (cell[0] > playMatrixHeight){
        loseGame()
        return false
      }
      landedShape[cell[0]][cell[1]].fillColor = this.fillColor 
      landedShape[cell[0]].fullCells++
      return true
    })
    if (isGameOngoing){
      newActiveTetromino('blue')
    }
  }
  move(direction){
    this.nextLocation = [this.baseLocation[0] + direction[0],this.baseLocation[1] + direction[1]]
    this.nextOccupiedSpaces = this.mapOccupiedSpaces(this.nextLocation)
    
    if (this.checkNextOccupiedSpaces()){
      this.baseLocation = this.nextLocation
      this.update()
    }
  }
}

function newActiveTetromino (fillColor) {
  setTickSpeed()
  activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]],fillColor)
}
function checkForCompleteRows() {
  const originalLength = landedShape.length
  landedShape = landedShape.filter(row=>!(row.fullCells === playMatrixWidth))
  const newLength = landedShape.length
  for (let i = newLength;i < originalLength;i++){
    landedShape.newRow()
  }
}

function loseGame(){
  isGameOngoing = false
  console.log('game over')
  clearInterval(gameTimer)
}
function gameTick(){
  console.log('tick')
  // playMatrix.forEach(row=>row.forEach(cell=> {
  //   cell.style.backgroundColor = 'inherit'
  // }))
  activeTetromino.moveDown()
  checkForCompleteRows()
  // landedShape.draw()
}
function setTickSpeed(tickSpeed = gameTickTime){
  clearInterval(gameTimer)
  return gameTimer = setInterval(()=>{
    gameTick()
  },tickSpeed)
}

// **************************************************************************
// keypress handler

function handleKeyPress(e) {
  try {
    playerInputScheme[e.code].control[e.type]()
  } catch (err) {
    // console.log(err)
    console.log('unrecognised key event:', e.code, e.type)
  }
}
// **************************************************************************
// Events

document,addEventListener('keydown', handleKeyPress)
document,addEventListener('keyup',   handleKeyPress)


setTimeout(()=>{
  clearInterval(gameTimer)
  console.log('game time over')
},5000)


// **************************************************************************
// * START GAME

isGameOngoing = true
newActiveTetromino('darkred')
setTickSpeed()

// **************************************************************************
// * export functions for testing
try {
  exports = {
    Tetromino,
    testJestConnection,
    buildPlayMatrix,

  }
} catch {
  'suppress this error in the browser until solution'
}