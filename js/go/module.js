SCG2.Module = {};

SCG2.Module.Module = function(init){
	this.parent = undefined;
	this.position = new Vector2;
	this.displayPosition = new Vector2; 
	this.size = new Vector2;
	this.angle = 0;
	this.img = undefined;
	this.alive = true;
	this.id = '';
	this.cornerPoints = [];
	this.boundingSphere = undefined;
	if(init!=undefined)
	{
		$.extend(this,init);
	}
	if(init.displayPosition === undefined)
	{
		this.displayPosition = this.position;
	}

	this.calculateBoundingSphere();
	this.collided = false;
	this.collidedSegmentIndices = [];
	this.collisionPoints = [];
}

SCG2.Module.Module.prototype = {
	constructor: SCG2.Module.Module,

	render: function(){},

	update: function (now) {
		
	},

	calculateBoundingSphere: function  () {
		if(this.cornerPoints.length > 2){
			var topLeft = new Vector2;
			var bottomRight = new Vector2;
			for (var i = this.cornerPoints.length - 1; i >= 0; i--) {
				if(this.cornerPoints[i].x < topLeft.x)
				{
					topLeft.x = this.cornerPoints[i].x;
				}
				if(this.cornerPoints[i].y < topLeft.y)
				{
					topLeft.y = this.cornerPoints[i].y;
				}
				if(this.cornerPoints[i].x > bottomRight.x)
				{
					bottomRight.x = this.cornerPoints[i].x;
				}
				if(this.cornerPoints[i].y > bottomRight.y)
				{
					bottomRight.y = this.cornerPoints[i].y;
				}

				
			}
			// var width = bottomRight.x - topLeft.x;
			// var height = bottomRight.y - topLeft.y;
			// var center = new Vector2(topLeft.x + width/2,topLeft.y + height/2);
			// var radius = width > height? width/2 : height/2;

			var center = new Vector2;//((bottomRight.x - topLeft.x)/2,(bottomRight.y - topLeft.y)/2)
			var radius = topLeft.distance(bottomRight)/2;

			this.boundingSphere = new Circle(center,radius);
		}
	},

	renderBoundingSphere: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render(fill);

		
		for (var i = this.cornerPoints.length - 1; i >= 0; i--) {
			SCG2.context.beginPath();
			SCG2.context.moveTo(this.cornerPoints[i].x, this.cornerPoints[i].y);
			SCG2.context.lineTo(this.cornerPoints[i==0?this.cornerPoints.length-1:i-1].x, this.cornerPoints[i==0?this.cornerPoints.length-1:i-1].y);
			SCG2.context.strokeStyle = '#0000FF';
			SCG2.context.lineWidth = 1;
			if(this.collidedSegmentIndices.indexOf(i)!=-1)
			{
				SCG2.context.lineWidth = 3;
				SCG2.context.strokeStyle = '#000000';
			}
			SCG2.context.stroke();
		}
	}
}