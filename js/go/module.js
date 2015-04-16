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

	render: function(){
		if(this.img === undefined)
		{
			return;
		}
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		SCG2.context.rotate(this.angle);

		SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	
		this.innerRender();

		if(SCG2.gameLogics.drawBoundings)
		{
			this.renderBoundingSphere(this.collided);	
		}		

		SCG2.context.rotate(-this.angle);
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
	},

	innerRender: function(){

	},

	update: function (now) {
		this.innerUpdate(now);
	},

	innerUpdate: function(now){

	},

	calculateBoundingSphere: function  () {
		if(this.cornerPoints.length > 0){
			var center = new Vector2;
			var radius = 0;
			for (var i = this.cornerPoints.length - 1; i >= 0; i--) {	
				var d = center.distance(this.cornerPoints[i]);
				if(d > radius) radius = d;
			}

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
	},

	checkCollisionWithLine: function(line)
	{
		this.collided = segmentIntersectCircle(line, new Circle(this.parent.position.add(this.position.rotate(this.parent.angle,true,false),true),this.boundingSphere.radius));
		if(this.collided){
			if(this.cornerPoints.length > 1){
				this.collidedSegmentIndices = []; //reset index
				this.collisionPoints = [];
				var relativeToModuleLine = new Line({
					begin:line.begin.substract(this.parent.position,true).rotate(-this.parent.angle,true,false).substract(this.position,true).rotate(-this.angle,true,false), 
					end:line.end.substract(this.parent.position,true).rotate(-this.parent.angle,true,false).substract(this.position,true).rotate(-this.angle,true,false)
				});

				var lDirection = relativeToModuleLine.begin.direction(relativeToModuleLine.end);
				var secondTryDelta = lDirection.mul(relativeToModuleLine.begin.distance(relativeToModuleLine.end)/5);
				var relativeToModuleLine2 = new Line({begin:relativeToModuleLine.begin, end:relativeToModuleLine.end.add(secondTryDelta,true)});
				var closestCollision  = undefined 
				for (var k= this.cornerPoints.length - 1; k >= 0; k--) {
					var l = new Line({begin: this.cornerPoints[k], end: this.cornerPoints[k==0?this.cornerPoints.length-1:k-1]});

					var collided = segmentsIntersectionVector2(relativeToModuleLine,l) || segmentsIntersectionVector2(relativeToModuleLine2,l);
					if(collided)
					{
						var distance = l.begin.distance(collided);
						if(closestCollision === undefined || closestCollision.distance > distance)
						{
							closestCollision = {collision: collided, distance: distance};
						}
						//this.modules[j].collisionPoints.push(collided);
					}
				};
				if(closestCollision!==undefined)
				{
					var absCollisionPosition = closestCollision.collision.clone().rotate(this.angle,true,false).add(this.position,true).rotate(this.parent.angle,true,false).add(this.parent.position,true);
					SCG2.nonplayableGo.push(new SCG2.GO.SimpleExplosion({position: absCollisionPosition}));
					return closestCollision;		
				}
			}
		}
	}
}


