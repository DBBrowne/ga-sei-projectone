// const object = {}

// function test() {
//   return [1,2]
// }

// [object.prop1, object.prop2] =  test()

// console.log(object.prop1)
// console.log(object.prop2)


const playerControls = { //todo: refactor into TetrisGame object
  // todo: setter: legendClassName = 'input-symbol-' + playerControls[controlAction].name.toLowerCase().replace(/ /g,'-')
  moveLeft: {
    displayName: 'Move Left',
    legendClassName: 'input-symbol-move-left',
    keydown(targetPlayerIndex){
      globalPlayers[targetPlayerIndex].activeTetromino.move([0,1])
    },
    keyup(){
      return 'event inactive'
    },
  },
}
console.log(Object.getOwnPropertyNames(playerControls.moveLeft))
// console.log(playerControls.moveLeft.getOwnProperties())

const obj1 = {}
const obj2 = obj1


console.log(!!(obj1 === obj2))