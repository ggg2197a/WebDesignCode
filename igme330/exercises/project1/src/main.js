var app = app || {};

app.main = (function () {
    "use strict";
		
    let NUM_SAMPLES = 256;
    /*
    The audio files here were sourced from Youtube, and are used for the purposes of education under Fair Use.
    Golgo 13 Theme (NES) - https://www.youtube.com/watch?v=zttVkYUI71A&t=55s
    Feel Good Inc. 8-Bit version - https://www.youtube.com/watch?v=MltJnhBLGtw
    Pokemon Tower Theme (Red/Blue) - https://www.youtube.com/watch?v=u8NktOkmRvM&t=25s
    Strike the Earth! - https://www.youtube.com/watch?v=wqAYMZSOQao
    Solomon's Key (Room Theme 1) - https://www.youtube.com/watch?v=qlJtzyhTIzI
    Bonetrousle (Undertale) - https://www.youtube.com/watch?v=mqzBv3FYpr0
    */
    const SOUND_PATH = Object.freeze({
        sound1: 'audio/Golgo 13 (NES) - Title Theme.mp3',
        sound2: 'audio/Gorillaz (arr. 8-Bit Universe) - Feel Good Inc..mp3',
        sound3: 'audio/Pokemon Blue_Red - Pokemon Tower.mp3',
        sound4: 'audio/Shovel Knight - Strike the Earth!.mp3',
        sound5: 'audio/Solomons Key (NES) - Room Theme 1.mp3',
        sound6: 'audio/UnderTale - Bonetrousle.mp3'
    });
    
    let audioElement;
    let audioCtx;//AudioContext
    //Nodes for audio analysing and editing
    let analyserNode;
    var biquadFiltHi, biquadFiltLow, sourceNode;
    //Canvas and context to draw to
    let canvas,ctx;
    //MaxRadius is a misnomer - this refers to the radius of the ellipse on X and Y axes
    //Did not change because I understood this as meaning maximum allowed to be drawn at this time.
    //The actual 'maximum' is dictated down in the body by the range, set at 240 - 150 is just the best size to start
    let maxYRadius = 150, maxXRadius = 150;
    //l is the low pass level, h is the high pass level
    let invert = false, noise = false, lines = false, chaos = false, 
    l=0, h=0, colorTint = "none", gradChange = false, lineDiv = 51;
    
    function init(){
        // set up canvas stuff
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");
        
        // get reference to <audio> element on page
        audioElement = document.querySelector('audio');
        
        //audioCtx = audioElement.getContext();
        
        // Set up the Web Audio
        setUpWebAudio();
        
        // get sound track <select> and Full Screen button working
        setupUI();
        
        // start animation loop
        update();
    }
    
    
    function setUpWebAudio() {
        //Set up the web audio context based on the browser
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        //Set the audio element
        audioElement = document.querySelector("audio");
        audioElement.src = SOUND_PATH.sound1;
        
        // this is where we hook up the <audio> element to the analyserNode
        sourceNode = audioCtx.createMediaElementSource(audioElement); 
        
        // create an analyser node
        analyserNode = audioCtx.createAnalyser();
        
        //Set up the highshelf filter
        biquadFiltHi = audioCtx.createBiquadFilter();
        biquadFiltHi.type = "highshelf";
        biquadFiltHi.frequency.setValueAtTime(1000, audioCtx.currentTime);
        biquadFiltHi.gain.setValueAtTime(h, audioCtx.currentTime);
        
        //Set up the lowshelf filter
        biquadFiltLow = audioCtx.createBiquadFilter();
        biquadFiltLow.type = "lowshelf";
        biquadFiltLow.frequency.setValueAtTime(1000, audioCtx.currentTime);
        biquadFiltLow.gain.setValueAtTime(l, audioCtx.currentTime);
        
        // fft stands for Fast Fourier Transform
        analyserNode.fftSize = NUM_SAMPLES;
        
        // here we connect to the destination i.e. speakers
        sourceNode.connect(biquadFiltLow);
        biquadFiltLow.connect(biquadFiltHi);
        biquadFiltHi.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
        
    }
    
    function setupUI(){
        //Setting up onchange methods so variables change dynamically
        document.querySelector("#trackSelect").onchange = function(e){
            playStream(audioElement,e.target.value);
        };
        
        document.querySelector("#fsButton").onclick = function(){
            requestFullscreen(canvas);
        };
        
        document.querySelector("#circleYRadius").onchange = function(e){
            maxYRadius = e.target.value;
        }
        
        document.querySelector("#circleXRadius").onchange = function(e){
            maxXRadius = e.target.value;
        }
        
        document.querySelector("#invertCtrl").onchange = function(e){
            invert = !invert;
        }
        
        document.querySelector("#noiseCtrl").onchange = function(e){
            noise = !noise;
        }
        
        document.querySelector("#linesCtrl").onchange = function(e){
            lines = !lines;
        }
        
        document.querySelector("#chaosCtrl").onchange = function(e){
            chaos = !chaos;
        }
        
        //Sets gain when value is changed
        document.querySelector("#lowPassLevel").onchange = function(e){
            l = e.target.value;
            biquadFiltLow.gain.setValueAtTime(l, audioCtx.currentTime);
        }
        
        //Sets gain when value is changed
        document.querySelector("#highPassLevel").onchange = function(e){
            h = e.target.value;
            biquadFiltHi.gain.setValueAtTime(h, audioCtx.currentTime);
        }
        
        document.querySelector("#radioCtrls").onchange = function(e){
            colorTint = e.target.value;
        }
    }
    
    //Starts the audio playing, sets up the status bar
    function playStream(audioElement,path){
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.3;
        document.querySelector('#status').innerHTML = "Now playing: " + path;
    }
    
    function update() { 
        // this schedules a call to the update() method in 1/60 seconds
        requestAnimationFrame(update);
        
        // create a new array of 8-bit integers (0-255)
        var data = new Uint8Array(NUM_SAMPLES/2); 
        
        // populate the array with the frequency data
        // notice these arrays can be passed "by reference" 
        analyserNode.getByteFrequencyData(data);
    
        //Drawing the imagery!
        ctx.clearRect(0,0,1500,1200);  
        let barWidth = 9;
        let barSpacing = 3;
        let barHeight = 65;
        let topSpacing = 152;

        if(Math.random() < .001){
            gradChange = !gradChange;
        }
        
        // loop through the data and draw!
        for(let i=0; i<data.length - 1; i++) { 
            
            //Rectangles/background lines - aesthetic!
            ctx.save();
            if(!gradChange){
                ctx.strokeStyle = makeColor(255, 0, 130, 0.2);
            }
            else{
                ctx.strokeStyle = makeColor(255, 0, 15, 0.2);
            }
            ctx.strokeRect(i * (barWidth), 0, barWidth, canvas.height);
            ctx.restore();
            
            if(i < (data.length-2)/2){
                //Bezier curves - they move up or down (sadly) but it looks better with my aesthetic!
                //The first set moves down, second set moves up
                if(!gradChange){
                    ctx.strokeStyle = makeColor(4, 231, 98, 0.2);
                }
                else{
                    ctx.strokeStyle = makeColor(0, 0, 255, 0.2);
                }
                ctx.beginPath();
                ctx.moveTo(0, canvas.height/2);
                ctx.bezierCurveTo(0, (canvas.height/2) + data[i], canvas.width, (1 + canvas.height/2) + data[i] * 1.3, canvas.width, canvas.height/2);
                ctx.stroke();
                ctx.closePath();
            
                ctx.beginPath();
                ctx.moveTo(0, canvas.height/2);
                ctx.bezierCurveTo(0, (canvas.height/2) - data[i], canvas.width, (-1 + canvas.height/2) - data[i] * 1.3, canvas.width, canvas.height/2);
                ctx.stroke();
                ctx.closePath();
            }

            if(!gradChange){
                ctx.strokeStyle = makeColor(0, 79, 255, 0.9);
            }
            else{
                ctx.strokeStyle = makeColor(255, 242, 117, 0.9);
            }
            //Lines - original
            ctx.beginPath();
            ctx.moveTo(i * (barWidth + barSpacing), (canvas.height/2) + data[i] * 1.3);
            ctx.lineTo((i + 1) * (barWidth + barSpacing), (canvas.height/2) + data[i+1] * 1.3);
            ctx.stroke();
            ctx.closePath();
            
            //inverted lines
            ctx.beginPath();
            ctx.moveTo(1080 - i * (barWidth + barSpacing), (canvas.height/2) + data[i] * 1.3);
            ctx.lineTo(1080 - (i + 1) * (barWidth + barSpacing), (canvas.height/2) + data[i+1] * 1.3);
            ctx.stroke();
            ctx.closePath();
            
            //Lines - original, upward motion
            ctx.beginPath();
            ctx.moveTo(i * (barWidth + barSpacing), (canvas.height/2) - data[i] * 1.3);
            ctx.lineTo((i + 1) * (barWidth + barSpacing), (canvas.height/2) - data[i+1] * 1.3);
            ctx.stroke();
            ctx.closePath();
            
            //inverted lines, upward motion
            ctx.beginPath();
            ctx.moveTo(1080 - i * (barWidth + barSpacing), (canvas.height/2) - data[i] * 1.3);
            ctx.lineTo(1080 - (i + 1) * (barWidth + barSpacing), (canvas.height/2) - data[i+1] * 1.3);
            ctx.stroke();
            ctx.closePath();
            
            
            var percent = data[i] / 255;
            var circleYRadius = percent * maxYRadius;
            var circleXRadius = percent * maxXRadius;
            
            //creates a circle with a gradient!
            ctx.save();
            var grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2 + data[i]%28, circleXRadius * 1.6, canvas.width/2, canvas.height/2 + data[i]%28, circleYRadius * 1.8);
            ctx.globalAlpha = .10 - percent/10.0;
            if(!gradChange){
                grad.addColorStop(0, makeColor(4, 231, 98, 1.0));
                grad.addColorStop(2 / 6, makeColor(76, 154, 114, 1.0));
                grad.addColorStop(4 / 6, makeColor(170, 69, 122, 1.0));
                grad.addColorStop(1, makeColor(255, 0, 130, 1.0));
            }
            else{
                grad.addColorStop(0, makeColor(0, 0, 255, 1.0));
                grad.addColorStop(2 / 6, makeColor(76, 20, 179, 1.0));
                grad.addColorStop(4 / 6, makeColor(170, 45, 85, 1.0));
                grad.addColorStop(1, makeColor(255, 68, 15, 1.0));
            }
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, canvas.height/2, circleXRadius * 1.5 + (data[i] * percent), circleYRadius * 1.5 + (data[i] * percent), 0, 2*Math.PI, false);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
            
        }
        
        //Calls for the post-drawing image manipulation
        manipulatePixels();
         
    }
    
    function manipulatePixels(){
        //Get all the rgba pixel data of the canvas by grabbing the ImageData Object
        let imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        
        //imageData is an 8-bit typed array - values range from 0 to 255
        //contains 4 values per pixel
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;
        
        //iterate through each pixel
        //step by 4 so 1 pixel per iteration is manipulated
        //i is red, i + 1 is green, i + 2 is blue, i + 3 is alpha
        for(let i = 0; i < length; i += 4){
            
            //if statements to use the colorTint
            if(colorTint == "red"){
                data[i] = 200;
                data[i+1] -= 20;
                data[i+2] -= 20;
               }
            if(colorTint == "green"){
                data[i] -= 20;
                data[i+1] = 200;
                data[i+2] -= 20;
               }
            if(colorTint == "blue"){
                data[i] -= 20;
                data[i+1] -= 20;
                data[i+2] = 200;
               }
            
            //Invert the colors?
            if(invert){
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255 - red;
                data[i+1] = 255 - green;
                data[i+2] = 255 - blue;
            }
            //lines?
            if(lines){
                let row = Math.floor(i/4/width)
                if(row % lineDiv == 0){
                    //this row
                    data[i]=data[i+1]=data[i+2]=data[i+3] = 200;
                    data[i+width*4] = data[i+(width*4) + 1] = data[i+(width*4) + 2] = data[i+(width*4) + 3] = 70;
                }
            }
            //White noise?
            if(noise && Math.random() < .01){
                //data[i] = data[i+1] = data[i+2] = 128; gray noise
                data[i] = data[i+1] = data[i+2] = 255; //white noise
                //data[i] = data[i+1] = data[i+2] = 0; black noise
                data[i+3] = 255;//alpha
            }
            
            //Chaos?
            if(chaos)
            {
                if(Math.random() < .7){
                    data[i] = Math.random() * 255;
                    data[i+1] = Math.random() * 255;
                    data[i+2] = Math.random() * 255;
                }
//                    if(Math.random() < .2){
//                        data[i] = data[i+1] = data[i+2] = 255;
//                    }
//                    else if(colorTint == "red" && Math.random() < .2){
//                        data[i] = 255;
//                        data[i+1] = data[i+2] = 5;
//                    }
//                    else if(colorTint == "green" && Math.random() < .2){
//                        data[i+1] = 255;
//                        data[i] = data[i+2] = 5;
//                    }
//                    else if(colorTint == "blue" && Math.random() < .2){
//                        data[i+2] = 255;
//                        data[i] = data[i+1] = 5;
//                    }
//                    else if(invert && Math.random() < .2){
//                        data[i] = data[i+1] = data[i+2] = Math.random() * 255;
//                    }
//                    else{
//                        data[i] = 0;
//                        data[i+1] = 0;
//                        data[i+2] = 5;
//                    }
//                    
            }
            
        }
        //put the modified data back on the canvas
        ctx.putImageData(imageData, 0, 0);

        //Modify lineDiv for next call
        if(Math.random() < .2){
            lineDiv++;
        }
        if(Math.random() < .1){
            lineDiv--;
        }
        if(lineDiv > 75){
            lineDiv = 51;
        }
    }
    
    // HELPER - creates custom colors in rgba format - from exercises
    function makeColor(red, green, blue, alpha){
           var color='rgba('+red+','+green+','+blue+', '+alpha+')';
           return color;
    }
    
     // FULL SCREEN MODE
    function requestFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
        // .. and do nothing if the method is not supported
    };
    
    return{
        init: init
    };
    
})();