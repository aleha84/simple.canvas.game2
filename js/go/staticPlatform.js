SCG2.GO.StaticPlatform = function(init){

	if(init.position === undefined)
	{
		throw 'SCG2.GO.StaticPlatform -> position is undefined';
	}

	this.defaultInitProperties = {
		speed: 0,
		direction: new Vector2,
	}

	var prop = this.initProperties(init);

	SCG2.GO.GO.call(this,prop);

	this.id = 'staticPlatform' + (SCG2.GO.StaticPlatform.counter++);
	this.addModule(new SCG2.Module.PlatformBase({position: new Vector2}));
	this.addModule(new SCG2.Module.SimpleTurret({
			position: new Vector2(30,-30),
			angle: 0,
			clamps: { min: degreeToRadians(-5), max: degreeToRadians(5)},
			rotationDirection: -1,
		}));
}
SCG2.GO.StaticPlatform.counter = 0;
SCG2.GO.StaticPlatform.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.StaticPlatform.prototype.constructor = SCG2.GO.StaticPlatform;

SCG2.GO.StaticPlatform.prototype.internalRender = function(){ 
	
}

SCG2.GO.StaticPlatform.prototype.internalUpdate = function(now){ 
	for (var i = this.modules.length - 1; i >= 0; i--) {
		if(this.modules[i].makeShot)
		{
			this.modules[i].makeShot(now);	
		}
	};
}

