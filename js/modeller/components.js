SCG2.modeller.components = {
	init: function(){
		this.command_Room = {
			size: new Vector2(30,30),
			addStats: function(stats){
				if(stats.commandRoom === undefined){
					stats.commandRoom = 1;
				}
				else{
					if(stats.commandRoom < 0) {stats.commandRoom = 0;}
					stats.commandRoom++;	
				}
			},
			removeStats:function(stats){
				if(stats.commandRoom === undefined){
					stats.commandRoom = 0;
				}
				else{
					stats.commandRoom--;	
					if(stats.commandRoom < 0) {stats.commandRoom = 0;}
				}
			},
			img: SCG2.images.component_commandRoom,
		}
		this.small_Thruster = {
			size: new Vector2(30,30),
			addStats: function(stats){
				if(stats.speed === undefined){
					stats.speed = 1;
				}
				else{
					if(stats.speed < 0) {stats.speed = 0;}
					stats.speed++;	
				}
			},
			removeStats:function(stats){
				if(stats.speed === undefined){
					stats.speed = 0;
				}
				else{
					stats.speed--;	
					if(stats.speed < 0) {stats.speed = 0;}
				}
			},
			img: SCG2.images.component_smallThruster,
		}
		
	}
	
}