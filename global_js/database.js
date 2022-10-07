console.log("database loaded: " + window.location)

import "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"
import generate_uc from './generate_ucode.js'

let provider = new firebase.auth.GoogleAuthProvider(),
	app

const firebaseConfig = {
	apiKey: "AIzaSyBNgq_MFpErV5W1nm04geaIwDKMUps1MDw",
	authDomain: "ezquizzy-b9179.firebaseapp.com",
	projectId: "ezquizzy-b9179",
	storageBucket: "ezquizzy-b9179.appspot.com",
	messagingSenderId: "166896373047",
	appId: "1:166896373047:web:302e8c155f057a3c991eb2",
	measurementId: "G-DQ9SHP3VCJ"
};

export default class DB {

	constructor() {
		if(!app)app = firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore(app)
		this.collection = this.db.collection("games")
	}


	add_game(fdata) {

		const title = fdata.get("title"),
			words = fdata.get("words").split(","),
			difficulty = fdata.get("difficulty"),
			hp = fdata.get("hp"),
			regen = fdata.get("regen"),
			shuffle = fdata.get("shuffle"),
			code = fdata.get('code').split('-').join('').toLowerCase()


		return this.collection
			.add({
				code: code,
				hp: hp,
				title: title,
				regen: regen,
				shuffle: shuffle === 'true',
				words: words,
				difficulty: difficulty
			})
	}

	async query_exists(code) {
		const { db } = this

		const snapshot = await this.collection
			.where("code", "==", code.toLowerCase())
			.limit(1)
			.get()

		return (!!snapshot.docs[0])
	}

	async query_game_by_id(id) {
		const { db } = this

		const snapshot = await this.collection
			.doc(id)
			.get()

		return (snapshot.exists) ? snapshot : null
	}

	async query_game(code) {

		const { db } = this

		const snapshot = await this.collection
			.where("code", "==", code.toLowerCase())
			.limit(1)
			.get()


		if (!snapshot.docs[0]) return null

		const g = snapshot.docs[0].data()
		g._id = snapshot.docs[0].id

		return g
	}

	sign_in() {

		firebase.auth.onAuthStateChanged(user => {

			if (user) {

				const user = firebase.auth().currentUser
			} else {
				firebase.auth()
					.signInWithPopup(provider)
					.then(result => {
						//todo:
					})
					.catch(
						err => {

						}
					);
			}
		});
	}

}

