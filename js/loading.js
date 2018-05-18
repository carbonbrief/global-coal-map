// inspired by http://jsfiddle.net/simonsarris/Msdkv/ and http://jsfiddle.net/AbdiasSoftware/YVEhE/8/

var canvas = document.getElementById('canvas-id');
var ctx = canvas.getContext('2d');
var canvasWidth = 100;
var canvasHeight = 100;
//var loading = true;

ctx.translate(10,10); // to move circle from canvas edges

ctx.save();

function rotate () {

    // Clear the canvas
    ctx.restore();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
    // Move registration point to the center of the canvas
    ctx.translate(canvasWidth/2, canvasWidth/2);
        
    // Rotate 2 degrees
    ctx.rotate(Math.PI / 90);
        
    // Move registration point back to the top left corner of canvas
    ctx.translate(-canvasWidth/2, -canvasWidth/2);

    var firstPart = ctx.createLinearGradient(0,0,0,100);
    firstPart.addColorStop(0, '#a45edb');
    firstPart.addColorStop(0.7, '#dd54b6');
    firstPart.addColorStop(1, '#ff8767');

    var secondPart = ctx.createLinearGradient(0,0,0,100);
    secondPart.addColorStop(1, '#ff8767');
    secondPart.addColorStop(0.7, '#ffc83e');
    secondPart.addColorStop(0, '#ced1cc');


    var width = 8;
    ctx.lineWidth = width;

    // First we make a clipping region for the left half
    ctx.save();
    ctx.beginPath();
    ctx.rect(-width, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the left half
    ctx.strokeStyle = firstPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default

    // Then we make a clipping region for the right half
    ctx.save();
    ctx.beginPath();
    ctx.rect(50, -width, 50+width, 100 + width*2);
    ctx.clip();

    // Then we draw the right half
    ctx.strokeStyle = secondPart;
    ctx.beginPath();
    ctx.arc(50,50,50,0,Math.PI*2, false);
    ctx.stroke();

    ctx.restore(); // restore clipping region to default
}


setInterval(rotate, 20);


// removing loading mask after a short interval
// timed to synchronise with the autoplay of the slider

setTimeout (function() {
    $('#loading').css('visibility', 'hidden');
}, 1700);