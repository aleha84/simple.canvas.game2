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
	var cornerDistance_sq = Math.pow(circleDistance.x - rect.size.x/2,2) + Math.pow(circleDistance.y - rect.size.y/2,2);
	return (cornerDistance_sq <= Math.pow(circle.radius,2))
}

function segmentIntersectBox(segment,box)
  {
    var minX = segment.begin.x;
    var maxX = segment.end.x;
    if(segment.begin.x > segment.end.x)
    {
      minX = segment.end.x;
      maxX = segment.begin.x;
    }
   if(maxX > box.bottomRight.x)
    {
      maxX = box.bottomRight.x;
    }
    if(minX < box.topLeft.x)
    {
      minX = box.topLeft.x;
    }
    if(minX > maxX) 
    {
      return false;
    }
    var minY = segment.begin.y;
    var maxY = segment.end.y;
    var dx = segment.end.x - segment.begin.x;
    if(Math.abs(dx) > 0.0000001)
    {
      var a = (segment.end.y - segment.begin.y) / dx;
      var b = segment.begin.y - a * segment.begin.x;
      minY = a * minX + b;
      maxY = a * maxX + b;
    }
    if(minY > maxY)
    {
      var tmp = maxY;
      maxY = minY;
      minY = tmp;
    }
    if(maxY > box.bottomRight.y)
    {
      maxY = box.bottomRight.y;
    }
    if(minY < box.topLeft.y)
    {
      minY = box.topLeft.y;
    }
    if(minY > maxY) // If Y-projections do not intersect return false
    {
      return false;
    }
    return true;
  }

function segmentIntersectCircle(segment,circle)
{
    // return ((circle.center.x - circle.radius <= segment.begin.x && segment.begin.x <= circle.center.x + circle.radius ) && (circle.center.y - circle.radius <= segment.begin.y && segment.begin.y <= circle.center.y + circle.radius )
    //   || (circle.center.x - circle.radius <= segment.end.x && segment.end.x <= circle.center.x + circle.radius ) && (circle.center.y - circle.radius <= segment.end.y && segment.end.y <= circle.center.y + circle.radius ));
    var d = segment.end.substract(segment.begin,true);
    var f = segment.begin.substract(circle.center,true);

    var a = d.dot(d);
    var b = 2*f.dot(d);
    var c = f.dot(f) - Math.pow(circle.radius,2);
    var discriminant = b*b-4*a*c;
    if(discriminant<0)
    {
      return false;
    }

    discriminant = Math.sqrt(discriminant);
    var t1 = (-b - discriminant)/(2*a);
    var t2 = (-b + discriminant)/(2*a);

    if(t1 >= 0 && t1 <=1)
    {
      return true;
    }
    if(t2>=0 && t2 <=1)
    {
      return true;
    }
    return false;
}

function segmentsIntersectionVector2(line1, line2)
{
  var x1 = line1.begin.x;
  var x2 = line1.end.x;
  var y1 = line1.begin.y;
  var y2 = line1.end.y;
  var x3 = line2.begin.x;
  var x4 = line2.end.x;
  var y3 = line2.begin.y;
  var y4 = line2.end.y;

  var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if(d == 0)
  {
    return undefined;
  }

  var xi = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
  var yi = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;

  var p = new Vector2(xi,yi);
  if (xi < Math.min(x1,x2) || xi > Math.max(x1,x2)) return undefined;
  if (xi < Math.min(x3,x4) || xi > Math.max(x3,x4)) return undefined;

  return p;
}

function segmentsIntersection(line1, line2)
{
  var CmP = line1.begin.directionNonNormal(line2.begin);
  var r = line1.begin.directionNonNormal(line1.end);
  var s = line2.begin.directionNonNormal(line2.end);

  var CmPxr = CmP.x * r.y - CmP.y*r.x;
  var CmPxs = CmP.x * s.y - CmP.y * s.x;
  var rxs = r.x * s.y - r.y*s.x;

  if(CmPxr == 0)
  {
    return ((line2.begin.x - line1.begin.x < 0) != (line2.begin.x - line1.end.x < 0)) || ((line2.begin.y - line1.begin.y < 0) != (line2.begin.y - line1.end.y < 0));
  }

  if(rxs == 0)
  {
    return false;
  }

  var rxsr = 1.0/rxs;
  var t = CmPxs * rxsr;
  var u = CmPxr * rxsr;

  return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
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