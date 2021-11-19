//  * TETRIS
// Initialisation Constructors

class TetrominoShape {
  constructor(shapeMap, fillColor = 'white'){
    this.shapeMap = shapeMap
    //todo: hash classname for new shape or use hexCode, add to css, set fill colour and border entirely with class
    this.fillColor = fillColor
  }
}


function testJestConnection() {
  console.log('hello')
  return 'hello'
}

// DOM Elements

const pageMain = document.querySelector('main')
const htmlRoot = document.documentElement

const globalPlayButton = document.querySelector('.play-button')
const globalPauseButton = document.querySelector('.pause-button')
const globalNewPlayerButton = document.querySelector('.new-player-button')

const playerCoreHTML = '<div class="info"><div class="score-container"><p>Score:&nbsp;</p><span class="score-span">000</span></div><ul class="controls"><p>Controls:<br><small>click to redefine, then press new key</small></p></ul></div><div class="play-decorator"><tetris-overlay class="pause-overlay"><p class = "rainbow-text">pause</p></tetris-overlay><div class="play-matrix"></div></div>'
// **************************************************************************
// Variables
// todo: refactor to enum
const isDebugMode = false
const isDebugVerbose = false
const localStorageDebugMode = true

const redefineKeyMode = { 
  isOn: false, 
  legendElement: {}, 
}

const globalPlayers = []

const playMatrixHeight = 20
const playMatrixWidth = 16

const tetrominoSpawnXY = [7,20]
const localHiscoresStorageKey = 'tentris-hiscores'

const defaultGameTickTime = 500
const levelUpTickTimeMultiplier = 0.90
const levelUpTickTimeRowsBreakpoint = 1
const speedUpTickDivider = 5
const dropTickDivider = 1000
let globalClearedRows = 0

// todo: refactor to enum
let isGameOngoing = false
let isGamePaused = false
let globalTickTime = defaultGameTickTime

const pointsPerRow = 100
const pointsMultirowExponent = 1.5

const tetrominoShapes = [
  new TetrominoShape(
    [
      [0,0,0,0],
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0]
    ],
    'gold'
  ),
  new TetrominoShape(
    [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    'green'
  ),
  new TetrominoShape(
    [
      [0,0,0,0],
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0]
    ],
    'cyan'
  ),
  new TetrominoShape(
    [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    'darkred'
  ),
  new TetrominoShape(
    [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    'darkorchid'
  ),
  new TetrominoShape(
    [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    'darkorange'
  ),
  new TetrominoShape(
    [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    'darkblue'
  )
]
const maxShapeSize = tetrominoShapes.reduce((acc,shape)=>{
  return Math.max(acc, shape.shapeMap.length)
},0)

// **************************************************************************
// Controls
// define behaviour for a control
const playerControls = { //todo: refactor into TetrisGame object
  // todo: setter: legendClassName = 'input-symbol-' + playerControls[controlAction].name.toLowerCase().replace(/ /g,'-')
  moveLeft: {
    name: 'Move Left',
    legendClassName: 'input-symbol-move-left',
    keydown(targetPlayerIndex){
      globalPlayers[targetPlayerIndex].activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  moveRight: {
    name: 'Move Right',
    legendClassName: 'input-symbol-move-right',
    keydown(targetPlayerIndex){
      globalPlayers[targetPlayerIndex].activeTetromino.move([0,-1])
    },
    keyup(){
      return 'event inactive'
    },
  },
  speedUpPlay: {
    name: 'Speed Up',
    legendClassName: 'input-symbol-speed-up',
    keydown(targetPlayerIndex, keypressRepeatFlag){
      if (isGameOngoing && !keypressRepeatFlag){
        globalPlayers[targetPlayerIndex].setTickSpeed(globalPlayers[targetPlayerIndex].gameTickTime / speedUpTickDivider)
      }
    },
    keyup(targetPlayerIndex){
      if (isGameOngoing){ //retain this check so that other keys will still work within debug mode
        globalPlayers[targetPlayerIndex].setTickSpeed() 
      }
    },
  },
  dropPiece: {
    name: 'Drop',
    legendClassName: 'input-symbol-drop-piece',
    keydown(targetPlayerIndex){
      if (isGameOngoing){ //retain this check so that other keys will still work within debug mode
        globalPlayers[targetPlayerIndex].setTickSpeed(globalPlayers[targetPlayerIndex].gameTickTime / dropTickDivider)
      }
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateACW: {
    name: '&#8630;',
    legendClassName: 'input-symbol-rotate-acw',
    keydown(targetPlayerIndex){
      globalPlayers[targetPlayerIndex].activeTetromino.rotateShape(false)
    },
    keyup(){
      return 'event inactive'
    },
  },
  rotateCW: {
    name: '&#8631;',
    legendClassName: 'input-symbol-rotate-cw',
    keydown(targetPlayerIndex){
      globalPlayers[targetPlayerIndex].activeTetromino.rotateShape(true)
    },
    keyup(){
      return 'event inactive'
    },
  },
}
// attach input to abstract control behaviour
const inputKeyBindings = {
  ArrowLeft: {
    name: '&#8592;',
    control: playerControls.moveLeft,
    player: 1,
  },
  ArrowRight: {
    name: '&#8594;',
    control: playerControls.moveRight,
    player: 1,
  },
  ArrowDown: {
    name: '&#8595;',
    control: playerControls.speedUpPlay,
    player: 1,
  },
  ArrowUp: {
    name: '&#8593;',
    control: playerControls.dropPiece,
    player: 1,
  },
  Period: {
    name: '.',
    control: playerControls.rotateACW,
    player: 1,
  },
  Slash: {
    name: '/',
    control: playerControls.rotateCW,
    player: 1,
  },
  KeyA: {
    name: 'A',
    control: playerControls.moveLeft,
    player: 2,
  },
  KeyD: {
    name: 'D',
    control: playerControls.moveRight,
    player: 2,
  },
  KeyS: {
    name: 'S',
    control: playerControls.speedUpPlay,
    player: 2,
  },
  KeyW: {
    name: 'W',
    control: playerControls.dropPiece,
    player: 2,
  },
  KeyC: {
    name: 'C',
    control: playerControls.rotateACW,
    player: 2,
  },
  KeyV: {
    name: 'V',
    control: playerControls.rotateCW,
    player: 2,
  },
}

// **************************************************************************
// * From this point on, location arrays are referenced in the form [y,x],
// * so that each member of the outer array represents a row of the gamespace
// **************************************************************************
const tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]


// **************************************************************************
// Build play window
class LandedShape extends Array {
  draw(parent){
    if (!this.length){
      return
    }
    this.forEach((row, rowIndex)=>{
      if (row.fullCellsCount){
        row.forEach((cell, columnIndex)=>{
          if (cell.fillColor){
            toggleElementClassFilled(parent.playMatrix[rowIndex][columnIndex], cell.fillColor)
          }
        })
      }
    })
  }
  newRow(deadRow = false,length = playMatrixWidth){
    const newRowArray = []
    for (let i = 0; i < length;i++){
      newRowArray.push({})
      deadRow && (newRowArray[i].fillColor = 'lightgrey')
    }
    if (deadRow){
      newRowArray.fullCellsCount = length + 1
      this.pop()
      this.unshift(newRowArray)
      return true
    }
    newRowArray.fullCellsCount = 0
    this.push(newRowArray)
    return true
  }
}

class TetrisGame {
  constructor(playerNumber = globalPlayers.length + 1, displayParent = pageMain){
    this.playerNumber = playerNumber
    this.playerName = 'player' + playerNumber
    this.displayParent = displayParent
    this.playerSection = {} //DOM element to carry this player
    this.playMatrixView = {} //DOM element to display this gamestate
    this.coreHTML = playerCoreHTML
    this.playMatrix = []
    this.landedShape = []

    this.playerRowsCleared = 0
    this.playerScore = 0
    this.playerScoreView = {}

    this.activeTetromino = {}
    this.gameTickTime = globalTickTime
    this.gameTimer = {}

    this.initPlayspace()
  }

  initPlayspace(){
    const newPlayerSection = document.createElement('section')
    newPlayerSection.classList.add(this.playerName)
    newPlayerSection.innerHTML = this.coreHTML

    this.displayParent.appendChild(newPlayerSection)

    this.playerSection = newPlayerSection

    this.playMatrixView = newPlayerSection.querySelector('.play-matrix')
    isDebugMode && console.log(this.playMatrixView)
    this.playerScoreView = newPlayerSection.querySelector('.info .score-span')

    this.buildMatrix()

    this.injectPlayerControlsIntoHTML()
    this.injectScoreIntoHTML()
  }
  buildMatrix(){
    //todo: refactor to deconstruct return.  Currently causes "console.log(...) is undefined"
    const buildReturn = this.buildNewPlayMatrix(playMatrixHeight + maxShapeSize, playMatrixWidth, this.playMatrixView)
    this.playMatrix = buildReturn[0]
    this.landedShape = buildReturn[1]

    isDebugMode && console.log('build new matrix:',this.playerName, 'playmatrix',this.playMatrix,'landedshape', this.landedShape)
  }
  buildNewPlayMatrix(rows, columns, displayElement = this.playMatrixView){
    setCssGridProperties(rows, columns, displayElement)
    displayElement.innerHTML = ''
    const playMatrix = new Array
    const landedShape = new LandedShape()
    for (let y = 0; y < rows; y++){
      playMatrix.push([])
      landedShape.newRow(false, columns)
      //count from width-1 to 0 to retain 0,0 at the lower left of the play view
      for (let x = columns - 1; x >= 0; x--){
        const playCell = document.createElement('div')
      
        if (isDebugMode){
          playCell.textContent = `${x}, ${y}`
          playCell.classList.add('debug')
        }
      
        displayElement.prepend(playCell)
        playMatrix[y].push(playCell)
      }
    }
    setPlayViewCellHeight(displayElement)
    return [playMatrix, landedShape]
  }
  injectScoreIntoHTML(){
    this.playerScoreView.textContent = this.playerScore.toLocaleString(undefined, { minimumIntegerDigits: 3 })
  }
  injectPlayerControlsIntoHTML(){
    // inject control legend
    const controlLegendElement = this.playerSection.querySelector('.controls')
    for (const controlAction in playerControls) {
      const playerControl = playerControls[controlAction]

      const controlLegendItem = document.createElement('div')
      controlLegendItem.classList.add('control-key')
      controlLegendItem.dataset.controlAction = controlAction
      controlLegendItem.dataset.playerNumber = this.playerNumber
      controlLegendItem.innerHTML = `<span class="${playerControl.legendClassName}"></span><p>&nbsp;${playerControl.name}</p>`
      controlLegendItem.addEventListener('click', handleRedefineInput)

      controlLegendElement.appendChild(controlLegendItem)
    }
    // if controls are already defined for this player, inject them
    for (const definedInput in inputKeyBindings){
      const input = inputKeyBindings[definedInput]
      if ( input.player === this.playerNumber){
        this.playerSection.querySelector(`.${input.control.legendClassName}`).innerHTML = input.name
      }
    }
  }
  newActiveTetromino (fillColor) {
    this.setTickSpeed()
    this.activeTetromino = this.newTetromino(fillColor)
  }
  reset(){
    clearInterval(this.gameTimer)
    this.buildMatrix()
    this.playerRowsCleared = 0
    this.playerScore = 0
    this.injectScoreIntoHTML()
  }
  gameTick(){
    isDebugMode && isDebugVerbose && console.log(this.playerName, 'tick')
    this.activeTetromino.moveDown()
    this.checkForCompleteRows()
  }
  setTickSpeed(tickSpeed = globalTickTime){
    clearInterval(this.gameTimer)
    return this.gameTimer = setInterval(()=>{
      this.gameTick()
    },tickSpeed)
  }
  clearPlayAreaView(){
    this.playMatrix.forEach(row=>row.forEach(cell=> {
      toggleElementClassFilled(cell)
    }))
  }
  checkForCompleteRows() {
    const originalLength = this.landedShape.length
    this.landedShape = this.landedShape.filter(row=>!(row.fullCellsCount === playMatrixWidth))
    const newLength = this.landedShape.length
    const clearedRows = originalLength - newLength
    for (let i = newLength;i < originalLength;i++){
      this.landedShape.newRow()
    }
    if (clearedRows){
      this.clearPlayAreaView()
      this.landedShape.draw(this)
      this.addToScore(clearedRows)
      globalAddClearedRows(this.playerNumber, clearedRows)
      isDebugMode && console.log('global tick time updated:',globalTickTime)
    }
  }
  addToScore(clearedRows){
    this.playerScore += Math.ceil(Math.pow(clearedRows, pointsMultirowExponent) * pointsPerRow)
    this.playerScoreView.textContent = this.playerScore
  }
  newTetromino(fillColor, shapeChoice) {
    isDebugMode && console.log('newtetr parent:', this)
    shapeChoice = shapeChoice || Math.floor(Math.random() * tetrominoShapes.length)
    isDebugMode && console.log('new shape index:', shapeChoice)
    const shape = tetrominoShapes[shapeChoice]
    return new Tetromino(shape.shapeMap, fillColor || shape.fillColor, this)
  }
  togglePauseOverlay(){
    this.playerSection.querySelector('.pause-overlay').classList.toggle('enable-overlay')
  }
}
class Tetromino {
  constructor(shapeMap, fillColor, parent, baseLocation = tetrominoSpawnYX) {
    this.baseLocation = baseLocation
    this.fillColor = fillColor
    this.shapeMap = shapeMap
    this.shapeOffsets = convertShapeMeshToOffsets(shapeMap)
    this.occupiedSpaces = []
    this.nextOccupiedSpaces = []
    this.parent = parent

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
      toggleElementClassFilled(this.parent.playMatrix[space[0]][space[1]])
    })
  }
  updateOccupiedSpaces(){
    if (!this.nextOccupiedSpaces.length){
      this.occupiedSpaces = this.mapOccupiedSpaces(this.baseLocation)
      return
    }
    this.occupiedSpaces = [...this.nextOccupiedSpaces]
  }
  mapOccupiedSpaces(address, shapeOffsets = this.shapeOffsets){
    return shapeOffsets.map(offset=>{
      return [address[0] + offset[0],address[1] + offset[1]]
    })
  }
  colorPlayMatrixView(){
    this.occupiedSpaces.forEach((space)=>{
      toggleElementClassFilled(
        this.parent.playMatrix[space[0]][space[1]], this.fillColor)
    })
  }
  checkNextOccupiedSpaces(){
    return  this.nextOccupiedSpaces.every(nextMoveCell=>{
      return nextMoveCell[0] >= 0 &&
        nextMoveCell[1] >= 0 &&
        nextMoveCell[1] < playMatrixWidth &&
        !this.parent.landedShape[nextMoveCell[0]][nextMoveCell[1]].fillColor
    })
  }
  addToLandedShape(){
    if (
      this.occupiedSpaces.every(cell=>{
        if (cell[0] >= playMatrixHeight){
          loseGame()
          return false
        }
        this.parent.landedShape[cell[0]][cell[1]].fillColor = this.fillColor 
        this.parent.landedShape[cell[0]].fullCellsCount++
        return true
      })
    ){
      this.parent.newActiveTetromino()
    }
  }
  moveDown(){ // TODO: refactor into move()
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
  move(direction){
    isDebugMode && isDebugVerbose && console.log('moving', direction, this)
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
// **************
// * local storage manager
const hiscoresManager = {
  records: [],
  storageKey: localHiscoresStorageKey,
  setStoredHiscores(newHiScores = this.records, key = this.storageKey){
    const newHiscoresString = JSON.stringify(newHiScores.map((record=>JSON.stringify(record))))

    localStorage.setItem(key, newHiscoresString)

    localStorageDebugMode && console.log('new local highscores : ',newHiscoresString)

    return newHiscoresString
  },
  populateLocalHighscores(key = this.storageKey){
    // if key does not exist set to default.  If key exists already, set this.records and return parsed contents.

    const localStorageItem = localStorage.getItem(key)

    localStorageDebugMode && console.log('local storage on key', key,':' , localStorageItem)

    if (!localStorageItem){
      localStorageDebugMode && console.log('no Hiscores found.  Setting to default')

      const defaultHiscores = [ { playerName: 'abc', score: 1000 }, { playerName: 'def', score: 900 },{ playerName: 'ghi', score: 800 },{ playerName: 'jkl', score: 700 },{ playerName: 'mno', score: 600 },{ playerName: 'pqr', score: 500 },{ playerName: 'stu', score: 400 },{ playerName: 'vwx', score: 300 },{ playerName: 'yza',score: 100 },{ playerName: 'bcd', score: 50 } ]

      this.records = defaultHiscores
      this.updateHiscoreScroller()

      return this.setStoredHiscores(defaultHiscores)
    }

    const parsedLocalItem = JSON.parse(localStorageItem).map(record=>JSON.parse(record))
      
    this.records = parsedLocalItem

    localStorageDebugMode && console.log('post-parsing records', this.records)

    this.updateHiscoreScroller()
    return parsedLocalItem
  },
  addNewRecordToHiscores(playerName, newScore){
    this.records.pop()
    this.records.push({ playerName: playerName, score: newScore })
    this.records.sort((a, b) => b.score - a.score)
    this.setStoredHiscores()
    return true
  },
  checkForNewHiscore(newScore){
    const lowestScore = this.records[this.records.length - 1].score

    if (newScore < lowestScore){
      localStorageDebugMode && console.log('Score lower than minimum')
      return false
    }
    localStorageDebugMode && console.log('New High Score!')
    const newRecordPlayerName = this.capturePlayerName()
    this.addNewRecordToHiscores(newRecordPlayerName, newScore)
    this.updateHiscoreScroller()

    return this.records
  },
  capturePlayerName(){
    return window.prompt('NEW HIGH SCORE!\n\nEnter your name:') || 'PLAYER'
  },
  updateHiscoreScroller(newHiscores = this.records){
    const hiscorePlayersElement = document.querySelector('.hiscore-players')
    const hiscoreScoresElement = document.querySelector('.hiscore-scores')

    //clear old list and initialise new list titles
    hiscorePlayersElement.innerHTML = '<li>high</li>'
    hiscoreScoresElement.innerHTML = '<li>scores</li>'

    newHiscores.forEach(record=>{
      const newPlayerElement = document.createElement('li')
      const newScoreElement = document.createElement('li')
      
      newPlayerElement.textContent = record.playerName
      newScoreElement.textContent =  record.score

      hiscorePlayersElement.appendChild(newPlayerElement)
      hiscoreScoresElement.appendChild(newScoreElement)
    })
    return newHiscores
  },
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
function globalAddClearedRows(playerNumSendingRows, clearedRows){
  globalClearedRows += clearedRows
  globalTickTime = globalTickTime * Math.pow(levelUpTickTimeMultiplier, Math.ceil(globalClearedRows / levelUpTickTimeRowsBreakpoint))
  globalPlayers.forEach(player=>{
    if (player.playerNumber !== playerNumSendingRows){
      isDebugMode && console.log(`adding ${clearedRows} rows to Player${player.playerNumber}`)
      for (let i = 0; i < clearedRows; i++){
        // move active shape away from new row to prevent conflicts
        player.clearPlayAreaView()
        player.activeTetromino.move([1,0])
        // redraw new landed shape
        player.landedShape.newRow(true)
        player.landedShape.draw(player)
        // restore previous position and calculate intercepts with new landed shape
        player.gameTick()
      }
    }
  })
}
function toggleElementClassFilled(element, fillColor) {
  if (!fillColor){
    element.classList.remove('filled')
    element.style.backgroundColor = 'initial'
    element.style.borderColor = 'rgba(10,10,10, 0.5)'
  } else {
    element.classList.add('filled')
    element.style.backgroundColor = fillColor
    element.style.borderColor = fillColor
  }
}

function setCssGridProperties(rows, columns){
  const gridRows = !isDebugMode ? rows - maxShapeSize : rows
  htmlRoot.style.setProperty('--playmatrix-width-count', columns)
  htmlRoot.style.setProperty('--playmatrix-height-count', gridRows)
}
function setPlayViewCellHeight(playMatrixViewHtmlElement){
  isDebugMode && console.log(playMatrixViewHtmlElement)
  const playerViewCell = document.querySelector('.player1 .play-matrix').lastChild
  isDebugMode && console.log(playerViewCell)
  const playMatrixCellEdgeLength = playerViewCell.offsetWidth
    
  isDebugMode && console.log(playMatrixCellEdgeLength)

  htmlRoot.style.setProperty('--playmatrix-cell-edge-length', `${playMatrixCellEdgeLength}px`)
}
// ************
// * playspace functions
function loseGame(){
  isGameOngoing = false
  console.log('game over')
  globalPlayers.forEach(player=>{
    clearInterval(player.gameTimer)
    hiscoresManager.checkForNewHiscore(player.playerScore)
  })
}

function resetGame() {
  // todo does not stop game
  // todo if game state is ended, requires doubleclick to clear field
  isGameOngoing = false
  globalPlayers.forEach(player=>player.reset())
  globalTickTime = defaultGameTickTime
}
function startGame(){
  isGameOngoing = true
  if (isDebugMode){
    globalPlayers.forEach(player=>{
      player.newActiveTetromino('red')
      player.setTickSpeed()
    })
  } else {
    globalPlayers.forEach(player=>player.newActiveTetromino())
  }
}
function redefinePlayerInput(legendElement,keyCode){
  const targetPlayerNumber = parseInt(legendElement.dataset.playerNumber)
  const actionToBind = legendElement.dataset.controlAction
  isDebugMode && console.log('binding:',targetPlayerNumber, keyCode, actionToBind)
  //if reference to this keypress exists already, alert user
  if (inputKeyBindings[keyCode]){
    window.alert(`Key is already in use!\n\nPlayer${inputKeyBindings[keyCode].player} : ${inputKeyBindings[keyCode].control.name}`)
    
    legendElement.classList.remove('rebinding-input')
    redefineKeyMode.isOn = false
    return
  }
  // if binding for this player/control already exists, clear it
  for (const keyBindingLabel in inputKeyBindings){
    const keyBinding = inputKeyBindings[keyBindingLabel]

    if (
      keyBinding.player === targetPlayerNumber &&
      keyBinding.control === playerControls[actionToBind]
    ){
      isDebugMode && console.log('deleting old key binding')
      delete inputKeyBindings[keyBindingLabel]
    }
  }
  // bind new key
  inputKeyBindings[keyCode] = {
    name: keyCode,
    control: playerControls[actionToBind],
    player: targetPlayerNumber,
  }

  legendElement.querySelector('span').innerHTML = keyCode
  
  isDebugMode && console.log('new key bindings:',inputKeyBindings)
  
  legendElement.classList.remove('rebinding-input')
  redefineKeyMode.isOn = false
}
// **************************************************************************
// keypress handler

function handleKeyPress(e) {
  // system keys
  switch (e.code){
    case 'F5': 
      return true
    case 'F12':
      if (e.type === 'keydown'){
        e.preventDefault()
        handlePauseButton()
      }
      return
  }
  e.preventDefault()

  if (redefineKeyMode.isOn){
    redefinePlayerInput(
      redefineKeyMode.legendElement,
      e.code)
    return
  }
  try {
    if (isGameOngoing || isDebugMode ){
      const keyBoundPlayerIndex = inputKeyBindings[e.code].player - 1
      inputKeyBindings[e.code].control[e.type](keyBoundPlayerIndex, e.repeat)
    }
  } catch (err) {
    if (isDebugMode){
      isDebugVerbose && console.log(err)
      console.log('unrecognised key event:', e.code, e.type)
    }
  }
}
function handlePlayButton(){
  if (!isGameOngoing){
    startGame()
    globalPlayButton.textContent = 'reset'
    globalPlayButton.classList.add('allcaps')

  } else {
    resetGame()
    globalPlayButton.textContent = 'start game'
    globalPlayButton.classList.remove('allcaps')
  }
}
function handlePauseButton() {
  if (isGameOngoing){
    isGameOngoing = false
    isGamePaused = true
    isDebugMode && console.log('game paused')
    globalPlayers.forEach(player=>{
      clearInterval(player.gameTimer)
      player.togglePauseOverlay()
    })
  } else if (isGamePaused) {
    isDebugMode && console.log('game unpaused')
    isGamePaused = false
    isGameOngoing = true
    globalPlayers.forEach(player=>{
      player.setTickSpeed()
      player.togglePauseOverlay()
    })
  }
  
}
function handleRedefineInput(){
  redefineKeyMode.isOn = true
  redefineKeyMode.legendElement = this
  this.classList.add('rebinding-input')
}
function addNewPlayer(){
  if (isGameOngoing){
    return false
  }
  // init new play field and return new player number
  return globalPlayers.push(new TetrisGame)
  
}

function handleWindowResize(){
  setPlayViewCellHeight(pageMain.querySelector('.play-matrix'))
}

// **************************************************************************
// Events

document.addEventListener('keydown', handleKeyPress)
document.addEventListener('keyup',   handleKeyPress)
globalPlayButton.addEventListener('click',   handlePlayButton)
globalNewPlayerButton.addEventListener('click', addNewPlayer)
globalPauseButton.addEventListener('click', handlePauseButton)

if (isDebugMode){
  document.querySelector('head').innerHTML += '<style>* {border: solid rgb(80, 80, 80) 0.2px;}</style>'
  document.querySelectorAll('*').forEach(node=> node.classList.add('debug'))
  setTimeout(()=>{
    globalPlayers.forEach(player=> clearInterval(player.gameTimer))
    console.log('game time over')
  },11500)
}

window.onresize =  handleWindowResize

// **************************************************************************
// START GAME
// populate with at least one player
globalPlayers.push(new TetrisGame)
// init highscores
hiscoresManager.populateLocalHighscores()

// **************************************************************************
// * export functions for testing
try {
  exports = {
    Tetromino,
    testJestConnection,
  }
} catch {
  'suppress this error in the browser until solution'
}