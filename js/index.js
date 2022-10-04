import DB from '../global_js/database.js'   
import 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js' 	
    	
    	const play_btn = document.querySelector(".play")
    	const code_input = document.querySelector(".txt") 
    	
		const db = new DB
		
		play_btn.onclick = ()=>start();
		code_input.addEventListener('keypress',function(e){
			
			if(! (e.key === 'Enter'))return
			console.log('enter active');
			e.preventDefault()
			start()
		});
    	
    	async function start(){

			if(code_input.value == '')return
    		
    		const code = code_input.value.split('-').join('').toLowerCase()

    		
    		if(!await db.query_exists(code)){
    		    code_input.value=""
    			game_not_exists()
    			return
    		}
			window.location = "../hangman/index.hangman.html?code="+code
		} 
    	
    	function game_not_exists(){
    		code_input.placeholder = "INVALID CODE"
    		code_input.addEventListener("input",()=> code_input.placeholder = "code:hm-42069",{once:true})
    	}
    	
    	
    	const suggestion_btns = document.querySelectorAll(".game_suggestion")
    	
    	suggestion_btns.forEach(
    		(e)=> {
    			e.onclick = ()=>{
	    			const code = e.dataset.code	    			
	    			window.location = "../hangman/index.hangman.html?code="+code
    			}
    		}
    	)
		//////////////////////

		const game_select_bnts = document.querySelectorAll('.game_select')
		
		game_select_bnts.forEach(
			e=>{

				e.onclick = ()=>{
					const type =  e.dataset.type
					window.location = `${type}/${type}.create.html`
				}
			}
		)
    	
		/////////////////////////////////
		//animations

		const game_select = document.querySelector('#gametype_select')
    	const create_bnt =  document.querySelector('.create')
		const profile_img = document.querySelector('#profile_img')
		const profile_con = $('#profile_con')[0]
		const logout_btn = $('#profile_con ')[0]
		

		create_bnt.onclick = (ev) => {
			 game_select.style.transform = " translateY(0%)"
			 game_select.state = 'active'
			 ev.stopPropagation()
		}
		profile_img.onclick = (ev) =>{
			profile_con.style.transform = 'scaleY(1) translateY(0%)'
			profile_con.state = 'active'
			ev.stopPropagation()
		}

		document.onclick = () => {
			if(game_select.state == 'active'){
				game_select.style.transform = " translateY(-100%)"
				game_select.state = 'inactive'
			}

			if(profile_con.state == 'active'){
				profile_con.style.transform = 'scaleY(0) translateY(-100%)'
				profile_con.state = 'inactive'
			}
		}

		
