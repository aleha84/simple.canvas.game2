SCG2.Module.SimpleTurret = function(init){
	if(init.cornerPoints === undefined)
	{
		init.cornerPoints = [new Vector2(-20,-20),new Vector2(20,-20),new Vector2(20,20),new Vector2(-20,20)];
	}

	if(init.img === undefined)
	{
		init.img = SCG2.images.turret;
	}
	if(init.rotationSpeed === undefined)
	{
		init.rotationSpeed = 0.01;
	}
	if(init.size === undefined){
		init.size = new Vector2(30,30);
	}


	SCG2.Module.Module.call(this,init);
	this.id = 'simpleTurret'+(SCG2.Module.SimpleTurret.counter++);
	this.clamps = undefined;
	this.rotationSpeed = 0;
	this.rotationDirection = 0;

	if(init.rotationDirection!== undefined)
	{
		this.rotationDirection = init.rotationDirection;
	}
	if(init.rotationSpeed !== undefined)
	{
		this.rotationSpeed = init.rotationSpeed;
	}
	if(init.clamps !== undefined)
	{
		this.clamps = init.clamps;
	}
	

}

SCG2.Module.SimpleTurret.prototype = Object.create( SCG2.Module.Module.prototype );
SCG2.Module.SimpleTurret.prototype.constructor = SCG2.Module.SimpleTurret;
SCG2.Module.SimpleTurret.counter = 0;

SCG2.Module.SimpleTurret.prototype.innerRender = function(){ 
	SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	

	// if(SCG2.gameLogics.drawBoundings)
	// {
	// 	this.renderBoundingSphere(this.collided);	
	// }
	
	for (var i = this.collisionPoints.length - 1; i >= 0; i--) {
		var c = new Circle(this.collisionPoints[i],5);
		c.render();
	};
}

SCG2.Module.SimpleTurret.prototype.innerUpdate = function(now){ 
	if(this.rotationSpeed !== undefined && this.rotationSpeed > 0)
	{
		if(this.clamps!== undefined &&  (this.angle >= this.clamps.max || this.angle <= this.clamps.min))	
		{
			this.rotationDirection *= -1;
		}

		this.angle+=(this.rotationSpeed*this.rotationDirection);
	}

	
}