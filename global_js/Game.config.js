


import Game from '../hangman/scenes/Game.scene.js'
import GUI from '../hangman/scenes/GUI.scene.js'
import Screen from '../hangman/scenes/screen.scene.js'



const config = {
    type:Phaser.WEBGL,
    width:920,
    height:1420,
    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    backgroundColor:'#1B1E34',
    scene:[Game,GUI,Screen]
    
}

let game = new Phaser.Game(config)