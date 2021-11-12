/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */
const tetr = require('./tetris.js')

it('should work', ()=>{
  expect(tetr.testJestConnection()).toBe('hello')
})

it('should use jsdom in this test file', () => {
  const element = document.createElement('div')
  expect(element).not.toBeNull()
})

// too much work to mock document at this point in my career.
// describe('buildPlayMatrix',()=>{
//   it('should build an array of length = playWidth * playHeight', ()=>{
//     it('should return a length of 384 with = 24, h=16')
//     expect(tetr.buildPlayMatrix(24,16).flat().length).toEqual(384)
//   })
// })