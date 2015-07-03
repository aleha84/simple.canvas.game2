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
	module_internal_square: 'content/images/module_internal_square.png',
	module_internal_triangle_bottomLeft: 'content/images/module_internal_triangle_bottomLeft.png',
	module_internal_triangle_bottomRight: 'content/images/module_internal_triangle_bottomRight.png',
	module_internal_triangle_topLeft: 'content/images/module_internal_triangle_topLeft.png',
	module_internal_triangle_topRight: 'content/images/module_internal_triangle_topRight.png',
	component_commandRoom: 'content/images/commandRoom.png',
	component_commandRoom_2x: 'content/images/commandRoom_2x.png',
	component_smallThruster: 'content/images/smallThruster.png',
	module_external_small_gun_turret: 'content/images/small_gun_turret.png',
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
	
	if(SCG2.debugger.show){
		SCG2.debugger.el = $('.debugger');
	}

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
		SCG2.modeller.modules.init();
		SCG2.modeller.components.init();
		SCG2.initScene1();
		SCG2.animate();
	});
});

SCG2.initScene1 = function(testGo){
	$('.showScene, #modulesSelectPanel, #getPredefined').remove();
	SCG2.gameLogics.isPaused = false;
	SCG2.modeller.options.isActive = false;
	var fighter = testGo || new SCG2.GO.Fighter({position:new Vector2(SCG2.battlefield.width/2,SCG2.battlefield.height/2)});
	fighter.playerControllable = true;
	fighter.selected = true;
	SCG2.defaultScene = {};
	SCG2.defaultScene.go = [];
	SCG2.defaultScene.go.push(fighter);
	SCG2.defaultScene.go.push(new SCG2.GO.StaticPlatform({position:new Vector2(100,100)}));
	SCG2.go = SCG2.defaultScene.go;

	SCG2.nonplayableGo = [];
	SCG2.gameControls.selectedGOs = [];
	SCG2.gameControls.selectedGOs.push(fighter);
	SCG2.gameControls.camera.center();

	SCG2.modeller.options.disableControlsEvents();
	SCG2.gameControls.initControlsEvents();

	addModellerBtn($(document.body),testGo);
}

SCG2.animate = function() {
	//SCG2.frameCounter.renderConsumption.begin = new Date;
    SCG2.draw();
    requestAnimationFrame( SCG2.animate );
    
}

SCG2.draw = function(){
	var now = new Date;

	//draw background
	SCG2.context.drawImage(SCG2.images.starfield,0,0,SCG2.battlefield.width,SCG2.battlefield.height);
	if((!SCG2.gameLogics.isPaused || (SCG2.gameLogics.isPaused && SCG2.gameLogics.isPausedStep)) && !SCG2.gameLogics.gameOver){
		// clear visible go array
		SCG2.visibleGo = [];	
	}
	
	SCG2.gameControls.camera.update(now);
	
	var i = SCG2.go.length;
	while (i--) {
		SCG2.go[i].update(now);
		SCG2.go[i].render();
		if(!SCG2.go[i].alive){
			var deleted = SCG2.go.splice(i,1);
		}
	}

	var ni = SCG2.nonplayableGo.length;
	while (ni--) {
		SCG2.nonplayableGo[ni].update(now);
		SCG2.nonplayableGo[ni].render();
		if(!SCG2.nonplayableGo[ni].alive){
			var deleted = SCG2.nonplayableGo.splice(ni,1);
		}
	}

	if(SCG2.gameLogics.isPausedStep)
	{
		SCG2.gameLogics.isPausedStep =false;
	}

	SCG2.frameCounter.doWork(now);

	if(SCG2.modeller.options.isActive){
		SCG2.modeller.showNotifications();
	}

	if(SCG2.debugger.show){

		SCG2.debugger.el.html(String.format("delta : {0}", SCG2.gameControls.mousestate.delta.toString()))
	}
}