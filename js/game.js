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
SCG2.visibleGo = [];
SCG2.gameControls = {
	mousestate : {
		position: new Vector2,
		leftButtonDown: false,
		rightButtonDown: false,
	},
	selectedGOs : [],
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
		//debugger;
		//console.log(event);

		/*simple selection, without selection rectangle and checking for mouse buttons*/

		//clean current selected gos
		for (var i = SCG2.gameControls.selectedGOs.length - 1; i >= 0; i--) {
			SCG2.gameControls.selectedGOs[i].selected = false;
		};
		SCG2.gameControls.selectedGOs = [];

		absorbTouchEvent(event);
		var posX = $(SCG2.canvas).offset().left, posY = $(SCG2.canvas).offset().top;
		var eventPos = pointerEventToXY(event);
		SCG2.gameControls.mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);
		if(SCG2.visibleGo.length)
		{
			for (var i = SCG2.visibleGo.length - 1; i >= 0; i--) {
				if(SCG2.visibleGo[i].boundingBox !== undefined && SCG2.visibleGo[i].displayBoundingBox().isPointInside(SCG2.gameControls.mousestate.position))
				{
					//todo multiple go selection
					SCG2.visibleGo[i].selected = true;
					SCG2.gameControls.selectedGOs.push(SCG2.visibleGo[i]);
					break;
				}
			};
		}
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

