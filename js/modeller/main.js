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
					var module = new SCG2.Module.Module($.extend(true,{position:SCG2.modeller.currentPlaceHolder.position},SCG2.modeller.modules[SCG2.modeller.currentPlaceHolder.moduleId]));
					if(SCG2.modeller.currentPlaceHolder.siblings !== undefined){
						for (var i = SCG2.modeller.currentPlaceHolder.siblings.length - 1; i >= 0; i--) {
							
							switch(SCG2.modeller.currentPlaceHolder.siblings[i].siblingDirection){
								case 'above':
									SCG2.modeller.currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.above = module;
									module.connectionInnerLinks.below = SCG2.modeller.currentPlaceHolder.siblings[i].sibling;
									break;
								case 'below':
									SCG2.modeller.currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.below = module;
									module.connectionInnerLinks.above = SCG2.modeller.currentPlaceHolder.siblings[i].sibling;
									break;
								case 'left':
									SCG2.modeller.currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.left = module;
									module.connectionInnerLinks.right = SCG2.modeller.currentPlaceHolder.siblings[i].sibling;
									break;
								case 'right':
									SCG2.modeller.currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.right = module;
									module.connectionInnerLinks.left = SCG2.modeller.currentPlaceHolder.siblings[i].sibling;
									break;
								default:
									break;
							}
						};
						
					}
					SCG2.modeller.go.addModule(module);
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
		},
	},
}

SCG2.modeller.go = [];//new SCG2.GO.GO({direction: new Vector2.up()});
SCG2.modeller.currentPlaceHolder = undefined;
SCG2.modeller.selectedModule = {
	module: undefined,
	unselect: function(){
		if(this.module){
			this.module.selected = false,
			this.module = undefined;	
		}
		
	},
	select: function(module){
		this.unselect();
		this.module = module;
		this.module.selected = true;
	}
};
SCG2.modeller.showDialog = function(){
	SCG2.gameControls.scale.reset();
	SCG2.gameControls.disableControlsEvents();
	SCG2.modeller.options.initControlsEvents();

	SCG2.modeller.go = new SCG2.GO.GO({direction: new Vector2.up()});
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

	var panel = $('<div/>',{id:'modulesSelectPanel', css: {left: (SCG2.battlefield.default.width + 8) + 'px'}});
	panel.append($('<div/>',{id:'module_internal_square',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_square.png)'}}));
	panel.append($('<div/>',{id:'module_internal_triangle_bottomLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomLeft.png)'}}));
	panel.append($('<div/>',{id:'module_internal_triangle_bottomRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_bottomRight.png)'}}));
	panel.append($('<div/>',{id:'module_internal_triangle_topLeft',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topLeft.png)'}}));
	panel.append($('<div/>',{id:'module_internal_triangle_topRight',class:'moduleBlock',css: {'background-image':'url(content/images/module_internal_triangle_topRight.png)'}}));

	panel.on('click','.moduleBlock',function(e){
		SCG2.modeller.panelBlockSelect(e);
	});
	SCG2.modeller.panel = panel;
	body.append(panel);

}

SCG2.modeller.panelBlockSelect = function(event){
	SCG2.modeller.options.moduleAdding = true;
	SCG2.modeller.selectedModule.unselect();
	SCG2.nonplayableGo = [];
	SCG2.modeller.panel.find('.moduleBlock').removeClass('selected');
	var ct = $(event.currentTarget);
	ct.addClass('selected');
	var moduleId = ct.attr('id');
	if(SCG2.modeller.go.modules.length == 0){
		var ph = new SCG2.modeller.PlaceHolder({position: new Vector2, size: SCG2.modeller.modules[moduleId].size, moduleId: moduleId});
		SCG2.nonplayableGo.push(ph);
	}
	else{
		for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {
			if(SCG2.modeller.go.modules[i].connectionInnerLinks) {
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.above && !SCG2.modeller.modules[moduleId].connectionInnerLinks.below){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().substract(new Vector2(0,SCG2.modeller.go.modules[i].size.y/2 + SCG2.modeller.modules[moduleId].size.y/2),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'above'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.below && !SCG2.modeller.modules[moduleId].connectionInnerLinks.above){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().add(new Vector2(0,SCG2.modeller.go.modules[i].size.y/2 + SCG2.modeller.modules[moduleId].size.y/2),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'below'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.left && !SCG2.modeller.modules[moduleId].connectionInnerLinks.right){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().substract(new Vector2(SCG2.modeller.go.modules[i].size.x/2 + SCG2.modeller.modules[moduleId].size.x/2,0),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'left'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.right && !SCG2.modeller.modules[moduleId].connectionInnerLinks.left){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().add(new Vector2(SCG2.modeller.go.modules[i].size.x/2 + SCG2.modeller.modules[moduleId].size.x/2,0),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'right'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph);
				}
			}
		};
	}

		
	// switch(ct.attr('id'))
	// {
	// 	default:
	// 		break;
	// }
}

SCG2.modeller.checkPlaceHolderExistenceByPosition = function(placeHolder){
	for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {
		if(placeHolder.position.x >= SCG2.modeller.go.modules[i].position.x - SCG2.modeller.go.modules[i].size.x/2 && placeHolder.position.x <= SCG2.modeller.go.modules[i].position.x + SCG2.modeller.go.modules[i].size.x/2 &&
		placeHolder.position.y >= SCG2.modeller.go.modules[i].position.y - SCG2.modeller.go.modules[i].size.y/2 && placeHolder.position.y <= SCG2.modeller.go.modules[i].position.y + SCG2.modeller.go.modules[i].size.y/2)
		{
			return;
		}
	};

	for (var i = SCG2.nonplayableGo.length - 1; i >= 0; i--) {
		if(SCG2.nonplayableGo[i].position.equal(placeHolder.position) && placeHolder.siblings.length > 0){
			SCG2.nonplayableGo[i].siblings.push(placeHolder.siblings[0]);
			return;
		}
	};

	SCG2.nonplayableGo.push(placeHolder);
}
