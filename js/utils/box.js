function Box(topLeft,size){
	this.topLeft = topLeft;
	this.size = size;
	//this.center = new Vector2(this.topLeft.x + (size.x/2), this.topLeft.y + (size.y/2));
	this.bottomRight = new Vector2(this.topLeft.x + this.size.x,this.topLeft.y+this.size.y);
	this.update = function(topLeft,size){
		this.topLeft = topLeft;
		if(size!== undefined)
		{
			this.size = size;
		}
		//this.center = new Vector2(this.topLeft.x + (size.x/2), this.topLeft.y + (size.y/2));
		this.bottomRight = new Vector2(this.topLeft.x + this.size.x,this.topLeft.y+this.size.y);
	}
	this.isPointInside = function(point){
		return //point instanceof Vector2 &&
			   this.topLeft.x <= point.x && point.x <= this.bottomRight.x && 
			   this.topLeft.y <= point.y && point.y <= this.bottomRight.y
	}

	// this.isIntersectsWithCircle = function(circle)
	// {
	// 	return boxCircleIntersects(circle,this);
	// }

	this.isIntersectsWithBox = function(box)
	{
		return this.isPointInside(box.topLeft) || this.isPointInside(box.bottomRight);
	}
}

