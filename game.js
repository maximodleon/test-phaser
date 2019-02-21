let game
let gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4
  },
  tweenSpeed: 2000,
  swipeMaxTime: 1000,
  swipeMinDistance: 20,
  swipeMinNormal: 0.85
}
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

window.onload = function() {
 let config = {
  width: gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
  height: gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
  backgroundColor: 0xecf0f1,
  scene: [ BootGame, PlayGame ]
 }

 game = new Phaser.Game(config)
 window.focus()
 resizeGame()
 window.addEventListener('resize', resizeGame)
}

function resizeGame() {
  const canvas = document.querySelector('canvas')
  const windowWidth = window.innerWidth 
  const windowHeight = window.innerHeight
  const windowRatio = windowWidth/windowHeight
  const gameRatio = game.config.width/game.config.height

  if(windowRatio < gameRatio){
    canvas.style.width = `${windowWidth}px`
    canvas.style.height = `${windowWidth/gameRatio}px`
  } else {
    canvas.style.width = `${(windowHeight * gameRatio)}px`
    canvas.style.height = `${windowHeight}px`
  }
}

// Scene classes
class PlayGame extends Phaser.Scene {
   constructor() {
      super('PlayGame')
   }

    create() {
      this.boardArray = []
      this.canMove = false
      this.input.keyboard.on('keydown', this.handleKey, this)
      this.input.on('pointerup', this.handleSwipe, this)
      for (let i=0; i < gameOptions.boardSize.rows; i++) {
       this.boardArray[i] = []
       for (let j=0; j < gameOptions.boardSize.cols; j++) {
           let tilePosition = this.getTilePosition(i, j)
           this.add.image(tilePosition.x, tilePosition.y, 'emptytile')
           let tile =this.add.sprite(tilePosition.x, tilePosition.y, 'tiles', 0)
           tile.visible = false
           this.boardArray[i][j] = { tileValue: 0, tileSprite: tile }
          }
        }
        this.addTile()
        this.addTile()
    }

    addTile() {
      let emptyTiles = []
      for(let i = 0; i < gameOptions.boardSize.rows; i++){
         for(let j = 0; j < gameOptions.boardSize.cols; j++) {
            if(this.boardArray[i][j].tileValue === 0) {
              emptyTiles.push({ row: i, col: j })
            }
         }
      }

      if(emptyTiles.length > 0) {
        let chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles)
        this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1
        this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true
        this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0)
        this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0
        this.tweens.add({
             targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
             alpha: 1,
             duration: gameOptions.tweenSpeed,
             callbackScope: this,
             onComplete: () => {
               console.log('tween complete')
               this.canMove = true
             }
        })
      }
    }

    makeMove(direction) {
       console.log('about to move')
    }

    handleKey(event) {
       if(this.canMove) {
         switch(event.code) {
             case 'KeyA':
             case 'ArrowLeft':
                this.makeMove(LEFT)
                break;
             case 'KeyD':
             case 'ArrowRight':
                this.makeMove(LEFT)
                break;
             case 'KeyW':
             case 'ArrowUp':
                this.makeMove(LEFT)
                break;
             case 'KeyS':
             case 'ArrowDown':
                this.makeMove(LEFT)
                break;
         }
       }
    }

    handleSwipe(event) {
       if(this.canMove) {
         let swipeTime = event.upTime - event.downTime
         let fastEnough = swipeTime < gameOptions.swipeTimeMax
         let swipe = new Phaser.Geom.Point(event.upX - event.downX, event.upY - event.upX)
         let swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe)
         let longEnough = swipeMagnitude > gameOptions.swipeMinDistance

         if(longEnough && fastEnough) {
           Phaser.Geom.Point.SetMagnitude(swipe, 1)
           if(swipe.x > gameOptions.swipeMinNormal) {
              this.makeMove(RIGHT)
           }
           if(swipe.x < -gameOptions.swipeMinNormal) {
              this.makeMove(LEFT)
           }

           if(swipe.y > gameOptions.swipeMinNormal) {
              this.makeMove(DOWN)
           }
           if(swipe.y < -gameOptions.swipeMinNormal){
              this.makeMove(UP)
           }

         }
       }
    }

    getTilePosition(row, col) {
      let posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5)
      let posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5)

      return new Phaser.Geom.Point(posX, posY)
    }
}

class BootGame extends Phaser.Scene {

  constructor() {
    super('BootGame') 
  }

  preload(){
   this.load.image('emptytile', 'assets/sprites/emptytile.png')
   this.load.spritesheet('tiles', 'assets/sprites/tiles.png', {
       frameWidth: gameOptions.tileSize,
       frameHeight: gameOptions.tileSize
   })
  }

  create() {
    this.scene.start('PlayGame')
  }
}
