( function(){



window.particles = [];

var removeParticle = function(){
	for (var i = particles.length - 1; i >= 0; i--) {
		if ( particles[i] == this ){
			particles.splice(i, 1);
			return;
		}
	}
}

var updateParticle = function(dt){
	this.time += dt;
	this.dy += 200 * dt / 1000;
	this.x += this.dx * dt / 1000;
	this.y += this.dy * dt / 1000;
	if ( this.time > 800 ){
		this.remove();
	}
	this.draw();
}

var createParticle = function(x, y, imgx, imgy){
	particles.push( {
		time: rand(300),
		x: x - 10 + rand(20),
		y: y - 10 + rand(20),
		w: 4 + rand(6),
		h: 4 + rand(6),
		image: images['spritesheet'],
		imgx: imgx,
		imgy: imgy,
		imgw: 32,
		imgh: 32,
		dy: -100 * Math.random() - 50,
		dx: -100 + ( 200 * Math.random() ),
		draw: drawImage,
		update: updateParticle,
		remove: removeParticle
	} );
}

window.emitParticles = function(x, y, num, imgx, imgy){
	for (var i = num; i > 0; i--) {
		createParticle(x, y, imgx, imgy);
	}
}


} )();