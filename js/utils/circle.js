function Circle (center, radius) {
	this.center = center;
	this.radius = radius;

	this.render = function(){
		SCG2.context.beginPath();
		SCG2.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
		SCG2.context.lineWidth = 1;
		SCG2.context.strokeStyle = '#00FF00';
		SCG2.context.stroke();
	}
}