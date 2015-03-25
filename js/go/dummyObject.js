SCG2.GO.DummyObject = function(init){
	this.defaultInitProperties = {
		position: new Vector2(getRandom(0,SCG2.battleSpace.width),getRandom(0,SCG2.battleSpace.height)),
		size: new Vector2(32,32),
	}

	var prop = this.initProperties(init);

	SCG2.GO.GO.call(this,prop);
	
	this.id = 'dummyObject_' + (SCG2.GO.DummyObject.counter++);
}
SCG2.GO.DummyObject.counter = 0;
SCG2.GO.DummyObject.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.DummyObject.prototype.constructor = SCG2.GO.DummyObject;

SCG2.GO.DummyObject.prototype.render = function(){ 
	if(SCG2.battlefield.current.isIntersectsWithBox(this.boundingBox))
	{
		SCG2.context.translate(this.position.x,this.position.y);
		SCG2.context.rotate(this.angle);
		
		SCG2.context.rect(-this.size.x/2, -this.size.y/2, this.size.x/2, this.size.y/2);
		SCG2.context.fillStyle = 'white';
		SCG2.context.fill();
		
		SCG2.context.rotate(-this.angle);
		SCG2.context.translate(-this.position.x,-this.position.y);		
	}
}

SCG2.GO.DummyObject.prototype.update = function(now){ 
	SCG2.GO.GO.prototype.update.call(this,now);
}

