var SCG2 = {};

SCG2.battlefield = {
	default: {
		width: 1024,
		height: 768
	},
	width: 1024,
	height: 768,
	current: undefined,
}

SCG2.battleSpace = {
	width: 2048,
	height: 1536
}

SCG2.debugger = 
{
	show: true,
	el: undefined
}

SCG2.canvas = undefined;
SCG2.context = undefined;
SCG2.gameLogics = {
	isPaused: false,
	isPausedStep: false,
	gameOver: false,
	drawBoundings: true,
	fillBoundings: false,
}

//main game objects array
SCG2.go = [];
SCG2.nonplayableGo = [];
SCG2.visibleGo = [];
SCG2.gameControls = {
	scale: {
		current: 1,
		step: 0.75,
		max: 1,
		min: 0.5625,
		change: function(direction){
			if(direction > 0){ //+
				if(this.current == this.max)
				{
					return;
				}
				this.current /= this.step;
				SCG2.context.scale(4/3,4/3);
			}
			else if(direction < 0) // -
			{
				if(this.current == this.min)
				{
					return;
				}
				this.current *= this.step;
				SCG2.context.scale(0.75,0.75);					
			}

			SCG2.battlefield.width=SCG2.battlefield.default.width/this.current;
			SCG2.battlefield.height=SCG2.battlefield.default.height/this.current;
			var center = SCG2.battlefield.current.center.clone();
			SCG2.battlefield.current.update(new Vector2(center.x - (SCG2.battlefield.width/2),center.y - (SCG2.battlefield.height/2)),new Vector2(SCG2.battlefield.width,SCG2.battlefield.height))
		},
		reset: function(){
			SCG2.context.setTransform(1, 0, 0, 1, 0, 0);
			SCG2.battlefield.width = SCG2.battlefield.default.width;
			SCG2.battlefield.height = SCG2.battlefield.default.height;
			this.current = 1;
			SCG2.battlefield.current.update(SCG2.battlefield.current.topLeft.clone(),new Vector2(SCG2.battlefield.width,SCG2.battlefield.height))
		},
	},
	mousestate : {
		position: new Vector2,
		delta: new Vector2,
		leftButtonDown: false,
		rightButtonDown: false,
		middleButtonDown: false,
		timer : undefined,
		reset: function(){
			this.leftButtonDown = false;
            this.rightButtonDown = false;
            this.middleButtonDown = false;
		},
		stopped : function(){
			SCG2.gameControls.mousestate.delta = new Vector2;
		}
	},
	keyboardstate: {
		altPressed : false,
		shiftPressed : false,
		ctrlPressed: false
	},
	selectedGOs : [],
	camera: {
		mode: 'free',
		shiftSpeed: 5,
		centeredOn: undefined,
		shifts: {
			left: false,
			right: false,
			up: false,
			down: false
		},
		free: function(){
			SCG2.gameControls.camera.mode = 'free';
			this.centeredOn = undefined;
		},
		center: function(){
			if(SCG2.gameControls.selectedGOs.length == 1){
				SCG2.gameControls.camera.mode = 'centered';
				this.centeredOn = SCG2.gameControls.selectedGOs[0];
			}
			else{
				SCG2.gameControls.camera.mode = 'free';
				this.centeredOn = undefined;
			}
		},
		reset: function(){
			this.shifts.left = false;
			this.shifts.right = false;
			this.shifts.up = false;
			this.shifts.down = false;
		},
		update: function(now){
			if(this.mode === 'free'){
				var direction = undefined;
				if(this.shifts.left)
				{
					direction = Vector2.left();
				}
				if(this.shifts.right)
				{
					direction = Vector2.right();
				}
				if(this.shifts.up)
				{
					if(direction!= undefined)
					{
						direction.add(Vector2.up());
					}
					else
					{
						direction = Vector2.up();	
					}
				}
				if(this.shifts.down)
				{
					if(direction!= undefined)
					{
						direction.add(Vector2.down());
					}
					else
					{
						direction = Vector2.down();	
					}
				}
				if(direction!== undefined){
					var delta = direction.mul(this.shiftSpeed);
					var bfTL = SCG2.battlefield.current.topLeft.clone();
					bfTL.add(delta);
					SCG2.battlefield.current.update(bfTL);		
				}
			}
			else if(this.mode === 'centered' && this.centeredOn!== undefined){
				var newBftl = this.centeredOn.position.substract(new Vector2(SCG2.battlefield.width/2,SCG2.battlefield.height/2),true);
				SCG2.battlefield.current.update(newBftl);
			}
			
		}
	},
	goControl: {
		accelerate : false,
		reverse: false,
		rotateLeft: false,
		rotateRight: false,
	},
	disableControlsEvents: function(){
		var that = this;
		$(document).off('keydown',that.keyDown);
		$(document).off('keyup',that.keyUp);
		$(SCG2.canvas).off();
	},
	permanentEventInit : function (){
		var that = this;
		$(document).on('keydown',function(e){
			that.permanentKeyDown(e);
		});
		$(document).on('keyup',function(e){
			that.permanentKeyUp(e);
		});
	},
	initControlsEvents: function  () {
		var that = this;
		$(document).on('keydown',$.proxy(that.keyDown,that));
		$(document).on('keyup',$.proxy(that.keyUp,that));
		$(SCG2.canvas).on('mousedown',function(e){
			that.mouseDown(e);
		});
		$(SCG2.canvas).on('mouseup',function(e){
			that.mouseUp(e);
		});
		$(SCG2.canvas).on('mousemove',function(e){
			that.mouseMove(e);
		});
		$(SCG2.canvas).on('mouseout',function(e){
			that.mouseOut(e);
		});
		$(SCG2.canvas).on('mousewheel',function(e){
			that.mouseScroll(e);
		});

		$(SCG2.canvas).on('contextmenu',function(e){
			e.preventDefault();
			return false;
		});
	},
	mouseDown: function(event){
		switch (event.which) {
	        case 1:
	            SCG2.gameControls.mousestate.leftButtonDown = true;
	            break;
	        case 2:
	            SCG2.gameControls.mousestate.middleButtonDown = true;
	            break;
	        case 3:
	            SCG2.gameControls.mousestate.rightButtonDown = true;
	            break;
	        default:
	            SCG2.gameControls.mousestate.reset();
	            break;
	    }
	},
	mouseScroll: function(event){
		if(event.originalEvent.wheelDelta >= 0){
			SCG2.gameControls.scale.change(1);
		}else{
			SCG2.gameControls.scale.change(-1);
		}

	},
	mouseOut: function(event){
		SCG2.gameControls.camera.reset();
		SCG2.gameControls.mousestate.reset();
	},
	mouseMove: function(event)
	{
		var oldPosition = SCG2.gameControls.mousestate.position.clone();

		clearTimeout(SCG2.gameControls.mousestate.timer);

		absorbTouchEvent(event);
		var posX = $(SCG2.canvas).offset().left, posY = $(SCG2.canvas).offset().top;
		var eventPos = pointerEventToXY(event);
		SCG2.gameControls.mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);
		SCG2.gameControls.mousestate.delta = SCG2.gameControls.mousestate.position.substract(oldPosition,true);
		if(SCG2.gameControls.mousestate.rightButtonDown)
		{
			var delta = oldPosition.directionNonNormal(SCG2.gameControls.mousestate.position);
			var newBftl = SCG2.battlefield.current.topLeft.clone().substract(delta,true);
			SCG2.battlefield.current.update(newBftl);
		}

		if(SCG2.gameControls.camera.mode === 'free')
		{
			var direction = undefined;
			if(SCG2.gameControls.mousestate.position.x < 15){
				SCG2.gameControls.camera.shifts.left = true;
			}
			else{
				SCG2.gameControls.camera.shifts.left = false;	
			}
			if(SCG2.gameControls.mousestate.position.x > (SCG2.battlefield.default.width - 15)){
				SCG2.gameControls.camera.shifts.right = true;
			}
			else{
				SCG2.gameControls.camera.shifts.right = false;
			}
			if(SCG2.gameControls.mousestate.position.y < 15){
				SCG2.gameControls.camera.shifts.up = true;
			}
			else{
				SCG2.gameControls.camera.shifts.up = false;
			}
			if(SCG2.gameControls.mousestate.position.y > (SCG2.battlefield.default.height - 15)){
				SCG2.gameControls.camera.shifts.down = true;
			}
			else{
				SCG2.gameControls.camera.shifts.down = false;
			}	
		}
		
		SCG2.gameControls.mousestate.timer = setTimeout(SCG2.gameControls.mousestate.stopped, 50);
	},
	mouseUp: function(event){
		switch (event.which) {
	        case 1:
	            SCG2.gameControls.mousestate.leftButtonDown = false;
	            break;
	        case 2:
	            SCG2.gameControls.mousestate.middleButtonDown = false;
	            break;
	        case 3:
	            SCG2.gameControls.mousestate.rightButtonDown = false;
	            break;
	        default:
	            SCG2.gameControls.mousestate.reset();
	            break;
	    }

		/*simple selection, without selection rectangle and checking for mouse buttons*/

		//clean current selected gos
		event.preventDefault();

		for (var i = SCG2.gameControls.selectedGOs.length - 1; i >= 0; i--) {
			SCG2.gameControls.selectedGOs[i].selected = false;
		};
		SCG2.gameControls.selectedGOs = [];
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
	permanentKeyDown : function (event)
	{
		this.keyboardstate.shiftPressed =event.shiftKey;
		this.keyboardstate.ctrlPressed =event.ctrlKey;
		this.keyboardstate.altPressed =event.altKey;
	},
	permanentKeyUp : function (event)
	{
		this.keyboardstate.shiftPressed =event.shiftKey;
		this.keyboardstate.ctrlPressed =event.ctrlKey;
		this.keyboardstate.altPressed =event.altKey;
	},
	keyDown: function (event) {
		switch(event.which)
		{
			case 87:
				this.goControl.accelerate = true;
				break;
			case 83:
				this.goControl.reverse = true;
				break;
			case 65:
				this.goControl.rotateLeft = true;
				break;
			case 68:
				this.goControl.rotateRight = true;
				break;
			default:
				break;
		}
	},
	keyUp: function(event){
		console.log(event.which);
		switch(event.which)
		{
			case 87:
				this.goControl.accelerate = false;
				break;
			case 83:
				this.goControl.reverse = false;
				break;
			case 65:
				this.goControl.rotateLeft = false;
				break;
			case 68:
				this.goControl.rotateRight = false;
				break;
			case 32:
				if(event.shiftKey){ 
					SCG2.gameLogics.isPausedStep = true;
				}
				else{
					SCG2.gameLogics.isPaused = !SCG2.gameLogics.isPaused;	
				}
				
				break;
			case 67:
				if(event.shiftKey){
					SCG2.gameControls.camera.free();
				}
				else{
					SCG2.gameControls.camera.center();
				}
				break;
			case 90:
				if(event.shiftKey){ //+
					SCG2.gameControls.scale.change(1);
				}
				else{ // -
					SCG2.gameControls.scale.change(-1);
				}
				break;
			case 84:
				break;
			default:
				break;
		}
	}
}

SCG2.gameControls.permanentEventInit();

