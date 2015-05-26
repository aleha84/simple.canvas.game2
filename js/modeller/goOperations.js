// methos for go createion programmatically

SCG2.modeller.placeHolderCreation = function(moduleId, phCollection){
	if(!isArray(phCollection)){
		throw 'SCG2.modeller.placeHolderCreation -> phCollection should be array!';
	}
	var isInternal = moduleId.indexOf('internal') != -1;


	if(SCG2.modeller.go.modules.length == 0 && isInternal){
		var ph = new SCG2.modeller.PlaceHolder({position: new Vector2, size: SCG2.modeller.modules[moduleId].size, moduleId: moduleId});
		phCollection.push(ph);
	}
	else{
		for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {
			if(isInternal && SCG2.modeller.go.modules[i].connectionInnerLinks) {
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.above && !SCG2.modeller.modules[moduleId].connectionInnerLinks.below){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().substract(new Vector2(0,SCG2.modeller.go.modules[i].size.y/2 + SCG2.modeller.modules[moduleId].size.y/2),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'above'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph, phCollection);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.below && !SCG2.modeller.modules[moduleId].connectionInnerLinks.above){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().add(new Vector2(0,SCG2.modeller.go.modules[i].size.y/2 + SCG2.modeller.modules[moduleId].size.y/2),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'below'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph, phCollection);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.left && !SCG2.modeller.modules[moduleId].connectionInnerLinks.right){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().substract(new Vector2(SCG2.modeller.go.modules[i].size.x/2 + SCG2.modeller.modules[moduleId].size.x/2,0),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'left'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph, phCollection);
				}
				if(!SCG2.modeller.go.modules[i].connectionInnerLinks.right && !SCG2.modeller.modules[moduleId].connectionInnerLinks.left){
					var ph = new SCG2.modeller.PlaceHolder({position: SCG2.modeller.go.modules[i].position.clone().add(new Vector2(SCG2.modeller.go.modules[i].size.x/2 + SCG2.modeller.modules[moduleId].size.x/2,0),true)
						, size: SCG2.modeller.modules[moduleId].size
						, moduleId: moduleId
						, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: 'right'}] 
					});
					SCG2.modeller.checkPlaceHolderExistenceByPosition(ph, phCollection);
				}
			}
			else if(!isInternal && SCG2.modeller.go.modules[i].connectionOuterLinks){
				for (var outerLinkName in SCG2.modeller.go.modules[i].connectionOuterLinks) {
					if (SCG2.modeller.go.modules[i].connectionOuterLinks.hasOwnProperty(outerLinkName) && SCG2.modeller.go.modules[i].connectionOuterLinks[outerLinkName] instanceof Vector2) {
						var siblingDirection = "";
						switch(outerLinkName)
						{
							case 'above':
								siblingDirection = 'below';
								break;
							case 'below':
								siblingDirection = 'above';
								break;
							case 'left':
								siblingDirection = 'right';
								break;
							case 'right':
								siblingDirection = 'left';
								break;
							default: 
								break;
						}

						var ph = new SCG2.modeller.PlaceHolder( {position: SCG2.modeller.go.modules[i].position.clone().add(SCG2.modeller.go.modules[i].connectionOuterLinks[outerLinkName],true)
							, size: SCG2.modeller.modules[moduleId].size
							, moduleId: moduleId
							, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: siblingDirection}] 
						});

						phCollection.push(ph);
					}
				}
			}
			// if(SCG2.modeller.go.modules[i].component && SCG2.modeller.go.modules[i].component.restrictionPoligon)
			// {
			// 	phCollection.push()
			// }
		};
	}
}

SCG2.modeller.checkPlaceHolderExistenceByPosition = function(placeHolder, phCollection){
	for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {
		if(placeHolder.position.x >= SCG2.modeller.go.modules[i].position.x - SCG2.modeller.go.modules[i].size.x/2 && placeHolder.position.x <= SCG2.modeller.go.modules[i].position.x + SCG2.modeller.go.modules[i].size.x/2 &&
		placeHolder.position.y >= SCG2.modeller.go.modules[i].position.y - SCG2.modeller.go.modules[i].size.y/2 && placeHolder.position.y <= SCG2.modeller.go.modules[i].position.y + SCG2.modeller.go.modules[i].size.y/2)
		{
			return;
		}

		if(SCG2.modeller.go.modules[i].component && SCG2.modeller.go.modules[i].component.restrictionPoligon)
		{
			var rp = SCG2.modeller.go.modules[i].component.restrictionPoligon.clone();
			rp.update(SCG2.modeller.go.modules[i].position);
			if(rp.isPointInside(placeHolder.position))
			{
				return;
			}
		}
			
	};

	for (var i = phCollection.length - 1; i >= 0; i--) {
		if(phCollection[i].position.equal(placeHolder.position) && placeHolder.siblings.length > 0){
			phCollection[i].siblings.push(placeHolder.siblings[0]);
			return;
		}
	};

	phCollection.push(placeHolder);
}

SCG2.modeller.addModule = function(currentPlaceHolder){
	var module = new SCG2.Module.Module($.extend(true,{position:currentPlaceHolder.position},SCG2.modeller.modules[currentPlaceHolder.moduleId]));
	if(currentPlaceHolder.siblings !== undefined){
		for (var i = currentPlaceHolder.siblings.length - 1; i >= 0; i--) {
			
			switch(currentPlaceHolder.siblings[i].siblingDirection){
				case 'above':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.above = module;
					module.connectionInnerLinks.below = currentPlaceHolder.siblings[i].sibling;
					break;
				case 'below':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.below = module;
					module.connectionInnerLinks.above = currentPlaceHolder.siblings[i].sibling;
					break;
				case 'left':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.left = module;
					module.connectionInnerLinks.right = currentPlaceHolder.siblings[i].sibling;
					break;
				case 'right':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.right = module;
					module.connectionInnerLinks.left = currentPlaceHolder.siblings[i].sibling;
					break;
				default:
					break;
			}
		};
		
	}
	SCG2.modeller.go.addModule(module);
	SCG2.modeller.findDisconnectedModules();
}

SCG2.modeller.loadPredefined = function(){
	var loadedModules = [
		{moduleId: 'module_internal_square', position: new Vector2},
		{moduleId: 'module_internal_square', position: new Vector2(0,-30)},
		{moduleId: 'module_internal_square', position: new Vector2(0,30)},
	];

	SCG2.nonplayableGo = [];
	SCG2.go = [];
	SCG2.modeller.go = new SCG2.GO.GO({direction: new Vector2.up()});
	SCG2.modeller.go.position = new Vector2;
	SCG2.modeller.go.angle = 0;

	for(var i = 0;i<loadedModules.length;i++)
	{
		var phCollection = [];
		SCG2.modeller.placeHolderCreation(loadedModules[i].moduleId,phCollection);
		for(var j = 0; j<phCollection.length;j++)
		{
			if(loadedModules[i].position.equal(phCollection[j].position)){
				SCG2.modeller.addModule(phCollection[j]);
				break;
			}
		}
	}

	SCG2.go.push(SCG2.modeller.go);
}
