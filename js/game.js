var SCG2 = {};

SCG2.battlefield = {
	width: 1024,
	height: 768,
	current: undefined,
}

SCG2.battleSpace = {
	width: 2048,
	height: 1536
}

SCG2.canvas = undefined;
SCG2.context = undefined;
SCG2.gameLogics = {
	isPaused: false,
	gameOver: false,
	drawBoundings: true
}

//main game objects array
SCG2.go = [];
SCG2.shots = [];

SCG2.gameControls = {
	mousestate : {
		position: new Vector2,
		leftButtonDown: false,
		rightButtonDown: false,
	},
	accelerate : false,
	reverse: false,
	rotateLeft: false,
	rotateRight: false,
	initControlsEvents: function  () {
		var that = this;
		$(document).on('keydown',function(e){
			//e.preventDefault();
			//e.stopPropagation();
			that.keyDown(e);
		})
		$(document).on('keyup',function(e){
			//e.preventDefault();
			//e.stopPropagation();
			that.keyUp(e);
		});
		$(SCG2.canvas).on('mouseup',function(e){
			that.mouseUp(e);
		});
	},
	mouseUp: function(event){
		debugger;
		console.log(e);
		absorbTouchEvent(e);
		var posX = $(this).offset().left, posY = $(this).offset().top;
		var eventPos = pointerEventToXY(e);
		SCG2.gameControls.mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);
	},
	keyDown: function (event) {
		switch(event.which)
		{
			case 87:
				this.accelerate = true;
				break;
			case 83:
				this.reverse = true;
				break;
			case 65:
				this.rotateLeft = true;
				break;
			case 68:
				this.rotateRight = true;
				break;
			default:
				break;
		}
	},
	keyUp: function(event){
		switch(event.which)
		{
			case 87:
				this.accelerate = false;
				break;
			case 83:
				this.reverse = false;
				break;
			case 65:
				this.rotateLeft = false;
				break;
			case 68:
				this.rotateRight = false;
				break;
			case 32:
				SCG2.gameLogics.isPaused = !SCG2.gameLogics.isPaused;
			default:
				break;
		}
	}
}

