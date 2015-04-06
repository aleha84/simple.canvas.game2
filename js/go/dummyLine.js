SCG2.GO.DummyLine = function(init){
	if(init === undefined)
	{
		init = {};
	}

	this.defaultInitProperties = {
		begin: new Vector2(100,100),
		end: new Vector2(200,200),
		size: new Vector2(10,10)
	}
	var prop = this.initProperties(init);
	this.direction = prop.begin.directionNonNormal(prop.end);
	this.length = prop.begin.distance(prop.end);
	this.line = new Line({begin: new Vector2, end: new Vector2().add(this.direction,true), color: '#ff0000'});

	SCG2.GO.GO.call(this,prop);
	this.position = prop.begin;
	this.begin = prop.begin;
	this.end = prop.end;
	this.id = 'dummyLine_' + (SCG2.GO.DummyLine.counter++);
	
	
	// this.renderBoundingSphere = function  () {
	// 	if(this.boundingSphere === undefined)
	// 	{
	// 		return;
	// 	}

	// 	this.boundingSphere.render();
	// }

	// this.renderBoundingBox = function  () {
	// 	if(this.boundingBox === undefined)
	// 	{
	// 		return;
	// 	}

	// 	this.boundingBox.render();
	// }
}
SCG2.GO.DummyLine.counter = 0;
SCG2.GO.DummyLine.prototype = Object.create( SCG2.GO.GO.prototype );
SCG2.GO.DummyLine.prototype.constructor = SCG2.GO.DummyLine;

SCG2.GO.DummyLine.prototype.render = function(){ 
	if(this.displayPosition!==undefined)
	{
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		SCG2.context.rotate(this.angle);
		this.line.render();
		this.renderBoundingSphere(this.collided);
		//this.renderBoundingBox();
		SCG2.context.rotate(-this.angle);
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);		
	}	
}

SCG2.GO.DummyLine.prototype.update = function(now){ 
	SCG2.GO.GO.prototype.update.call(this,now);
}

SCG2.GO.DummyLine.prototype.calculateBoundingSphere = function  () {
	return this.line.calculateBoundingSphere();
}

SCG2.GO.DummyLine.prototype.calculeteBoundingBox = function  () {
	//return this.line.calculateBoundingBox();
}

SCG2.GO.DummyLine.prototype.checkCollisions = function  () {
	var center = new Vector2(this.begin.x +Math.abs((this.end.x - this.begin.x)/2),this.begin.y+Math.abs((this.end.y - this.begin.y)/2));
	var line = new Line({begin: this.begin, end: this.end});
	for (var i = SCG2.go.length - 1; i >= 0; i--) {
		if(SCG2.go[i].id == this.id)
		{
			continue;
		}
		SCG2.go[i].checkCollisionWuthLine(line);
	};
}

