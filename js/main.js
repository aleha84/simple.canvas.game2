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
	visibleCount: 0,
	draw: function(){
		SCG2.context.save();     
		SCG2.context.fillStyle = "red";
		SCG2.context.font = "48px serif";
  		SCG2.context.fillText(this.prevRate, SCG2.battlefield.width-60, 40);
  		SCG2.context.font = "24px serif";
  		SCG2.context.fillText(this.visibleCount, SCG2.battlefield.width-60, 80);
  		SCG2.frameCounter.visibleCount = 0;
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
	turret: 'content/images/turret.png',
	platformBase: 'content/images/platformBase.png',
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
	
	SCG2.gameControls.initControlsEvents();
	SCG2.battlefield.current = new Box(new Vector2,new Vector2(SCG2.battlefield.width,SCG2.battlefield.height));

	
	// for (var i = 100; i >= 0; i--) {
	// 	SCG2.go.push(new SCG2.GO.DummyObject)
	// };
	
	//SCG2.go.push(new SCG2.GO.DummyLine({length:100}));
	// setInterval(function(){
	// 	SCG2.go.push(new SCG2.GO.Shot({position:new Vector2(100,100),direction: new Vector2(1,0)}));
	// },2000);
	
	
	initializer(function(){
		// SCG2.Player = new SCG2.GO.Player;
		// SCG2.Player.addModule(new SCG2.Module.SimpleTurret({
		// 	position: new Vector2(20,0),
		// 	size: new Vector2(30,30),
		// 	img: SCG2.images.turret,
		// 	angle: 0,
		// 	clamps: { min: 0, max: degreeToRadians(180)},
		// 	rotationSpeed: 0.01,
		// 	rotationDirection: -1,
		// }));
		// SCG2.Player.addModule(new SCG2.Module.SimpleTurret({
		// 	position: new Vector2(-20,0),
		// 	size: new Vector2(30,30),
		// 	img: SCG2.images.turret,
		// 	angle: 0,
		// 	clamps: { min: degreeToRadians(-180), max: 0},
		// 	rotationSpeed: 0.01,
		// 	rotationDirection: 1,
		// }));
		// SCG2.go.push(SCG2.Player);

		var fighter = new SCG2.GO.Fighter({position:new Vector2(SCG2.battlefield.width/2,SCG2.battlefield.height/2)});
		fighter.playerControllable = true;
		SCG2.go.push(fighter);
		SCG2.go.push(new SCG2.GO.StaticPlatform({position:new Vector2(100,100)}));
		SCG2.animate();
	});
});

SCG2.animate = function() {
	//SCG2.frameCounter.renderConsumption.begin = new Date;
    SCG2.draw();
    requestAnimationFrame( SCG2.animate );
    
}

SCG2.draw = function(){
	var now = new Date;

	//draw background
	SCG2.context.drawImage(SCG2.images.starfield,0,0,SCG2.battlefield.width,SCG2.battlefield.height);
	if(!SCG2.gameLogics.isPaused && !SCG2.gameLogics.gameOver){
		// clear visible go array
		SCG2.visibleGo = [];	
	}
	
	
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