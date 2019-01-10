var continueGame;
var showScoreCard = function(nextLevel, paddle){

canvas.classList.add('hidden');
var scoreCard;
var totalScore = paddle.score;

continueGame = function(){
	canvas.classList.remove('hidden');
	scoreCard.parentNode.removeChild( scoreCard );
	initRound(nextLevel);
	continueGame = undefined;
}


setTimeout( function(){
	sound.explosion1.play();
	scoreCard = createElem(
		document.body.clientWidth/2, 
		50, 
		'scoreCardText', 
		"Brick Score: <span style='color: crimson'> "+paddle.score+" </span><br/>"
	)

}, 1000 );

setTimeout( function(){
	sound.explosion1.play();
	var timePenalty = Math.round( paddle.time / -3000 );
	scoreCard.innerHTML += "Time Penalty: <span style='color: crimson'> "+timePenalty+" </span><br/>";
	totalScore += timePenalty;
}, 2000 );

setTimeout( function(){
	sound.explosion1.play();
	var hpBonus = paddle.hp * 20;
	scoreCard.innerHTML += "HP Bonus: <span style='color: crimson'> "+hpBonus+" </span><br/><br/>";
	totalScore += hpBonus;
}, 3000 );

setTimeout( function(){
	sound.explosion1.play();
	scoreCard.innerHTML += "Total Score: <span style='color: crimson'> "+totalScore+" </span><br/><br/>";
}, 4000 );

setTimeout( function(){
	sound.explosion1.play();
	scoreCard.innerHTML += "&nbsp; &nbsp; &nbsp; &nbsp; <span onclick='continueGame()' style='color: crimson; cursor: pointer;'> Continue </span><br/>";
}, 5000 );





}