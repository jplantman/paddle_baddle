var initMainMenu = function(){
	var loader = document.getElementById('loader');
	loader.parentNode.removeChild( loader );

	var title = createElem( 
		document.body.clientWidth/2 - 80, 
		50, 
		'title', 
		'Bricks vs Paddle' 
	);

	var start = createElem( 
		document.body.clientWidth/2 - 20, 
		120, 
		'menuButton', 
		'Start'
	);
	

	var startGame = function(){
		canvas.classList.remove('hidden');
		start.parentNode.removeChild( start );
		title.parentNode.removeChild( title );
		initRound(4);
		sound.song1.play();
	}
	start.onclick = startGame;




	
}



