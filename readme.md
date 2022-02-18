![tetris_1280](https://user-images.githubusercontent.com/72463218/154482287-a9489ad1-9c7a-44c3-8795-5c84717207ee.png)
# teNtris
|n-player Tetris, with||
|---|---|
|- local multi-player |- local hi-scores|
|- customisable Tetrominoes|- mobile touch functionality|
|- resizable play field||
|- redefinable controls|-  and ... bombs?!?|

Deployed at [tentris.dbb.tools](https://tentris.dbb.tools) via [Netlify](https://netlify.com/) and [on Github Pages](https://dbbrowne.github.io/ga-sei-projectone/).

## Contents
- [TeNtris](#tentris)
- [Demos](#demos)
- [Usage](#usage)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Links](#links)
- [Overview](#overview)
    - [Architecture](#architecture)
    - [Core Behaviour](#core-behaviour)
    - [Project History](#project-history)
        - [Brief](#brief)
        - [Planning](#planning)
        - [Wireframes](#wireframes)
        - [Project Plan](#project-plan)
        - [Build Execution](#build-execution)
    - [Known Bugs](#known-bugs)
    - [Challenges](#challenges)
    - [Wins](#wins)
    - [Future Features](#future-features)
    - [Key Lessons](#key-lessons)
- [Team Members](#team-members)

## Demos
https://user-images.githubusercontent.com/72463218/154386454-24478f2b-5fcc-41ad-8b0c-af8a3d1d7545.mp4

|Mobile|Multiplayer|
|:---:|:---:|
|![tentris_mobile](https://user-images.githubusercontent.com/72463218/154389077-ac9df77d-5035-47bc-8f4d-8ded16102e51.gif)|![tentris_multiplayer](https://user-images.githubusercontent.com/72463218/154381809-3460974a-ccbb-4d5c-bc86-a793fb0ba526.gif)|
## Usage

### Tetris, with N-players.
Move pieces left and right, and rotate them, to fill rows of your play field.  Don't let the Tetrominoes reach the top row!
#### Click New Player to add a player to your game.  

 - Players 1 and 2 have default controls.  Click the control listing in the player's key to (re)define the control for that player.
 - Complete a line (or many at once) to block lines in all other player's fields.
 - Knock out all other players to win!


#### Click to equip your bomb.
 - Click again to blow up a section of your play field.

#### Resize all playfields with the Resize button.  
 - Layout starts to have problems at around 100x100.

#### Add new custom Tetromino shapes with the "create shape" button.

#### Score a hiscore to save your score and initials.

#### Tap the buttons on mobile to control the game.


## Technologies
|- HTML<br>- CSS<br>- JavaScript|- StackOverflow<br><br>- Coffee|
|---|---|
## Getting Started
These instructions will run a copy of the project on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

#### Running Locally
Open `index.html` in a web browser.

#### Deployment
Deploy to any static site hosting service, e.g. Github Pages.

## Links
- [Project Board / Issues](https://github.com/users/DBBrowne/projects/1)
- [Wireframes](https://github.com/DBBrowne/ga-sei-projectone/wiki/initial-layouts)

****

## Overview
## Architecture
- [globalPlayers](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L53) holds an array of [TetrisGame](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L323)s, which populate the DOM with their UI on initialisation.
- Each TetrisGame holds references to its DOM elements for rendering, a map of the cells occupied by the placed Tetrominoes in its [landedShape](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L289-L321), and an [activeTetromino](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L646).
- The [keypress handler](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L1103) passes input through the control handlers to the method on the target player's active Tetrominoes:
    ```js
    function handleKeyPress(e) {
      // ...
      inputKeyBindings[e.code].control[e.type](keyBoundPlayerIndex, e.repeat)
      // ...
    }
    ```
    - [mobile touch controls](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L1135-L1149) are handled in fundamentally the same manner.
- the [globalGameStateManager](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L1003-L1027) starts, stops, and resets games.

## Core Behaviour
- [Checks for mobile browsers](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L17-L24) to enable touch functionality on mobile devices with high resolution screens.
- [Debug Modes](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L40-L42) for more console feedback and an auto pause, that maintains user input, after the first block would hit the bottom of the play field at default game speed to aid debugging.
- [Default settings](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L62-L67) set the initial time between game ticks and score scaling.
- [Initial tetromino matrix meshes](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L77-L136) which are transformed into [renderable offsets](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L871-L877) of cells for rendering via their [css classes](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L909-L919).
- [inputKeyBindings](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L217) hold key mappings for each player and translate these through the [playerControls](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L147) object to each `TetrisGame`.
- [gameTimers](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L578-L586) on each player's `TetrisGame` control the interval between each processing of a [gameTick](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L573-L577).  Each `gameTick`, rotation, or horizontal movement triggers a check that the next space is free to move or rotate into, moves the shape if possible, and checks for any completed rows.
- The [hiscoresManager](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L784) handles storing and retrieving hiscores when each player loses their game, and populates the scrolling hiscores display.
- The [shapeCreator](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L1028) displays a modal overlay allowing the user to create their own custom Tetrominoes, managing any necessary playfield size changes required to correctly deploy the new shapes.
- A [window resize listener](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L1198-L1200) retains playfield aspect ratios as the window is resized.


## Project History

### Brief
Software Engineering Immersive Project 1 - MyFirstJavaScript  

Individually, build a game from the subset of choices available in [/brief/briefs](/brief/briefs).

Top of the difficulty list?  2 player tetris.  So here's n-player Tetris.  
**Timeframe**: 7 days.

### Planning
Once one-player tetris is working, as a "player" or "playspace" object in JS, it should be easy to duplicate that object, then add some extra functionality to make the player objects interact.

Handle all gameplay in a data layer (ie JavaScript objects), use HTML DOM only to render the state of the data layer.

As all JavaScript will be in a single file, code order is not entirely optimal for readability to ensure correct initialisation order.

[Github Projects Beta](https://github.com/users/DBBrowne/projects/1) provided a framework to assemble a Kanban style board of issues, broken down into the smallest possible steps, to ensure a working MVP was released asap. Github issues provided an organised place to include pseudocode where a possible solutions occurred to problems that were not yet prioritised.

### Wireframes:
Designed with mobile in mind, the original design required little more than a max-width media query to switch the main Section flex direction to column to achieve a functional mobile view.

|MVP - 1 player desktop Tetris| 1 player mobile view|multi-player desktop view|
|:---:|:---:|:---:|
|![Tetris - Desktop V1_2021-11-11](https://user-images.githubusercontent.com/72463218/141463233-12e04551-f901-4dc2-bfc0-206d7f88ca0e.jpg)|![Tetris - Mobile-V1_2011-11-11](https://user-images.githubusercontent.com/72463218/141463270-9a049220-a2ec-458f-9147-3451f8f986fb.jpg)|![Tetris - Desktop v2 + mobileRotated V2_2011-11-11](https://user-images.githubusercontent.com/72463218/141463202-cdf54922-05f3-429b-9816-6213b8375ea9.jpg)|

Tetrominoes:
<figure class="pi-item pi-image" data-source="image">
	<a href="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest?cb=20090706171943" class="image image-thumbnail" title="">
		<img src="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/350?cb=20090706171943" srcset="https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/350?cb=20090706171943 1x, https://static.wikia.nocookie.net/tetrisconcept/images/c/ca/Tetromino_image.png/revision/latest/scale-to-width-down/700?cb=20090706171943 2x" class="pi-image-thumbnail" alt="" data-image-key="Tetromino_image.png" data-image-name="Tetromino image.png" width="270" height="90">
	<figcaption class="pi-item-spacing pi-caption">The various types of tetrominoes, from tetris.fandom.com</figcaption>
  </a>
</figure>

Although I had wanted to follow a TDD-lite approach, building tests where possible, I was unable to get Jest up and running with the knowledge I had at the time and moved on without it.  There were certainly a number of bugs in the development process that could have been resolved a lot faster if the developer's errors had been exposed by unit tests, even if only written during the troubleshooting phase.  This was particularly apparent when certain parts of the tetromino movement and interactions were reversed.  
### Implementation Notes
- Use a 2D matrix to hold the play field data layer.  Inject this into the HTML to retain flexibility.
- Use a CSS normalizer.
 ### Project Plan

1. Basic DOM layout to provide containers for JS DOM manipulation.
1. Represent the simplest tetromino in the data layer.
1. Render tetromino on page.
1. Core gameplay ticks - piece moves down, stops when it hits a border or an occupied space.
1. Player control - movement.
1. More Tetromino shapes.
1. Tetromino rotation.
1. Game Over handling - alert user, stop gameplay.
1. ***MVP DONE*** - We have a game that meets the specified brief.
1. Refactor to a Class, and duplicate the player object.
1. Separate controls.
1. Competitive interactions - one players completing a row adds to other's blocked rows.
1. ***2-Player complete*** - Stretch goals met, on to fun additions.
1. Wallkicks
1. Game art - Draw pixel art into the playFields for, eg, GameOver.  

      *As we've built ina  flexible manner, show that off :*  
1. Dynamically resize play fields.
1. Create Custom Shape modal with colourpicker.
1. Bombs?  Bombs.


### Execution and Lessons Learned
1. Basic DOM layout:
    - Use blocks of bright colours to fill the initial dom layout and [inject playfield](https://github.com/DBBrowne/ga-sei-projectone/commit/0951355c4890512d1a1837e1549b458616e07aa3):
    ```js
    const playMatrixHeight = 24
    const playMatrixWidth = 16
    const playMatrix = []

    // * Build play window
    function buildPlayMatrix(height, width){
      for (let x = 0; x < height; x++){
        playMatrix.push([])
        for (let y = 0; y < width; y++){
          const playCell = document.createElement('div')
          playCell.textContent = `${x}, ${y}`
          
          playMatrixView.appendChild(playCell)
          playMatrix[x].push(playCell)
        }
      }
      return playMatrix
    }

    buildPlayMatrix(playMatrixHeight, playMatrixWidth)
    ```
1. Represent the O tetromino in the data layer, and
1. [Render on page](https://github.com/DBBrowne/ga-sei-projectone/commit/2fd61e4aecfa63982a9890025323c1609188ff19):
    - Build a reusable object that takes the desired shape as a 2x2 matrix:
        ```js
        class Tetromino {
          constructor(shapeOffsets, fillColor = 'red'){
            this.location = TetrominoSpawnRef
            this.occupiedSpaces = shapeOffsets.map((offset)=>{
              return [TetrominoSpawnRef[0] + offset[0],TetrominoSpawnRef[1] + offset[1]]
            })
            this.fillColor = fillColor
          }
          colorPlayMatrixView(){
            console.log('coloring', this.fillColor)
            this.occupiedSpaces.forEach((space)=>{
              playMatrix[space[0]][space[1]].style.backgroundColor = 'red' //`"${this.fillColor}"`
            })
          }
        }

        activeTetromino = new Tetromino([[0,0], [0,1], [1,0], [1,1]])
        activeTetromino.colorPlayMatrixView()
        ```
1. Core gameplay ticks:
    - Build a function that moves the active tetromino in the data layer, then re-renders the playfield.  Call that function on a timer to progress the game.  (If only I knew about React at this stage!)
        ```js
        function gameTick(){
          activeTetromino.baseLocation[0]--
          activeTetromino.updateOccupiedSpaces()
          activeTetromino.colorPlayMatrixView()
        }
        const gameTimer = setInterval(()=>{
          gameTick()
        },400)
        ```
    - Why is the game state getting into an infinite loop of thinking it has a collision when spawning a new tetromino?  
        - Because there's an accidental reference between Tetromino current location from spawn location.  [Break it.](https://github.com/DBBrowne/ga-sei-projectone/commit/04e34f46acf3d28afae9bb0a06d8b5a251338c8b):
        ```diff
        -  this.baseLocation = TetrominoSpawnRef
        +  this.baseLocation = [...TetrominoSpawnRef]
        ```
1. Player controls:
    - Speed up the game / drop pieces by simply speeding up the game timer on keypress.  Reuse our collision detection functionality to detect if horizontal movement should be allowed.
    - How can we DRY with all the inputs that will be required, and design to accommodate upcoming multiplayer?  
    This was an interesting exercise in thinking through object boundaries and how to avoid generating excessive numbers of duplicated methods.
        - Define some [control functions](https://github.com/DBBrowne/ga-sei-projectone/blob/13db6485e0166be5a4ec88be3169e1c49ba3c1ac/scripts/tetris.js#L38-L81)
          ```js
          const playerControls = {
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
            // ... other controls
          },
          ```
        - Assemble an object to [reference them by a keyCode](https://github.com/DBBrowne/ga-sei-projectone/blob/13db6485e0166be5a4ec88be3169e1c49ba3c1ac/scripts/tetris.js#L83-L100) (and include a symbol for the controls legend)
          ```js
            const playerInputScheme = {
              ArrowDown: {
                name: '&#8595;',
                control: playerControls.speedUpPlay,
              },
              // ... other controls
            }
          ```
        - Capture keystrokes, and [pass them through the control handlers](https://github.com/DBBrowne/ga-sei-projectone/blob/13db6485e0166be5a4ec88be3169e1c49ba3c1ac/scripts/tetris.js#L235-L247):
          ```js
          function handleKeyPress(e) {
            try {
              playerInputScheme[e.code].control[e.type]()
            } catch (err) {
              console.log('unrecognised key event:', e.code, e.type)
            }
          }

          document,addEventListener('keydown', handleKeyPress)
          document,addEventListener('keyup',   handleKeyPress)
          ```
1. More shapes, and ...
1. Rotation
    - After a little research and trial-and-error, discover that you can rotate 2-dimensional matrices by transposing, then reversing:
      ```js
      function rotateMatrix(matrix, isClockwise = true){
          //rotate clockwise by default
          if (isClockwise){
            //transpose, then reverse row content
            return matrix.map((val, index) => matrix.map(row => row[index]).reverse())
          }
          //transpose, then reverse column content
          return matrix.map((val, index) => matrix.map(row => row[index])).reverse()
        }
      ```
1. Game Over handling - alert user, stop gameplay.
1. ***MVP DONE*** - We have a game that meets the specified brief.
1. Refactor the game into a Class, and [duplicate it as a Player object](https://github.com/DBBrowne/ga-sei-projectone/commit/3ed0ba715da4e552491bfd21d650fd682900b70f).
    - Pleasantly simple!  Move some DOM references into a Class, set up an array to hold all the players, and push new player, then [build a playfield](https://github.com/DBBrowne/ga-sei-projectone/commit/10a9f27ce3fd5f2f7778491f19fffbff46418873) for them!
      ```js
      const players = []

      class TetrisGame {
        constructor(playerNumber = 1, displayParent = pageMain){
          this.playerNumber = playerNumber
          this.playerName = 'player' + playerNumber
          this.displayParent = displayParent
          this.coreHTML = playerCoreHTML

          this.initPlayspace()
        }

        initPlayspace(){
          const newPlayerSection = document.createElement('section')
          newPlayerSection.classList.add(this.playerName)
          newPlayerSection.innerHTML = this.coreHTML

          this.displayParent.appendChild(newPlayerSection)

          this.playerSection = newPlayerSection
        }
      }

      players.push(new TetrisGame)
      buildNewPlayMatrix(rows, columns, playMatrixView)
      ```
1. Separate controls.
    - Attach a playerId to each set of controls, and pass that through the control handlers to call the required method on the correct player's object without duplicating code or objects.
1. Competitive interactions - one player completing a row adds to other's blocked rows.
    - Some refactoring to correctly handle moving another playfield against the normal flow of the game.
1. ***2-Player complete*** - Stretch goals met, on to fun additions.
    - A titanic battle - allowing responsive design, that resizes across screen sizes and with additional players being added, whilst retaining ***SQUARE*** cells without spaces between them.  After nearly an entire day spent on various attempts that almost met all of these criteria, a solution was found.  Allow FlexBox to set one dimension of a cell, then [use JS to set a CSS variable which fixes the other](https://github.com/DBBrowne/ga-sei-projectone/commit/7d46edc8d9a8cbf24406693e40dc98996892c2e6).
1. [Wallkicks](https://github.com/DBBrowne/ga-sei-projectone/blob/c9ed2626c66529b2bbfe4af3c9611caf4deb54df/scripts/tetris.js#L761-L779) - Attempted rotation into an occupied or offgrid space attempts to move the tetromino away form the obstruction.  If that movement is permitted, move the tetromino.  
    - Surprisingly slow to convert from pseudocode to functioning due to an error in the chosen vector through the playfield.
1. Game art - Draw art into the playFields for, eg, GameOver.  

      *As we've built in a flexible manner, show that off :*  
1. Dynamically resize play fields.
1. Create Custom Shape modal with colourpicker.
1. Bombs?  Bombs.
    - An interesting exercise in DOM manipulation gathering the correct element from the cursor, and recursively mapping an explosion.


## Known Bugs
- If the game is ended, the reset button requires two clicks to reset the game state.
- Inconsistent behaviour had been observed the using the bomb.  The fixes in place do not seem to have resolved this in all circumstances.

## Challenges
- Retaining aspect ratios with responsive design and flexboxes is a little tough.
## Wins
- Project went broadly to plan.  Vertical execution of the basic game followed by horizontal expansion into multiplayer worked well.
- JavaScript understanding greatly improved.
- Built an understanding of DOM event bubbling.

## Future Features
[Project Board / Outstanding Issues](https://github.com/users/DBBrowne/projects/1)
- Better styling.  It was supposed to be retro, but this is maybe too retro.
- Sound effects
- Display next incoming shape to user, and allow swapping current shape into storage.  
<br>

- Refactor the checks for next occupied spaces to reduce the number of intermediate states that ate stored on the Tetromino objects.
- Reduce some of the mutually exclusive flags to enums (eg debug modes, gameOngoing states).
- Refactor the `Tetromino.moveDown` method into `.move([vector])` .  Alternatively, MoveDown is a special state as it can trigger `Tetromino.addToLandedShape`, so it may be clearer if it remains separate.

## Key Lessons
- Keep committing frequently, this makes backtracking and experimenting easier.
- Quickly building some testing or console.assert() to ensure that difficult to visualise code is behaving as expected would be very valuable.
- CSS variables.
- Keeping a project board as a place to drop issues and to stay focussed on the next-most-important task is vital.
- A designer would be really valuable to reduce indecision at design and CSS time.


## Team Members
- [Duncan Browne](https://github.com/dbbrowne)