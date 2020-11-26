function byId(elem) {return document.getElementById(elem);}
let	 strictInd = byId('strict-ind'),
		 btnStrict = byId('strict-btn'),
		 btnStart = byId('start-btn'),
		 startLabel = byId('start-label'),
		 audioCtx = new AudioContext(),
		 green = byId('green'),
		 red = byId('red'),
		 yellow = byId('yellow'),
		 blue = byId('blue'),
		 countShow = byId('count-show'),
		 counter,
		 strictSwitch = false,
		 gameRunning = false,
		 stop1,
		 stop2,
		 stop3,
		 stop4,
		 errorStop,
		 pressedWrong = 0;

green.onmousedown = function() {
  mouseDownFunc.apply(green, ['green', 164.81, 'stop1']);
};//
green.onmouseup = function() {
  if (typeof stop1 == 'function') {//breaks without this check
    stop1();
  } //
  simonClick.apply(green, ['green', errorStop]); //
};
//
red.onmousedown = function() {
  mouseDownFunc.apply(red, ['red', 220, 'stop2']);
};
red.onmouseup = function() {
  if (typeof stop2 == 'function') {stop2();} //
  simonClick.apply(red, ['red', errorStop]); //
};

yellow.onmousedown = function() {//261.63
 mouseDownFunc.apply(yellow, ['yellow', 261.63, 'stop3']);
};
yellow.onmouseup = function() {
  if (typeof stop3 == 'function') {stop3();} //
  simonClick.apply(yellow, ['yellow', errorStop]); //
};

blue.onmousedown = function() {//329.63
 mouseDownFunc.apply(blue, ['blue', 329.63, 'stop4']);
};
blue.onmouseup = function() {
  if (typeof stop4 == 'function') {stop4();} //
  simonClick.apply(blue, ['blue', errorStop]); //
};

function getRandomInt(min, max) { //max not included
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
var simonSteps;
var changeSteps = [];

function simonAlgorithm() {
  var randomNum = getRandomInt(0, 4);
  switch (randomNum) {
    case 0:
      simonSteps.push("green");
      break;
    case 1:
      simonSteps.push("red");
      break;
    case 2:
      simonSteps.push("yellow");
      break;
    case 3:
      simonSteps.push("blue");
      break;
  }
  counter++;
  if (counter < 10) {
    countShow.textContent = "0" + counter;
  } else {
    countShow.textContent = counter;
  }
  stepByStep();
}

function simonClick(color, func) {
  this.classList.remove('active');
  if (changeSteps.length === 0) {return;}
  if(pressedWrong>1)return;
  if (color != changeSteps[0]) {
    if (strictSwitch === false) {
      console.log('normal mode');
      setTimeout(function() {
        stepByStep();
      }, 1000);
    } else if (strictSwitch === true) {
      console.log('strict mode');
      setTimeout(function() {
        restartGame();
      }, 1000);
    }
    func(); //stop error oscillator, errorstop
    return;
  } else {
    changeSteps.shift();
    if (changeSteps.length === 0&&counter==10){
    	console.log('you win');//end game
    	alert('you win');
    }else if (changeSteps.length === 0) {
    setTimeout(function() {simonAlgorithm();}, 1500);
  }
  }
}

function stepByStep() {
  var i = 0;

  function functionLoop() {
    if (i < simonSteps.length) {
      switch (simonSteps[i]) {
        case "green":
          customOscillator(164.81, audioCtx.currentTime, audioCtx.currentTime + .6, 'sine'); //
          green.classList.add('active');
          setTimeout(function() {
            green.classList.remove('active');
          }, 600);
          break;
        case "red":
          customOscillator(220, audioCtx.currentTime, audioCtx.currentTime + .6, 'sine'); //
          red.classList.add('active');
          setTimeout(function() {
            red.classList.remove('active');
          }, 600);
          break;
        case "yellow":
          customOscillator(261.63, audioCtx.currentTime, audioCtx.currentTime + .6, 'sine'); //
          yellow.classList.add('active');
          setTimeout(function() {
            yellow.classList.remove('active');
          }, 600);
          break;
        case "blue":
          customOscillator(329.63, audioCtx.currentTime, audioCtx.currentTime + .6, 'sine'); //
          blue.classList.add('active');
          setTimeout(function() {
            blue.classList.remove('active');
          }, 600);
          break;
      }
      i++;
      setTimeout(function() {
        functionLoop();
      }, 900);
    } else {
      changeSteps = simonSteps.map(function(current) {
        return current;
      });
      pressedWrong = 0;
      return;
    }
  }

  functionLoop();
}

btnStrict.onclick = function() {//toggle strict mode
  strictInd.classList.toggle('active');
  if (strictSwitch === false) {
    strictSwitch = true;
  } else if (strictSwitch === true) {
    strictSwitch = false;
  }
};

function restartGame() {
  simonSteps = [];
  counter = 0;
  pressedWrong = 0;
  if(typeof errorStop == 'function'){errorStop();}
  if (typeof stop1 == 'function') {stop1();}
  if (typeof stop2 == 'function') {stop2();}
  if (typeof stop3 == 'function') {stop3();}
  if (typeof stop4 == 'function') {stop4();}
  green.classList.remove('active');
	red.classList.remove('active');
	yellow.classList.remove('active');
	blue.classList.remove('active');
  simonAlgorithm();
}

btnStart.onclick = function() {
  if (gameRunning === false) {
    startLabel.textContent = 'RESTART';
  }
  gameRunning = true;
  restartGame();
};

function playOscillator(freq) {
  var currOsc = audioCtx.createOscillator();
  currOsc.type = 'sine';
  currOsc.frequency.value = freq; // value in hertz
  currOsc.connect(audioCtx.destination);
  currOsc.start();
  return function() {
    currOsc.stop();
  };
}

function customOscillator(freq, startTime, endTime, type) {
  var currOsc = audioCtx.createOscillator();
  currOsc.type = type;
  currOsc.frequency.value = freq; // value in hertz
  currOsc.connect(audioCtx.destination);
  currOsc.start(startTime);
  currOsc.stop(endTime);
}

function playError() {
  var errOsc = audioCtx.createOscillator();
  errOsc.type = 'triangle';
  errOsc.frequency.value = 110;
  errOsc.connect(audioCtx.destination);
  errOsc.start();
  return function() {//
    errOsc.stop();
  };
}

function mouseDownFunc(colorCheck, oscFreq, varName){
if (changeSteps.length === 0) {return;}

  if (changeSteps[0] != colorCheck) {
  	  pressedWrong++;
  if(pressedWrong>1)return;
    this.classList.add('active');
    errorStop = playError(); //closure, remember current error sound oscillator
  } else {
    window[varName] = playOscillator(oscFreq);//164.81
    this.classList.add('active');
  }
}
