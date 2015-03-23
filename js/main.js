

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
	SCG2.context.resetTransform();
	SCG2.gameControls.initControlsEvents();
	SCG2.go.push(new SCG2.GO.Player());

	initializer(function(){
		SCG2.animate();
	});
});

SCG2.animate = function() {
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

}