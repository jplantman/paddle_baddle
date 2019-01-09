var initBricks = function(currentLevel, paddle){
	// Bricks
	var bricks = [];
	var bullets = [];

	var data = { // BRICK TYPES //

		face1: {x: 200, y: 40, ai: "enemy"},
		face2: {x: 240, y: 40, ai: "enemy", next: "face1"},
		face3: {x: 280, y: 40, ai: "enemy", next: "face2"},
		face4: {x: 320, y: 40, ai: "enemy", next: "face3"},
		idol1: {x: 240, y: 120, ai: "bullet"},

		red: {x: 0, y: 0},
		purple: {x: 40, y: 0, next: 'red'},
		yellow: {x: 80, y: 0, next: 'purple'},
		blue1: {x: 120, y: 0, next: 'yellow'},
		blue2: {x: 160, y: 0, next: 'blue1'},
		green1: {x: 200, y: 0, next: 'blue2'},
		green2: {x: 240, y: 0, next: 'green1'},
		star1: {x: 280, y: 0, next: "green2"},
		star2: {x: 280, y: 0, next: "star1"},
		star3: {x: 280, y: 0, next: "star2"},
		sandy1: {x: 320, y: 0},
		sandy2: {x: 360, y: 0, next: 'sandy1'},
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
			initRound(currentLevel+1);
		}, 2000)
	}
}







return [ bricks, bullets ];


}