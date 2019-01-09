var loaded = false;

// Images

var images = preloadImages([
	['spritesheet', 'images/breakout_sprites(no shadow).png']
], function(){
	initMainMenu();
	loaded = true;
	// initRound( "Test" );
});

// Sound

var sound = {
	jump1: document.getElementById('jump1'),
	explosion1: document.getElementById('explosion1'),
	explosion2: document.getElementById('explosion2'),
	zap1: document.getElementById('zap1'),
	zap2: document.getElementById('zap2'),
	song1: document.getElementById('song1')
}
var gameVolume;
var setVolume = function( volume ){
	gameVolume = volume;
	sound.jump1.volume = 0.03 * volume;
	sound.explosion1.volume = 0.3 * volume;
	sound.explosion2.volume = 0.3 * volume;
	sound.zap1.volume = 0.7 * volume;
	sound.zap2.volume = 0.1 * volume;
	sound.song1.volume = 0.3 * volume;
}
setVolume( 1 );




sound.song1.addEventListener('ended', function() { 
   sound.song1.play();
   console.log('song looping')
}, false);