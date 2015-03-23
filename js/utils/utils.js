window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();


function initializer(callback) {
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in SCG2.src) {
      numImages++;
    }
    for(var src in SCG2.src) {
      SCG2.images[src] = new Image();
      SCG2.images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback();
        }
      };
      SCG2.images[src].src = SCG2.src[src];
    }
  }

function getRandom(min, max){
	return Math.random() * (max - min) + min;
}