
import * as Uis from '../../global_js/Ui.js'
import Screen from './Screen.scene.js'

let WIDTH,HEIGHT,GAME,
UI,
screen

let ft

export default class GUI extends Phaser.Scene{


	constructor(){
		super("GUI")
	}
	
	
	create(){
		UI = {}//resets UI
		WIDTH = this.game.canvas.width
		HEIGHT = this.game.canvas.height
		GAME = this.scene.get("Game")
		screen = this.scene.get('Screen')
		this.display_UIs()
	}
	
	
	
	display_UIs(){
		
		const word = GAME.guessed
		this.display_visual_panel()
		this.display_blank_panel(word)
		this.display_keyboard()
		this.init_events()
		this.display_lv()
		this.display_hp()
		this.display_ehp()
		
		this.rt = this.add.renderTexture(0,0,WIDTH,HEIGHT).setOrigin(0).setDepth(100)
		const {rt} = this
		rt.fill(0x1B1E34,1)
		rt.setInteractive()
		this.fade()
	}
	
	
	
	
	/////
	display_lv(){
		UI.lv = this.add.text(
			35,30,"lv:0",{font:"2.5rem superstarregular",color :'black'}
		);
		
		this.update_lv() 
	}
	
    display_hp(){
		

    	UI.hp = this.add.text(
	    	35,550,"HP:0",{font:"2.5rem superstarregular"}
    	)
		this.update_hp() 
    }
    
    display_ehp(){
		UI.ehp = this.add.text(
			WIDTH-30,30,"",{font:"2.5rem superstarregular"}
		)
		.setOrigin(1,0)
		this.update_ehp() 
    }
    
    update_hp(){
    	const {hp} = UI
    	hp.setText(`HP:${GAME.player.hp}`)
    }
    
    update_lv(){
        const {lv} = UI
    	lv.setText(`lv:${GAME.lv}`)
    }
    
    update_ehp(){
    	const {ehp} = UI
    	ehp.setText(`HP:${GAME.enemy.hp}`)  
    }
    
    
    /////////
	update_blanks(guess){
		
		const {txt} = UI.blanks
		txt.setText(guess.join(""))
	}
	
	display_defeat_panel(){
		UI.defeat =  new Uis.Panel(this,WIDTH/2,HEIGHT/2,WIDTH-40,500,0xB0294D)
		const dropshadow = this.add.rectangle(20,25,WIDTH-40,500,0x000)
		.setOrigin(0.5,0)
		.setDepth(103)
		
		
		const {defeat} = UI
		
		defeat.add(dropshadow)
		defeat.moveTo(dropshadow,0)
		defeat.bg.setStrokeStyle(10,0xC24B6E)
		.setOrigin(0.5,0)
				
		defeat
		.setScale(0,1)
		.setDepth(105)
		
		const txt = this.add.text(0,0,"DEFEAT",
		{font:` 10rem superstarregular`})
		.setOrigin(0.5)
		.setShadow(10,10,"#355D68")
		
		defeat.txt = txt
		defeat.add(txt)
		
		const score_txt = this.add.text(0,100,`score:${GAME.player.score}`,
		{font:` 5rem superstarregular`})
		.setOrigin(0.5)
		
		defeat.score_txt = score_txt
		defeat.add(score_txt)
		
		this.tweens.add({
			targets:defeat,
			duration:900,
			ease:"Power2",
			y:WIDTH/2,
			scaleX:1
		});
		
		this.fade()
	}
	
	update_visual_panel()
	{
	
	}

	display_visual_panel(){

		UI.panel = new Uis.Panel(this,20,20,WIDTH-40,600,0x355D68)
		UI.panel.bg.setStrokeStyle(10,0x94C5AC)

		const enemy = this.add.image(WIDTH/2,200,'char')
		.setOrigin(0.5)

		const ehp_bar = this.add.image(WIDTH/2,100,'ehp','F.png')
		.setScale(6)
		this.tweens.add(
			{
				targets:enemy,
				rotation:enemy.rotation+1000,
				duration:500000,
				loop:true
			}
		)

		
		const ehp =  this.add.image(WIDTH/2,10,'')
		const hp =  this.add.image(WIDTH/2,10,'')


		UI.panel.enemy = enemy
		UI.panel.add(enemy)

	}
	
	display_blank_panel(in_w){

		UI.blanks = new Uis.Panel(this,20,640,WIDTH-40,240,0xEC9A6D)
		UI.blanks.bg.setStrokeStyle(10,0xFFEB99)
		
		let word = in_w
		let w_len = word.length
		let w_size = w_len < 8 ? 90 : (WIDTH)/w_len*1.4
				
		const blank_txt = this.add.text((WIDTH-40)/2,120,word.join(""),
		{font:` ${w_size}px superstarregular`,
		color:"#FFEB99",
		align:"center",
		wordWrap:{ width:WIDTH-60, useAdvancedWrap: true }})
		.setOrigin(0.5)
		.setShadow(5,10,"#C24B6E")
		
		
		UI.blanks.add(blank_txt)
		UI.blanks.txt = blank_txt
	}
	
	display_keyboard(){
		
		UI.keyboard =  new Uis.Panel(this,20,HEIGHT-520,WIDTH-40,500,0xC24B6E)
		UI.keyboard.bg.setStrokeStyle(10,0xC24B6E)
		
		const w = (UI.keyboard.w)/4-10
		const h = (UI.keyboard.h)/7-10
		let i = 0
		
		for(let col = 0;col < 7;col++){
			for(let row = 0;row < 4;row++){
				const code = (++i + 64)
				const letter = String.fromCharCode(code==91?45:code==92?32:code)
				this.create_key(row*(w+10)+5,col*(h+10)+5,w,h,letter)
			}
		}
	}
	
	create_key(x,y,w,h,c){
		
		const excess_keys = GAME.excess_keys
		//console.log("excess:"+excess_keys.join(""))
		
		let btn =  new Uis.Button(this,x,y,w,h,0xD9667B)
		const txt = this.add.text(btn.w/2,btn.h/2,c,
		{font:" 50px superstarregular",color:"#FFEB99"
		})
		.setOrigin(0.5)
		.setShadow(5,5,"#C24B6E")

		

		btn.val = c
		btn.txt = txt
		btn.once("click",click)
		btn.set_bg(this.add.image(-3,0,"btn1_lowres").setOrigin(0).setScale(0.65))
		btn.add(txt)
		
		
		btn.once("disabled",()=>{
			const {txt,bg} = btn
			btn.set_bg(this.add.image(-3,0,"btn0_lowres").setOrigin(0).setScale(0.65))
			btn.moveUp(txt.setColor("#B0294D"))
			btn.txt.setShadow(0,0)
		});
		
		if(!excess_keys.includes(btn.val))btn.disable()
	
		UI.keyboard.add(btn)
	
		function click(){
			const {txt,bg} = btn			
			btn.disable()
			GAME.guess(btn.val)
		}
	}
	
	
	init_events(){
		const {events} = GAME
		
		events.on("guessed",(data)=>{
			this.update_blanks(data.guess)
			this.update_ehp()
			this.update_lv()
		});
		
		events.on("failed_guess",()=>{
			this.update_hp()
		});
		
		events.once("VICTORY",()=>{
			this.display_victory()

		});
		events.once("DEFEAT",()=>{
			this.display_defeat()
		});
	}
	
//###################
	end_level(cb=()=>{}){
		
		const {keyboard} = UI
		
		this.tweens.add({
			targets:keyboard,
			scaleY:0,
			y:HEIGHT*3/4,
			duration:200,
			ease:"Power2",
			onComplete:cb()
		});
	}

	//#################
	display_victory(){
		//todo victory animation
		this.end_level(()=>this.display_next());
	}
	
	display_defeat(){
		//todo victory animation
		this.end_level(()=>this.display_defeat_panel());
	}
	
	display_next(){

		if(GAME.words.length<1)return
		
		const next = new Uis.Button(this,WIDTH/2,HEIGHT*4/5,400,150,0x6AAF9D)
		.setScale(0,1)
		
		next.bg.setOrigin(0.5)
		.setStrokeStyle(10,0x94C5AC)

		
		const txt = this.add.text(0,0,"NEXT",
		{font:"50px superstarregular",
		 color:"#FFEB99"
		})
		.setOrigin(0.5)
		.setShadow(3,3,"#355D68")
		
		next.add(txt)
		
		this.tweens.add({
			targets:next,
			scaleX:1,
			duration:300,
			ease:"Bounce"
		});
		
		next.on("click",()=>{
			
			this.fade(()=>{GAME.fight()})			
			
			this.tweens.add({
				targets:next,
				scaleX:0,
				duration:200,
				ease:"Bounce",
			});
		});
		
	}
	
	display_home(){

		
		const next = new Uis.Button(this,WIDTH/2,HEIGHT*4/5,400,150,0x6AAF9D)
		.setScale(0,1)
		
		next.bg.setOrigin(0.5)
		.setStrokeStyle(10,0x94C5AC)

		
		const txt = this.add.text(0,0,"NEXT",
		{font:"50px superstarregular",
		 color:"#FFEB99"
		})
		.setOrigin(0.5)
		.setShadow(3,3,"#355D68")
		
		next.add(txt)
		
		this.tweens.add({
			targets:next,
			scaleX:1,
			duration:300,
			ease:"Bounce"
		});
		
		next.on("click",()=>{
			
			this.fade(()=>{GAME.fight()})			
			
			this.tweens.add({
				targets:next,
				scaleX:0,
				duration:200,
				ease:"Bounce",
			});
		});
		
	}
	
	
	fade(cb=()=>{},){
		const {rt} = this
		
		this._fade_state = !this._fade_state
		
		if(!!this._fade_state){
		
			this.tweens.add({
				targets:rt,
				alpha:0,
				duration:200,
				ease:"Power2",
				onComplete:()=>{
					rt.disableInteractive()
					cb()
				}
			});
			
			return
		}
		
		this.tweens.add({
			targets:rt,
			alpha:1,
			duration:500,
			ease:"Power2",
			onComplete:()=>{
				rt.setInteractive()
				cb()
			}
		});
	}
}