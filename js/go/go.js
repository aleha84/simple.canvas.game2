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
	//this.boundingSphere = this.calculateBoundingSphere();
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
	// calculateBoundingSphere: function(){
	// 	var boundingSphereRadius = Math.sqrt(Math.pow(this.size.x,2)+Math.pow(this.size.y,2));
	// 	return new Circle(this.position,boundingSphereRadius);
	// },

	addModule: function (module) {
		module.parent = this;
		this.modules.push(module);
	},

	render: function(){ },

	update: function(now){ 
		this.boundingBox.update(this.position);
		if(SCG2.battlefield.current.isIntersectsWithBox(this.boundingBox))
		{
			this.displayPosition = this.position.add(SCG2.battlefield.current.topLeft.mul(-1),true);
			SCG2.frameCounter.visibleCount++;
		}
		else{
			this.displayPosition = undefined;
		}
		
	}
}

