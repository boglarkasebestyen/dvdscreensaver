
//SOUNDS
var soundX = new Audio("bleep.aif");
var soundY = new Audio("bleep.aif");
var soundCorner = new Audio("shortsaxish.aif");

var cornerAnimationTimer;
var frameTimerInterval = 5;

function getPixelValue(stringValue) {
  return parseInt(stringValue.replace("px", ""));
}

//COLOR FOR DVD LOGO
function getRandomColor() {
  var characters = "123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var randomIndex = Math.floor(Math.random() * 15);
    color += characters[randomIndex] + characters[randomIndex];
  }
  return color;
}

//CHANGE COLOR OF DVD LOGO SVG
function changeCubeColor(animationBox, sound, cornerDetection) {
    document.getElementById("dvdLogo").setAttribute("fill", getRandomColor());
    if (cornerDetection) sound.play(); 
}

function onCornerHit() {
  clearInterval(cornerAnimationTimer);
  cornerAnimationTimer = setInterval(vibrateRed, 60);
  var animationCount = 0;
  var newColor = getRandomColor();

  function vibrateRed() {
      if (animationCount % 2 == 0) {
        document.getElementById("dvdLogo").setAttribute("fill", newColor);
      } else {
        document.getElementById("dvdLogo").setAttribute("fill", "#ff0000");
      }

      if (++animationCount > 26) {
        clearInterval(cornerAnimationTimer);
      }
  }

  soundX.pause();
  soundY.pause();
  soundCorner.play();
}


function almostEqual(a, b) {
  return Math.abs(a - b) <= 5;
}


function detectCorner(newX, newY, maxX, maxY, w, h) {

  var newXwidth = newX + w;
  var newYheight = newY + h;

  // console.log("newX:" + newX + " newY:" + newY + " w:" + w + " h:" + h);
  // console.log("x: " + newXwidth + " y:" + newYheight + " maxX:" + maxX + " maxY:" + maxY);

  var topLeft = almostEqual(newX,0) && almostEqual(newY, 0);
  var topRight = almostEqual(newXwidth, maxX) && almostEqual(newY, 0);
  var bottomRight = almostEqual(newXwidth, maxX) && almostEqual(newYheight, maxY);
  var bottomLeft = almostEqual(newX, 0) && almostEqual(newYheight, maxY);

  if (topLeft || topRight || bottomRight || bottomLeft) {
    onCornerHit();
    return true;
  }

  return false;
}


//ANIMATIONBOX'S MOVEMENT
function movingBox() {
  var animationBox = $("#animationBox");
  var timer = setInterval(frame, frameTimerInterval); 

  var oldX = getPixelValue(animationBox.css("left"));
  var oldY = getPixelValue(animationBox.css("top"));

  var directionX = 1.0;
  var directionY = 1.0;

  var cornerDetection = true;
  var framesSinceCorner = 0;

  var maxX = 0;
  var maxY = 0;

    function frame() {

      maxX = $(document).width() - animationBox.width();
      maxY = $(document).height() - animationBox.height();

      var newX = oldX;
      var newY = oldY;

      if (oldX <= 0 || oldX >= maxX) { 
        directionX = directionX * -1;
        changeCubeColor(animationBox, soundX, cornerDetection);
        // $("#animationBox").effect("bounce", { direction: "left",times: 2}, 2);
      } 

      newX = newX + 2 * directionX;

      if (oldY <= 0 || oldY >= maxY) {
        directionY = directionY * -1;
        changeCubeColor(animationBox, soundY, cornerDetection);
        // $("#animationBox").effect("bounce", { direction: "left",times: 4}, 2);
      } 

      newY = newY + 2 * directionY;

      oldX = newX;
      oldY = newY;

      animationBox.css("left", newX + "px"); 
      animationBox.css("top", newY + "px"); 
      
      if (cornerDetection && detectCorner(newX, newY, $(document).width(), $(document).height(), animationBox.width(), animationBox.height())) {
          cornerDetection = false;
      } else if (++framesSinceCorner > 50) {
          cornerDetection = true;
          framesSinceCorner = 0;
      }
        // console.log("newX:" + newX + " " + "newY:" + newY);

    }

    var mouseDown = false;
    var resizeTimer;
    
    function detectResizeEnd() {
      
      var newMaxX = Math.floor($(document).width() - animationBox.width());
      var newMaxY = Math.floor($(document).width() - animationBox.height());

      if ((newMaxX == Math.floor(maxX)) && (newMaxY = Math.floor(maxY))) {
        clearInterval(resizeTimer);
        if (timer === null) {
          timer = setInterval(frame, frameTimerInterval);
        }
      }
    }

    $(window).resize(
      function () {
        clearInterval(resizeTimer);
        resizeTimer = setInterval(detectResizeEnd, 10);

        clearInterval(timer);
        timer = null;

        oldX = getPixelValue(animationBox.css("left"));
        oldY = getPixelValue(animationBox.css("top"));

        var newMaxX = $(document).width() - animationBox.width();
        var newMaxY = $(document).height() - animationBox.height();

        var differenceX = maxX - newMaxX;
        var differenceY = maxY - newMaxY;

        var newX = oldX - differenceX;
        var newY = oldY - differenceY;

        newX = (newX > 0) ? newX : 1;
        newY = (newY > 0) ? newY : 1;

        animationBox.css("left", newX + "px"); 
        animationBox.css("top", newY + "px"); 

        maxX = newMaxX;
        maxY = newMaxY;

        oldX = newX;
        oldY = newY;
      
    }); // resize
  } // movingBox
    

$(document).ready(function() {
  document.getElementById("dvdLogo").setAttribute("fill", getRandomColor());
  movingBox();
});

console.log("Test")