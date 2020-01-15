		let config = {
			apiKey: "AIzaSyCe6svbpXHjXQXiUf3tfC-mS0QYea-rtF8",
			authDomain: "card-search-history.firebaseapp.com",
			databaseURL: "https://card-search-history.firebaseio.com",
			projectId: "card-search-history",
			storageBucket: "card-search-history.appspot.com",
			messagingSenderId: "43474641910"
        };
        firebase.initializeApp(config);
	
        console.log(firebase); // #3 - make sure firebase is loaded
        
        // // #4 This is where the magic happens! searchLog
        firebase.database().ref("searchLog").on("value", dataChanged, firebaseError);
        
        function dataChanged(data){
            let obj = data.val();
            console.log(obj);
            let bigString="";
            for (let key in obj){   // use for..in to interate through object keys
                let row = obj[key];
                bigString += `<li>${row.dateID} ------ ${row.searched}</li>`;
            }	
            scoresList.innerHTML = bigString;
        }
        function firebaseError(error){
            console.log(error);
        }
        