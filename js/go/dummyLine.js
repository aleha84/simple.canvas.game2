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
	this.id = 'dummyLine_' + (SCG2.GO.DummyLine.counter++);
	

	this.renderBoundingSphere = function  () {
		if(this.boundingSphere === undefined)
		{
			return;
		}

		this.boundingSphere.render();
	}
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
		this.renderBoundingSphere();
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



