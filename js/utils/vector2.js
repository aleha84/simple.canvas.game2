function Vector2(x,y){
	if(x == undefined){
		x = 0;
	}
	if(y == undefined){
		y = 0;
	}
	this.x = x;
	this.y = y;

	this.distance = function(to){
		if(!to || !(to instanceof Vector2)){
			return undefined;
		}

		return new Vector2(to.x-this.x,to.y - this.y).module();
	}

	this.direction = function(to){
		if(!to || !(to instanceof Vector2)){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y).normalize();
	}

	this.normalize = function(){
		var module = this.module();
		this.x /= module;
		this.y /= module;
		return this;
	}

	this.module = function(){
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
	}

	this.add = function(summand, outer){
		if(outer === undefined)
		{
			outer = false;
		}
		if(summand instanceof Vector2){
			if(outer){
				return new Vector2(this.x + summand.x,this.y + summand.y);
			}
			else{
				this.x +=summand.x;
				this.y +=summand.y;	
			}
			
		}
	}

	this.mul = function(coef){
		return new Vector2(this.x*coef,this.y*coef);
	}

	this.mulVector = function(to){
		if(!to || !(to instanceof Vector2)){
			return 0;
		}

		return this.x*to.x + this.y*to.y;
	}

	this.rotate = function(angle, inRad, isSelf){
		if(inRad === undefined)
		{
			inRad = false;
		}
		if(isSelf === undefined)
		{
			isSelf = false;
		}

		var result = new Vector2(this.x*Math.cos(inRad?angle:angle*Math.PI/180) - this.y* Math.sin(inRad?angle:angle*Math.PI/180),
						   this.x*Math.sin(inRad?angle:angle*Math.PI/180) + this.y* Math.cos(inRad?angle:angle*Math.PI/180) );

		if(isSelf)
		{
			this.x = result.x;
			this.y = result.y;
		}
		else{
			return result;
		}
	}
}