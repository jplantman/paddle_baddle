var initMainMenu = function(){
	var loader = document.getElementById('loader');
	loader.parentNode.removeChild( loader );

	var title = createElem( 
		document.body.clientWidth/2, 
		50, 
		'title', 
		'Paddle Baddle' 
	);

	var start = createElem( 
		document.body.clientWidth/2, 
		120, 
		'menuButton', 
		'Start'
	);

	var startGame = function(){
		canvas.classList.remove('hidden');
		start.parentNode.removeChild( start );
		title.parentNode.removeChild( title );
		initRound(10);
		sound.song1.play();
	}
	
	start.onclick = startGame;




	
}



