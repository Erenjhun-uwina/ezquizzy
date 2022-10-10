

export class UI_bg extends Phaser.GameObjects.Rectangle{
	
	constructor(sc,x=0,y=0,w=100,h=100,fill,a){
		super(sc,x,y,w,h,fill,a)
		sc.add.existing(this)
	}
}




export class UI extends Phaser.GameObjects.Container{

	constructor(sc,x,y,w=200,h=150,fill=0x5666f5,a=1){
		super(sc,x,y)
		sc.add.existing(this)
		
		this.w = w
		this.h = h
		
		let bg = w
		
		if(w.constructor.name != "UI_bg"){
			bg = new UI_bg(sc,0,0,w,h,fill,a)
			.setOrigin(0)
		}
		this.add(bg)
		this.bg = bg

	}
	
	set_bg(bg){
		
		if(this.bg){
			this.remove(this.bg,true)  
		}
		this.add(bg)
		this.bg = bg
		this.onchange_bg()
	}
	
	onchange_bg(){
		//
	}
}




export class Panel extends UI{
	
	constructor(sc,x,y,w=300,h=250,fill=0x4232f0,a){
		super(sc,x,y,w,h,fill,a)
	}
	
}



export class Button extends UI{
	
	constructor(sc,x,y,w=150,h=100,fill,a){
		super(sc,x,y,w,h,fill,a)
		
		this.enable()
		this.add_listeners()
	}
	
	onchange_bg(){
		this.add_listeners()
		if(this._enabled)return this.enable()
		this.disable()
	}
	
	add_listeners(){
		this.bg.on("pointerup",()=>{this.emit("click")})
	}
	
	
	enable(){
		this.bg.setInteractive()
		this._enabled = true
		this.emit("enabled")
	}
	
	disable(){
		this.bg.disableInteractive()
		this._enabled = false
		this.emit("disabled")
	}
	
	get is_enabled(){
		return this._enabled
	}
}