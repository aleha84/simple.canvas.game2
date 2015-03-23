SCG2.GO = {};

SCG2.GO.GO = function(){
	this.defaultInitProperties = {};
	this.position = new Vector2;
	this.alive = true;
	this.id = '';
	this.direction = new Vector2;
	this.rotationSpeed = 0;
	this.speed = 0;
	this.angle = 0;
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

	render: function(){ },

	update: function(now){ }
}

