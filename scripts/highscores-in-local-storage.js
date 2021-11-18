
const storageDebugMode = true

const localHiscoresStorageKey = 'tentris-hiscores'

const winningscore = 650

storageDebugMode && console.log('local storage', localHiscoresStorageKey,':' , localStorage.getItem(localHiscoresStorageKey))

function setLocalHiscores(newHiScores, key=localHiscoresStorageKey){
  const newHiscoresString = JSON.stringify(newHiScores.map((record=>JSON.stringify(record))))
  localStorage.setItem(key, newHiscoresString)

  storageDebugMode && console.log('new local highscores : ',newHiscoresString)
  return newHiscoresString
}

if (!localStorage.getItem(localHiscoresStorageKey)){
  const defaultHiscores = [ { playerName: 'abc', score: 1000 }, { playerName: 'def', score: 900 },{ playerName: 'ghi', score: 800 },{ playerName: 'jkl', score: 700 },{ playerName: 'mno', score: 600 },{ playerName: 'pqr', score: 500 },{ playerName: 'stu', score: 400 },{ playerName: 'vwx', score: 300 },{ playerName: 'yza',score: 100 },{ playerName: 'bcd', score: 50 } ]
  
  setLocalHiscores(defaultHiscores)
}

const localHiscores = JSON.parse(
  localStorage.getItem(localHiscoresStorageKey)
)

storageDebugMode && console.log(localHiscores)

if (winningscore > localHiscores[localHiscores.length - 1].score){
  storageDebugMode && console.log('New High Score!')
  //capture name
  const playerName = 'winrararar'

  const newHiscore = { playerName: playerName, score: winningscore }

  localHiscores.pop()
  console.log('popped', localHiscores)
  localHiscores.push(newHiscore)
  localHiscores.sort((a, b) => b.score - a.score)

  localStorage.setItem(localHiscoresStorageKey, localHiscores)
}
console.log(localHiscores)