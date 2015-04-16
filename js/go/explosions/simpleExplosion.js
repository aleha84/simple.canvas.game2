SCG2.GO.SimpleExplosion = function(init){
	if(init.position === undefined)
	{
		throw 'SCG2.GO.SimpleExplosion -> position is undefined';
	}

	this.defaultInitProperties = {
		timeToLive: 250,
		color: 'red'
	}

	var prop = this.initProperties(init);
	this.f = function(x) { return -0.04*x +10; }
	this.radius = this.f(0);
	this.circle = new Circle(new Vector2,this.radius);

	SCG2.GO.GO.call(this,prop);

	this.timeToLive = prop.timeToLive;
	this.color = prop.color;

	this.id = 'simpleExplosion' + (SCG2.GO.SimpleExplosion.counter++);
}
SCG2.GO.SimpleExplosion.counter = 0;
SCG2.GO.SimpleExplosion.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.SimpleExplosion.prototype.constructor = SCG2.GO.SimpleExplosion;

SCG2.GO.SimpleExplosion.prototype.calculateBoundingSphere = function  () {
	return this.circle.clone();
}

SCG2.GO.SimpleExplosion.prototype.internalRender = function(){ 
	this.circle.render({fillStyle: this.color,strokeStyle:this.color,fill:true});
}

SCG2.GO.SimpleExplosion.prototype.internalUpdate = function(now){ 
	var delta = now - this.creationTime;
	if(delta > this.timeToLive)
	{
		this.setDead();
	}
	this.radius = this.f(delta);
	if(this.radius < 1)
	{
		this.radius = 1;
	}
	this.circle.update(this.radius);
}

