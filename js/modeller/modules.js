//connectionInnerLinks -> false mean connection is possible

SCG2.modeller.modules = {
	init: function(){
		this.module_internal_square = {
			size: new Vector2(30,30),
			cornerPoints: [new Vector2(-15,-15),new Vector2(15,-15),new Vector2(15,15),new Vector2(-15,15)],
			connectionInnerLinks: { above: false, below: false, left: false, right: false },
			img: SCG2.images.module_internal_square,
		}
		this.module_internal_triangle_bottomLeft = {
			size: new Vector2(30,30),
			cornerPoints: [new Vector2(-15,-15),new Vector2(15,-15),new Vector2(15,15)],
			connectionInnerLinks: { above: false, below: true, left: true, right: false },
			img: SCG2.images.module_internal_triangle_bottomLeft,
		}
		this.module_internal_triangle_bottomRight = {
			size: new Vector2(30,30),
			cornerPoints: [new Vector2(-15,-15),new Vector2(15,-15),new Vector2(-15,15)],
			connectionInnerLinks: { above: false, below: true, left: false, right: true },
			img: SCG2.images.module_internal_triangle_bottomRight,
		}
		this.module_internal_triangle_topLeft = {
			size: new Vector2(30,30),
			cornerPoints: [new Vector2(15,-15),new Vector2(15,15),new Vector2(-15,15)],
			connectionInnerLinks: { above: true, below: false, left: true, right: false },
			img: SCG2.images.module_internal_triangle_topLeft,
		}
		this.module_internal_triangle_topRight = {
			size: new Vector2(30,30),
			cornerPoints: [new Vector2(-15,-15),new Vector2(15,15),new Vector2(-15,15)],
			connectionInnerLinks: { above: true, below: false, left: false, right: true },
			img: SCG2.images.module_internal_triangle_topRight,
		}
	}
	
}