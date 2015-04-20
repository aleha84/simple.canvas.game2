SCG2.modeller = {};
SCG2.modeller.options = {
	size: new Vector2(200,200),
	isActive: false,
}

SCG2.modeller.go = [];//new SCG2.GO.GO({direction: new Vector2.up()});

SCG2.modeller.showDialog = function(){
	SCG2.modeller.go = [];
	SCG2.modeller.go.push(new SCG2.GO.GO({direction: new Vector2.up()}));

	if(SCG2.modeller.go.displayPosition === undefined){
		SCG2.modeller.go.displayPosition = new Vector2;
	}

	SCG2.modeller.options.isActive = true;

	SCG2.go = SCG2.modeller.go;
	SCG2.nonplayableGo = [];
	SCG2.gameControls.selectedGOs = SCG2.go;
	SCG2.gameControls.camera.center();

	$('#showModellerDialog').remove();
	var body = $(document.body);
	addScene1Btn(body);

	var panel = $('<div/>',{id:'modulesSelectPanel', css: {left: (SCG2.battlefield.width + 8) + 'px'}});
	panel.append($('<div/>',{id:'module_internal_square',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_square.png)'}}));

	panel.on('click','.moduleBlock',function(e){
		SCG2.modeller.panelBlockSelect(e);
	});
	SCG2.modeller.panel = panel;
	body.append(panel);

}

SCG2.modeller.panelBlockSelect = function(event){
	panel.find('.moduleBlock').removeClass('selected');
	var ct = $(event.currentTarget);
	ct.addClass('selected');
	switch(ct.attr('id'))
	{
		default:
			break;
	}
}
