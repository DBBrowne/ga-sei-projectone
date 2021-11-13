/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */
const { it, expect } = require('@jest/globals')
const fs = require('fs')

window.document.body.innerHTML = fs.readFileSync('../index.html')

const tetr = require('./tetris.js')

describe('basic JS file connection',()=>{
  it('should work', ()=>{
    expect(tetr.testJestConnection()).toBe('hello')
  })
})

describe('Tetromino class', ()=>{
  it('should return a Tetromino at the spawn point',()=>{
    testRedSquareTetr = new tetr.Tetromino(([[0,0], [0,1], [1,0], [1,1]],'red'))
    expect(testRedSquareTetr.baseLocation).toEqual([20,7])
  })

  it('should move',()=>{
    testRedSquareTetr = new tetr.Tetromino(([[0,0], [0,1], [1,0], [1,1]],'red'))
    it('to the left',()=>{
      const priorLocation = testRedSquareTetr.baseLocation
      const attemptMove = [0,1]
      const expectPostMoveLocation = [priorLocation[0] + attemptMove[0],priorLocation[1] + attemptMove[1]]

      testRedSquareTetr.move(attemptMove)

      expect(testRedSquareTetr.baseLocation).toEqual(expectPostMoveLocation)
    })
    it('to the right',()=>{
      const priorLocation = testRedSquareTetr.baseLocation
      const attemptMove = [1,0]
      const expectPostMoveLocation = [priorLocation[0] + attemptMove[0],priorLocation[1] + attemptMove[1]]

      testRedSquareTetr.move(attemptMove)

      expect(testRedSquareTetr.baseLocation).toEqual(expectPostMoveLocation)
    })
    it('but not out of play bound left',()=>{
      const priorLocation = [22,0]
      testRedSquareTetr.baseLocation = priorLocation
      const attemptMove = [0,-1]

      testRedSquareTetr.move(attemptMove)

      expect(testRedSquareTetr.baseLocation).toEqual(priorLocation)
    })
    it('but not out of play bound left',()=>{
      const priorLocation = [22,14]
      testRedSquareTetr.baseLocation = priorLocation
      const attemptMove = [0,1]

      testRedSquareTetr.move(attemptMove)

      expect(testRedSquareTetr.baseLocation).toEqual(priorLocation)
    })
  })
})

// it('should use jsdom in this test file', () => {
//   const element = document.createElement('div')
//   expect(element).not.toBeNull()
// })

// too much work to mock document at this point in my career.
// describe('buildPlayMatrix',()=>{
//   it('should build an array of length = playWidth * playHeight', ()=>{
//     it('should return a length of 384 with = 24, h=16')
//     expect(tetr.buildPlayMatrix(24,16).flat().length).toEqual(384)
//   })
// })