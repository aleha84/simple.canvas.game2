function Circle (center, radius) {
	if(center instanceof Vector2){
		this.center = center;
		this.radius = radius;	
	}
	else if(center instanceof Object && center.center !== undefined && center.radius !== undefined)
	{
		this.center = center.center;
		this.radius = center.radius;	
	}
	

	this.render = function(fill, color){
		
		SCG2.context.beginPath();
		SCG2.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		if(fill){
			SCG2.context.fillStyle = color? color:'rgba(255, 255, 0, 0.5)';
			SCG2.context.fill();	
		}
		SCG2.context.lineWidth = 1;
		SCG2.context.strokeStyle = '#FFFF00';
		SCG2.context.stroke();
	}
}