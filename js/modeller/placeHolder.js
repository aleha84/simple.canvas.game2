SCG2.modeller.PlaceHolder = function (init) {
	if(init.position === undefined){ throw "SCG2.modeller.PlaceHolder -> position Undefiend"; }
	if(init.size === undefined){ throw "SCG2.modeller.PlaceHolder -> size Undefiend"; }

	this.alive = true;
	$.extend(this,init);
	this.displayPosition = this.position.add(SCG2.battlefield.current.topLeft.mul(-1),true);
	this.displayBox = new Box(this.displayPosition.substract(new Vector2(this.size.x/2,this.size.y/2),true),this.size);
	this.box = new Box(new Vector2().substract(new Vector2(this.size.x/2,this.size.y/2),true),this.size);
	this.mouseOver = false;
	this.update = function(now){
		this.displayPosition = this.position.substract(SCG2.battlefield.current.topLeft,true);
		this.displayBox = new Box(this.displayPosition.substract(new Vector2(this.size.x/2,this.size.y/2),true),this.size);
		if(SCG2.gameControls.mousestate.position){
			this.mouseOver = this.displayBox.isPointInside(SCG2.gameControls.mousestate.position);
			if(this.mouseOver) {SCG2.modeller.currentPlaceHolder = this;}
		}
	}
	this.render = function(){
		SCG2.context.translate(this.displayPosition.x,this.displayPosition.y);
		this.box.render({strokeStyle: 'red', fill: this.mouseOver, fillStyle: 'rgba(255,0,0,0.2)'})
		SCG2.context.translate(-this.displayPosition.x,-this.displayPosition.y);
	}

}