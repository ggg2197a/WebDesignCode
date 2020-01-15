    import {GiphyResult} from './classes.js';
    export {searchButtonClicked};
	// 2
    let displayTerm = "";
    let offset = 0;    
	
	// 3
	function searchButtonClicked(e){
        console.log("searchButtonClicked() called");
        console.log(e.target.id);
        if(e.target.id == "search"){
            document.querySelector("#moreSearch").disabled = false;
            console.log(document.querySelector("#moreSearch").disabled);
        }

        if(e.target.id == "moreSearch"){
            offset += parseInt(document.querySelector("#limit").value, 10);
        }
        else{
            offset = 0;
        }
		
        //1
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

        //2
        //Public API key
        let GIPHY_KEY = "dc6zaTOxFJmzC";

        //3 - build up our URL string
        let url = GIPHY_URL;
        url += "api_key=" + GIPHY_KEY;

        //4 - parse the user entered term we're searching
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;

        //5 - get rid of leading and trailing spaces
        term = term.trim();

        //6 - encode spaces and characters
        term = encodeURIComponent(term);

        //7 - if no term to search, bail out
        if(term.length < 1) return;

        //8 - append search to URL
        url += "&q=" + term;

        //9 - grab user chosen search 'limit'
        let limit = document.querySelector("#limit").value;
        url += "&limit" + limit;

        url += "&offset=" + offset;

        //10 - update UI
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

        //11 - see what the URL looks like
        console.log(url);

        //12 - Request data
        getData(url);
	}

    function getData(url){
        //1 - create XHR object
        let xhr = new XMLHttpRequest();

        //2 - set the onload handler
        xhr.onload = dataLoaded;

        //3 - set the onerror handler
        xhr.onerror = dataError;

        //4 - open connection, send request
        xhr.open("GET", url);
        xhr.send();
    }

    function dataLoaded(e){
        //5 - event.target is the xhr object
        let xhr = e.target;

        let limit = document.querySelector("#limit").value;

        //6 - xhr.responseText is the JSON file we just downloaded
        console.log(xhr.responseText);

        //7 - turn text into a parsable Javascript object
        let obj = JSON.parse(xhr.responseText);

        //8 - if there are no results, print message and return
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return; // Out
        }

        //9 - Start building an HTML string we will display to the user
        let results = obj.data;
        let bigString = "<p><i>Here are " + limit + " results for '" + displayTerm + "' (start = " + offset + ", end = " + (offset + parseInt(limit)) + ")</i></p>";

        //10 - loop through the array of results
        for(let i = 0; i < limit; i++){
            let result = results[i];
            let giphy = new GiphyResult(result);

            bigString += giphy.line;

            // //11 - get the URL to the GIF
            // let smallURL = result.images.fixed_width_small.url;
            // if(!smallURL) smallURL = "images/no-image-found.png";

            // //12 - get the URL to the GIPHY page
            // let url = result.url;

            // //13 - Buld a <div> to hold each result
            // let rate = result.rating.toUpperCase();
            // let line = `<div class='result'><b>Rating: ${rate}</b><img src='${smallURL}' title = '${result.id}' />`;
            // line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span></div>`;

            // //15 - add the <div> to 'bigString' and loop
            // bigString += line;
        }

        //16 - all done building the HTML, show it to the user
        document.querySelector("#content").innerHTML = bigString;

        //17 - update the status
        document.querySelector("#status").innerHTML = "<b>Success!</b>";
    }

    function dataError(e){
        console.log("An error occurred");
    }
    
