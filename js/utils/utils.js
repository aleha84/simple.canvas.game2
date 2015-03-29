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

function boxCircleIntersects(circle, rect)
{ 
	var circleDistance = new Vector2(Math.abs(circle.center.x - rect.center.x),Math.abs(circle.center.y - rect.center.y));
	if(circleDistance.x > (rect.size.x/2 + circle.radius))
	{
		return false;
	}
	if(circleDistance.y > (rect.size.y/2 + circle.radius))
	{
		return false;
	}

	if(circleDistance.x <= (rect.size.x/2)) 
	{
		return true; 
	}
	if(circleDistance.y <= (rect.size.y/2))
	{
		return true;
	}
	var cornerDistance_sq = Math.pos(circleDistance.x - rect.size.x/2,2) + Math.pow(circleDistance.y - rect.size.y/2,2);
	return (cornerDistance_sq <= Math.pow(circle.radius,2))
}

function radiansToDegree (radians) {
  if(radians === undefined)
  {
    return 0;
  }
  return radians * 180/Math.PI;
}

function degreeToRadians (degree) {
  if(degree === undefined)
  {
    return 0;
  }
  return degree * Math.PI / 180;
}