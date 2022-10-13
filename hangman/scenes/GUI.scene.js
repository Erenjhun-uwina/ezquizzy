
import * as Uis from '../../global_js/Ui.js'
import Screen from './Screen.scene.js'

let WIDTH, HEIGHT, GAME, UI

export default class GUI extends Phaser.Scene {
	constructor() {
		super("GUI")
	}

	create() {
		UI = {}//resets UI
		WIDTH = this.game.canvas.width
		HEIGHT = this.game.canvas.height
		GAME = this.scene.get("Game")
		this.display_UIs()
		this.init_events()
	}

	display_UIs() {

		const word = GAME.guessed
		this.create_anims()
		this.display_visual_panel()
		this.display_blank_panel(word)
		this.display_hint()
		this.display_keyboard()

		this.display_lv()
		this.display_hp()
		this.display_ehp()

		this.rt = this.add.renderTexture(0, 0, WIDTH, HEIGHT).setOrigin(0).setDepth(100)
		const { rt } = this
		rt.fill(0x1B1E34, 1)
		rt.setInteractive()
		this.fade()
	}

	display_lv() {
		UI.lv = this.add.text(
			35, 30, "lv:0", { font: "2.5rem superstarregular", color: 'black' }
		);

		this.update_lv()
	}

	display_hp() {
		UI.hp = this.add.text(
			35, 550, "HP:0", { font: "2.5rem superstarregular" }
		)
		this.update_hp(false)
	}

	display_ehp() {

		UI.ehp = this.add.text(
			WIDTH - 30, 30, "", { font: "2.5rem superstarregular" }
		)
			.setOrigin(1, 0)
		this.update_ehp()
	}

	update_hp(animate = true) {
		this.toggle_hint(false)
		const php = UI.hp
		php.setText(`HP:${GAME.player.hp}`)

		const { mhp, hp } = GAME.player

		php.setText(`HP:${hp}`)
		const hp_percent = 2 * hp / mhp

		UI.panel.hp.setScale(hp_percent, 2)


		if (!animate) return UI.panel.hp_1.setScale(hp_percent, 2)
		this.tweens.add({
			targets: UI.panel.hp_1,
			scaleX: hp_percent,
			duration: 2000,
			ease: 'Power2'
		});
	}

	update_lv() {
		const { lv } = UI
		lv.setText(`lv:${GAME.lv}`)
	}

	update_ehp() {
		this.toggle_hint(false)
		const { ehp } = UI
		const { mhp, hp } = GAME.enemy

		ehp.setText(`HP:${hp}`)
		const hp_percent = 2 * hp / mhp
		UI.panel.ehp.setScale(hp_percent, 2)

		this.tweens.add({
			targets: UI.panel.ehp_1,
			scaleX: hp_percent,
			duration: 2000,
			ease: 'Power2'
		});
	}

	update_blanks(guess) {

		const { txt } = UI.blanks
		txt.setText(guess.join(""))
	}

	display_hint() {
		if (!GAME.hint) return
		UI.hint = new Uis.Panel(this, 20, 640, WIDTH - 40, 240, 0xEC9A6D)
		UI.hint.bg.setStrokeStyle(10, 0xC24B6E)
		UI.hint._state = 'inactive'
		UI.hint.setScale(0, 1)

		UI.hint_icon = this.add.circle(80, 700, 40).setInteractive()
			.on('pointerup', () => {
				this.toggle_hint()
			}
			);

		this.add.image(80, 700, 'ui', 'hint')


		let word = GAME.hint
		let w_len = word.length
		let w_size = w_len < 8 ? 90 : (WIDTH) / w_len * 1.4


		const hint_txt = this.add.text((WIDTH - 40) / 2, 120, word,
			{
				font: ` ${w_size}px superstarregular`,
				color: "#345c6c",
				align: "center",
				baseLineY: '10px',
				wordWrap: { width: WIDTH - 60, useAdvancedWrap: true }
			})
			.setOrigin(0.5)
			.setPadding(10, 10)

		const hint_txt_indicator = this.add.text((WIDTH - 40) / 2, 20, 'hint:',
			{
				font: ` 60px superstarregular`,
				color: "#FFEB99",
				align: "center",
			})
			.setOrigin(0.5, 0)
			.setShadow(5, 5, "#C24B6E")

		UI.hint.add(hint_txt)
		UI.hint.add(hint_txt_indicator)
	}

	toggle_hint(state = true) {
		const { hint } = UI
		if (hint._state == 'inactive' && state) {
			hint.setScale(1, 1)
			hint._state = 'active'
			return
		}
		hint.setScale(0, 1)
		hint._state = 'inactive'
	}

	display_trivia() {
		// pa adjust ng size (this,x,y,width,height,color)

		const panel = new Uis.Panel(this, 10, 10, WIDTH - 20, HEIGHT - 20, 0x201834)
		let fontSize = 200

		const txt = this.add.text(WIDTH / 2 + 10, HEIGHT * 2 / 5, `did you know?\n${GAME.trivia}`,
			{
				fontFamily: `superstarregular`,
				fontSize: '150px',
				color: '#F2DB94',
				align: 'center',
				wordWrap: { width: WIDTH - 50 },

			})
			.setOrigin(0.5)
			.setShadow(5, 10, "#241424")


		while (txt.height > HEIGHT / 3) {
			fontSize = fontSize * 0.95
			txt.setFontSize(fontSize + 'px')
		}
	}

	display_defeat_panel() {
		const defeat = new Uis.Panel(this, WIDTH / 2, HEIGHT / 2, WIDTH - 40, 500, 0xB0294D)
		const dropshadow = this.add.rectangle(20, 25, WIDTH - 40, 500, 0x000)
			.setOrigin(0.5, 0)
			.setDepth(103)

		//try again
		defeat.add(this.add.rectangle(-WIDTH / 3 + 100, 300, 400, 150, 0x222640).setInteractive()
			.on('pointerup', () => {
				window.location.reload()
			}
			));

		//home
		defeat.add(this.add.rectangle(WIDTH / 3 - 10, 300, 200, 150, 0x222640).setInteractive()
			.on('pointerup', () => {
				window.location = '../index.html'
			}
			));


		defeat.add(dropshadow)
		defeat.moveTo(dropshadow, 0)
		defeat.bg.setStrokeStyle(10, 0xC24B6E)
			.setOrigin(0.5, 0)

		defeat
			.setScale(0, 1)
			.setDepth(105)

		const txt = this.add.text(0, 0, "DEFEAT",
			{
				font: ` 10rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)
			.setShadow(10, 10, "#355D68")

		defeat.txt = txt
		defeat.add(txt)

		const score_txt = this.add.text(0, 100, `score:${GAME.player.score}`,
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)

		defeat.score_txt = score_txt
		defeat.add(score_txt)

		const try_again = this.add.text(-WIDTH / 3 + 100, 300, 'try again',
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)

		defeat.add(try_again)


		const exit = this.add.text(WIDTH / 3 - 10, 300, `exit`,
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)


		defeat.add(exit)

		this.tweens.add({
			targets: defeat,
			duration: 900,
			ease: "Power2",
			y: WIDTH / 2,
			scaleX: 1
		});

		this.fade()
	}

	escape() {
		const panel = new Uis.Panel(this, 20, 20, WIDTH - 40, 600, 0x355D68).setScale(0, 1)
		panel.bg.setStrokeStyle(10, 0x94C5AC)

		this.tweens.add({
			targets: panel,
			scaleX: 1,
			duration: 300
		})

		const txt = this.add.text(WIDTH / 2, HEIGHT / 5, ' luckily...\n you have escaped...',
		{ 
			font: '3rem superstarregular',
			wordWrap:{width:20},
			align:'center'
		}
		).setOrigin(0.5, 0)

		GAME.player.hp = 1
		this.update_blanks(GAME.word)
		this.hide_keyboard()
		this.display_next(true)
	}

	display_victory_panel() {
		const victory = new Uis.Panel(this, WIDTH / 2, HEIGHT / 2, WIDTH - 40, 500, 0xB0294D)
		const dropshadow = this.add.rectangle(20, 25, WIDTH - 40, 500, 0x000)
			.setOrigin(0.5, 0)
			.setDepth(103)


		//try again
		victory.add(this.add.rectangle(-WIDTH / 3 + 100, 300, 400, 150, 0x3C6973).setInteractive()
			.on('pointerup', () => {
				window.location.reload()
			}
			));

		//home
		victory.add(this.add.rectangle(WIDTH / 3 - 10, 300, 200, 150, 0x3C6973).setInteractive()
			.on('pointerup', () => {
				window.location = '../index.html'
			}
			));


		victory.add(dropshadow)
		victory.moveTo(dropshadow, 0)
		victory.bg.setStrokeStyle(10, 0xC24B6E)
			.setOrigin(0.5, 0)

		victory
			.setScale(0, 1)
			.setDepth(105)

		const txt = this.add.text(0, 0, "victory",
			{
				font: ` 10rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)
			.setShadow(10, 10, "#355D68")

		victory.txt = txt
		victory.add(txt)

		const score_txt = this.add.text(0, 100, `score:${GAME.player.score}`,
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)

		victory.score_txt = score_txt
		victory.add(score_txt)

		const try_again = this.add.text(-WIDTH / 3 + 100, 300, 'play again',
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)

		victory.add(try_again)


		const exit = this.add.text(WIDTH / 3 - 10, 300, `exit`,
			{
				font: ` 5rem superstarregular`,
				color: '#F2DB94'
			})
			.setOrigin(0.5)


		victory.add(exit)

		this.tweens.add({
			targets: victory,
			duration: 900,
			ease: "Power2",
			y: WIDTH / 2,
			scaleX: 1
		});

		this.fade()
	}

	display_visual_panel() {

		UI.panel = new Uis.Panel(this, 20, 20, WIDTH - 40, 600, 0x355D68)
		UI.panel.bg.setStrokeStyle(10, 0x94C5AC)


		const enemy = this.add.sprite(WIDTH / 2, 300)
			.setOrigin(0.5)

		const fx = this.add.sprite(WIDTH / 2, 300)
			.setOrigin(0.5)
			.setTint(0x0)

		enemy.play('fly')

		UI.panel.fx = fx


		//adding the hp bars to the visua panel
		// enemy
		this.add.image(WIDTH / 4 + 11, 50, 'ui', 'B').setScale(2).setOrigin(0, 0.5)
		UI.panel.ehp_1 = this.add.image(WIDTH / 4 + 11, 50, 'ui', 'F').setScale(2).setOrigin(0, 0.5)
		UI.panel.ehp = this.add.image(WIDTH / 4 + 11, 50, 'ui', 'F_1').setOrigin(0, 0.5)
		this.add.image(WIDTH / 4, 50, 'ui', 'M').setScale(2).setOrigin(0, 0.5)
		//player
		this.add.image(WIDTH / 4 + 11, 590, 'ui', 'B').setScale(2).setOrigin(0, 0.5)
		UI.panel.hp_1 = this.add.image(WIDTH / 4 + 11, 590, 'ui', 'F_1').setScale(2).setOrigin(0, 0.5)
		UI.panel.hp = this.add.image(WIDTH / 4 + 11, 590, 'ui', 'F').setOrigin(0, 0.5)
		this.add.image(WIDTH / 4, 590, 'ui', 'M').setScale(2).setOrigin(0, 0.5)

		UI.panel.enemy = enemy
		UI.panel.add(enemy)

	}

	display_blank_panel(in_w) {

		UI.blanks = new Uis.Panel(this, 20, 640, WIDTH - 40, 240, 0xEC9A6D)
		UI.blanks.bg.setStrokeStyle(10, 0xFFEB99)

		let word = in_w
		let w_len = word.length
		let w_size = w_len < 8 ? 90 : (WIDTH) / w_len * 1.4

		const blank_txt = this.add.text((WIDTH - 40) / 2, 120, word.join(""),
			{
				font: ` ${w_size}px superstarregular`,
				color: "#FFEB99",
				align: "center",
				wordWrap: { width: WIDTH - 60, useAdvancedWrap: true }
			})
			.setOrigin(0.5)
			.setShadow(5, 10, "#C24B6E")


		UI.blanks.add(blank_txt)
		UI.blanks.txt = blank_txt
	}

	display_keyboard() {

		UI.keyboard = new Uis.Panel(this, 20, HEIGHT - 520, WIDTH - 40, 500, 0xC24B6E)
		UI.keyboard.bg.setStrokeStyle(10, 0xC24B6E)

		const w = (UI.keyboard.w) / 4 - 10
		const h = (UI.keyboard.h) / 7 - 10
		let i = 0

		for (let col = 0; col < 7; col++) {
			for (let row = 0; row < 4; row++) {
				const code = (++i + 64)
				const letter = String.fromCharCode(code == 91 ? 45 : code == 92 ? 32 : code)
				this.create_key(row * (w + 10) + 5, col * (h + 10) + 5, w, h, letter)
			}
		}
	}

	create_key(x, y, w, h, c) {

		const excess_keys = GAME.excess_keys



		let btn = new Uis.Button(this, x, y, w, h, 0xD9667B)
		const txt = this.add.text(btn.w / 2, btn.h / 2, c,
			{
				font: " 50px superstarregular", color: "#FFEB99"
			})
			.setOrigin(0.5)
			.setShadow(5, 5, "#C24B6E")



		btn.val = c
		btn.txt = txt
		btn.once("click", click)
		btn.set_bg(this.add.image(-3, 0, 'ui', "btn1_lowres").setOrigin(0).setScale(0.65))
		btn.add(txt)


		btn.once("disabled", () => {
			const { txt, bg } = btn
			btn.set_bg(this.add.image(-3, 0, 'ui', "btn0_lowres").setOrigin(0).setScale(0.65))
			btn.moveUp(txt.setColor("#B0294D"))
			btn.txt.setShadow(0, 0)
		});

		if (!excess_keys.includes(btn.val)) btn.disable()

		UI.keyboard.add(btn)

		function click() {
			const { txt, bg } = btn
			btn.disable()
			GAME.guess(btn.val)
		}
	}


	init_events() {
		const { events } = GAME

		events.on("attack", (data) => {
			this.update_blanks(data.guess)
			this.update_ehp()
			this.update_lv()


			const { enemy, fx } = UI.panel

			//add a little randomness to bonkfx position
			const amount = 60

			fx.x = enemy.x + (Math.random() * 3 - 1) * amount
			fx.y = enemy.y + (Math.random() * 2 - 1) * amount
			fx.play('bonk')


			enemy.setTint(0xff0000)

			const timeline = this.tweens.createTimeline()

			timeline.add({
				targets: enemy,
				scaleX: 0.8,
				scaleY: 1,
				tint: { from: 0xff0000, to: 0xffffff },
				angle: 30 * (Math.random() < 0.5 ? -1 : 1),
				duration: 100
			});

			timeline.add({
				targets: enemy,
				scaleX: 1.1,
				scaleY: 0.8,
				angle: 0,
				tint: { from: 0xffffff, to: 0xff0000 },
				duration: 100,
				ease: 'Power2'
			});

			timeline.add({
				targets: enemy,
				scaleX: 1,
				scaleY: 1,
				tint: { from: 0xff0000, to: 0xffffff },
				duration: 100
			});

			timeline.play()
		});

		events.on("defend", () => {

			this.cameras.main.shake(100, 0.03)
			this.update_hp()
		});

		events.once("VICTORY", () => {
			this.disble_buttons()
			this.time.delayedCall(1500, () => this.play_enemy_faint())
		});

		events.once("DEFEAT", () => {
			if (!GAME.survival) return this.escape()
			this.display_defeat()
		});
	}

	//###################
	hide_keyboard(cb = () => { }) {

		const { keyboard } = UI

		this.tweens.add({
			targets: keyboard,
			scaleY: 0,
			y: HEIGHT * 3 / 4,
			duration: 200,
			ease: "Power2",
			onComplete: cb()
		});
	}

	disble_buttons() {
		for (const btn of UI.keyboard.list) {
			if (btn.constructor.name != 'Button') continue
			if (!btn.is_enabled) continue
			btn.disable()
		}
	}

	//#################
	display_victory() {
		//todo victory animation
		//wait for the health bar animation to drop before displaying the panel
		this.hide_keyboard()
		this.time.delayedCall(1500, () => this.display_victory_panel())
	}

	display_defeat() {
		//todo victory animation
		//wait for the health bar animation to drop before displaying the panel
		this.hide_keyboard()
		this.time.delayedCall(1500, () => this.display_defeat_panel())
	}

	display_next(escape) {


		if (!escape) {
			if (GAME.trivia) this.display_trivia()
		}

		if (GAME.words.length < 1) return this.display_victory()

		const next = new Uis.Button(this, WIDTH / 2, HEIGHT * 4 / 5, 400, 150, 0x345c6c)
			.setScale(0, 1)

		next.bg.setOrigin(0.5)
			.setStrokeStyle(10, 0x94C5AC)


		const txt = this.add.text(0, 0, "NEXT",
			{
				font: "50px superstarregular",
				color: "#FFEB99"
			})
			.setOrigin(0.5)
			.setDepth(1000)
			.setShadow(3, 3, "#355D68")
		next.add(txt)

		this.tweens.add({
			targets: next,
			scaleX: 1,
			duration: 300,
			ease: "Bounce"
		});

		if(escape){

			next.once("click", () => {

				this.fade(() => { this.display_next()})
	
				this.tweens.add({
					targets: next,
					scaleX: 0,
					duration: 200,
					ease: "Bounce",
				});
			});
			return
		}

		next.once("click", () => {

			this.fade(() => { GAME.fight() })

			this.tweens.add({
				targets: next,
				scaleX: 0,
				duration: 200,
				ease: "Bounce",
			});
		});

	}

	display_home() {


		const next = new Uis.Button(this, WIDTH / 2, HEIGHT * 4 / 5, 400, 150, 0x6AAF9D)
			.setScale(0, 1)

		next.bg.setOrigin(0.5)
			.setStrokeStyle(10, 0x94C5AC)


		const txt = this.add.text(0, 0, "NEXT",
			{
				font: "50px superstarregular",
				color: "#FFEB99"
			})
			.setOrigin(0.5)
			.setShadow(3, 3, "#355D68")

		next.add(txt)

		this.tweens.add({
			targets: next,
			scaleX: 1,
			duration: 300,
			ease: "Bounce"
		});

		next.on("click", () => {

			this.fade(() => { GAME.fight() })

			this.tweens.add({
				targets: next,
				scaleX: 0,
				duration: 200,
				ease: "Bounce",
			});
		});

	}
	//////////animations
	play_enemy_faint() {

		const { enemy } = UI.panel

		// enemy.setTint(0x00)
		this.tweens.addCounter({
			from: 255,
			to: 0,
			duration: 300,
			onUpdate: (tween) => {
				const val = Math.floor(tween.getValue())
				enemy.setTint(Phaser.Display.Color.GetColor(val, val, val))
			}
		})



		this.tweens.add({
			targets: enemy,
			delay: 310,
			duration: 1000,
			ease: 'Power1',
			y: HEIGHT * 1.3,
			onComplete: () => this.hide_keyboard(() => this.display_next())
		});
	}

	create_anims() {
		this.anims.create({
			key: 'fly',
			frameRate: 20,
			frames: this.anims.generateFrameNames('lavabee', { prefix: 'lvb', suffix: '.png', start: 1, end: 5 }),
			repeat: -1
		});

		this.anims.create({
			key: 'bonk',
			frameRate: 20,
			frames: this.anims.generateFrameNames('bonk', { prefix: 'b', start: 0, end: 7 })
		});
	}

	fade(cb = () => { },) {
		const { rt } = this

		this._fade_state = !this._fade_state

		if (!!this._fade_state) {

			this.tweens.add({
				targets: rt,
				alpha: 0,
				duration: 200,
				ease: "Power2",
				onComplete: () => {
					rt.disableInteractive()
					cb()
				}
			});

			return
		}

		this.tweens.add({
			targets: rt,
			alpha: 1,
			duration: 500,
			ease: "Power2",
			onComplete: () => {
				rt.setInteractive()
				cb()
			}
		});
	}
}
