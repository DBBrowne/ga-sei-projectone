
const localStorageDebugMode = true

const localHiscoresStorageKey = 'tentris-hiscores'

const winningscore = 650

localStorageDebugMode && console.log('local storage', localHiscoresStorageKey,':' , localStorage.getItem(localHiscoresStorageKey))

const localHiscores = {
  records: [],
  lowestScore: 0,
  setStoredHiscores(newHiScores = this.records, key = localHiscoresStorageKey){
    const newHiscoresString = JSON.stringify(newHiScores.map((record=>JSON.stringify(record))))

    localStorage.setItem(key, newHiscoresString)

    localStorageDebugMode && console.log('new local highscores : ',newHiscoresString)

    return newHiscoresString
  },
  populateLocalHighscores(key = localHiscoresStorageKey){
    // if key does not exist set to default.  If key exists already, set this.records and return parsed contents.

    const localStorageItem = localStorage.getItem(key)

    if (!localStorageItem){
      localStorageDebugMode && console.log('no Hiscores found.  Setting to default')

      const defaultHiscores = [ { playerName: 'abc', score: 1000 }, { playerName: 'def', score: 900 },{ playerName: 'ghi', score: 800 },{ playerName: 'jkl', score: 700 },{ playerName: 'mno', score: 600 },{ playerName: 'pqr', score: 500 },{ playerName: 'stu', score: 400 },{ playerName: 'vwx', score: 300 },{ playerName: 'yza',score: 100 },{ playerName: 'bcd', score: 50 } ]

      return this.setStoredHiscores(defaultHiscores)
    }

    const parsedLocalItem = JSON.parse(
      localStorage.getItem(localHiscoresStorageKey)
    ).map(record=>JSON.parse(record))
      
    this.records = parsedLocalItem
    this.setLowestScore()
    localStorageDebugMode && console.log(this.records)
    return parsedLocalItem
  },
  setLowestScore(){
    this.lowestScore = this.records[this.records.length - 1].score
  },
  addNewRecordToHiscores(playerName, newScore){
    // todo: refactor to add new high score above existing matching scores
    this.records.pop()
    this.records.push({ playerName: playerName, score: newScore })
    this.records.sort((a, b) => b.score - a.score)

    this.setStoredHiscores()
    return true
  },
  checkNewHiscore(newScore){
    if (newScore < this.lowestScore){
      localStorageDebugMode && console.log('Score lower than minimum')
      return false
    }
    localStorageDebugMode && console.log('New High Score!')
    const newRecordPlayerName = this.capturePlayerName()

    this.addNewRecordToHiscores(newRecordPlayerName, newScore)

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
  },
}


localHiscores.populateLocalHighscores()
// localHiscores.checkNewHiscore(winningscore)

console.log(localHiscores.populateLocalHighscores())