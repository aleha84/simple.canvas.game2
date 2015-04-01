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
	this.displayPosition = new Vector2(SCG2.battlefield.width/2,SCG2.battlefield.height/2);

	this.turret = {
		position: new Vector2(40,32),
		displayPosition: new Vector2(20,0),//new Vector2(40,32),
		size: new Vector2(30,30),
		img: SCG2.images.turret
	}
}

SCG2.GO.Player.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.Player.prototype.constructor = SCG2.GO.Player;

SCG2.GO.Player.prototype.render = function(){ 
	SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
	SCG2.context.rotate(this.angle);
	SCG2.context.drawImage(SCG2.images.debug_ship,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);

	var i = this.modules.length;
	while (i--) {
		this.modules[i].render();
	}
	
	SCG2.context.rotate(-this.angle);
	this.renderBoundingBox();
	SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
}

SCG2.GO.Player.prototype.update = function(now){ 
	var bfTL = new Vector2(SCG2.battlefield.current.topLeft.x,SCG2.battlefield.current.topLeft.y);
	var delta = undefined;
	if(SCG2.gameControls.accelerate)
	{
		delta = this.direction.mul(this.speed);
		this.position.add(delta);
	}

	if(SCG2.gameControls.reverse)
	{
		delta = this.direction.mul(-1*this.speed)
		this.position.add(delta);
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

	if(delta!==undefined)
	{
		bfTL.add(delta);
		SCG2.battlefield.current.update(bfTL);
	}

	var i = this.modules.length;
	while (i--) {
		this.modules[i].update(now);
		if(!this.modules[i].alive){
			var deleted = this.modules.splice(i,1);
		}
	}

	this.updateBoundingBox();
}

