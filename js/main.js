SCG2.frameCounter = {
	lastTimeCheck : new Date,
	checkDelta: 1000,
	prevRate: 0,
	current: 0,
	renderConsumption:
	{
		begin: new Date,
		end: new Date,
	},
	draw: function(){
		SCG2.context.save();     
		SCG2.context.fillStyle = "red";
		SCG2.context.font = "48px serif";
  		SCG2.context.fillText(this.prevRate, SCG2.battlefield.width-60, 40);
  		SCG2.context.font = "24px serif";
  		SCG2.context.fillText(this.renderConsumption.end - this.renderConsumption.begin, SCG2.battlefield.width-60, 80);
		SCG2.context.restore(); 
	},
	doWork : function(now)
	{
		if(now - this.lastTimeCheck > this.checkDelta)
		{
			this.prevRate = this.current;
			this.current = 0;
			this.lastTimeCheck = now;
		}
		else{
			this.current++;
		}

		this.draw();
	}
}

//images
SCG2.src = {
	starfield: 'content/images/starfield.png',
	debug_ship: 'content/images/debug_ship.png',
};
SCG2.images = {
}

$(document).ready(function(){
	if(!SCG2.canvas)
	{
		var c = $('<canvas />',{
			width: SCG2.battlefield.width,
			height: SCG2.battlefield.height
		});
		c.attr({'width':SCG2.battlefield.width,'height':SCG2.battlefield.height});
		$(document.body).append(c);
		SCG2.canvas = c.get(0);
		SCG2.context = SCG2.canvas.getContext('2d');
	}
	//SCG2.context.resetTransform();
	SCG2.gameControls.initControlsEvents();
	SCG2.battlefield.current = new Box(new Vector2,new Vector2(SCG2.battlefield.width,SCG2.battlefield.height));

	SCG2.go.push(new SCG2.GO.Player());
	for (var i = 20; i >= 0; i--) {
		SCG2.go.push(new SCG2.GO.DummyObject);
	};
	initializer(function(){
		SCG2.animate();

		// SCG2.gameControls.accelerate = true;
		// SCG2.gameControls.rotateLeft = true;
	});
});

SCG2.animate = function() {
	//SCG2.frameCounter.renderConsumption.begin = new Date;
    requestAnimationFrame( SCG2.animate );
    SCG2.draw();
}

SCG2.draw = function(){
	var now = new Date;

	//draw background
	SCG2.context.drawImage(SCG2.images.starfield,0,0,SCG2.battlefield.width,SCG2.battlefield.height);

	var i = SCG2.go.length;
	while (i--) {
		if(!SCG2.gameLogics.isPaused && !SCG2.gameLogics.gameOver)
		{
			SCG2.go[i].update(now);
		}
		SCG2.go[i].render();
		if(!SCG2.go[i].alive){
			var deleted = SCG2.go.splice(i,1);
		}
	}
	//SCG2.frameCounter.renderConsumption.end = new Date;
	SCG2.frameCounter.doWork(now);
}