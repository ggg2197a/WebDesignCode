const app = new Vue({
	el: '#app',
	data: {
        title: 'Yu-Gi-Oh! Card to Melody Music Generator',
        searchName: '',
		result_name: '',
		config: {
			apiKey: "AIzaSyCe6svbpXHjXQXiUf3tfC-mS0QYea-rtF8",
			authDomain: "card-search-history.firebaseapp.com",
			databaseURL: "https://card-search-history.firebaseio.com",
			projectId: "card-search-history",
			storageBucket: "card-search-history.appspot.com",
			messagingSenderId: "43474641910"
		},
		searchCount: 0,
		result: {},
		noteArray: [],
		staves: 0
	},
	methods:{
	random(){
		//if (! this.term.trim()) return;
		fetch("https://db.ygoprodeck.com/api/v4/randomcard.php")
		.then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {	
			this.result = json[0][0];
			this.drawMusic();
			this.sendData();
		})
    }, // end random call
    search(){
        let url = "https://db.ygoprodeck.com/api/v4/cardinfo.php?name=" + this.searchName.trim();
        fetch(url)
        .then(response => {
			if(!response.ok){
				throw Error(`ERROR: ${response.statusText}`);
			}
			return response.json();
		})
		.then(json => {	
            this.result = json[0][0];
			this.result_name = this.result.name;
			this.drawMusic();
			this.sendData();
		})
    }, //end search button
    getImage(){
        if(this.result.image_url){
            return '' + this.result.image_url;
        }
        else{
            return 'img/no_search.jpg';
        }
	},
	drawMusic(){
		VF = Vex.Flow;
		//1: determine length of string - toLower() name and save length
		//2: genNotes - method, create notes based on letters in name (max; 8 or 2 measures)
		//3: Use array from genNotes (array of strings in format: "note/4 or 5") to create two notes arrays
		//4: Render both staves, the first stave with a treble clef
		//5: Draw both staves
		while(this.noteArray.length > 0){
			this.noteArray.pop();
		}

		let workName = this.result.name + "";
		workName = workName.toLowerCase();
		let noteList = this.genNotes(workName);

		let notes1 = [];
		let notes2 = [];

		for(let i = 0; i < 8; i++){
			this.noteArray.push(noteList[i]);
		}

		for(let i = 0; i < 8; i++){
			this.noteArray[i] = this.noteArray[i].replace(/\//g, '');
			this.noteArray[i] = this.noteArray[i].toUpperCase();
		}

		if(this.result.type == "Spell Card"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" })
			];
			//a.substr(0, position) + b + a.substr(position)
			this.noteArray[1] = this.noteArray[1].substr(0,1) + "b" + this.noteArray[1].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
			this.noteArray[5] = this.noteArray[5].substr(0,1) + "b" + this.noteArray[5].substr(1,1);
		}
		else if(this.result.type == "Trap Card"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" })
			];
			this.noteArray[2] = this.noteArray[2].substr(0,1) + "b" + this.noteArray[2].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
			this.noteArray[6] = this.noteArray[6].substr(0,1) + "b" + this.noteArray[6].substr(1,1);
		}
		else if(this.result.attribute == "EARTH"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }).addAccidental(0, new VF.Accidental("#")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" }).addAccidental(0, new VF.Accidental("#"))
			];
			this.noteArray[1] = this.noteArray[1].substr(0,1) + "#" + this.noteArray[1].substr(1,1);
			this.noteArray[3] = this.noteArray[3].substr(0,1) + "#" + this.noteArray[3].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
			this.noteArray[6] = this.noteArray[6].substr(0,1) + "b" + this.noteArray[6].substr(1,1);
		}
		else if(this.result.attribute == "FIRE"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" }).addAccidental(0, new VF.Accidental("#"))
			];
			this.noteArray[3] = this.noteArray[3].substr(0,1) + "#" + this.noteArray[3].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
		}
		else if(this.result.attribute == "WIND"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }).addAccidental(0, new VF.Accidental("#")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" })
			];
			this.noteArray[0] = this.noteArray[0].substr(0,1) + "#" + this.noteArray[0].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }).addAccidental(0, new VF.Accidental("#")),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
			this.noteArray[4] = this.noteArray[4].substr(0,1) + "#" + this.noteArray[4].substr(1,1);
		}
		else if(this.result.attribute == "LIGHT"){
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }).addAccidental(0, new VF.Accidental("b")),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" })
			];
			this.noteArray[0] = this.noteArray[0].substr(0,1) + "b" + this.noteArray[0].substr(1,1);
			this.noteArray[2] = this.noteArray[2].substr(0,1) + "b" + this.noteArray[2].substr(1,1);
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
		}
		else{
			notes1 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[0]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[1]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[2]], duration: "q" }),
	
				new VF.StaveNote({clef: "treble", keys: [noteList[3]], duration: "q" })
			];
	
			notes2 = [
				new VF.StaveNote({clef: "treble", keys: [noteList[4]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[5]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[6]], duration: "q" }),
			  
				new VF.StaveNote({clef: "treble", keys: [noteList[7]], duration: "q" })
			];
		}

		let voice1 = new VF.Voice({num_beats: 4,  beat_value: 4});
		voice1.addTickables(notes1);

		let voice2 = new VF.Voice({num_beats: 4,  beat_value: 4});
		voice2.addTickables(notes2);

		let formatter1 = new VF.Formatter().joinVoices([voice1]).format([voice1], 400);
		let formatter2 = new VF.Formatter().joinVoices([voice2]).format([voice2], 400);

		//Create an SVG renderer and attach it to the music DIV
		let div = document.getElementById("music");
		let renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

		//Size the svg
		if(this.staves == 1)
		{
			div.innerHTML = "";
			//renderer.getContext().svg.removeChild(renderer.getContext().svg.lastChild);
			div = document.getElementById("music");
			renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
			this.staves = 0;
		}
		renderer.resize(800,500);
		//Get the drawing context
		let context = renderer.getContext();
		//Create a stave
		let stave1 = new VF.Stave(10, 40, 400);
		let stave2 = new VF.Stave(410, 40, 400);

		//add a clef and time signature
		stave1.addClef("treble").addTimeSignature("4/4");

		//Connect it to the rendering context
		stave1.setContext(context).draw();
		voice1.draw(context, stave1);
		stave2.setContext(context).draw();
		voice2.draw(context, stave2);
		this.staves = 1;
	},
	genNotes(wName){
		let nameArray = wName.split("");
		//Checks for rare instance of cards with less that four letter in their name
		if(nameArray.length <= 3){
			for(let i = 0; i < 4; i++){
				nameArray.push("b");
				if(nameArray.length >= 4){
					break;
				}
			}
		}
		//Initialize the array to be returned
		let retArray = [];

		//Loop through the first four letters of the name
		for(let i = 0; i < 4; i++){
			switch(nameArray[i]){ //Using this base set, the letters in the name are given a note value
				case "a":
				retArray.push(nameArray[i] + "/4");
				break;
				case "b":
				retArray.push(nameArray[i] + "/4");
				break;
				case "c":
				retArray.push(nameArray[i] + "/4");
				break;
				case "d":
				retArray.push(nameArray[i] + "/4");
				break;
				case "e":
				retArray.push(nameArray[i] + "/4");
				break;
				case "f":
				retArray.push(nameArray[i] + "/4");
				break;
				case "g":
				retArray.push(nameArray[i] + "/4");
				break;
				case "h":
				retArray.push("a/4");
				break;
				case "i":
				retArray.push("b/4");
				break;
				case "j":
				retArray.push("c/4");
				break;
				case "k":
				retArray.push("d/4");
				break;
				case "l":
				retArray.push("e/4");
				break;
				case "m":
				retArray.push("f/4");
				break;
				case "n":
				retArray.push("g/4");
				break;
				case "o":
				retArray.push("a/4");
				break;
				case "p":
				retArray.push("f/4");
				break;
				case "q":
				retArray.push("e/4");
				break;
				case "r":
				retArray.push("d/4");
				break;
				case "s":
				retArray.push("c/4");
				break;
				case "t":
				retArray.push("b/4");
				break;
				case "u":
				retArray.push("g/4");
				break;
				case "v":
				retArray.push("b/3");
				break;
				case " ":
				retArray.push("b/4"); //Make spaces B-flat notes
				break;
				case "-":
				retArray.push("d/4"); //Make dashes D-flat notes
				break;
				default:
				let neno = Math.floor(Math.random() * 6); //Create a value to make a random note if letter is not above letters
				switch(neno){ //If any other value is found in the name, the letter is given a random value for variation
					case 0:
					retArray.push("a/4");
					break;
					case 1:
					retArray.push("c#/4");
					break;
					case 2:
					retArray.push("e/4");
					break;
					case 3:
					retArray.push("f/4");
					break;
					case 4:
					retArray.push("b/3");
					break;
					case 5:
					retArray.push("d/4");
					break;
					default:
					retArray.push("g/4");
				}
			}
		}

		//loop through last four letters of the name
		for(let i = nameArray.length - 1; i > nameArray.length - 5; i--){
			switch(nameArray[i]){ //Same rules as above, however the name is looped through from the back to the front
				case "a":
				retArray.push(nameArray[i] + "/4");
				break;
				case "b":
				retArray.push(nameArray[i] + "/4");
				break;
				case "c":
				retArray.push(nameArray[i] + "/4");
				break;
				case "d":
				retArray.push(nameArray[i] + "/4");
				break;
				case "e":
				retArray.push(nameArray[i] + "/4");
				break;
				case "f":
				retArray.push(nameArray[i] + "/4");
				break;
				case "g":
				retArray.push(nameArray[i] + "/4");
				break;
				case "h":
				retArray.push("a/4");
				break;
				case "i":
				retArray.push("b/4");
				break;
				case "j":
				retArray.push("c/4");
				break;
				case "k":
				retArray.push("d/4");
				break;
				case "l":
				retArray.push("e/4");
				break;
				case "m":
				retArray.push("f/4");
				break;
				case "n":
				retArray.push("g/4");
				break;
				case "o":
				retArray.push("a/4");
				break;
				case "p":
				retArray.push("f/4");
				break;
				case "q":
				retArray.push("e/4");
				break;
				case "r":
				retArray.push("d/4");
				break;
				case "s":
				retArray.push("c/4");
				break;
				case "t":
				retArray.push("b/4");
				break;
				case "u":
				retArray.push("g/4");
				break;
				case "v":
				retArray.push("b/3");
				break;
				case " ":
				retArray.push("b/4"); //Make spaces B-flat notes
				break;
				case "-":
				retArray.push("d/4"); //Make dashes D-flat notes
				break;
				default:
				let neno = Math.floor(Math.random() * 6); //Create a value to make a random note if letter is not above letters
				switch(neno){
					case 0:
					retArray.push("a/4");
					break;
					case 1:
					retArray.push("c/4");
					break;
					case 2:
					retArray.push("e/4");
					break;
					case 3:
					retArray.push("f/4");
					break;
					case 4:
					retArray.push("b/3");
					break;
					case 5:
					retArray.push("g/4");
					break;
					default:
					retArray.push("a/4");
				}
			}
		}

		return retArray;
	},
	playMusic(){
		//create a synth and connect it to the master output (your speakers)
		let synth = new Tone.Synth().toMaster();

		if(this.noteArray.length > 0){
			synth.triggerAttackRelease(this.noteArray[0], 0.5, 0);
			synth.triggerAttackRelease(this.noteArray[1], 0.5, 0.5);
			synth.triggerAttackRelease(this.noteArray[2], 0.5, 1);
			synth.triggerAttackRelease(this.noteArray[3], 0.5, 1.5);
			synth.triggerAttackRelease(this.noteArray[4], 0.5, 2);
			synth.triggerAttackRelease(this.noteArray[5], 0.5, 2.5);
			synth.triggerAttackRelease(this.noteArray[6], 0.5, 3);
			synth.triggerAttackRelease(this.noteArray[7], 0.5, 3.5);
		}
		else{
			//play a middle 'C' for the duration of an 8th note
			synth.triggerAttackRelease("C2", "8n");
		}
	},
	sendData(){
		if(this.searchCount == 0){
			firebase.initializeApp(this.config);
		}

		let database = firebase.database();

		let ref = database.ref('searchLog');
		
		let today = new Date();
		let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + "_";
		date += today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		let sData = {
			dateID: date,
			searched: this.result.name
		};

		ref.push(sData);
		this.searchCount++;
	}
	} // end methods
});