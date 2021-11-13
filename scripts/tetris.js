//  * TETRIS

function testJestConnection() {
  console.log('hello')
  return 'hello'
}
class LandedShape extends Array {
  draw(){
    if (!this.length){
      return
    }
    this.forEach(cell=>{
      playMatrix[cell.address[0]][cell.address[1]].style.backgroundColor = cell.fillColor
    })
  }
}


// DOM Elements

const playMatrixView = document.querySelector('.play-matrix')
// **************************************************************************
// Variables

const playMatrixHeight = 20
const playMatrixWidth = 16
const playMatrix = []
const landedShape = new LandedShape(0)

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

const tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]
// Build play window
function buildPlayMatrix(height, width){
  for (let y = 0; y < height; y++){
    playMatrix.push([])
    for (let x = 0; x < width; x++){
      const playCell = document.createElement('div')
      playCell.textContent = `${x}, ${y}`
      
      playMatrixView.appendChild(playCell)
      playMatrix[y].push(playCell)
    }
  }
  return playMatrix
}

buildPlayMatrix(playMatrixHeight + 2, playMatrixWidth)

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
      return landedShape.every(landedCell=>{
        return !landedCell.address.every((coordinate, index)=>(coordinate === nextMoveCell[index]))
      }) && 
        nextMoveCell[0] >= 0 &&
        nextMoveCell[1] >= 0 &&
        nextMoveCell[1] < playMatrixWidth

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
      landedShape.push({ address: cell, fillColor: this.fillColor })
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



function newActiveTetromino (fillcolor) {
  setTickSpeed()
  activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]],fillcolor)
}
function loseGame(){
  isGameOngoing = false
  
  clearInterval(gameTimer)
}
function gameTick(){
  console.log('tick')
  playMatrix.forEach(row=>row.forEach(cell=> {
    cell.style.backgroundColor = 'inherit'
  }))
  activeTetromino.moveDown()
  landedShape.draw()
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
},10000)


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