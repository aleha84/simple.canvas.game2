SCG2.GO = {};

SCG2.GO.GO = function(prop){
	this.defaultInitProperties = {};
	this.position = new Vector2;
	this.alive = true;
	this.id = '';
	this.size = new Vector2;
	this.initialDirection = new Vector2;
	this.direction = new Vector2;
	this.rotationSpeed = 0;
	this.speed = 0;
	this.angle = 0;
	this.displayPosition = undefined;
	this.modules = [];
	this.collided = false;
	this.selected = false;
	this.playerControllable =false;
	if(prop!=undefined)
	{
		$.extend(this,prop);
		// if(prop.position!=undefined)
		// {
		// 	this.position = prop.position;	
		// }
		// if(prop.size!=undefined)
		// {
		// 	this.size = prop.size;
		// }
		// if(prop.speed!=undefined)
		// {
		// 	this.speed = prop.speed;
		// }
		// if(prop.direction!=undefined)
		// {
		// 	this.initialDirection = prop.direction;
		// }
		// if(prop.direction!=undefined)
		// {
		// 	this.direction = prop.direction;
		// }
		// if(prop.rotationSpeed!=undefined)
		// {
		// 	this.rotationSpeed = prop.rotationSpeed;
		// }
		// if(prop.modules!=undefined)
		// {
		// 	this.modules = prop.modules;
		// }
	}
	if(this.direction!=undefined)
	{
		this.initialDirection = this.direction;
	}
	this.boundingBox = this.calculeteBoundingBox();
	this.boundingSphere = this.calculateBoundingSphere();
	this.creationTime = new Date;
	this.stats = {};
	this.moduleCounter = 0;
}

SCG2.GO.GO.prototype = {
	constructor: SCG2.GO.GO,

	setDead : function() {
		this.alive = false;
	},

	isAlive : function(){ 
		return this.alive;
	},

	initProperties: function(init)
	{
		if(init === undefined)
		{
			init = {};
		}
		return $.extend({},this.defaultInitProperties,init);
	},
	calculateBoundingSphere: function(){

	},
	calculeteBoundingBox: function(){
		new Box(this.position,this.size);
	},

	addModule: function (module, isInternal) {
		if(isInternal === undefined){
			isInternal = true;
		}
		module.parent = this;
		module.id = this.id + '_module_' + (++this.moduleCounter);
		if(isInternal){
			this.modules.push(module);	
		}
		else{
			this.modules.unshift(module);
		}
		

		this.updateBoundingBox();
	},

	removeModule: function(module){
		for (var i = this.modules.length - 1; i >= 0; i--) {					
			if(this.modules[i] == module){
				this.modules[i].removeComponent();
				var deleted = this.modules.splice(i,1);
				this.updateBoundingBox();
				return;
			}
		};
		
	},

	updateBoundingBox: function(){
		if(this.modules.length == 0)
		{
			return;
		}
		var topLeft = new Vector2;
		var bottomRight = new Vector2;
		for (var i = this.modules.length - 1; i >= 0; i--) {
			var rotatedModulePosition = this.modules[i].position.rotate(this.angle,true,false);
			var moduleTopLeft = new Vector2(rotatedModulePosition.x-this.modules[i].boundingSphere.radius,rotatedModulePosition.y-this.modules[i].boundingSphere.radius);
			var moduleBottomRight = new Vector2(rotatedModulePosition.x+this.modules[i].boundingSphere.radius,rotatedModulePosition.y+this.modules[i].boundingSphere.radius);
			if(moduleTopLeft.x < topLeft.x)
			{
				topLeft.x = moduleTopLeft.x;
			}
			if(moduleTopLeft.y < topLeft.y)
			{
				topLeft.y = moduleTopLeft.y;
			}
			if(moduleBottomRight.x > bottomRight.x)
			{
				bottomRight.x = moduleBottomRight.x;
			}
			if(moduleBottomRight.y > bottomRight.y)
			{
				bottomRight.y = moduleBottomRight.y;
			}
		}

		this.boundingBox = new Box(topLeft,new Vector2(bottomRight.x - topLeft.x,bottomRight.y - topLeft.y));
	},

	render: function(){ 
		if(this.displayPosition===undefined)
		{
			return;
		}
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		SCG2.context.rotate(this.angle);
		
		var i = this.modules.length;
		while (i--) {
			this.modules[i].render();
		}
		this.internalRender();

		SCG2.context.rotate(-this.angle);
		if(SCG2.gameLogics.drawBoundings)
		{
			this.renderBoundingBox(SCG2.gameLogics.fillBoundings && this.collided);	
			this.renderBoundingSphere(SCG2.gameLogics.fillBoundings && this.collided);	
		}
		if(this.selected)
		{
			this.renderSelectBox();
		}
		
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
	},

	internalRender: function(){

	},

	update: function(now){ 
		
		if((this.boundingBox!== undefined && SCG2.battlefield.current.isIntersectsWithBox(this.absolutBoundingBox())) || (this.boundingSphere!== undefined && SCG2.battlefield.current.isIntersectsWithCircle(this.absolutBoundingSphere()))){
			this.displayPosition = this.position.add(SCG2.battlefield.current.topLeft.mul(-1),true);
			SCG2.frameCounter.visibleCount++;
			SCG2.visibleGo.push(this);
		}
		else{
			this.displayPosition = undefined;
		}	

		var i = this.modules.length;
		while (i--) {
			this.modules[i].update(now);
			if(!this.modules[i].alive){
				var deleted = this.modules.splice(i,1);
			}
		}

		if(SCG2.gameLogics.isPaused /*|| (SCG2.gameLogics.isPaused && SCG2.gameLogics.isPausedStep)*/ || SCG2.gameLogics.gameOver || SCG2.modeller.options.isActive)
		{
			return;
		}

		if(this.playerControllable && SCG2.gameControls.selectedGOs.length > 0 && SCG2.gameControls.selectedGOs[0] === this)
		{
			var delta = undefined;
			var _speed = this.speed || this.stats.speed;
			var _rotationSpeed = this.rotationSpeed || this.stats.rotationSpeed;
			if(SCG2.gameControls.goControl.accelerate)
			{
				delta = this.direction.mul(_speed);
				this.position.add(delta);
			}

			if(SCG2.gameControls.goControl.reverse)
			{
				delta = this.direction.mul(-1*_speed)
				this.position.add(delta);
			}

			if(SCG2.gameControls.goControl.rotateLeft)
			{
				this.angle -= _rotationSpeed;
				this.direction = this.initialDirection.rotate(this.angle,true,false);
			}

			if(SCG2.gameControls.goControl.rotateRight)
			{
				this.angle += _rotationSpeed;
				this.direction = this.initialDirection.rotate(this.angle,true,false);
			}
		}

		this.updateBoundingBox();

		this.checkCollisions();
		
		this.internalUpdate(now);
	},

	internalUpdate: function(){

	},

	absolutBoundingBox: function(){
		if(this.boundingBox=== undefined)
		{
			throw 'boundingBox Undefined';
		}

		return new Box(this.boundingBox.topLeft.add(this.position,true),this.boundingBox.size);
	},

	absolutBoundingSphere: function(){
		if(this.boundingSphere === undefined)
		{
			throw 'boundingSphere Undefined';
		}

		return new Circle(this.boundingSphere.center.add(this.position,true),this.boundingSphere.radius);
	},

	displayBoundingBox: function(){
		if(this.boundingBox=== undefined || this.displayPosition === undefined)
		{
			throw 'boundingBox or displayPosition -> Undefined';
		}

		return new Box(this.boundingBox.topLeft.add(this.displayPosition,true).mul(SCG2.gameControls.scale.current),this.boundingBox.size.mul(SCG2.gameControls.scale.current));
	},

	renderBoundingSphere: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render(fill);
	},

	renderBoundingBox: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingBox === undefined)
		{
			return;
		}
		this.boundingBox.render(fill);
	},

	renderSelectBox: function(){
		if(this.boundingBox === undefined)
		{
			return;
		}
		if(this.selectBoxColor === undefined)
		{
			this.selectBoxColor = {max:255, min: 100, current: 255, direction:1, step: 1, colorPattern: 'rgb({0},0,0)'};
			if(this.playerControllable)
			{
				this.selectBoxColor.colorPattern = 'rgb(0,{0},0)'
			}
		}
		

		this.boundingBox.render({fill:false,strokeStyle: String.format(this.selectBoxColor.colorPattern,this.selectBoxColor.current), lineWidth: 2});
		if(this.selectBoxColor.current >= this.selectBoxColor.max || this.selectBoxColor.current <= this.selectBoxColor.min)
		{
			this.selectBoxColor.direction *=-1;
		}
		this.selectBoxColor.current+=(this.selectBoxColor.step*this.selectBoxColor.direction);
	},

	checkCollisions: function(){

	},

	checkCollisionWuthLine: function(line, secondTry)
	{
		if(secondTry === undefined)
		{
			secondTry = true;
		}

		if(this.boundingBox !== undefined)
		{
			this.collided = //boxCircleIntersects(new Circle(center,this.boundingSphere.radius),new Box(this.position.add(this.boundingBox.topLeft,true),this.boundingBox.size))
				segmentIntersectBox(line, new Box(this.position.add(this.boundingBox.topLeft,true),this.boundingBox.size));
			if(this.collided){
				if(this.modules.length > 0){
					var closestCollision = undefined;
					for (var j = this.modules.length - 1; j >= 0; j--) {
						if(this.modules[j].alive && this.modules[j].boundingSphere !== undefined){
							var c = this.modules[j].checkCollisionWithLine(line);
							if(c!== undefined)
							{
								if(closestCollision === undefined || closestCollision.distance > c.distance)
								{
									closestCollision = c;
								}
							}
						}
					};
					if(closestCollision!==undefined)
					{
						//var absCollisionPosition = closestCollision.collision.clone().rotate(this.angle,true,false).add(this.position,true).rotate(this.parent.angle,true,false).add(this.parent.position,true);
						SCG2.nonplayableGo.push(new SCG2.GO.SimpleExplosion({position: closestCollision.absolute}));
						return closestCollision;		
					}
				}	
			}
			
		}
	},

	checkStats: function(){
		if(this.stats == undefined){ return false; }
		if(this.modules.length < 2) { return false; }
		if(this.stats.commandRoom == undefined || this.stats.commandRoom < 1) {return false;}

		return true;
	}
}

