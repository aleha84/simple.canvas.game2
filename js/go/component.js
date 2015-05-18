SCG2.Component = {};

SCG2.Component.Component = function (init) {
	this.addStats = function(){}
	this.removeStats = function(){}
	this.img = undefined;
	this.size = new Vector2(30,30);
	this.componentSize = '';
	if(init!=undefined)
	{
		$.extend(true,this,init);
	}
	this.parents = [];
}