SCG2.GO.Player = function(init){
	this.defaultInitProperties = {
		position: new Vector2(SCG2.battlefield.width/2,SCG2.battlefield.height/2),
		size: new Vector2(64,64),
		speed: 5,
		direction: new Vector2(0,-1),
		rotationSpeed: 0.05,
	}

	var prop = this.initProperties(init);

	SCG2.GO.GO.call(this,prop);
	
	this.id = 'player';
}

SCG2.GO.Player.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.Player.prototype.constructor = SCG2.GO.Player;

SCG2.GO.Player.prototype.render = function(){ 
	SCG2.context.translate(this.position.x,this.position.y);
	SCG2.context.rotate(this.angle);
	SCG2.context.drawImage(SCG2.images.debug_ship,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);
	SCG2.context.rotate(-this.angle);
	SCG2.context.translate(-this.position.x,-this.position.y);
}

SCG2.GO.Player.prototype.update = function(now){ 
	if(SCG2.gameControls.accelerate)
	{
		this.position.add(this.direction.mul(this.speed));
	}

	if(SCG2.gameControls.reverse)
	{
		this.position.add(this.direction.mul(-1*this.speed));
	}

	if(SCG2.gameControls.rotateLeft)
	{
		this.angle -= this.rotationSpeed;
		this.direction = this.initialDirection.rotate(this.angle,true,false);
	}

	if(SCG2.gameControls.rotateRight)
	{
		this.angle += this.rotationSpeed;
		this.direction = this.initialDirection.rotate(this.angle,true,false);
	}
}

