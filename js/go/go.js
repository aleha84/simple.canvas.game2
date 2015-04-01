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
	this.boundingBox = new Box(this.position,this.size);
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

	addModule: function (module) {
		module.parent = this;
		this.modules.push(module);
		var topLeft = new Vector2;
		var bottomRight = new Vector2;

		for (var i = this.modules.length - 1; i >= 0; i--) {
			var moduleTopLeft = new Vector2(this.modules[i].position.x-this.modules[i].boundingSphere.radius,this.modules[i].position.y-this.modules[i].boundingSphere.radius);
			var moduleBottomRight = new Vector2(this.modules[i].position.x+this.modules[i].boundingSphere.radius,this.modules[i].position.y+this.modules[i].boundingSphere.radius);
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
		var center = new Vector2;//((bottomRight.x - topLeft.x)/2,(bottomRight.y - topLeft.y)/2)
		var radius = topLeft.distance(bottomRight)/2;

		this.boundingSphere = new Circle(center,radius);
	},

	render: function(){ },

	update: function(now){ 
		// if(this.boundingBox!==undefined)
		// {
		// 	this.boundingBox.update(this.position);
		// }
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
		
	},

	renderBoundingSphere: function  () {
		if(this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render();
	}
}

