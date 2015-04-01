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
		

		// for (var i = this.modules.length - 1; i >= 0; i--) {
		// 	var moduleTopLeft = new Vector2(this.modules[i].position.x-this.modules[i].boundingSphere.radius,this.modules[i].position.y-this.modules[i].boundingSphere.radius);
		// 	var moduleBottomRight = new Vector2(this.modules[i].position.x+this.modules[i].boundingSphere.radius,this.modules[i].position.y+this.modules[i].boundingSphere.radius);
		// 	if(moduleTopLeft.x < topLeft.x)
		// 	{
		// 		topLeft.x = moduleTopLeft.x;
		// 	}
		// 	if(moduleTopLeft.y < topLeft.y)
		// 	{
		// 		topLeft.y = moduleTopLeft.y;
		// 	}
		// 	if(moduleBottomRight.x > bottomRight.x)
		// 	{
		// 		bottomRight.x = moduleBottomRight.x;
		// 	}
		// 	if(moduleBottomRight.y > bottomRight.y)
		// 	{
		// 		bottomRight.y = moduleBottomRight.y;
		// 	}
		// }

		// this.boundingBox = new Box(topLeft,new Vector2(bottomRight.x - topLeft.x,bottomRight.y - topLeft.y));
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

	render: function(){ },

	update: function(now){ 
		if(this.boundingBox!==undefined)
		{
			this.boundingBox.update(this.position);
		}
		// if(this.boundingSphere!==undefined)
		// {

		// }
		if((this.boundingBox!== undefined && SCG2.battlefield.current.isIntersectsWithBox(this.boundingBox)) || (this.boundingSphere!== undefined && SCG2.battlefield.current.isIntersectsWithCircle(this.boundingSphere)))
		{
			this.displayPosition = this.position.add(SCG2.battlefield.current.topLeft.mul(-1),true);
			SCG2.frameCounter.visibleCount++;
		}
		else{
			this.displayPosition = undefined;
		}
		this.updateBoundingBox();
		this.checkCollisions();
		
	},

	renderBoundingSphere: function  (fill) {
		if(this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render(fill);
	},

	renderBoundingBox: function  () {
		if(this.boundingBox === undefined)
		{
			return;
		}
		this.boundingBox.render();
	},

	checkCollisions: function(){

	}
}

