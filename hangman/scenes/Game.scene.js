
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));

let WIDTH,
	HEIGHT,
	GUI,
	words,
	player = {},
	enemy = {},
	initialized,
	txts

import DB from "../../global_js/database.js"
const db = new DB

export default class Game extends Phaser.Scene {

	constructor() {
		super("Game")
	}

	preload() {
		WIDTH = this.game.canvas.width
		HEIGHT = this.game.canvas.height
		
		txts = this.add.text(WIDTH / 2, HEIGHT / 2, "LOADING....", {
			font: "5rem superstarregular",
		}).setOrigin(0.5)


		//load music path
		this.load.setPath('../../global_assets/music')
		this.load.audio('fight', 'fight.wav')

		//
		this.load.setPath('../../global_assets/img')
		this.load.atlas('bonk', 'bonkfx.png', 'bonkfx.json')


		//load enemy atlas path
		this.load.setPath('../../global_assets/img/lavabee')
		this.load.atlas('lavabee', 'spritesheet.png', 'spritesheet.json')

		//load ui path
		this.load.setPath('../../global_assets/img/ui')
		this.load.atlas('hpbar', 'spritesheet.png', 'spritesheet.json')
		this.load.image("btn0_lowres", "btn0_lowres.png")
		this.load.image("btn1_lowres", "btn1_lowres.png")
	}


	create() {
		console.log("hangman game start!!")
		

		txts.setText('start').setDepth(2)
		this.add.image(WIDTH/2,HEIGHT/2,'btn0_lowres').setOrigin(0.5,0.45)

		GUI = this.scene.get("GUI")

		window.onpointerup = ()=>this.user_start()
	}
	user_start(){

		console.log(this);
		if (!GUI) return GUI = this.scene.get("GUI")
		window.onpointerup = null
		this._init()
	}

	async _init() {
		
		if (initialized) return
		initialized = true
		
		const url = new URLSearchParams(window.location.search);
		const code = url.get("code").split('-').join('').toLowerCase()

		const game = await db.query_game(code)
		words = [...game.words]

		if (game.shuffle && !(game.shuffle === 'false')) words.shuffle()
		this.words = words

		//player vars
		this.player = player
		player.hp = game.hp
		player.mhp = game.hp
		player.score = 0
		player.regen = game.regen
		//enemy vars
		this.enemy = enemy
		//game
		this.lv = 0
		this.fight()
		this.sound.play('fight', { loop: true })
	}

	fight() {
		console.log('fight')
		if (words.length < 1) return
		this.lv++
		const word = [...this.getWord(words)]
		this.word = word

		enemy.mhp = word.length
		enemy.hp = word.length

		let guessed = word.map(() => "-")
		this.guessed = guessed

		const word_keys = [...word]

		const level = 1
		const num_of_random_keys = level * 5

		//generate random letters besides the word's letters
		const excess = this.shuffle_slice(word_keys, num_of_random_keys)
		this.excess_keys = excess

		GUI = this.scene.start('GUI')
	}

	attack(key) {
		const { word, guessed } = this
		let dmg = 0

		word.forEach((e, i) => {
			if (e == key) {
				guessed.splice(i, 1, key)
				dmg++
			}
		});

		enemy.hp -= dmg
		player.score += dmg

		this.events.emit("attack", { guess: guessed })
		if (enemy.hp > 0) return

		player.hp = Math.min(player.hp += player.regen, player.mhp)
		this.events.emit("VICTORY")
	}

	defend() {

		player.hp -= 1
		this.events.emit("defend")
		if (player.hp <= 0) this.events.emit("DEFEAT")
	}

	guess(key) {

		const { word, guessed } = this
		const success = this.word.includes(key)

		if (!success) return this.defend()
		this.attack(key)
	}

	getWord(words) {

		//returns a uppercased word then removes it from the list
		const nw = words.splice(0, 1)
		const ucw = nw[0].toUpperCase()

		return ucw
	}


	shuffle_slice(keys, num) {

		const rand_keys = alphabet.filter(e => !keys.includes(e))
		return rand_keys.slice(0, num).concat(keys).concat(["A", "O", "E"])
	}
}



Array.prototype.shuffle = function () {

	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this
}