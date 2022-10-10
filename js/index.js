import DB from '../global_js/database.js'   

    	
    	const play_btn = document.querySelector(".play")
    	const code_input = document.querySelector(".txt") 
    	
		const db = new DB
		

		play_btn.onclick = ()=>start();
		code_input.addEventListener("input",()=> code_input.placeholder = "code:hm-42069",{once:true})
    

		code_input.addEventListener('keypress',function(e){
			
			if(!(e.key === 'Enter'))return
			console.log('enter active');
			e.preventDefault()
			start()
		});
    	
    	async function start(){

			code_input.placeholder = "blank code????bruh"
			if(code_input.value == '')return
    		
    		const code = code_input.value.split('-').join('').toLowerCase()

    		
    		if(!await db.query_exists(code)){
    		    code_input.value=""
    			game_not_exists()
    			return
    		}
			console.log('plaayy');
			location.href = "hangman/index.hangman.html?code="+code
		} 
    	
    	function game_not_exists(){
    		code_input.placeholder = "INVALID CODE"
    	}
    	
    	
    	const suggestion_btns = document.querySelectorAll(".game_suggestion")
    	const game_details = document.querySelector('#game_details ') 
		const play_button = document.querySelector('#play_button') 

		const game_details_close = document.querySelector('#game_details_close ') 

		game_details_close.onclick = ()=>{
			game_details.style.transform = 'scaleX(0)'
		}

		play_button.onclick = ()=>{
			
			const code = play_button.dataset.code
			location.href = "hangman/index.hangman.html?code="+code
		}

		const game_details_code = document.querySelector('#game_details_code')
		const game_details_type = document.querySelector('#game_details_type')
		const game_details_title = document.querySelector('#game_details_title')


    	suggestion_btns.forEach(
    		e=> {
    			e.onclick = ()=>{

					
	    			const code = e.dataset.code
					const title = e.dataset.title
					const type = e.dataset.type

					game_details.style.transform = 'scaleX(1)'
					
					game_details_code.innerText = `code ${code}`
					game_details_type.innerText = type
					game_details_title.innerText = title
					play_button.dataset.code = code

	    			
    			}
    		}
    	)
		//////////////////////

		const game_select_bnts = document.querySelectorAll('.game_select')
		
		game_select_bnts.forEach(
			e=>{

				e.onclick = ()=>{
					const type =  e.dataset.type
					location.href = `${type}/${type}.create.html`
				}
			}
		)
    	
		/////////////////////////////////
		//animations

		const game_select = document.querySelector('#gametype_select')
    	const create_bnt =  document.querySelector('.create')
		const profile_img = document.querySelector('#profile_img')
		const profile_con = document.querySelector('#profile_con') 
		const logout_btn = document.querySelector('#profile_con ') 
		

		create_bnt.onclick = (ev) => {
			game_select.style.transform = 'translateY(0)'
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

		
