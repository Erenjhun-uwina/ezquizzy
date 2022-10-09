
export default class Screen extends Phaser.Scene{

    constructor(){
        super('Screen')
    }

    create(){
        this.scene.setVisible(false)
        this.add.image(200,200,'char')
        this.add.image(500,700,'char')
    }

}