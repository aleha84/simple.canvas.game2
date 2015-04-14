SCG2.Module.SpaceshipBody = function(init){
	if(init.position === undefined)
	{
		throw 'SCG2.Module.SpaceshipBody -> position Undefined';
	}
	if(init.cornerPoints === undefined)
	{
		init.cornerPoints = [new Vector2(0,-32),new Vector2(20,20),new Vector2(0,32),new Vector2(-20,20)];
	}
	if(init.img === undefined)
	{
		init.img = SCG2.images.debug_ship;
	}
	if(init.size === undefined){
		init.size = new Vector2(64,64);
	}

	SCG2.Module.Module.call(this,init);
	this.id = 'spaceshipBody'+(SCG2.Module.SpaceshipBody.counter++);
}

SCG2.Module.SpaceshipBody.prototype = Object.create( SCG2.Module.Module.prototype );
SCG2.Module.SpaceshipBody.prototype.constructor = SCG2.Module.SpaceshipBody;
SCG2.Module.SpaceshipBody.counter = 0;

SCG2.Module.SpaceshipBody.prototype.innerRender = function(){ 
	//SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	
}

SCG2.Module.SpaceshipBody.prototype.innerUpdate = function(now){ 	
}