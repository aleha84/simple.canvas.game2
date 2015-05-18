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
	},
	disableControlsEvents: function(){
		$(SCG2.canvas).off();
	},
	controls: {
		mouseMove:function(event){
			SCG2.modeller.currentPlaceHolder = undefined;
			absorbTouchEvent(event);
			var posX = $(SCG2.canvas).offset().left, posY = $(SCG2.canvas).offset().top;
			var eventPos = pointerEventToXY(event);
			SCG2.gameControls.mousestate.position = new Vector2(eventPos.x - posX,eventPos.y - posY);
		},
		mouseOut:function(event){
			//SCG2.gameControls.mousestate.position = undefined;
		},
		mouseUp: function(event){
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
SCG2.modeller.restrictionLines = [];
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
		if(SCG2.modeller.selectedModule.module.connectionInnerLinks.left instanceof SCG2.Module.Module) {
			SCG2.modeller.selectedModule.module.connectionInnerLinks.left.connectionInnerLinks.right = false;
		}
		if(SCG2.modeller.selectedModule.module.connectionInnerLinks.right instanceof SCG2.Module.Module) {
			SCG2.modeller.selectedModule.module.connectionInnerLinks.right.connectionInnerLinks.left = false;
		}
		if(SCG2.modeller.selectedModule.module.connectionInnerLinks.above instanceof SCG2.Module.Module) {
			SCG2.modeller.selectedModule.module.connectionInnerLinks.above.connectionInnerLinks.below = false;
		}
		if(SCG2.modeller.selectedModule.module.connectionInnerLinks.below instanceof SCG2.Module.Module) {
			SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionInnerLinks.above = false;
		}
		SCG2.modeller.selectedModuleComponentRemove();
		SCG2.modeller.go.removeModule(SCG2.modeller.selectedModule.module);
		SCG2.modeller.findDisconnectedModules();
	}
	else if(componentId == 'remove_component'){
		SCG2.modeller.selectedModuleComponentRemove();
	}
	else if(componentId != ''){
		var id = ct.attr('id');
		var size = ct.attr('componentSize');
		var component = undefined;
		if(size!=undefined){
			id = id.replace('_'+size,'');
			component = new SCG2.Component.Component(SCG2.modeller.components[id]);
			if(size == '2x'){
				component.componentSize = size;
				SCG2.modeller.selectedModule.module.addComponent(component,0);
				SCG2.modeller.selectedModule.module.connectionInnerLinks.right.addComponent(component,1);
				SCG2.modeller.selectedModule.module.connectionInnerLinks.below.addComponent(component,2);
				SCG2.modeller.selectedModule.module.connectionInnerLinks.below.connectionInnerLinks.right.addComponent(component,3);
			}
		}
		else{
			SCG2.modeller.selectedModule.module.addComponent(new SCG2.Component.Component(SCG2.modeller.components[id]));
		}
		
	}

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
	SCG2.modeller.panel.append($('<div/>',{id:'module_internal_square',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_square.png)'}}));
	SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_bottomLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomLeft.png)'}}));
	SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_bottomRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomRight.png)'}}));
	SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_topLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topLeft.png)'}}));
	SCG2.modeller.panel.append($('<div/>',{id:'module_internal_triangle_topRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topRight.png)'}}));
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
		        			id:componentName + '_2x',
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
					SCG2.modeller.panel.append($('<div/>',{id:componentName,class:'componentBlock',css: {'background-image':'url('+SCG2.modeller.components[componentName].img.src+')'},title: SCG2.modeller.components[componentName].title}));					
				}
			}

			// SCG2.modeller.panel.append($('<div/>',{id:'command_Room',class:'componentBlock',css: {'background-image':'url('+SCG2.modeller.components[componentName].img.src+')'},title: 'Command room'}));
			// //below should be free
			// if(SCG2.modeller.selectedModule.module.connectionInnerLinks.below == false){
			// 	SCG2.modeller.panel.append($('<div/>',{id:'small_Thruster',class:'componentBlock',css: {'background-image':'url(content/images/smallThruster.png)'},title: 'Small thruster'}));
			// }
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
	return !(module.connectionInnerLinks.left | module.connectionInnerLinks.right | module.connectionInnerLinks.above | module.connectionInnerLinks.below);
}

SCG2.modeller.showNotifications = function(){
	var message = 
		{ 
			noModules: {message:'No modules added', state: 'fatal', show: (SCG2.modeller.go.modules.length == 0)},
			commandRoom:{message:'No command room', state: 'fatal', show: !SCG2.modeller.go.stats.commandRoom || SCG2.modeller.go.stats.commandRoom == 0},
			disconnected:{message:'Modules disconnected', state: 'fatal',show: SCG2.modeller.go.stats.disconnectedModules},
			thruster:{message:'Ship is static', state: 'warning',show: !SCG2.modeller.go.stats.speed},
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

	this.internal(SCG2.modeller.go.modules[0]);
	for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {			
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
