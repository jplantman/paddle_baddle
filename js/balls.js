var initBalls = function( paddle, bricks ){

// adjust ball's dx based on where it hit the paddle
var adjustBallDx = function( ball ){
	var whereItHitThePaddle = (ball.x + ball.w/2) - (paddle.x + paddle.w/2);
	var ratio = 5 * whereItHitThePaddle / (paddle.w);
	ball.dx = Math.round( Math.abs( ball.dy ) * ratio );
}

// Ball
var balls = [];
var removeBall = function(){
	for (var i = balls.length - 1; i >= 0; i--) {
		if ( balls[i] == this ){
			balls.splice( i, 1 )[0];
			paddle.checkDefeat();
			return;
		}
	}
}

// Double
var ballDouble = function(){
	var copy = createBall();
	copy.x = this.x;
	copy.y = this.y;
	copy.dx = this.dx/2 || this.dy * Math.random();
	copy.dy = this.dy;
	this.dx = this.dx / -2;

}

var updateBall = function(dt){
	// SCHEME:
	// if touching paddle
		// if sticky, or isStuck,
			// follow paddle
		// else ( if not sticky )
			// bounce off appropriately
	// else ( if not touching paddle )
		// move appropriately, check for brick collision


	// ACTUAL:
	// if touching paddle
	if ( collideRect( this, paddle ) || this.isStuck ){
		// if sticky, or justStartingRound,
		if ( this.isSticky || this.isStuck ){
			if ( !this.isStuck ){
				// become isStuck
				this.isStuck = true;
				this.offset = (this.x + this.w/2) - (paddle.x + paddle.w/2);
			}
			// follow paddle
			this.y = paddle.y - this.h;
			this.x = paddle.x + paddle.w/2 - this.w/2 + this.offset;
		// else ( if not sticky )
		} else {
			// bounce off appropriately
			adjustBallDx( this );
			this.dy *= -1; 
			this.y = paddle.y - this.h;
			sound.jump1.currentTime = 0;
			sound.jump1.play();
		}
	// else ( if not touching paddle )
	} else {
		// move appropriately
		this.x += this.dx * dt / 1000;
		this.y += this.dy * dt / 1000;
		//  dissapear on bottom 
		if ( this.y > canvas.height ){
			this.remove();
			return;
		}
		// bounce off right
		else if ( this.x + this.w > canvas.width ){
			this.dx *= -1;
			this.x = canvas.width - this.w;
			sound.jump1.currentTime = 0;
			sound.jump1.play();
		}
		// bounce off top
		else if ( this.y < 0 ){
			this.dy *= -1;
			this.y = 0;
			sound.jump1.currentTime = 0;
			sound.jump1.play();
		}
		// bounce off right
		if ( this.x < 0 ){
			this.dx *= -1;
			this.x = 0;
			sound.jump1.currentTime = 0;
			sound.jump1.play();
		}
		// check for brick collision
		var brickHit = collideRects( this, bricks );
		if ( brickHit ){
			// if ( 
			// 	this.x + this.w/2 <= brickHit.x 
			// 	||
			// 	this.x + this.w/2 >= brickHit.x + brickHit.w/2
			// 	){
			// 	this.dx *= -1;
			// }
			// if ( 
			// 	this.y + this.h/2 <= brickHit.y 
			// 	||
			// 	this.y + this.h/2 >= brickHit.y + brickHit.w/2
			// 	){
			// 	this.dy *= -1;
			// }

			// var xCollisionIntnsity = 
			// 	Math.max( 
			// 		brickHit.x - (this.x + this.w/2),
			// 		this.x + this.w/2 - (brickHit.x + brickHit.w/2) );

			// var yCollisionIntnsity = 
			// 	Math.max( 
			// 		brickHit.y - (this.y + this.h/2),
			// 		this.y + this.h/2 - (brickHit.y + brickHit.h/2) );

			// if ( yCollisionIntnsity > xCollisionIntnsity ){
			// 	this.dy *= -1;
			// } else {
			// 	this.dx *= -1;
			// }


			var leftCollisionIntensity = brickHit.x - (this.x + this.w/2);
			var rightCollisionIntensity = this.x + this.w/2 - (brickHit.x + brickHit.w/2);
			var topCollisionIntensity = brickHit.y - (this.y + this.h/2);
			var bottomCollisionIntensity = this.y + this.h/2 - (brickHit.y + brickHit.h/2);

			// Which direction did the collision prob come from?
			var biggest = 'left';
			var num = brickHit.x - (this.x + this.w/2)
			var right = this.x + this.w/2 - (brickHit.x + brickHit.w/2);
			var top = brickHit.y - (this.y + this.h/2);
			var bottom = this.y + this.h/2 - (brickHit.y + brickHit.h/2);
			if ( right > num ){
				biggest = 'right';
				num = right;
			}
			if ( top > num ){
				biggest = 'top';
				num = top;
			}
			if ( bottom > num ){
				biggest = 'bottom';
				num = bottom;
			}
			if ( biggest == 'left' ){
				this.dx = -Math.abs( this.dx )
				this.x = brickHit.x - this.w - 1;
			} 
			else if ( biggest == 'right' ) {
				this.dx = Math.abs( this.dx )
				this.x = brickHit.x + brickHit.w + 1;
			}
			else if ( biggest == 'top' ) {
				this.dy = -Math.abs( this.dy );
				this.y = brickHit.y - this.h - 1;
			}
			else if ( biggest == 'bottom' ) {
				this.dy = Math.abs( this.dy );
				this.y = brickHit.y + brickHit.h + 1;
			}


			if (brickHit.upgrade == 'double'){
				this.double();
			}

			brickHit.remove();
			sound.explosion1.currentTime = 0;
			sound.explosion1.play();
		}
	}
	this.draw();
}
var createBall = function( options ){
	var options = options || {};
	var ball = {
		x: canvas.width/2 + 20,
		y: canvas.height/2,
		w: 16,
		h: 16,
		image: images['spritesheet'],
		imgx: 160,
		imgy: 200,
		imgw: 16,
		imgh: 16,
		draw: drawImage,
		dx: 200,
		dy: -200,
		// stickyTimer: 3000,
		isSticky: false,
		isStuck: options.isStuck,
		offset: 0,
		remove: removeBall,
		update: updateBall,
		double: ballDouble
	};
	balls.push( ball );
	return ball;
}
createBall( {isStuck: true} );

// Release Ball
paddle.releaseBall = function(e){
	if ( isPaused ){ return }
	for (var i = balls.length - 1; i >= 0; i--) {
		var ball = balls[i]
		if ( ball.isStuck ){
			ball.isStuck = false;
			ball.dy = -Math.abs(ball.dy);
			adjustBallDx( ball );
			sound.jump1.currentTime = 0;
			sound.zap1.play();
			return;
		}
	}
}
canvas.addEventListener( 'click', paddle.releaseBall );

return balls;


}