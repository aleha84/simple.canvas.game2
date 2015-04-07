SCG2.Module.SimpleTurret = function(init){
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

SCG2.Module.SimpleTurret.prototype.render = function(){ 
	if(this.img === undefined)
	{
		return;
	}
	SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
	SCG2.context.rotate(this.angle);
	SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	

	if(SCG2.gameLogics.drawBoundings)
	{
		this.renderBoundingSphere(this.collided);	
	}
	
	for (var i = this.collisionPoints.length - 1; i >= 0; i--) {
		var c = new Circle(this.collisionPoints[i],5);
		c.render();
	};


	SCG2.context.rotate(-this.angle);
	SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
}

SCG2.Module.SimpleTurret.prototype.update = function(now){ 
	SCG2.Module.Module.prototype.update.call(this,now);
	if(this.rotationSpeed !== undefined && this.rotationSpeed > 0)
	{
		if(this.clamps!== undefined &&  (this.angle >= this.clamps.max || this.angle <= this.clamps.min))	
		{
			this.rotationDirection *= -1;
		}

		this.angle+=(this.rotationSpeed*this.rotationDirection);
	}

	
}