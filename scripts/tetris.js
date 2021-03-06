//  * TETRIS

// asset credits:
// bomb: https://tenor.com/view/bomb-explode-gif-12917124
// explosion: https://i.pinimg.com/originals/66/e6/40/66e6407c40863b263f4ed8e2bc1a3119.gif

// Initialisation Constructors

class TetrominoShape {
  constructor(shapeMap, fillColor = 'white'){
    this.shapeMap = shapeMap
    //todo: hash classname for new shape or use hexCode, add to css, set fill colour and border entirely with class
    this.fillColor = fillColor
  }
}

window.mobileCheck = function() {
  let check = false;
  (
    function(a){
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(a.substr(0,4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

// DOM Elements

const pageMain = document.querySelector('main')
const htmlRoot = document.documentElement

const globalPlayButton = document.querySelector('.play-button')
const globalPauseButton = document.querySelector('.pause-button')
const globalNewPlayerButton = document.querySelector('.new-player-button')
const globalCreateShapeOverlay = document.querySelector('.create-shape-overlay')

const playerCoreHTML = '<div class="info"><div class="score-container"><p>Score:&nbsp;</p><span class="score-span">000</span></div><ul class="controls"><p>Controls:<br><small>click to redefine, then press new key</small></p></ul><figure class="bomb"></figure></div><div class="play-decorator"><tetris-overlay class="pause-overlay"><p class = "rainbow-text">pause</p></tetris-overlay><div class="play-matrix"></div></div>'
// **************************************************************************
// Variables
// todo: refactor to enum
const isDebugMode = false
const isDebugVerbose = false
const localStorageDebugMode = false

let playMatrixHeight = 20
let playMatrixWidth = 16

let tetrominoSpawnXY = [(playMatrixWidth / 2) - 1,playMatrixHeight]

const bombSize = 2
const deadRowFill = 'lightgrey'
const gameOverFill = 'chartreuse'

const globalPlayers = []

const localHiscoresStorageKey = 'tentris-hiscores'

const redefineKeyMode = { 
  isOn: false, 
  legendElement: {}, 
}

const defaultGameTickTime = 500
const levelUpTickTimeMultiplier = 0.90
const levelUpTickTimeRowsBreakpoint = 1
const speedUpTickDivider = 5
const dropTickDivider = 5000
let globalClearedRows = 0

// todo: refactor to enum
let globalIsGameOngoing = false
let globalIsGamePaused = false
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
let globalMaxShapeSize = tetrominoShapes.reduce((acc,shape)=>{
  return Math.max(acc, shape.shapeMap.length)
},0)

const gameOverArtArray = [[1, 0],[5, 0],[8, 0],[9, 0],[10, 0],[12, 0],[14, 0],[0, 1],[2, 1],[4, 1],[6, 1],[8, 1],[12, 1],[14, 1],[0, 2],[2, 2],[4, 2],[6, 2],[8, 2],[9, 2],[10, 2],[12, 2],[13, 2],[0, 3],[2, 3],[4, 3],[6, 3],[8, 3],[12, 3],[14, 3],[1, 4],[4, 4],[6, 4],[8, 4],[9, 4],[10, 4],[12, 4],[13, 4],[1, 6],[4, 6],[6, 6],[8, 6],[12, 6],[14, 6],[15, 6],[0, 7],[2, 7],[4, 7],[6, 7],[8, 7],[12, 7],[14, 7],[0, 8],[2, 8],[4, 8],[5, 8],[6, 8],[8, 8],[10, 8],[12, 8],[14, 8],[15, 8],[0, 9],[4, 9],[6, 9],[8, 9],[9, 9],[11, 9],[12, 9],[14, 9],[1, 10],[2, 10],[4, 10],[5, 10],[6, 10],[8, 10],[12, 10],[14, 10],[15, 10]]
gameOverArtArray.height = 11

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
      if (globalIsGameOngoing && !keypressRepeatFlag){
        globalPlayers[targetPlayerIndex].setGameTimer(globalPlayers[targetPlayerIndex].gameTickTime / speedUpTickDivider)
      }
    },
    keyup(targetPlayerIndex){
      if (globalIsGameOngoing){ //retain this check so that other keys will still work within debug mode
        globalPlayers[targetPlayerIndex].setGameTimer() 
      }
    },
  },
  dropPiece: {
    name: 'Drop',
    legendClassName: 'input-symbol-drop-piece',
    keydown(targetPlayerIndex){
      if (globalIsGameOngoing){ //retain this check so that other keys will still work within debug mode
        globalPlayers[targetPlayerIndex].setGameTimer(globalPlayers[targetPlayerIndex].gameTickTime / dropTickDivider)
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
let tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]


// **************************************************************************
// Build play window
class LandedShape extends Array {
  draw(parent){
    if (!this.length){
      return
    }
    this.forEach((row, rowIndex)=>{
      // only iterate through row that have filled cells.
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
      deadRow && (newRowArray[i].fillColor = deadRowFill)
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

    this.isGameOngoing = false

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

    // attach bomb to existing HTML
    const bombFigure = newPlayerSection.querySelector('.bomb')
    const bombImg = document.createElement('img')
    bombImg.src = './assets/bomb.gif' 
    bombImg.alt = 'bomb'
    bombImg.style.height = '75px'
    const bombImgCaption = document.createElement('figcaption')
    bombImgCaption.textContent = 'click me!!'

    bombFigure.appendChild(bombImg)
    bombFigure.appendChild(bombImgCaption)


    const additionalFeaturesElement = newPlayerSection.querySelector('.info')
    const newButtons = [['resize', handleResizeButton], ['create shape', handleCreateShapeOverlay]]
      
    newButtons.forEach((button)=>{
      const newButton = document.createElement('button')
      newButton.textContent = button[0]
      newButton.addEventListener('click', button[1])

      additionalFeaturesElement.appendChild(newButton)
    })
    
    
    
    
    this.armBomb()

    this.buildMatrix()

    this.injectPlayerControlsIntoHTML()
    this.injectScoreIntoHTML()
  }
  buildMatrix(){
    //todo: refactor to deconstruct return.  Currently causes "console.log(...) is undefined"
    isDebugMode && console.log('new matrix', playMatrixHeight + globalMaxShapeSize, playMatrixWidth)
    const buildReturn = this.buildNewPlayMatrix(playMatrixHeight + globalMaxShapeSize, playMatrixWidth, this.playMatrixView)
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
        
        playCell.dataset.matrixCoordinateY = y
        playCell.dataset.matrixCoordinateX = x
        playCell.dataset.playerNumber = this.playerNumber

        if (isDebugMode){
          playCell.textContent = `${x}, ${y}`
          playCell.classList.add('debug')
        }
        if ((rows - y) <= globalMaxShapeSize){
          playCell.classList.add('spawn-area')
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
      controlLegendItem.addEventListener('touchstart', handleMobileTouchInput)

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
  armBomb(){
    const bombFigure = this.playerSection.querySelector('.bomb')
    bombFigure.addEventListener('click', this.handleBombClick)
    bombFigure.addEventListener('touchstart', this.handleBombClick)
    bombFigure.style.visibility = 'unset'
  }
  handleBombClick(){
    // target the data-layer player object
    const playerDOMSection = this.parentElement.parentElement
    const playerIndex = parseInt(playerDOMSection.classList[0].replace(/player/, '')) - 1
    const playerObject = globalPlayers[playerIndex]

    isDebugMode && console.log('pickup bomb.  player:', playerObject)
    // add event listener to playfield
    playerObject.playMatrixView.addEventListener('click',playerObject.handleBombDrop)
    playerObject.playMatrixView.addEventListener('touchstart',playerObject.handleBombDrop)

    playerObject.playerSection.classList.add('bomb-cursor')

    this.style.visibility = 'hidden'

    // remove event listener if bomb is moved outside player section
    playerObject.playerSection.addEventListener('mouseleave', playerObject.handleBombOutsideSection)
  }
  handleBombOutsideSection(){
    const playerObject = globalPlayers[parseInt(this.classList[0].replace(/player/, '')) - 1]
    isDebugMode && console.log('out', this)
    playerObject.clearBombCommonTasks()
    
    playerObject.playerSection.querySelector('.bomb').style.visibility = 'unset'

  }
  handleBombDrop(e){
    isDebugMode && console.log('bomb', e.target)
    const targetDivData = e.target.dataset
    const targetPlayerObject = globalPlayers[parseInt(targetDivData.playerNumber) - 1]
    targetPlayerObject.clearBombCommonTasks()
    const targetLandedShape = targetPlayerObject.landedShape

    const targetY = parseInt(targetDivData.matrixCoordinateY)
    const targetX = playMatrixWidth - parseInt(targetDivData.matrixCoordinateX) - 1

    const targets = []

    for (let y = -bombSize;y <= bombSize; y++){
      for (let x = -bombSize + Math.abs(y);x <= bombSize - Math.abs(y); x++){
        targets.push([targetY + y, targetX + x])
      }
    }

    isDebugMode && console.log('bomb targets:',targets)

    targets.forEach(target=>{
      const targetRow = targetLandedShape[target[0]]
      let targetFill = ''
      const targetColIndex = target[1]
      try {
        targetFill = targetRow[targetColIndex].fillColor
        delete targetRow[targetColIndex].fillColor

        const targetDisplayElement = targetPlayerObject.playMatrix[target[0]][targetColIndex]
        targetDisplayElement.classList.add('explode')
        setTimeout(()=>targetDisplayElement.classList.remove('explode'), 400)

        // reduce full cells count if a cell has been cleared, unless row is populated  due to another player passing a completed row
        if (targetFill !== undefined && targetRow.fullCellsCount > 0 && targetFill !== deadRowFill){
          targetRow.fullCellsCount --
        }
      } catch (e){
        isDebugMode && console.log(e)
      }
    })

    targetPlayerObject.clearPlayAreaView()
    targetPlayerObject.landedShape.draw(targetPlayerObject)
  }
  clearBombCommonTasks(){
    this.playMatrixView.removeEventListener('click',this.handleBombDrop)
    this.playMatrixView.removeEventListener('touchstart',this.handleBombDrop)
    this.playerSection.removeEventListener('mouseleave', this.handleBombOutsideSection)
    this.playerSection.classList.remove('bomb-cursor')
  }
  startGame(firstTetrominoColor){
    this.isGameOngoing = true
    this.newActiveTetromino(firstTetrominoColor)
  }
  newActiveTetromino (fillColor) {
    this.setGameTimer()
    this.activeTetromino = this.newTetromino(fillColor)
  }
  newTetromino(fillColor, shapeChoice) {
    isDebugMode && console.log('newtetr parent:', this)
    shapeChoice = shapeChoice || Math.floor(Math.random() * tetrominoShapes.length)
    isDebugMode && console.log('new shape index:', shapeChoice)
    const shape = tetrominoShapes[shapeChoice]
    return new Tetromino(shape.shapeMap, fillColor || shape.fillColor, this)
  }
  reset(){
    this.stopGameTimer()
    this.isGameOngoing = false
    try {
      this.activeTetromino.clearCurrentLocation()
    } catch (e) {
      isDebugMode && console.log(e)
    }
    this.resumeFromPause()
    this.buildMatrix()
    this.armBomb()
    
    this.playerRowsCleared = 0
    this.playerScore = 0
    this.injectScoreIntoHTML()
  }
  gameTick(){
    isDebugMode && isDebugVerbose && console.log(this.playerName, 'tick')
    this.activeTetromino.moveDown()
    this.checkForCompleteRows()
  }
  setGameTimer(tickSpeed = globalTickTime){
    isDebugMode && console.log(`new game timer.  Player: ${this.playerNumber}, TickSpeed: ${tickSpeed}, GlobalTickspeed: ${globalTickTime}`)
    this.stopGameTimer()
    if (this.isGameOngoing && !globalIsGamePaused){
      return this.gameTimer = setInterval(()=>{
        this.gameTick()
      },tickSpeed)
    }
  }
  stopGameTimer(){
    clearInterval(this.gameTimer)
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
  pauseGame(){
    this.stopGameTimer()
    this.playerSection.querySelector('.pause-overlay').classList.add('enable-overlay')
  }
  resumeFromPause(){
    this.playerSection.querySelector('.pause-overlay').classList.remove('enable-overlay')
    this.setGameTimer()
  }
  loseGame(){
    this.isGameOngoing = false
    this.stopGameTimer()
    this.applyArt(gameOverArtArray, gameOverFill)
    isDebugMode && console.log('Game Over.  player:', this.playerNumber)
    hiscoresManager.checkForNewHiscore(this.playerScore)
  }
  applyArt(artArray, fillColor){
    const translationToCenterX = 15 + Math.floor((playMatrixWidth - 15) / 2)
    const translationToCenterY = Math.floor((playMatrixHeight - artArray.height) / 2)
    artArray.forEach(cell => {
      // play view is mirrored, so mirror array to make drawing art easier.  Center art designed for default grid on other sizes.

      const drawCellY = translationToCenterY + cell[1]
      const drawCellX = translationToCenterX - cell[0]

      const drawCellHasValidPosition = (drawCellY < playMatrixHeight) && (drawCellY >= 0) &&  (drawCellX < playMatrixWidth) && (drawCellX >= 0)
      if (drawCellHasValidPosition){
        toggleElementClassFilled(this.playMatrix[drawCellY][drawCellX], fillColor)
      }
    })
  }
}
class Tetromino {
  constructor(shapeMap, fillColor, parent, baseLocation = tetrominoSpawnYX) {
    isDebugMode && console.log('new tetr spawn at:', baseLocation)
    this.baseLocation = baseLocation
    this.fillColor = fillColor
    this.shapeMap = shapeMap
    this.shapeOffsets = convertShapeMeshToOffsets(shapeMap)
    this.occupiedSpaces = []
    // todo: pass nextOccupiedSpaces directly from function to function ot avoid storage?
    this.nextOccupiedSpaces = []
    this.parent = parent

    isDebugMode && console.log('shape map:',this.shapeMap)
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
  findNextCellsOccupied(){
    // return false if empty, otherwise return first obstructed cell
    let obstructedCell = []
    const allNextCellsClear = this.nextOccupiedSpaces.every(nextMoveCell=>{
      if (nextMoveCell[0] >= 0 &&
        nextMoveCell[1] >= 0 &&
        nextMoveCell[1] < playMatrixWidth &&
        !this.parent.landedShape[nextMoveCell[0]][nextMoveCell[1]].fillColor
      ){
        return true
      }
      obstructedCell = nextMoveCell
      return false
    })
    if (allNextCellsClear){
      return false
    } 
    return obstructedCell

  }
  addToLandedShape(){
    if (
      this.occupiedSpaces.every(cell=>{
        if (cell[0] >= playMatrixHeight){
          this.parent.loseGame()
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

    const interceptOnNextSpaces = this.findNextCellsOccupied()

    if (interceptOnNextSpaces){
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
    
    if (!this.findNextCellsOccupied()){
      this.baseLocation = this.nextLocation
      this.update()
      return true
    }
    return false
  }
  rotateShape(isClockwise = true){
    
    const rotatedShapeMap = rotateMatrix(this.shapeMap, isClockwise)
    const rotatedOffsets = convertShapeMeshToOffsets(rotatedShapeMap)
    const rotatedBaseLocation = [...this.baseLocation]

    this.nextOccupiedSpaces = this.mapOccupiedSpaces(rotatedBaseLocation, rotatedOffsets)
    let nextLocationObstructedCell = this.findNextCellsOccupied()
    
    // check if wallkick allows rotation.  Check additional times for larger shapes
    for (let i = 0;i < Math.floor(this.shapeMap.length / 2); i++){
      if (nextLocationObstructedCell){
        const wallkickDirection = 1 * Math.sign(nextLocationObstructedCell[1] - rotatedBaseLocation[1])
        isDebugMode && console.log('wallkick direction:', wallkickDirection)
        rotatedBaseLocation[1] = rotatedBaseLocation[1] - wallkickDirection

        this.nextOccupiedSpaces = this.mapOccupiedSpaces(rotatedBaseLocation, rotatedOffsets)
        // check that new spaces are free
        nextLocationObstructedCell = this.findNextCellsOccupied()
      }
    }
    if (!nextLocationObstructedCell){
      this.baseLocation = rotatedBaseLocation
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
    player.gameTimer
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
    player.setGameTimer()
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
  const gridRows = !isDebugMode ? rows - globalMaxShapeSize : rows
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

function globalResetGames() {
  // todo if game state is ended, requires doubleclick to clear field
  globalIsGameOngoing = false
  globalIsGamePaused = false
  globalPlayers.forEach(player=>player.reset())
  globalTickTime = defaultGameTickTime
}
function globalStartGames(){
  globalIsGameOngoing = true
  globalPlayers.forEach(player=>{
    let forceTetrColor = null
    isDebugMode && (forceTetrColor = 'red')

    player.startGame(forceTetrColor)
  })
  
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
function resetPlayMatrixSize({ newX = 16, newY = 20 }){
  playMatrixHeight = newY
  playMatrixWidth = newX

  tetrominoSpawnXY = [(playMatrixWidth / 2) - 1,playMatrixHeight]
  tetrominoSpawnYX = [tetrominoSpawnXY[1],tetrominoSpawnXY[0]]

  globalGameStateManager.resetGames()
}
const globalGameStateManager = {
  buttonActivate(){
    if (!globalIsGameOngoing){
      globalGameStateManager.startGames()
    } else {
      globalGameStateManager.resetGames()
    }
  },
  startGames(){
    globalStartGames()
    globalPlayButton.textContent = 'reset'
    globalPlayButton.classList.add('allcaps')
    
    globalNewPlayerButton.removeEventListener('click', addNewPlayer)
    globalNewPlayerButton.classList.add('inactive-element')
  },
  resetGames(){
    globalResetGames()
    globalPlayButton.textContent = 'start game'
    globalPlayButton.classList.remove('allcaps')

    globalNewPlayerButton.addEventListener('click', addNewPlayer)
    globalNewPlayerButton.classList.remove('inactive-element')
  },
}
const shapeCreator = {
  overlay: globalCreateShapeOverlay,
  displayMatrix: [],
  newShapeMap: [],
  newShapeColor: '#b71eff',
  shapeCreatorMatrix: [],
  currentMaxShapeLength: globalMaxShapeSize,
  injectShapeBuilder(currentMaxShapeLength = this.currentMaxShapeLength){
    const displayElement = this.overlay.querySelector('.shape-creator-matrix-container')
    displayElement.innerHTML = ''
    this.newShapeMap = []

    for (let y = 0; y < currentMaxShapeLength ; y++){
      this.newShapeMap.push([])
      
      //count from width-1 to 0 to retain 0,0 at the lower left of the play view
      for (let x = (currentMaxShapeLength - 1); x >= 0; x--){
        const newCell = document.createElement('div')
        
        newCell.dataset.matrixCoordinateY = y
        newCell.dataset.matrixCoordinateX = x

        if (isDebugMode){
          newCell.textContent = `${x}, ${y}`
          newCell.classList.add('debug')
        }


        newCell.addEventListener('click', this.toggleCell)

        displayElement.prepend(newCell)
        this.newShapeMap[y].push(0)
      }
    }
    isDebugMode && console.log('finishedbuilding',this.newShapeMap)
  },
  toggleCell(){
    isDebugMode && console.log('toggle shapecreator:',this)
    
    const mapX = this.dataset.matrixCoordinateX
    const mapY = this.dataset.matrixCoordinateY

    this.classList.toggle('filled')
    // XOR toggles value in shapemap between 0 and 1
    shapeCreator.newShapeMap[mapY][mapX] ^= true

    isDebugMode && isDebugVerbose && console.log('after toggle', shapeCreator.newShapeMap)
  },
  handleColorChange(e){
    isDebugMode && isDebugVerbose && console.log(e.target.value)
    const newColor = e.target.value
    htmlRoot.style.setProperty('--shape-creator-cell-colour', newColor)
    shapeCreator.newShapeColor = newColor
  },
  addNewShapeToShapesArray(){
    isDebugMode && console.log(shapeCreator.newShapeMap, shapeCreator.newShapeColor)
    
    tetrominoShapes.push(new TetrominoShape(shapeCreator.newShapeMap, shapeCreator.newShapeColor))
    globalMaxShapeSize = shapeCreator.currentMaxShapeLength

    globalGameStateManager.resetGames()
    shapeCreator.injectShapeBuilder()
  },
  increaseNewShapeSize(){
    shapeCreator.currentMaxShapeLength++

    htmlRoot.style.setProperty('--shape-creator-matrix-length', shapeCreator.currentMaxShapeLength)

    shapeCreator.injectShapeBuilder()
  },
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
    if (globalIsGameOngoing || isDebugMode ){
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
function handleMobileTouchInput(){
  const targetPlayerNumber = parseInt(this.dataset.playerNumber)
  const action = this.dataset.controlAction
  
  try {
    if (globalIsGameOngoing || isDebugMode ){
      playerControls[action].keydown(targetPlayerNumber - 1)
    }
  } catch (err) {
    if (isDebugMode){
      isDebugVerbose && console.log(err)
      console.log('unrecognised key event:', this)
    }
  }
}
function handlePauseButton() {
  if (globalIsGameOngoing){
    globalIsGameOngoing = false
    globalIsGamePaused = true
    isDebugMode && console.log('game paused')
    globalPlayers.forEach(player=>{
      player.pauseGame()
    })
  } else if (globalIsGamePaused) {
    isDebugMode && console.log('game unpaused')
    globalIsGamePaused = false
    globalIsGameOngoing = true
    globalPlayers.forEach(player=>{
      player.resumeFromPause()
    })
  }
  
}
function handleRedefineInput(){
  if (window.mobileCheck()){
    return false
  }
  redefineKeyMode.isOn = true
  redefineKeyMode.legendElement = this
  this.classList.add('rebinding-input')
}
function addNewPlayer(){
  if (globalIsGameOngoing){
    return false
  }
  // init new play field and return new player number
  return globalPlayers.push(new TetrisGame)
  
}
function handleResizeButton(){
  const newX = parseInt(window.prompt('Resize play field.  Enter new X dimension', 16)) || playMatrixWidth
  const newY = parseInt(window.prompt('Resize play field.  Enter new Y dimension', 20)) || playMatrixHeight

  resetPlayMatrixSize({ newX: newX, newY: newY })
}
function handleCreateShapeOverlay(){
  globalIsGameOngoing && handlePauseButton()
  globalCreateShapeOverlay.classList.toggle('enable-overlay')
}
function stopEventPropagation(e){
  e.stopPropagation()
}

function handleWindowResize(){
  setPlayViewCellHeight(pageMain.querySelector('.play-matrix'))
}

// **************************************************************************
// Events

document.addEventListener('keydown', handleKeyPress)
document.addEventListener('keyup',   handleKeyPress)
globalPlayButton.addEventListener('click',   globalGameStateManager.buttonActivate)
globalNewPlayerButton.addEventListener('click', addNewPlayer)
globalPauseButton.addEventListener('click', handlePauseButton)

globalCreateShapeOverlay.addEventListener('click', handleCreateShapeOverlay)
globalCreateShapeOverlay.firstChild.addEventListener('click', stopEventPropagation)
globalCreateShapeOverlay.querySelector('#new-shape-color').addEventListener('input', shapeCreator.handleColorChange)
globalCreateShapeOverlay.querySelector('#new-shape-add').addEventListener('click', shapeCreator.addNewShapeToShapesArray)
globalCreateShapeOverlay.querySelector('#shape-creator-increase-size-button').addEventListener('click', shapeCreator.increaseNewShapeSize)

if (isDebugMode){
  document.querySelector('head').innerHTML += '<style>* {border: solid rgb(80, 80, 80) 0.2px;}</style>'
  document.querySelectorAll('*').forEach(node=> node.classList.add('debug'))
  setTimeout(()=>{
    globalPlayers.forEach(player=> player.stopGameTimer())
    console.log('game time over')
  },11500)
}

window.onresize =  handleWindowResize

// **************************************************************************
// START GAME
// populate with at least one player
globalPlayers.push(new TetrisGame)
// init highscores + shape creator
hiscoresManager.populateLocalHighscores()
shapeCreator.injectShapeBuilder()

// **************************************************************************