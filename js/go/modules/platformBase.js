SCG2.Module.PlatformBase = function(init){
	if(init.position === undefined)
	{
		throw 'SCG2.Module.PlatformBase -> position Undefined';
	}
	if(init.cornerPoints === undefined)
	{
		init.cornerPoints = [new Vector2(0,-45),new Vector2(45,0),new Vector2(0,45),new Vector2(-45,0)];
	}
	if(init.img === undefined)
	{
		init.img = SCG2.images.platformBase;
	}
	if(init.size === undefined){
		init.size = new Vector2(90,90);
	}

	SCG2.Module.Module.call(this,init);
	this.id = 'platformBase'+(SCG2.Module.PlatformBase.counter++);
}

SCG2.Module.PlatformBase.prototype = Object.create( SCG2.Module.Module.prototype );
SCG2.Module.PlatformBase.prototype.constructor = SCG2.Module.PlatformBase;
SCG2.Module.PlatformBase.counter = 0;

SCG2.Module.PlatformBase.prototype.innerRender = function(){ 
	//SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	
}

SCG2.Module.PlatformBase.prototype.innerUpdate = function(now){ 	
}