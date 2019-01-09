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
sound.jump1.volume = 0.03;
sound.explosion1.volume = 0.3;
sound.explosion2.volume = 0.3;
sound.zap1.volume = 0.7;
sound.zap2.volume = 0.1;
sound.song1.volume = 0.3;




sound.song1.addEventListener('ended', function() { 
   sound.song1.play();
   console.log('song looping')
}, false);