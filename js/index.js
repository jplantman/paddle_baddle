
var initRound = function(currentLevel){

var roundOver = false;
canvas.style = " background: url(images/breakout_bg.png) no-repeat center center fixed; " +
			"-webkit-background-size: cover;" +
			"-moz-background-size: cover;"+
			"-o-background-size: cover;"+
			"background-size: cover;";

// Paddle
var paddle = {
	hp: 10,
	score: 0,
	time: 0,
	x: canvas.width/2 - 49,
	y: canvas.height - 25,
	w: 98,
	h: 25,
	image: images['spritesheet'],
	imgx: 0,
	imgy: 200,
	imgw: 98,
	imgh: 25,
	draw: drawImage,
	moveTo: function(e){
		if ( isPaused ){ return }
		// account for canvas stretch
		var stretchX = canvas.offsetWidth / canvas.width;
		// var stretchY = canvas.offsetHeight / canvas.height;
		var x = ( e.pageX - canvas.offsetLeft ) / stretchX;
		// var y = ( e.pageY - canvas.offsetTop ) / stretchY;

		paddle.x = x - paddle.w/2;
	}
}

// Defeat
paddle.checkDefeat = function(){
	if ( paddle.hp <= 0 || balls.length == 0 ){
		var startText = createElem(
			document.body.clientWidth/2, 
			50, 
			'levelStartText', 
			"Game Over!"
		)
		setTimeout( function(){
			startText.parentNode.removeChild( startText );
			canvas.endRound();
			initRound( currentLevel );
		}, 2000 );
	}
}

// Score Display
paddle.scoreDisplay = createElem(
	10, 
	document.body.clientHeight-10,
	'scoreDisplay',
	'0'
);

// Paddle Health
var hpDisplay = createElem(
	10, 0,
	"hpBar",
	"Health"
);
hpDisplay.style.width = paddle.hp * 20 + 'px';
paddle.getHit = function(n){
	paddle.hp -= n;
	hpDisplay.style.width = paddle.hp * 20 + 'px';
	paddle.checkDefeat();
}

// Paddle Control
canvas.addEventListener( 'mousemove', paddle.moveTo );

// Bricks
var bricks = initBricks(currentLevel, paddle);
var bullets = bricks[1];
var points = bricks[2];
bricks = bricks[0];


var bricks = bricks;
var balls = initBalls( paddle, bricks );

// Canvas Shake
canvas.shake = function(times){
	for (var i = times; i >= 0; i--) {
		(function(i){
			setTimeout( function(){
				if ( i == times ){
					canvas.style.transform = "";
				} else {
					var num = times - i;
					var x = rand( num ) - num/2;
					var y = rand( num ) - num/2;
					canvas.style.transform = 
						"translate("+x+"px, "+y+"px)";
				}
			}, i*100 )
		})(i);
	}
}

// Pause Button
var pauseButton = createElem(
	document.body.clientWidth, 0,
	"pauseButton",
	"||"
);
pauseButton.onclick = function(){
	if ( isPaused ){
		isPaused = false;
		pauseButton.innerHTML = "||";
		before = Date.now();
		update();
	} else {
		isPaused = true;
		pauseButton.innerHTML = "&#9658;";
	}
}

// Sound Button
var soundButton = createElem(
	document.body.clientWidth, 60,
	"soundButton",
	"&#9835;&#9835;"
);
var updateVolume = function(){
	if ( gameVolume == 0 || gameVolume > 1 ){
		gameVolume = 0;
		soundButton.innerHTML = '_';
	}
	else if ( gameVolume == 0.5 ){
		soundButton.innerHTML = '&#9835;';
	} else {
		soundButton.innerHTML = '&#9835;&#9835;';
	}
	setVolume( gameVolume );
}
soundButton.onclick = function(){
	gameVolume += 0.5;
	updateVolume();
}
updateVolume();
// Update Loop
before = Date.now();
var before;
var update = function(){
	var now = Date.now();
	var dt = Math.min(20, now - before);
	before = now;

	paddle.time += dt;

	c.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = bricks.length - 1; i >= 0; i--) {
		if ( bricks[i].update ){ bricks[i].update(dt) }
		bricks[i].draw();
	}

	for (var i = balls.length - 1; i >= 0; i--) {
		balls[i].update(dt);
	}

	for (var i = bullets.length - 1; i >= 0; i--) {
		bullets[i].update(dt);
	}

	paddle.draw();

	for (var i = particles.length - 1; i >= 0; i--) {
		particles[i].update(dt);
	}

	for (var i = points.length - 1; i >= 0; i--) {
		points[i].update(dt);
	}

	if ( !isPaused && !roundOver ){
		requestAnimationFrame( update );
	}
}
update();

canvas.endRound = function(){
	console.log("Ending Round");
	roundOver = true;
	paddle.scoreDisplay.parentNode.removeChild( paddle.scoreDisplay );
	pauseButton.parentNode.removeChild( pauseButton );
	soundButton.parentNode.removeChild( soundButton );
	hpDisplay.parentNode.removeChild( hpDisplay );
	canvas.removeEventListener( 'mousemove', paddle.moveTo );
	canvas.removeEventListener( 'click', paddle.releaseBall );
	balls = [];
}



}





/*

Steps: 

finish main menu, bg img and options menu

pause menu to go back to start

high score saved

unbreakable bricks

sticky and maybe other power ups or heals ??

more levels

more backgrounds

bosses

exploding bricks that are dangerous and look like idols ??

html buttons responsive to screen size changes

*/
	