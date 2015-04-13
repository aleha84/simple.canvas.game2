SCG2.GO = {};

SCG2.GO.GO = function(prop){
	this.defaultInitProperties = {};
	this.position = new Vector2;
	this.alive = true;
	this.id = '';
	this.size = new Vector2;
	this.initialDirection = new Vector2;
	this.direction = new Vector2;
	this.rotationSpeed = 0;
	this.speed = 0;
	this.angle = 0;
	this.displayPosition = undefined;
	this.modules = [];
	this.collided = false;
	this.selected = false;
	if(prop!=undefined)
	{
		if(prop.position!=undefined)
		{
			this.position = prop.position;	
		}
		if(prop.size!=undefined)
		{
			this.size = prop.size;
		}
		if(prop.speed!=undefined)
		{
			this.speed = prop.speed;
		}
		if(prop.direction!=undefined)
		{
			this.initialDirection = prop.direction;
		}
		if(prop.direction!=undefined)
		{
			this.direction = prop.direction;
		}
		if(prop.rotationSpeed!=undefined)
		{
			this.rotationSpeed = prop.rotationSpeed;
		}
		if(prop.modules!=undefined)
		{
			this.modules = prop.modules;
		}
	}
	this.boundingBox = this.calculeteBoundingBox();
	this.boundingSphere = this.calculateBoundingSphere();
	this.creationTime = new Date;
}

SCG2.GO.GO.prototype = {
	constructor: SCG2.GO.GO,

	setDead : function() {
		delete SCG.gameLogics.enemies.placed[this.id];
		this.alive = false;
	},

	isAlive : function(){ 
		return this.alive;
	},

	initProperties: function(init)
	{
		if(init === undefined)
		{
			init = {};
		}
		return $.extend({},this.defaultInitProperties,init);
	},
	calculateBoundingSphere: function(){

	},
	calculeteBoundingBox: function(){
		new Box(this.position,this.size);
	},

	addModule: function (module) {
		module.parent = this;
		this.modules.push(module);

		this.updateBoundingBox();
	},

	updateBoundingBox: function(){
		if(this.modules.length == 0)
		{
			return;
		}
		var topLeft = new Vector2;
		var bottomRight = new Vector2;
		for (var i = this.modules.length - 1; i >= 0; i--) {
			var rotatedModulePosition = this.modules[i].position.rotate(this.angle,true,false);
			var moduleTopLeft = new Vector2(rotatedModulePosition.x-this.modules[i].boundingSphere.radius,rotatedModulePosition.y-this.modules[i].boundingSphere.radius);
			var moduleBottomRight = new Vector2(rotatedModulePosition.x+this.modules[i].boundingSphere.radius,rotatedModulePosition.y+this.modules[i].boundingSphere.radius);
			if(moduleTopLeft.x < topLeft.x)
			{
				topLeft.x = moduleTopLeft.x;
			}
			if(moduleTopLeft.y < topLeft.y)
			{
				topLeft.y = moduleTopLeft.y;
			}
			if(moduleBottomRight.x > bottomRight.x)
			{
				bottomRight.x = moduleBottomRight.x;
			}
			if(moduleBottomRight.y > bottomRight.y)
			{
				bottomRight.y = moduleBottomRight.y;
			}
		}

		this.boundingBox = new Box(topLeft,new Vector2(bottomRight.x - topLeft.x,bottomRight.y - topLeft.y));
	},

	render: function(){ 
		if(this.displayPosition===undefined)
		{
			return;
		}
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		SCG2.context.rotate(this.angle);
		
		this.internalRender();

		SCG2.context.rotate(-this.angle);
		if(SCG2.gameLogics.drawBoundings)
		{
			this.renderBoundingBox(this.collided);	
			this.renderBoundingSphere(this.collided);	
		}
		if(this.selected)
		{
			this.renderSelectBox();
		}
		
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
	},

	internalRender: function(){

	},

	update: function(now){ 
		
		var i = this.modules.length;
		while (i--) {
			this.modules[i].update(now);
			if(!this.modules[i].alive){
				var deleted = this.modules.splice(i,1);
			}
		}
		this.updateBoundingBox();

		if((this.boundingBox!== undefined && SCG2.battlefield.current.isIntersectsWithBox(this.absolutBoundingBox())) || (this.boundingSphere!== undefined && SCG2.battlefield.current.isIntersectsWithCircle(this.boundingSphere))){
			this.displayPosition = this.position.add(SCG2.battlefield.current.topLeft.mul(-1),true);
			SCG2.frameCounter.visibleCount++;
			SCG2.visibleGo.push(this);
		}
		else{
			this.displayPosition = undefined;
		}
		
		this.checkCollisions();
		
		this.internalUpdate(now);
	},

	internalUpdate: function(){

	},

	absolutBoundingBox: function(){
		if(this.boundingBox=== undefined)
		{
			throw 'boundingBox Undefined';
		}

		return new Box(this.boundingBox.topLeft.add(this.position,true),this.boundingBox.size);
	},

	displayBoundingBox: function(){
		if(this.boundingBox=== undefined || this.displayPosition === undefined)
		{
			throw 'boundingBox or displayPosition -> Undefined';
		}

		return new Box(this.boundingBox.topLeft.add(this.displayPosition,true),this.boundingBox.size);
	},

	renderBoundingSphere: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render(fill);
	},

	renderBoundingBox: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingBox === undefined)
		{
			return;
		}
		this.boundingBox.render(fill);
	},

	renderSelectBox: function(){
		if(this.boundingBox === undefined)
		{
			return;
		}
		if(this.selectBoxColor === undefined)
		{
			this.selectBoxColor = {max:255, min: 100, current: 255, direction:1, step: 1};
		}
		this.boundingBox.render({fill:false,strokeStyle: 'rgb(0,'+this.selectBoxColor.current+',0)', lineWidth: 2});
		if(this.selectBoxColor.current >= this.selectBoxColor.max || this.selectBoxColor.current <= this.selectBoxColor.min)
		{
			this.selectBoxColor.direction *=-1;
		}
		this.selectBoxColor.current+=(this.selectBoxColor.step*this.selectBoxColor.direction);
	},

	checkCollisions: function(){

	},

	checkCollisionWuthLine: function(line, secondTry)
	{
		if(secondTry === undefined)
		{
			secondTry = true;
		}

		if(this.boundingBox !== undefined)
		{
			this.collided = //boxCircleIntersects(new Circle(center,this.boundingSphere.radius),new Box(this.position.add(this.boundingBox.topLeft,true),this.boundingBox.size))
				segmentIntersectBox(line, new Box(this.position.add(this.boundingBox.topLeft,true),this.boundingBox.size));
			if(this.collided){
				if(this.modules.length > 0){
					for (var j = this.modules.length - 1; j >= 0; j--) {
						if(this.modules[j].boundingSphere !== undefined){
							this.modules[j].collided = segmentIntersectCircle(line, new Circle(this.position.add(this.modules[j].position.rotate(this.angle,true,false),true),this.modules[j].boundingSphere.radius));
							if(this.modules[j].collided){
								if(this.modules[j].cornerPoints.length > 1){
									this.modules[j].collidedSegmentIndices = []; //reset index
									this.modules[j].collisionPoints = [];
									var relativeToModuleLine = new Line({
										begin:line.begin.substract(this.position,true).rotate(-this.angle,true,false).substract(this.modules[j].position,true).rotate(-this.modules[j].angle,true,false), 
										end:line.end.substract(this.position,true).rotate(-this.angle,true,false).substract(this.modules[j].position,true).rotate(-this.modules[j].angle,true,false)
									});

									var lDirection = relativeToModuleLine.begin.direction(relativeToModuleLine.end);
									var secondTryDelta = lDirection.mul(relativeToModuleLine.begin.distance(relativeToModuleLine.end)/5);
									var relativeToModuleLine2 = new Line({begin:relativeToModuleLine.begin, end:relativeToModuleLine.end.add(secondTryDelta,true)});
									var closestCollision  = undefined 
									for (var k= this.modules[j].cornerPoints.length - 1; k >= 0; k--) {
										var l = new Line({begin: this.modules[j].cornerPoints[k], end: this.modules[j].cornerPoints[k==0?this.modules[j].cornerPoints.length-1:k-1]});

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
										return closestCollision;		
									}
								}
							}
						}
					};
				}	
			}
			
		}
	}
}

