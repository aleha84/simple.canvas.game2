SCG2.GO.Shot = function(init){
	if(init === undefined)
	{
		init = {};
	}

	if(init.position === undefined)
	{
		throw 'SCG2.GO.Shot -> init.position undefined';
	}

	if(init.direction === undefined)
	{
		throw 'SCG2.GO.Shot -> init.direction undefined';
	}

	this.defaultInitProperties = {
		speed : 20,
		angle: 0,
		color: '#ff0000',
		timeToLive: 6000,
		// begin: new Vector2(100,100),
		// end: new Vector2(200,200),
		// size: new Vector2(10,10)
	}
	var prop = this.initProperties(init);
	
	this.color = prop.color;
	this.direction = prop.direction;	
	this.length = prop.length === undefined? prop.speed:prop.length;
	this.timeToLive = prop.timeToLive;
	this.line = new Line({begin: new Vector2, end: new Vector2().add(this.direction.mul(this.length),true), color: this.color});

	SCG2.GO.GO.call(this,prop);
	this.position = prop.position;
	this.id = 'Shot_' + (SCG2.GO.Shot.counter++);

}
SCG2.GO.Shot.counter = 0;
SCG2.GO.Shot.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.Shot.prototype.constructor = SCG2.GO.Shot;

SCG2.GO.Shot.prototype.internalRender = function(){ 
	if(this.displayPosition!==undefined)
	{
		this.line.render();
	}	
}

SCG2.GO.Shot.prototype.internalUpdate = function(now){ 
	if(now - this.creationTime > this.timeToLive)
	{
		this.alive = false;
		return;
	}

	this.position.add(this.direction.mul(this.speed));
}

SCG2.GO.Shot.prototype.calculateBoundingSphere = function  () {
	//return this.line.calculateBoundingSphere();
}

SCG2.GO.Shot.prototype.calculeteBoundingBox = function  () {
	var box = this.line.calculateBoundingBox();
	return box;
}

SCG2.GO.Shot.prototype.checkCollisions = function  () {
	//var center = new Vector2(this.begin.x +Math.abs((this.end.x - this.begin.x)/2),this.begin.y+Math.abs((this.end.y - this.begin.y)/2));
	var line = new Line({begin: this.position.add(this.line.begin,true), end: this.position.add(this.line.end,true)});
	for (var i = SCG2.go.length - 1; i >= 0; i--) {
		if(SCG2.go[i].id == this.id)
		{
			continue;
		}
		var collided = SCG2.go[i].checkCollisionWuthLine(line);
		if(collided)
		{
			//console.log(collided);
			this.alive = false;
		}
	};
}

SCG2.GO.Shot.prototype.updateBoundingBox = function(){
	// if(this.boundingBox!== undefined)
	// {
	// 	this.boundingBox = 
	// }
}

