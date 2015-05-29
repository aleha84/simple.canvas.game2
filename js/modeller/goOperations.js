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
					if (SCG2.modeller.go.modules[i].connectionOuterLinks.hasOwnProperty(outerLinkName) && !SCG2.modeller.go.modules[i].connectionOuterLinks[outerLinkName] ) {

						var ph = new SCG2.modeller.PlaceHolder( {position: SCG2.modeller.go.modules[i].position.clone().add(SCG2.modeller.go.modules[i].connectionOuterLinksBase[outerLinkName],true)
							, size: SCG2.modeller.modules[moduleId].size
							, moduleId: moduleId
							, siblings: [{sibling: SCG2.modeller.go.modules[i], siblingDirection: outerLinkName}] 
						});

						var restricted = false;
						for (var j = SCG2.modeller.go.modules.length - 1; j >= 0; j--) {
							if(SCG2.modeller.restrictionCheck(ph, SCG2.modeller.go.modules[j] )){
								restricted = true;
								break;
							}
						}
						if(!restricted){
							phCollection.push(ph);	
						}
						
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

SCG2.modeller.restrictionCheck = function(placeHolder, module){
	if((module.component && module.component.restrictionPoligon) || module.restrictionPoligon)
	{
		var rp = undefined;
		if(module.component && module.component.restrictionPoligon){
			rp = module.component.restrictionPoligon.clone();
		}
		else if(module.restrictionPoligon)
		{
			rp = module.restrictionPoligon.clone();
		}
		rp.update(module.position, module.angle);
		return rp.isPointInside(placeHolder.position)
			|| rp.isPointInside(placeHolder.absoluteBox.topLeft) 
			|| rp.isPointInside(placeHolder.absoluteBox.topRight) 
			|| rp.isPointInside(placeHolder.absoluteBox.bottomLeft)
			|| rp.isPointInside(placeHolder.absoluteBox.bottomRight);
	}

	return false;
}

SCG2.modeller.checkPlaceHolderExistenceByPosition = function(placeHolder, phCollection){
	for (var i = SCG2.modeller.go.modules.length - 1; i >= 0; i--) {
		if(placeHolder.position.x >= SCG2.modeller.go.modules[i].position.x - SCG2.modeller.go.modules[i].size.x/2 && placeHolder.position.x <= SCG2.modeller.go.modules[i].position.x + SCG2.modeller.go.modules[i].size.x/2 &&
		placeHolder.position.y >= SCG2.modeller.go.modules[i].position.y - SCG2.modeller.go.modules[i].size.y/2 && placeHolder.position.y <= SCG2.modeller.go.modules[i].position.y + SCG2.modeller.go.modules[i].size.y/2)
		{
			return;
		}

		if(SCG2.modeller.restrictionCheck(placeHolder, SCG2.modeller.go.modules[i] )){ 
			return; 
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
	var isInternal = currentPlaceHolder.moduleId.indexOf('internal') != -1;
	var module = new SCG2.Module.Module($.extend(true,{position:currentPlaceHolder.position},SCG2.modeller.modules[currentPlaceHolder.moduleId]));
	var clamps = {min : 0, max: 0, default : 0 } //degreeToRadians
	var defaultDirection = undefined;
	if(currentPlaceHolder.siblings !== undefined){
		for (var i = currentPlaceHolder.siblings.length - 1; i >= 0; i--) {
			
			switch(currentPlaceHolder.siblings[i].siblingDirection){ 
				case 'above':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.above = module;
					if(isInternal){
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.above = true;
						module.connectionInnerLinks.below = currentPlaceHolder.siblings[i].sibling;	
						module.connectionOuterLinks.below = true;
					}
					else{
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.above = module;
						module.connectionOuterLink = {below: currentPlaceHolder.siblings[i].sibling};
						clamps = {min : degreeToRadians(-45), max : degreeToRadians(45), default : degreeToRadians(0) };
						defaultDirection = Vector2.up();
					}
					
					break;
				case 'below':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.below = module;
					if(isInternal){
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.below = true;
						module.connectionInnerLinks.above = currentPlaceHolder.siblings[i].sibling;
						module.connectionOuterLinks.above = true;
					}
					else{
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.below = module;
						module.connectionOuterLink = {above: currentPlaceHolder.siblings[i].sibling};
						clamps = {min : degreeToRadians(135), max : degreeToRadians(225), default : degreeToRadians(180) };
						defaultDirection = Vector2.down();
					}
					break;
				case 'left':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.left = module;
					if(isInternal){
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.left = true;
						module.connectionInnerLinks.right = currentPlaceHolder.siblings[i].sibling;
						module.connectionOuterLinks.right = true;
					}
					else{
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.left = module;
						module.connectionOuterLink = {right: currentPlaceHolder.siblings[i].sibling};	
						clamps = {min : degreeToRadians(-135), max : degreeToRadians(-45), default : degreeToRadians(-90) };
						defaultDirection = Vector2.left();
					}
					break;
				case 'right':
					currentPlaceHolder.siblings[i].sibling.connectionInnerLinks.right = module;
					if(isInternal){
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.right = true;
						module.connectionInnerLinks.left = currentPlaceHolder.siblings[i].sibling;
						module.connectionOuterLinks.left = true;
					}
					else{
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.right = module;
						module.connectionOuterLink = {left: currentPlaceHolder.siblings[i].sibling};	
						clamps = {min : degreeToRadians(45), max : degreeToRadians(135), default : degreeToRadians(90) };	
						defaultDirection = Vector2.right();
					}
					break;
				case 'center':
					if(!isInternal){
						currentPlaceHolder.siblings[i].sibling.connectionOuterLinks.center = module;
						module.connectionOuterLink = {center: currentPlaceHolder.siblings[i].sibling};
						var sc = currentPlaceHolder.siblings[i].sibling.connectionOuterLinksBase;
						var nVector = new Vector2;
						if(sc.above.equal(nVector) && sc.left.equal(nVector)) {
							clamps = {min : degreeToRadians(-90), max : degreeToRadians(0), default : degreeToRadians(-45) };	
							defaultDirection = Vector2.up().rotate(-45,false,true);
						} else if(sc.above.equal(nVector) && sc.right.equal(nVector)) {
							clamps = {min : degreeToRadians(0), max : degreeToRadians(90), default : degreeToRadians(45) };	
							defaultDirection = Vector2.up().rotate(45,false,true);
						} else if(sc.below.equal(nVector) && sc.left.equal(nVector)) {
							clamps = {min : degreeToRadians(-180), max : degreeToRadians(-90), default : degreeToRadians(-135) };	
							defaultDirection = Vector2.down().rotate(45,false,true);
						} else if(sc.below.equal(nVector) && sc.right.equal(nVector)) {
							clamps = {min : degreeToRadians(90), max : degreeToRadians(180), default : degreeToRadians(135) };	
							defaultDirection = Vector2.down().rotate(-45,false,true);
						}
					}
				default:
					break;
			}
		};
		
	}

	if(!isInternal){
		module.clamps = clamps;
		module.angle = clamps.default;
		var center = new Vector2;
		defaultDirection = Vector2.up();
		//center.add(defaultDirection.mul(15));
		var rp = new Poligon({ vertices: [
				center,
				defaultDirection.rotate(-45,false,false).mul(100).add(center,true),
				defaultDirection.rotate(45,false,false).mul(100).add(center,true),
			], renderOptions : { fill: true}})
	}
	module.restrictionPoligon = rp;
	SCG2.modeller.go.addModule(module, isInternal);
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
