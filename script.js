window.onload = function() {
    main();
};

function longitudeLines(ctx, width) {
    var y = width / 2;
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x <= width; x = x + width / 24) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function latitudeLines(ctx, height) {
    var x = height * 2;
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var y = 0; y <= height; y = y + height / 12) {
        ctx.moveTo(0, y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function iss(width, height, center, ctx, issImg) {

    var request = new XMLHttpRequest();
    request.open('GET', 'http://api.open-notify.org/iss-now.json', true);

    request.onload = function() {

        if (request.status == 200) {

            var data = JSON.parse(this.response);

            var lat = data['iss_position']['latitude'];
            var lon = data['iss_position']['longitude'];

            var width360 = width / 360; /* divide comprimento em 360 graus*/
            var height180 = height / 180; /* divide largurar em 180 graus*/

            var posX = center[0] + lon * width360;
            var posY = center[1] - lat * height180;

            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.arc(posX, posY, 25, 0, 2 * Math.PI);
            ctx.drawImage(issImg, posX - 21, posY - 15, 42, 30);
            ctx.strokeStyle = "red";
            ctx.stroke();

        } else {

            console.log("Error");

        }
    }

    request.send();
}



function main() {

    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    var ctx1 = canvas1.getContext('2d');
    var ctx2 = canvas2.getContext('2d');

    var width = canvas1.width;
    var height = canvas1.height;

    var center = [width / 2, height / 2];

    var bgImg = new Image();
    bgImg.src = 'img/worldmap.png';

    bgImg.onload = function() {

        ctx1.drawImage(bgImg, -height, 0, width, height);
        ctx1.drawImage(bgImg, height - 1, 0, width, height);


        longitudeLines(ctx1, width);
        latitudeLines(ctx1, height);

        var issImg = new Image();
        issImg.src = 'img/iss.png';

        issImg.onload = function() {
            setInterval(iss, 5000, width, height, center, ctx2, issImg);
        }

    }

}