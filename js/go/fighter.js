SCG2.GO.Fighter = function(init){

	if(init.position === undefined)
	{
		throw 'SCG2.GO.Fighter -> position is undefined';
	}

	this.defaultInitProperties = {
		speed: 5,
		direction: new Vector2(0,-1),
		rotationSpeed: 0.05,
	}

	var prop = this.initProperties(init);

	SCG2.GO.GO.call(this,prop);

	this.id = 'fighter' + (SCG2.GO.Fighter.counter++);
	this.addModule(new SCG2.Module.SpaceshipBody({position: new Vector2}));
	this.addModule(new SCG2.Module.SimpleTurret({
		position: new Vector2(20,0),
		angle: 0,
		clamps: { min: 0, max: degreeToRadians(180)},
		rotationDirection: -1,
	}));
	this.addModule(new SCG2.Module.SimpleTurret({
		position: new Vector2(-20,0),
		angle: 0,
		clamps: { min: degreeToRadians(-180), max: 0},
		rotationDirection: 1,
	}));
}
SCG2.GO.Fighter.counter = 0;
SCG2.GO.Fighter.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.Fighter.prototype.constructor = SCG2.GO.Fighter;

SCG2.GO.Fighter.prototype.internalRender = function(){ 
	
}

SCG2.GO.Fighter.prototype.internalUpdate = function(now){ 
	
}

