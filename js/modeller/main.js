/// <reference path="../game.js" />
/// <reference path="../main.js" />
/// <reference path="../utils/vector2.js" />
/// <reference path="../lib/jquery.js" />

SCG2.modeller = {};
SCG2.modeller.options = {
	size: new Vector2(200,200),
	isActive: false,
	moduleAdding: false,
	initControlsEvents: function(){
		var that = this;
		$(SCG2.canvas).on('mousemove',function(e){				
			that.controls.mouseMove(e);
		});
		$(SCG2.canvas).on('mouseout',function(e){				
			that.controls.mouseOut(e);
		});
		$(SCG2.canvas).on('mouseup',function(e){				
			that.controls.mouseUp(e);
		});
		$(SCG2.canvas).on('mousedown',function(e){
			that.controls.mouseDown(e);
		});
	},
	disableControlsEvents: function(){
		$(SCG2.canvas).off();
	},
	controls: {
		mouseMove:function(event){
			clearTimeout(SCG2.gameControls.mousestate.timer);

			var oldPosition = SCG2.gameControls.mousestate.position.clone();
			SCG2.modeller.currentPlaceHolder = undefined;
			absorbTouchEvent(event);
			var posX = $(SCG2.canvas).offset().left, posY = $(SCG2.canvas).offset().top;
			var eventPos = pointerEventToXY(event);
			SCG2.gameControls.mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);
			SCG2.gameControls.mousestate.delta = SCG2.gameControls.mousestate.position.substract(oldPosition,true);

			SCG2.gameControls.mousestate.timer = setTimeout(SCG2.gameControls.mousestate.stopped, 50);
		},
		mouseOut:function(event){
			//SCG2.gameControls.mousestate.position = undefined;
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
		    //console.log(SCG2.gameControls.mousestate);
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
		    //console.log(SCG2.gameControls.mousestate);

			if(SCG2.modeller.options.moduleAdding){
				if(SCG2.modeller.currentPlaceHolder){
					SCG2.modeller.addModule(SCG2.modeller.currentPlaceHolder);
				}
			}
			else{
				var mo = [];
				for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {					
					if(SCG2.modeller.go.modules[i].mouseOver){
						mo.push(SCG2.modeller.go.modules[i]);
					}
				};
				if(mo.length == 0) {
					SCG2.modeller.selectedModule.unselect();
				}
				else{
					for (var i = mo.length - 1; i >= 0; i--) {
						if(mo[i] == SCG2.modeller.selectedModule.module){continue;}
						else {
							SCG2.modeller.selectedModule.select(mo[i]);
							break;
						}
					};
				}
			}

			SCG2.modeller.options.moduleAdding = false;
			SCG2.nonplayableGo = [];
			SCG2.modeller.panel.find('.moduleBlock').removeClass('selected');
			$(SCG2.canvas).css({'cursor': 'default'});
		},
	},
}

SCG2.modeller.go = [];//new SCG2.GO.GO({direction: new Vector2.up()});
SCG2.modeller.currentPlaceHolder = undefined;
SCG2.modeller.restrictionPoligons = [];
SCG2.modeller.selectedModule = {
	module: undefined,
	unselect: function(){
		if(this.module){
			this.module.selected = false,
			this.module = undefined;	
			SCG2.modeller.fillModulesPanel();
		}
		
	},
	select: function(module){
		this.unselect();
		this.module = module;
		this.module.selected = true;
		SCG2.modeller.fillComponentsPanel();
		
	}
};
SCG2.modeller.showDialog = function(testGo){
	SCG2.gameControls.scale.reset();
	SCG2.gameControls.disableControlsEvents();
	SCG2.modeller.options.initControlsEvents();

	SCG2.modeller.go = testGo || new SCG2.GO.GO({direction: new Vector2.up()});
	//reset position and angle
	SCG2.modeller.go.position = new Vector2;
	SCG2.modeller.go.angle = 0;

	if(testGo)
	{
		SCG2.modeller.go.updateBoundingBox();
	}

	SCG2.modeller.goStats = {};
	//SCG2.modeller.go.push(new SCG2.GO.GO({direction: new Vector2.up()}));

	if(SCG2.modeller.go.displayPosition === undefined){
		SCG2.modeller.go.displayPosition = new Vector2;
	}

	SCG2.modeller.options.isActive = true;
	SCG2.go = [];
	SCG2.go.push(SCG2.modeller.go);
	SCG2.nonplayableGo = [];
	SCG2.gameControls.selectedGOs = SCG2.go;
	SCG2.gameControls.camera.center();

	$('#showModellerDialog').remove();
	var body = $(document.body);
	addScene1Btn(body);
	addScene1Btn(body,true);

	SCG2.modeller.panel = $('<div/>',{id:'modulesSelectPanel', css: {left: (SCG2.battlefield.default.width + 8) + 'px'}});
	SCG2.modeller.fillModulesPanel();

	SCG2.modeller.panel.on('mousedown','.moduleBlock',function(e){
		SCG2.modeller.panelBlockSelect(e);
	});
	SCG2.modeller.panel.on('click','.componentBlock',function(e){
		SCG2.modeller.componentBlockSelect(e);
	});
	body.append(SCG2.modeller.panel);

	body.append($('<input />', { id: 'getPredefined', type:'button', value: 'predefined', on: {'click':function(){ 
    SCG2.modeller.loadPredefined(); 
  	}}}));

}

SCG2.modeller.selectedModuleComponentRemove = function(){
	if(!SCG2.modeller.selectedModule.module.component){return;}
	if(SCG2.modeller.selectedModule.module.component.parents.length > 1){
		var componentParents = SCG2.modeller.selectedModule.module.component.parents;
		for (var i = componentParents.length - 1; i >= 0; i--) {
			componentParents[i].removeComponent();
		};
	}
	else{
		SCG2.modeller.selectedModule.module.removeComponent();	
	}
}

SCG2.modeller.componentBlockSelect = function(event){
	var ct = $(event.currentTarget);
	var componentId = ct.attr('id');
	if(componentId == 'remove_module'){
		if(SCG2.modeller.selectedModule.module.connectionInnerLinks){
			if(SCG2.modeller.selectedModule.module.connectionInnerLinks.left instanceof SCG2.Module.Module && SCG2.modeller.selectedModule.module.connectionInnerLinks.left.connectionInnerLinks) {
				SCG2.modeller.selectedModule.module.connectionInnerLinks.left.connectionInnerLinks.right = false;
				SCG2.modeller.selectedModule.module.connectionInnerLinks.left.connectionOuterLinks.right = false;
			}
			if(SCG2.modeller.selectedModule.module.connectionInnerLinks.right instanceof SCG2.Module.Module && SCG2.modeller.selectedModule.module.connectionInnerLinks.right.connectionInnerLinks) {
				SCG2.modeller.selectedModule.module.connectionInnerLinks.right.connectionInnerLinks.left = false;
				SCG2.modeller.selectedModule.module.connectionInnerLinks.right.connectionOuterLinks.left = false;
			}
			if(SCG2.modeller.selectedModule.module.connectionInnerLinks.above instanceof SCG2.Module.Module && SCG2.modeller.selectedModule.module.connectionInnerLinks.above.connectionInnerLinks) {
				SCG2.modeller.selectedModule.module.connectionInnerLinks.above.connectionInnerLinks.below = false;
				SCG2.modeller.selectedModule.module.connectionInnerLinks.above.connectionOuterLinks.below = false;
			}
			if(SCG2.modeller.selectedModule.module.connectionInnerLinks.below instanceof SCG2.Module.Module && SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionInnerLinks) {
				SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionInnerLinks.above = false;
				SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionOuterLinks.above = false;
			}

			//removes external modules binded to selected module
			for (var outerLinkName in SCG2.modeller.selectedModule.module.connectionOuterLinks) {
				if (SCG2.modeller.selectedModule.module.connectionOuterLinks.hasOwnProperty(outerLinkName) && SCG2.modeller.selectedModule.module.connectionOuterLinks[outerLinkName] ) {
					var externalModule = SCG2.modeller.selectedModule.module.connectionOuterLinks[outerLinkName];
					SCG2.modeller.go.removeModule(externalModule);
				}
			}
		}
		

		//removing external module
		if(SCG2.modeller.selectedModule.module.connectionOuterLink!=undefined)
		{
			var col = SCG2.modeller.selectedModule.module.connectionOuterLink;
			if(col.below){
				col.below.connectionInnerLinks.above = false;
				col.below.connectionOuterLinks.above = false;
			}else if(col.above){
				col.above.connectionInnerLinks.below = false;
				col.above.connectionOuterLinks.below = false;
			}else if(col.left){
				col.left.connectionInnerLinks.right = false;
				col.left.connectionOuterLinks.right = false;
			}else if(col.right){
				col.right.connectionInnerLinks.left = false;
				col.right.connectionOuterLinks.left = false;
			}else if(col.center){
				col.center.connectionOuterLinks.center = false;
			}

		}


		SCG2.modeller.selectedModuleComponentRemove();
		SCG2.modeller.go.removeModule(SCG2.modeller.selectedModule.module);
		SCG2.modeller.findDisconnectedModules();
	}
	else if(componentId == 'remove_component'){
		SCG2.modeller.selectedModuleComponentRemove();
	}
	else if(componentId != ''){
		var component = new SCG2.Component.Component(SCG2.modeller.components[componentId]);
		if(component._2x){
			SCG2.modeller.selectedModule.module.addComponent(component,0);
			SCG2.modeller.selectedModule.module.connectionInnerLinks.right.addComponent(component,1);
			SCG2.modeller.selectedModule.module.connectionInnerLinks.below.addComponent(component,2);
			SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionInnerLinks.right.addComponent(component,3);
		}
		else{
			SCG2.modeller.selectedModule.module.addComponent(component);
		}
		
	}
	SCG2.modeller.wholeGoRestrictionCheck();
	SCG2.modeller.selectedModule.unselect();
}

SCG2.modeller.panelBlockSelect = function(event){
	$(SCG2.canvas).css({'cursor': 'move'});
	SCG2.modeller.options.moduleAdding = true;
	SCG2.modeller.selectedModule.unselect();
	SCG2.nonplayableGo = [];
	SCG2.modeller.panel.find('.moduleBlock').removeClass('selected');
	var ct = $(event.currentTarget);
	ct.addClass('selected');
	var moduleId = ct.attr('id');
	SCG2.modeller.placeHolderCreation(moduleId,SCG2.nonplayableGo);
	
}

SCG2.modeller.fillModulesPanel = function(){
	if(SCG2.modeller.panel.attr('mode') == 'modules'){
		return;
	}
	SCG2.modeller.panel.empty();
	SCG2.modeller.panel.attr('mode','modules');

	SCG2.modeller.panel.append($('<div/>',{text: 'Inner', class: 'componentDivider'}));
	for (var moduleName in SCG2.modeller.modules) {
		if (SCG2.modeller.modules.hasOwnProperty(moduleName) && moduleName.indexOf('internal') != -1) {
			SCG2.modeller.panel.append($('<div/>',
				{
					id:moduleName,
					class:'moduleBlock',
					css: {'background-image':'url('+SCG2.modeller.modules[moduleName].img.src+')'}
			}));
		}
	}

	SCG2.modeller.panel.append($('<div/>',{text: 'Outer', class: 'componentDivider'}));
	for (var moduleName in SCG2.modeller.modules) {
		if (SCG2.modeller.modules.hasOwnProperty(moduleName) && moduleName.indexOf('external') != -1) {
			SCG2.modeller.panel.append($('<div/>',
				{
					id:moduleName,
					class:'moduleBlock',
					css: {'background-image':'url('+SCG2.modeller.modules[moduleName].img.src+')'}
			}));
		}
	}
	// SCG2.modeller.panel.append($('<div/>',{id:'module_internal_square',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_square.png)'}}));
	// SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_bottomLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomLeft.png)'}}));
	// SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_bottomRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomRight.png)'}}));
	// SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_topLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topLeft.png)'}}));
	// SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_topRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topRight.png)'}}));
}

SCG2.modeller.fillComponentsPanel = function(){
	// if(SCG2.modeller.panel.attr('mode') == 'components'){
	// 	return;
	// }
	SCG2.modeller.panel.empty();
	SCG2.modeller.panel.attr('mode','components');
	if(SCG2.modeller.selectedModule.module.component == undefined){
		if(SCG2.modeller.is2x2Possible(SCG2.modeller.selectedModule.module)){
			SCG2.modeller.panel.append($('<div/>',{text: '2x', class: 'componentDivider'}));

			for (var componentName in SCG2.modeller.components) {
		        if (SCG2.modeller.components.hasOwnProperty(componentName) && SCG2.modeller.components[componentName]._2x) {
		        	SCG2.modeller.panel.append($('<div/>',
		        		{
		        			id:componentName,
		        			componentSize:'2x',
		        			class:'componentBlock',
		        			css: {'background-image':'url('+SCG2.modeller.components[componentName].img.src+')'},
		        			title: SCG2.modeller.components[componentName].title
		        		}));		
		        }
		    }	
		}

		//only sqare module components
		SCG2.modeller.panel.append($('<div/>',{text: '1x', class: 'componentDivider'}));

		if(SCG2.modeller.isSquare(SCG2.modeller.selectedModule.module)){

			for (var componentName in SCG2.modeller.components) {
				if (componentName!=='init' && SCG2.modeller.components.hasOwnProperty(componentName) && !SCG2.modeller.components[componentName]._2x && SCG2.modeller.components[componentName].accessibilityCheck(SCG2.modeller.selectedModule.module)) {
					SCG2.modeller.panel.append($('<div/>',
						{
							id:componentName,
							class:'componentBlock',
							css: {'background-image':'url('+SCG2.modeller.components[componentName].img.src+')'},
							title: SCG2.modeller.components[componentName].title
						}));					
				}
			}
		}
		
	}
	else {
		SCG2.modeller.panel.append($('<div/>',{id:'remove_component',class:'componentBlock',css: {'background-image':'url(content/images/removeComponent30.png)'},title: 'Remove component'}));	
	}
	SCG2.modeller.panel.append($('<div/>',{text: '-', class: 'componentDivider'}));
	SCG2.modeller.panel.append($('<div/>',{id:'remove_module',class:'componentBlock',css: {'background-image':'url(content/images/remove20.png)'},title: 'Remove module'}));	
}

SCG2.modeller.is2x2Possible = function(module){
	return SCG2.modeller.isSquare(module) && 
		(module.connectionInnerLinks.right instanceof SCG2.Module.Module && SCG2.modeller.isSquare(module.connectionInnerLinks.right) && module.connectionInnerLinks.right.component == undefined) && 
		(module.connectionInnerLinks.below instanceof SCG2.Module.Module && SCG2.modeller.isSquare(module.connectionInnerLinks.below) && module.connectionInnerLinks.below.component == undefined) && 
		(module.connectionInnerLinks.below.connectionInnerLinks.right instanceof SCG2.Module.Module && SCG2.modeller.isSquare(module.connectionInnerLinks.below.connectionInnerLinks.right) && module.connectionInnerLinks.below.connectionInnerLinks.right.component == undefined);
}

SCG2.modeller.isSquare = function(module){
	if(!module.connectionInnerLinks){ return false; }
	return !(module.connectionInnerLinks.left | module.connectionInnerLinks.right | module.connectionInnerLinks.above | module.connectionInnerLinks.below);
}

SCG2.modeller.showNotifications = function(){
	var message = 
		{ 
			noModules: {message:'No modules added', state: 'fatal', show: (SCG2.modeller.go.modules.length == 0)},
			commandRoom:{message:'No command room', state: 'fatal', show: !SCG2.modeller.go.stats.commandRoom || SCG2.modeller.go.stats.commandRoom == 0},
			disconnected:{message:'Modules disconnected', state: 'fatal',show: SCG2.modeller.go.stats.disconnectedModules},
			thruster:{message:'Ship is static', state: 'warning',show: !SCG2.modeller.go.stats.speed},
			restrictionIntersections:{message:'Some modules in restriction zones', state: 'fatal',show: SCG2.modeller.go.stats.modulesInRestictedZones},
		};

	var rowShiftY = 40;
	for (var m in message) {
        if (message.hasOwnProperty(m) && message[m].show) {
            SCG2.context.save();  

			SCG2.context.fillStyle = message[m].state == 'fatal'?"red": message[m].state == 'warning'? "yellow": 'green' ;
			SCG2.context.font = "28px serif";
			SCG2.context.fillText(message[m].message, 20, rowShiftY);
			SCG2.context.restore(); 
			rowShiftY+=30;
        }
    }
}

SCG2.modeller.findDisconnectedModules = function(){
	if(SCG2.modeller.go.modules.length <= 1){ return; }
	var disconnectedModules = [];
	this.checkedModules = [];

	this.internal = function(module){
		if(this.checkedModules.indexOf(module.id) != -1){
			return;
		}
		
		if(!module.connectionInnerLinks)
		{
			return;
		}

		this.checkedModules.push(module.id);
		
		if(module.connectionInnerLinks.left instanceof SCG2.Module.Module) {
			this.internal(module.connectionInnerLinks.left);
		}
		if(module.connectionInnerLinks.right instanceof SCG2.Module.Module) {
			this.internal(module.connectionInnerLinks.right);	
		}
		if(module.connectionInnerLinks.above instanceof SCG2.Module.Module) {
			this.internal(module.connectionInnerLinks.above);
		}
		if(module.connectionInnerLinks.below instanceof SCG2.Module.Module) {
			this.internal(module.connectionInnerLinks.below);
		}
	}

	this.internal(SCG2.modeller.go.modules[SCG2.modeller.go.modules.length-1]);
	for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {	
		if(SCG2.modeller.go.modules[i].connectionOuterLink!==undefined){ continue; }
		var moduleFound = false;
		for (var j = this.checkedModules.length - 1; j >= 0; j--) {
			if(SCG2.modeller.go.modules[i].id == this.checkedModules[j])
			{
				moduleFound = true;
				break;
			}
		};
		if(!moduleFound){
			disconnectedModules.push(SCG2.modeller.go.modules[i].id)
		}
	};

	SCG2.modeller.go.stats.disconnectedModules = disconnectedModules.length > 0;
}

SCG2.modeller.restrictionPoligonMouseInteractions = function(module){
	if(!module.clamps){
		return;
	}
	var mp = SCG2.gameControls.mousestate.position.substract(new Vector2(SCG2.battlefield.default.width/2,SCG2.battlefield.default.height/2),true);
	var rp = module.restrictionPoligon.clone();
	rp.update(module.position, module.angle);
	var degreeAngle = radiansToDegree(module.angle);
	var distance = undefined;
	var ms = SCG2.gameControls.mousestate;
	// if(SCG2.gameControls.keyboardstate.altPressed)
	// {
	// 	debugger;
	// }

	if(isBetween(mp.x,rp.vertices[0].x, rp.vertices[1].x) 
			&& isBetween(mp.y,rp.vertices[0].y, rp.vertices[1].y))
	{
		distance = { 
			endpointIndex: 1, 
			length: distToSegment(mp, rp.vertices[0], rp.vertices[1])
		};
	}

	if(isBetween(mp.x,rp.vertices[0].x, rp.vertices[2].x) 
			&& isBetween(mp.y,rp.vertices[0].y, rp.vertices[2].y))
	{
		var _distance = 
		{ 
			endpointIndex: 2, 
			length: distToSegment(mp, rp.vertices[0], rp.vertices[2])
		};

		if((distance && distance.length > _distance.length) || distance == undefined){
			distance = _distance;
		}
	}

	if(distance && distance.length < 10){
		var shiftInrads = undefined;
		module.restrictionPoligon.renderOptions.fillStyle = 'rgba(255, 0, 0, 0.5)';
		$(SCG2.canvas).css({'cursor': 'move'});

		if(ms.leftButtonDown && !ms.delta.equal(new Vector2)){
			var clamps = { min: module.clamps.min, max: module.clamps.max};
			var increase = false;
			var decrease = false;
			if(isBetween(degreeAngle,-45,45)){
				if(ms.delta.x != 0){
					shiftInrads = degreeToRadians(ms.delta.x)
				}
			}
			else if(isBetween(degreeAngle,45,135)){
				if( ms.delta.y != 0){
					shiftInrads = degreeToRadians(ms.delta.y)
				}
			} if((isBetween(degreeAngle,135,225) || isBetween(degreeAngle,-135,-225))){
				if(ms.delta.x != 0){
					shiftInrads = degreeToRadians(ms.delta.x)
				}
			} if(isBetween(degreeAngle,-45,-135)){
				if( ms.delta.y != 0){
					shiftInrads = -degreeToRadians(ms.delta.y)
				}
			}

			if(shiftInrads){

			if(distance.endpointIndex == 1){
				clamps.min+=shiftInrads;
			}
			else if(distance.endpointIndex == 2){
				clamps.max+=shiftInrads;
			}

				module.updateClamps(clamps.min,clamps.max,true);
			}
		}
	}
	else{
		module.restrictionPoligon.resetToDefaults();
		$(SCG2.canvas).css({'cursor': 'default'});
	}
}

SCG2.modeller.updateClamps = function(min, max, inRadians){
	if(inRadians === undefined){
		inRadians = false;
	}
	var _default = (max - min)/2;
	this.clamps = {
		min : inRadians? min : degreeToRadians(min), 
		max : inRadians? max : degreeToRadians(max), 
		default : inRadians? _default : degreeToRadians(_default) };

	var defaultDirection = Vector2.up();

	var center = new Vector2;

	this.restrictionPoligon = new Poligon({ vertices: [
				center,
				defaultDirection.rotate(min,inRadians,false).mul(1000).add(center,true),
				defaultDirection.rotate(max,inRadians,false).mul(1000).add(center,true),
			], renderOptions : { fill: true}});
}
