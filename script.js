
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}    


var numGuesses = 0;
var secret;
var secretLength;
var a;

function errorCheck(guess) {
    //Check guess only contains numbers or spaces
    if (isNaN(guess) && /^(?=.*\d)[\d ]+$/.test(guess)) {
      alert("Your guess: " + guess + ", must be numbers and spaces only");
      return true;
    }
    //Check Guess length matches Secret length
    if (guess.length > secretLength) {
      alert("Your guess: " + guess + ", is too long");
      return true;
    }
    else if (guess.length < secretLength) {
      alert("Your guess: " + guess + ", is too short");
      return true;
    }
    //Check no repeats
    var text = guess.split(""); 
    if (text.some(function(v,i,a){
      return a.lastIndexOf(v)!=i;
    })) {
        alert("Your guess: " + guess + ", has repeats");
      return true;
    }
    return false;
}
function userGuess() {
    var guess = document.getElementById("guess").value;
    //Removes whitespaces from guess
    guess = guess.replace(/\s/g,''); 
    if (errorCheck(guess)) {
      return;
    }
    else {
      numGuesses += 1;
      var hintRes = getHint(secret, guess);
      var textAreaOutput = document.getElementById("previousGuesses");
      textAreaOutput.value +=  "Try " + numGuesses + ": " + guess + ", " + hintRes + '\n';
      textAreaOutput.rows += 1;
      document.getElementById("numTries").innerHTML = numGuesses;
      document.getElementById("guess").value = "";
    }
}
function getHint(secret, guess) {
    var bulls = 0;
    var cows = 0;
    var numbers = new Array(10);
    for (var i=0; i<10; i++){
      numbers[i] = 0;
    }
    for (var i = 0; i<secret.length; i++) {
      var s = secret.charCodeAt(i) - 48;
      var g = guess.charCodeAt(i) - 48;
      if (s == g) bulls++;
      else {
        if (numbers[s] < 0) cows++;
        if (numbers[g] > 0) cows++;
        numbers[s] ++;
        numbers[g] --;
      }
    }
    if (bulls == 3) {
      alert("You win");
      clearInterval(a);
    }
    return bulls + "A" + cows + "B";
}

function generateSecret(aLength) {
    tempArr = [];
    secretLength = aLength;
    while(tempArr.length < secretLength){
      var r = Math.floor(Math.random()*10);
      if(tempArr.indexOf(r) === -1) tempArr.push(r);
    }
    secret = "";
    for (var x in tempArr) {
      secret += tempArr[x];
    }
    
}
function showAnswer() {
  document.getElementById("answer").innerHTML = "Answer: " + secret;
}
var timer = function () {
  var minutesLabel = document.getElementById("minutes");
  var secondsLabel = document.getElementById("seconds");
  var totalSeconds = 0;
  var c = setInterval(setTime, 1000);

  function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
  }

  function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
      }
  }
  return c;
}
function play() {
    //Get secret length from radio buttons setting
    var radios = document.getElementsByName('difficulty');
    for (var i = 0, n = radios.length; i < n; i++) {
      if (radios[i].checked) {
        secretLength = radios[i].value;
        break;
      }
    }
    clearInterval(a);
    a = timer();
    generateSecret(secretLength);
    
    document.getElementById("showSecretLength").innerHTML = "Secret Length: " + secretLength;
    //Reset answer display to nothing
    document.getElementById("answer").innerHTML = "";
}
//Create buttons for easy input of numbers with mouseclick instead of keyboard
var genButtons = function() {
    var inputButtons = document.getElementById("buttons");
    for (var i = 0; i < 10; i++) {
        var aButton = document.createElement("button");
        aButton.innerHTML = i;
        aButton.addEventListener ("click", function() {
            document.getElementById("guess").value += " " + this.innerHTML;
        });
        aButton.classList.add("btn-info");
        aButton.style.width = "60px";
        inputButtons.appendChild(aButton);
    }
}
function clearInput() {
  document.getElementById("guess").value = "";
}
window.onload = function () {
    var tmonth=["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    function GetClock(){
    var d=new Date();
    var nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getFullYear();
    
    var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds(),ap;
    
    if(nhour==0){ap=" AM";nhour=12;}
    else if(nhour<12){ap=" AM";}
    else if(nhour==12){ap=" PM";}
    else if(nhour>12){ap=" PM";nhour-=12;}
    
    if(nmin<=9) nmin="0"+nmin;
    if(nsec<=9) nsec="0"+nsec;
    
    var clocktext=""+tmonth[nmonth]+" "+ndate+", "+nyear+" "+nhour+":"+nmin+":"+nsec+ap+"";
    var clockTemp = document.getElementById("clockbox");
    document.getElementById("clockbox").innerHTML = clocktext;
    document.getElementById("clockbox").style.fontSize = "x-large";
    
    }
    
    GetClock();
    setInterval(GetClock,1000);
    document.getElementById("defaultOpen").click();a = timer(); 
    //Open default tab
    genButtons();
    play(); //default 3, easy
}