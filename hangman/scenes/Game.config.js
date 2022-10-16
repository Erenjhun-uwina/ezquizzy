


import Game from './Game.scene.js'
import GUI from './GUI.scene.js'



const config = {
    type:Phaser.WEBGL,
    width:920,
    height:1420,
    scale:{
        mode:Phaser.Scale.FIT,
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    backgroundColor:'#1B1E34',
    scene:[Game,GUI]
    
}

let game = new Phaser.Game(config)

