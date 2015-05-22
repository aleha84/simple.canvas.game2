function Poligon(init)
{
	this.vertices = init.vertices;
	this.renderOptions = init.renderOptions;

	if(this.vertices.length < 3)
	{
		throw 'Poligon -> vertices lenght mustbe >= 3';
	}

	if(!this.renderOptions)
	{
		this.renderOptions = {};
	}

	if(!this.renderOptions.fillStyle)
	{
		this.renderOptions.fillStyle = 'rgba(255, 255, 0, 0.5)';
	}
	if(!this.renderOptions.lineWidth)
	{
		this.renderOptions.lineWidth = 2;
	}
	if(!this.renderOptions.strokeStyle)
	{
		this.renderOptions.strokeStyle = '#FF0000';
	}

	if(!this.renderOptions.fill)
	{
		this.renderOptions.fill = false;
	}

	this.update = function(shift){
		for (var i = this.vertices.length - 1; i >= 0; i--) {
			this.vertices[i].add(shift);
		};
	}

	this.render = function(){
		SCG2.context.beginPath();	
		SCG2.context.moveTo(this.vertices[0].x, this.vertices[0].y);
		for(var i = 1; i< this.vertices.length; i++)
		{
			SCG2.context.lineTo(this.vertices[i].x, this.vertices[i].y);
		}

		
		SCG2.context.lineWidth = this.renderOptions.lineWidth;
		SCG2.context.strokeStyle = this.renderOptions.strokeStyle;
		SCG2.context.closePath();
		if(this.renderOptions.fill){
			SCG2.context.fillStyle = this.renderOptions.fillStyle;
			SCG2.context.fill();	
		}
		SCG2.context.stroke();
	}

	this.isPointInside = function(point){
		var collisionCount = 0;
		for(var i = 0; i < this.vertices.length; i++)
		{
			var begin = this.vertices[i].clone();
			var end = this.vertices[(i == (this.vertices.length - 1) ? 0: i + 1)].clone();

			if(point.y == begin.y) { begin.y -= 0.001; }
			if(point.y == end.y) { end.y -= 0.001; }

			if(segmentsIntersectionVector2(
				new Line({begin: point, end: new Vector2((begin.x > end.x ? begin.x : end.x), point.y)}), 
				new Line({begin: begin, end: end}))
				)
			{
				collisionCount++;
			}
		}

		return collisionCount > 0 && collisionCount % 2 != 0;

	}
}