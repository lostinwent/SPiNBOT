var colors = ["#f1bb62", "#ee5d85", "#caeaf1", "#eb5b68", "#f8f082",            "#c5c452",  "#82cfcd",  "#cddf7f",
                "#f05622", "#c5de8e",
                "#ee5d85", "#dedee9"];
var directions = ["Forward", "Backward", "Turn Right", "Turn Left",
                     "Strafe Right", "Strafe Left"];

var time = ["1", "2", "3"];

// var possibilities = [];

// for (i=0; i < directions.length; i++) {
//   // var time_random = [];
//   var randomNumber_time = time[Math.floor(Math.random()*time.length)];
//   // time_random.push(randomNumber_time);
//   console.log(randomNumber_time);
//   // for (a = 0; a < time_random.length; a++) {
//       directions.forEach(function(possibility){
//         time_random.forEach(function(t){
//           possibilities.push(possibility + '\n' + t);
//       });
//     });
//   // }; 
// }


var possibilities = ["Forward 1", "Forward 2", "Backward 1", "Backward 2", "Left 1", "Left 2", "Right 1", "Right 2", "Strafe Right 1", "Strafe Right 2", "Strafe Left 1", "Strafe Left 2"];

// function possibilities(){
//   for (var i = 0; i < directions.length; i++){
//     var randomNumber_direction = Math.floor(Math.random()*directions.length);
//     var randomNumber_time = Math.floor(Math.random()*time.length);
//     var possibility = (directions[randomNubmer_direction]) + '\n' + (time[randomNumber_time]);
//     console.log(possibility);
//     possibilities.push(possibility);
//   }
// }

  var startAngle = 0;
  var arc = Math.PI / 6;
  var spinTimeout = null;
  
  var spinArcStart = 10;
  var spinTime = 0;
  var spinTimeTotal = 0;
  
  var ctx;
  
  function draw() {
    drawRouletteWheel();
  }
  
  function drawRouletteWheel() {
    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
      var outsideRadius = 250;
      var textRadius = 200;
      var insideRadius = 150;
      
      ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,500,500);
      
      
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0;
      
      ctx.font = 'bold 16px sans-serif';
      
      for(var i = 0; i < 12; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        
        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();
        
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = possibilities[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      } 
      
      //Arrow
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 100, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 100, 250 - (outsideRadius + 5));
      ctx.fill();
    }
  }
  
  $("#button").click(function(){
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
  });
  
  function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
      stopRotateWheel();
      return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
  }
  
  function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 40px Impact';
    var text = possibilities[index]
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
    console.log(text);
  }
  
  function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
  }
  
  draw();