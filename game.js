let game
let gameOptions = {
  tileSize: 200,
  tileSpacing: 20,
  boardSize: {
    rows: 4,
    cols: 4
  }
}

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
      for (let i=0; i < gameOptions.boardSize.rows; i++) {
       for (let j=0; j < gameOptions.boardSize.cols; j++) {
           let tilePosition = this.getTilePosition(i, j)
           this.add.image(tilePosition.x, tilePosition.y, 'emptytile')
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
  }

  create() {
    this.scene.start('PlayGame')
  }
}
