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
	
	if(init!=undefined)
	{
		if(init.parent !== undefined)
		{
			this.parent = init.parent;
		}
		if(init.position!== undefined)
		{
			this.position = init.position;
		}
		if(init.displayPosition!== undefined)
		{
			this.displayPosition = init.displayPosition;
		}
		else{
			this.displayPosition = this.position;
		}
		if(init.size!==undefined)
		{
			this.size = init.size;
		}
		if(init.img !== undefined)
		{
			this.img = init.img;
		}
	}
}

SCG2.Module.Module.prototype = {
	constructor: SCG2.Module.Module,

	render: function(){},

	update: function (now) {
		
	}
}