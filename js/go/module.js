SCG2.Module = {};

SCG2.Module.Module = function(init){
	this.parent = undefined;
	this.position = new Vector2;
	this.displayPosition = new Vector2; 
	this.size = new Vector2;
	this.angle = 0;
	this.img = undefined;
	this.alive = true;
	this.id = '';
	this.cornerPoints = [];
	this.boundingSphere = undefined;
	this.connectionInnerLinks = undefined;
	this.connectionOuterLinks = undefined;
	if(init!=undefined)
	{
		$.extend(true,this,init);
	}
	if(init.displayPosition === undefined)
	{
		this.displayPosition = this.position;
	}

	this.calculateBoundingSphere();
	this.collided = false;
	this.collidedSegmentIndices = [];
	this.collisionPoints = [];
	this.mouseOver = false;
	this.selected = false;
	this.hilightBox = new Box(new Vector2().substract(new Vector2(this.size.x/2,this.size.y/2),true),this.size);
	this.screenBox = undefined;
	this.component = undefined;
	this.img2xPart = undefined;
}

SCG2.Module.Module.prototype = {
	constructor: SCG2.Module.Module,

	render: function(){
		if(this.img === undefined)
		{
			return;
		}
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		SCG2.context.rotate(this.angle);

		SCG2.context.drawImage(this.img,this.size.x/-2,this.size.y/-2,this.size.x,this.size.y);	
		if(SCG2.modeller.options.isActive && this.component && this.component.img){
			if(this.component._2x)
			{
				var source; 
				switch(this.img2xPart)
				{
					case 0:
						source = new Vector2;
						break;
					case 1:
						source = new Vector2(this.size.x,0);
						break;
					case 2:
						source = new Vector2(0,this.size.y);
						break;
					case 3:
						source = new Vector2(this.size.x,this.size.y);
						break;
					default:
						break;
				}
				var sSize = this.size.clone();
				SCG2.context.drawImage(this.component.img, source.x, source.y, sSize.x, sSize.y,this.component.size.x/-2,this.component.size.y/-2,this.component.size.x,this.component.size.y);
			}
			else{
				SCG2.context.drawImage(this.component.img,this.component.size.x/-2,this.component.size.y/-2,this.component.size.x,this.component.size.y);
			}

			if(this.component.restrictionPoligon)
			{
				this.component.restrictionPoligon.render();
			}
			
		}
		this.innerRender();

		if(SCG2.gameLogics.drawBoundings)
		{
			this.renderBoundingSphere(SCG2.gameLogics.fillBoundings && this.collided);	
		}

		SCG2.context.rotate(-this.angle);
		if(this.selected || this.mouseOver){
			 
			this.hilightBox.render({strokeStyle:'rgb(255,255,0)',lineWidth: this.selected?3:1, fill: this.mouseOver, fillStyle: 'rgba(255,255,0,0.2)'});
		}
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
	},

	innerRender: function(){

	},

	update: function (now) {
		this.mouseOver = false;
		if((this.parent.selected && this.parent.displayPosition !== undefined && this.parent.displayBoundingBox().isPointInside(SCG2.gameControls.mousestate.position)) || SCG2.modeller.options.isActive){
			var relativeToScreenCenter = this.parent.displayPosition.add(this.position.rotate(this.parent.angle,true,false),true);
			this.screenBox = new Box(relativeToScreenCenter.substract(new Vector2(this.size.x/2,this.size.y/2),true),this.size);
			this.mouseOver = this.screenBox.isPointInside(SCG2.gameControls.mousestate.position);
		}
		else{
			this.screenBox = undefined;
		}

		if(SCG2.gameLogics.isPaused /*|| (SCG2.gameLogics.isPaused && SCG2.gameLogics.isPausedStep)*/ || SCG2.gameLogics.gameOver || SCG2.modeller.options.isActive)
		{
			return;
		}

		this.innerUpdate(now);
	},

	innerUpdate: function(now){

	},

	addComponent: function(component, img2xPart){
		this.component = component;
		this.component.parents.push(this);
		this.component.addStats(this.parent.stats);
		if(img2xPart!== undefined){
			this.img2xPart = img2xPart;
		}
	},

	removeComponent: function(){
		if(this.component){
			this.component.removeStats(this.parent.stats);
			this.component = undefined;	
		}
	},

	calculateBoundingSphere: function  () {
		if(this.cornerPoints.length > 0){
			var center = new Vector2;
			var radius = 0;
			for (var i = this.cornerPoints.length - 1; i >= 0; i--) {	
				var d = center.distance(this.cornerPoints[i]);
				if(d > radius) radius = d;
			}

			this.boundingSphere = new Circle(center,radius);
		}
	},

	renderBoundingSphere: function  (fill) {
		if(!SCG2.gameLogics.drawBoundings || this.boundingSphere === undefined)
		{
			return;
		}
		this.boundingSphere.render(fill);

		
		for (var i = this.cornerPoints.length - 1; i >= 0; i--) {
			SCG2.context.beginPath();
			SCG2.context.moveTo(this.cornerPoints[i].x, this.cornerPoints[i].y);
			SCG2.context.lineTo(this.cornerPoints[i==0?this.cornerPoints.length-1:i-1].x, this.cornerPoints[i==0?this.cornerPoints.length-1:i-1].y);
			SCG2.context.strokeStyle = '#0000FF';
			SCG2.context.lineWidth = 1;
			if(this.collidedSegmentIndices.indexOf(i)!=-1)
			{
				SCG2.context.lineWidth = 3;
				SCG2.context.strokeStyle = '#000000';
			}
			SCG2.context.stroke();
		}
	},

	checkCollisionWithLine: function(line)
	{
		this.collided = segmentIntersectCircle2(line, new Circle(this.parent.position.add(this.position.rotate(this.parent.angle,true,false),true),this.boundingSphere.radius));
		if(this.collided){
			if(this.cornerPoints.length > 1){
				this.collidedSegmentIndices = []; //reset index
				this.collisionPoints = [];
				var relativeToModuleLine = new Line({
					begin:line.begin.substract(this.parent.position,true).rotate(-this.parent.angle,true,false).substract(this.position,true).rotate(-this.angle,true,false), 
					end:line.end.substract(this.parent.position,true).rotate(-this.parent.angle,true,false).substract(this.position,true).rotate(-this.angle,true,false)
				});

				// var lDirection = relativeToModuleLine.begin.direction(relativeToModuleLine.end);
				// var secondTryDelta = lDirection.mul(relativeToModuleLine.begin.distance(relativeToModuleLine.end)/5);
				// var relativeToModuleLine2 = new Line({begin:relativeToModuleLine.begin.substract(secondTryDelta,true), end:relativeToModuleLine.end.add(secondTryDelta,true)});
				var closestCollision  = undefined 
				for (var k= this.cornerPoints.length - 1; k >= 0; k--) {
					var l = new Line({begin: this.cornerPoints[k], end: this.cornerPoints[k==0?this.cornerPoints.length-1:k-1]});

					var collided = segmentsIntersectionVector2(relativeToModuleLine,l); //|| segmentsIntersectionVector2(relativeToModuleLine2,l);
					if(collided)
					{
						var distance = relativeToModuleLine.begin.distance(collided);
						if(closestCollision === undefined || closestCollision.distance > distance)
						{
							closestCollision = {collision: collided, distance: distance};
						}
						//this.modules[j].collisionPoints.push(collided);
					}
				};
				if(closestCollision!==undefined)
				{
					// if(this instanceof SCG2.Module.SpaceshipBody)
					// {
					// 	debugger;
					// }
					var absCollisionPosition = closestCollision.collision.clone().rotate(this.angle,true,false).add(this.position,true).rotate(this.parent.angle,true,false).add(this.parent.position,true);
					//SCG2.nonplayableGo.push(new SCG2.GO.SimpleExplosion({position: absCollisionPosition}));
					return {distance: closestCollision.distance, absolute: absCollisionPosition};		
				}
			}
		}
	}
}


