//// Core Game Engine
//
// This is a loose collection of tools to help in 
// simple 2d game development

// Pause Feature
isPaused = false;

// Canvas
var canvas = document.getElementById('canvas');
canvas.width = 290;
canvas.height = 500;

var c = canvas.getContext('2d');

// Image Preloader
preloadImages = function( imagesArray, callback ){
	var loadedImages = 0,
		totalImages = imagesArray.length;
	var onloadFunc = function(){
		loadedImages++;
		if ( loadedImages == totalImages ){
			callback();
		}
	}
	var images = {};
	for (var i = imagesArray.length - 1; i >= 0; i--) {
		var img = new Image();
		// imagesArray holds arrays like this: 
		//   [ "name", "images/img.png" ] 
		img.src = imagesArray[i][1];
		images[ imagesArray[i][0] ] = img; 
		img.onload = onloadFunc;
	}
	return images;
}

// Draw functions to give to sprites

/*
core does not have sprite creation functions. but 
these different draw functions can be set == your 
sprite objects' draw functions
*/

var drawImage = function(){
	c.drawImage(
		this.image,
		this.imgx, this.imgy, this.imgw, this.imgh,
		this.x, this.y, this.w, this.h
	);
}


// UI Elements
var createElem = function( x, y, className, html ){
	var div = document.createElement('div');
	div.className = className;
	div.style.position = "absolute";
	div.style.left = x + 'px';
	div.style.top = y + 'px';
	div.innerHTML = html;
	document.body.appendChild( div );
	return div;
}





// Collisions
var collideRect = function( a, b ){
	return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h
}

var collideRects = function ( target, rects ){
	for (var i = rects.length - 1; i >= 0; i--) {
		if ( collideRect( target, rects[i] ) ){
			return rects[i];
		}
	}
}



// Random Number
rand = function(max){
	return Math.floor( Math.random()*(max+1) );
};


