var initBricks = function(currentLevel, paddle){
	// Bricks
	var bricks = [];
	var bullets = [];

	var data = { // BRICK TYPES //

		face1: {x: 200, y: 40, ai: "enemy", points: 30},
		face2: {x: 240, y: 40, ai: "enemy", next: "face1", points: 30},
		face3: {x: 280, y: 40, ai: "enemy", next: "face2", points: 30},
		face4: {x: 320, y: 40, ai: "enemy", next: "face3", points: 30},
		idol1: {x: 240, y: 120, ai: "bullet"},

		red: {x: 0, y: 0, points: 5},
		purple: {x: 40, y: 0, next: 'red', points: 5},
		yellow: {x: 80, y: 0, next: 'purple', points: 5},
		blue1: {x: 120, y: 0, next: 'yellow', points: 5},
		blue2: {x: 160, y: 0, next: 'blue1', points: 5},
		green1: {x: 200, y: 0, next: 'blue2', points: 5},
		green2: {x: 240, y: 0, next: 'green1', points: 5},
		star1: {x: 280, y: 0, next: "green2", points: 10},
		star2: {x: 280, y: 0, next: "star1", points: 10},
		star3: {x: 280, y: 0, next: "star2", points: 10},
		sandy1: {x: 320, y: 0, points: 3},
		sandy2: {x: 360, y: 0, next: 'sandy1', points: 3},


		// BOSSES
		// boss1: {x: 200, y: 40, ai: "enemy", points: 30},
	}

	var points = [];
	var updatePoints = function(dt){
		this.y += this.dy * dt / 1000;
		this.style.top = this.y + 'px';
		this.time += dt;
		if ( this.time > 800 ){
			this.parentNode.removeChild( this );
			for (var i = points.length - 1; i >= 0; i--) {
				if ( points[i] == this ){
					points.splice(i, 1);
					return;
				}
			}
		}
	}
	var indicatePoints = function( n, xcanv, ycanv ){
		// account for canvas stretch
		var stretchX = canvas.offsetWidth / canvas.width;
		var stretchY = canvas.offsetHeight / canvas.height;
		var x = ( xcanv - canvas.offsetLeft ) * stretchX;
		var y = ( ycanv - canvas.offsetTop ) * stretchY;

		var elem = createElem( x, y, "points", n );
		elem.update = updatePoints;
		elem.dy = -30;
		elem.time = 0;
		elem.y = y;
		points.push( elem );
		console.log(elem.style.top)
	}

	var removeBrick = function(){
		for (var i = bricks.length - 1; i >= 0; i--) {
			if ( bricks[i] == this ){
				bricks.splice( i, 1 )[0];
				emitParticles(
					this.x + this.w/2,
					this.y + this.h/2,
					10,
					this.imgx, this.imgy
				);
				canvas.shake(12);
				paddle.score += this.points;
				paddle.scoreDisplay.innerHTML = paddle.score;
				indicatePoints( this.points, this.x + this.w/2, this.y - 20 );
				if ( this.next ){
					createBrick( this.x, this.y, this.next );
					return;
				}
			}
		}
		checkForWin();
	}

	var removeBullet = function(emit){
		if ( emit ){
			emitParticles(
				this.x + this.w/2,
				this.y + this.h,
				10,
				this.imgx, this.imgy
			);
			canvas.shake(12);
			sound.explosion2.currentTime = 0;
			sound.explosion2.play();
		}
		
		for (var i = bullets.length - 1; i >= 0; i--) {
			if ( bullets[i] == this ){
				return bullets.splice( i, 1 );
				// if ( this.next ){
				// 	createBrick( this.x, this.y, this.next );
				// 	return;
				// }
			}
		}
	}

	var createBrick = function(x, y, type, upgrade){

		type = data[type];
		var brick = {
			x: x,
			y: y,
			w: 32,
			h: 32,
			image: images['spritesheet'],
			imgx: type.x,
			imgy: type.y,
			imgw: 32,
			imgh: 32,
			points: type.points,
			upgrade: upgrade,
			next: type.next,
			draw: drawImage,
			remove: removeBrick,
			ai: type.ai // enemy
		}
		if ( type.ai == "enemy" ){
			brick.dx = 30;
			brick.update = function(dt){
				brick.x -= brick.dx * dt / 1000;
				if ( brick.x <= 0 || 
					 brick.x + brick.w >= canvas.width )
				{
					brick.dx *= -1;
				}
				if (Math.random() < 0.002 ){
					createBrick( 
						brick.x + brick.w/2,
						brick.y + brick.h,
						"idol1" );
					sound.zap2.play();
				}
			}
		}
		else if ( type.ai == 'bullet' ){
			brick.dy = 100;
			brick.w = 16;
			brick.h = 32;
			brick.remove = removeBullet;
			brick.update = function(dt){
				brick.y += brick.dy * dt / 1000;
				if ( brick.y > canvas.height ){
					brick.remove();
				}
				else if ( collideRect( brick, paddle ) ){
					brick.remove(true);
					paddle.getHit(1);

				}
				brick.draw();
			}

			bullets.push( brick );
			return;
		}
		bricks.push( brick );
	}

	// Level

	var levels = [
	{
		level: 0,
		name: "Test",
		load: function(){
			console.log("Level: "+this.name)
			createBrick(10, 10+40, "star3" );
			createBrick(
					10 + 40 * 3, 
					20, 
					"face4",
					"double"
				);
		}
	},
	{
		level: 1,
		name: "Welcome",
		load: function(){
			console.log("Level: "+this.name)
			
				// Top Row
				createBrick(
					10 + 40 * 3, 
					20, 
					"face1",
					"double"
				);
			for (var i = 5; i >= 1; i--) {
				
				// Middle Row
				createBrick(
					10 + 40 * i, 
					20 + 40, 
					"sandy2" );
				// Bottom Row
				createBrick(
					10 + 40 * i, 
					20 + 40 *2 , 
					"red" );
			}
		}
	},
	{
		level: 2,
		name: "Travel The Desert",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 1, 
					20, 
					"face1",
					"double"
				);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face1",
				);
			for (var i = 6; i >= 0; i--) {
				createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"yellow" );
				if ( i < 3 || i > 5 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"sandy2" );
				}
				if ( i < 2 || i > 5 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 4, 
					"sandy2" );
				}
				if ( i < 1 || i > 6 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 5, 
					"sandy2" );
				}
			}	
		}
	},
	{
		level: 3,
		name: "Attack the Bunker!",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face2",
					"double"
				);

			createBrick(
					10 + 40 * 6, 
					20, 
					"face2",
					"double"
				);
			for (var i = 6; i >= 0; i--) {
				if ( i != 0 && i != 3 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"green1" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"blue1" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 4, 
					"red" );
				}
			}	
		}
	},
	{
		level: 4,
		name: "Inside The Bunker",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face4",
					"double"
				);

			createBrick(
					10 + 40 * 6, 
					20, 
					"face2",
				);
			for (var i = 6; i >= 0; i--) {
				if ( i < 6 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"green2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"blue2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 4, 
					"red" );
				}
			}	
		}
	},
	{
		level: 5,
		name: "Useless Fighting",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face4",
					"double"
				);

			createBrick(
					10 + 40 * 6, 
					20, 
					"face4",
				);
			for (var i = 6; i >= 0; i--) {
				if ( i > 1 && i < 4  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"star1" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"yellow" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 9, 
					"blue2" );
				}
			}	
		}
	},
	{
		level: 6,
		name: "Sticky",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face2",
					"double"
				);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face2",
					"sticky"
				);

			createBrick(
					10 + 40 * 6, 
					20, 
					"face2",
					"double"
				);
			for (var i = 6; i >= 0; i--) {
				if ( i > 1 && i < 6  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"star1", "sticky" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"yellow", "double" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 4, 
					"blue2" );
				}
			}	
		}
	},
	{
		level: 7,
		name: "Collumns",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face3",
					"double"
				);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face4",
					"sticky"
				);

			createBrick(
					10 + 40 * 6, 
					20, 
					"face2",
					"double"
				);
			for (var i = 6; i >= 0; i--) {
				if ( i == 0 || i == 2 || i == 4 || i == 6  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"yellow" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"sandy2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 4, 
					"sandy2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 5, 
					"sandy2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 6, 
					"sandy2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 7, 
					"sandy2" );
					createBrick(
					10 + 40 * i, 
					20 + 40 * 8, 
					"yellow" );
				}
			}	
		}
	},
	{
		level: 8,
		name: "Protected",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 3, 
					20, 
					"face3",
					"double"
				);

			createBrick(
					10 + 40 * 3, 
					20 + 40 * 2, 
					"face3",
					"sticky"
				);

			for (var i = 6; i >= 0; i--) {
				createBrick(
				10 + 40 * i, 
				20 + 40 * 1, 
				"green2" );
				createBrick(
				10 + 40 * i, 
				20 + 40 * 3, 
				"green2" );
				if ( i == 2 || i == 4  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 1, 
					"blue2" );
				}
			}	
		}
	},
	{
		level: 9,
		name: "Large Fight",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 1, 
					20, 
					"face4",
					"double"
				);
			createBrick(
					10 + 40 * 3, 
					20 + 40 * 1, 
					"face2",
				);
			createBrick(
					10 + 40 * 5, 
					20, 
					"face3",
					"double"
				);
			createBrick(
					10 + 40 * 6, 
					20 + 40 * 1, 
					"face2",
				);
			for (var i = 6; i >= 0; i--) {
				if ( i == 2 || i == 4 || i == 6  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"star3" );
				}
				if ( i == 2 ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 3, 
					"star3" );
				}
			}	
		}
	},
	{
		level: 10,
		name: "First Boss (almost)",
		load: function(){
			console.log("Level: "+this.name);

			createBrick(
					10 + 40 * 1, 
					20, 
					"face4",
					"double"
				);
			for (var i = 6; i >= 0; i--) {
				if ( i == 2 || i == 4 || i == 6  ){
					createBrick(
					10 + 40 * i, 
					20 + 40 * 2, 
					"star3" );
				}
			}	
		}
	}
];



// Level Manager
var nextLevel,
	currentLevel = currentLevel;

if ( levels[currentLevel] ){

	// load level
	levels[currentLevel].load();

	// show start text
	var startText = createElem(
		document.body.clientWidth/2, 
		50, 
		'levelStartText', 
		'Level '+currentLevel+"<br/>"+levels[currentLevel].name
	)
	setTimeout( function(){
		startText.parentNode.removeChild( startText );
	}, 2000 );

} else {

	console.log('no next level');
	var startText = createElem(
		document.body.clientWidth/2, 
		50, 
		'levelStartText', 
		"You Win!"
	)
	setTimeout( function(){
		startText.parentNode.removeChild( startText );
	}, 2000 );

}

var checkForWin = function(){
	if ( bricks.length == 0 ){
		setTimeout(function(){
			canvas.endRound();
			showScoreCard( currentLevel+1, paddle )
			// initRound(currentLevel+1);
		}, 2000)
	}
}







return [ bricks, bullets, points ];


}