//  * TETRIS
// Constructors

class LandedShape extends Array {
  draw(){
    if (!this.length){
      return
    }
    this.forEach((row, rowIndex)=>{
      if (row.fullCellsCount){
        row.forEach((cell, columnIndex)=>{
          if (cell.fillColor){
            playMatrix[rowIndex][columnIndex].style.backgroundColor = cell.fillColor
          }
        })
      }
    })
  }
  newRow(length = playMatrixWidth){
    const newRowArray = []
    newRowArray.fullCellsCount = 0
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
const playerScoreView = document.querySelector('.info .score-span')
// **************************************************************************
// Variables

const isDebugMode = false

const playMatrixHeight = 20
const playMatrixWidth = 16
const playMatrix = []
let landedShape = new LandedShape()

const tetrominoSpawnXY = [7,20]

const gameTickTime = 500
const speedUpTickDivider = 5
const dropTickDivider = 1000
let gameTimer = null
let isGameOngoing = false

let activeTetromino = null

let playerScore = 0
const pointsPerRow = 100
const pointsMultirowExponent = 1.5

const tetrominoShapes = [
  {
    name: 'O',
    shapeMap: [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    fillColor: 'gold',
  },
  {
    name: 'S',
    shapeMap: [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    fillColor: 'green',
  },
  {
    name: 'I',
    shapeMap: [
      [0,0,0,0],
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0]
    ],
    fillColor: 'cyan',
  },
  {
    name: 'Z',
    shapeMap: [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    fillColor: 'darkred',
  },
  {
    name: 'T',
    shapeMap: [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    fillColor: 'darkorchid',
  },
  {
    name: 'L',
    shapeMap: [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    fillColor: 'darkorange',
  },{
    name: 'J',
    shapeMap: [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    fillColor: 'darkblue',
  }
]

// **************************************************************************
// Controls
// define behaviour for a control
const playerControls = {
  moveLeft: {
    name: 'Move Left',
    keydown(){
      activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  moveRight: {
    name: 'Move Right',
    keydown(){
      activeTetromino.move([0,-1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  speedUpPlay: {
    name: 'Speed Up',
    keydown(repeat){
      if (isGameOngoing && !repeat){
        setTickSpeed(gameTickTime / speedUpTickDivider)
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
        setTickSpeed(gameTickTime / dropTickDivider)
      }
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateACW: {
    name: '&#8630;',
    keydown(){
      activeTetromino.rotateShape(false)
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateCW: {
    name: '&#8631;',
    keydown(){
      activeTetromino.rotateShape(true)
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
  Period: {
    name: '.',
    control: playerControls.rotateACW,
  },
  Slash: {
    name: '/',
    control: playerControls.rotateCW,
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
    //count from width-1 to 0 to retain 0,0 at the lower left of the play view
    for (let x = width - 1; x >= 0; x--){
      const playCell = document.createElement('div')
      
      isDebugMode && (playCell.textContent = `${x}, ${y}`)
      
      playMatrixView.prepend(playCell)
      playMatrix[y].push(playCell)
    }
  }
  return playMatrix
}


const maxShapeSize = tetrominoShapes.reduce((acc,shape)=>{
  return Math.max(acc, shape.shapeMap.length)
},0)
buildPlayMatrix(playMatrixHeight + maxShapeSize, playMatrixWidth) //todo: refactor to use return

// inject control legend
for (const controlKey in playerInputScheme) { //todo: refactor to for-of
  const controlLegend = document.querySelector('.player1 .controls')

  const controlLegendItem = document.createElement('div')
  controlLegendItem.classList.add('control-key')
  controlLegendItem.innerHTML = `<p><span>${playerInputScheme[controlKey].name}</span>${playerInputScheme[controlKey].control.name}</p>`

  controlLegend.appendChild(controlLegendItem)
}

// **************************************************************************
// Functions
class Tetromino {
  constructor(shapeMap, fillColor, baseLocation = tetrominoSpawnYX) {
    this.baseLocation = baseLocation
    this.fillColor = fillColor
    this.shapeMap = shapeMap
    this.shapeOffsets = convertShapeMeshToOffsets(shapeMap)
    this.occupiedSpaces = []
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
  mapOccupiedSpaces(address, shapeOffsets = this.shapeOffsets){
    return shapeOffsets.map(offset=>{
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
      isDebugMode && console.log('intercept')
      this.addToLandedShape()
      return
    }
    this.baseLocation = nextLocation
    this.update()
  }
  addToLandedShape(){
    if (
      this.occupiedSpaces.every(cell=>{
        if (cell[0] >= playMatrixHeight){
          loseGame()
          return false
        }
        landedShape[cell[0]][cell[1]].fillColor = this.fillColor 
        landedShape[cell[0]].fullCellsCount++
        return true
      })
    ){
      newActiveTetromino()
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
  rotateShape(isClockwise = true){
    const rotatedShapeMap = rotateMatrix(this.shapeMap, isClockwise)
    const rotatedOffsets = convertShapeMeshToOffsets(rotatedShapeMap)

    this.nextOccupiedSpaces = this.mapOccupiedSpaces(this.baseLocation, rotatedOffsets)

    if (this.checkNextOccupiedSpaces()){
      this.shapeOffsets = rotatedOffsets
      this.shapeMap = rotatedShapeMap
    } else {
      this.nextOccupiedSpaces = this.occupiedSpaces
    }
    this.update()
  }
}

// ************
// * global functions
function convertShapeMeshToOffsets(matrix, offsetPointXYFromTopLeft){
  const offsetReference = offsetPointXYFromTopLeft || [matrix.length - 2, 1]
  return matrix.reduce((acc,row, rowIndex)=>{
    row.forEach((flag, colIndex) => flag && acc.push([offsetReference[0] - rowIndex,-offsetReference[1] + colIndex]))
    return acc
  },[])
}
function rotateMatrix(matrix, isClockwise = true){
  //rotate clockwise by default
  if (isClockwise){
    //transpose, then reverse column content
    return matrix.map((val, index) => matrix.map(row => row[index])).reverse()
  }
  //transpose, then reverse row content
  return matrix.map((val, index) => matrix.map(row => row[index]).reverse())
}



// ************
// * playspace functions

function newTetromino(fillColor, shapeChoice) {
  shapeChoice = shapeChoice || Math.floor(Math.random() * tetrominoShapes.length)
  isDebugMode && console.log('new shape index:', shapeChoice)
  const shape = tetrominoShapes[shapeChoice]
  return new Tetromino(shape.shapeMap, fillColor || shape.fillColor)
}
function newActiveTetromino (fillColor) {
  setTickSpeed()
  activeTetromino = newTetromino(fillColor)
}
function addToScore(clearedRows){
  playerScore += Math.ceil(Math.pow(clearedRows, pointsMultirowExponent) * pointsPerRow)
  playerScoreView.textContent = playerScore
}
function checkForCompleteRows() {
  const originalLength = landedShape.length
  landedShape = landedShape.filter(row=>!(row.fullCellsCount === playMatrixWidth))
  const newLength = landedShape.length
  const clearedRows = originalLength - newLength
  for (let i = newLength;i < originalLength;i++){
    landedShape.newRow()
  }
  if (clearedRows){
    playMatrix.forEach(row=>row.forEach(cell=> {
      cell.style.backgroundColor = 'inherit'
    }))
    landedShape.draw()
    addToScore(clearedRows)
  }
}
function loseGame(){
  isGameOngoing = false
  console.log('game over')
  clearInterval(gameTimer)
}
function gameTick(){
  isDebugMode && console.log('tick')
  activeTetromino.moveDown()
  checkForCompleteRows()
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
  // system keys
  if (e.code === 'F5'){
    return true
  }

  // user keys
  e.preventDefault()
  try {
    playerInputScheme[e.code].control[e.type](e.repeat)
  } catch (err) {
    if (isDebugMode){
      console.log(err)
      console.log('unrecognised key event:', e.code, e.type)
    }
  }
}
// **************************************************************************
// Events

document,addEventListener('keydown', handleKeyPress)
document,addEventListener('keyup',   handleKeyPress)

if (isDebugMode){
  document.querySelector('head').innerHTML += '<style>* {border: solid rgb(80, 80, 80) 0.2px;}</style>'
  document.querySelectorAll('*').forEach(node=> node.classList.add('debug'))
  setTimeout(()=>{
    clearInterval(gameTimer)
    console.log('game time over')
  },5000)
}


// **************************************************************************
// * START GAME

isGameOngoing = true
newActiveTetromino('red')
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