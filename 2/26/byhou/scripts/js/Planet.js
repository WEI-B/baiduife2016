(function( global , undefined ) {
	
	if ( global.Planet ) {
		throw new Error("Planet 已经初始化过");
	}
	
	/** Planet(radius)
	 *
	 * @description 星球
	 */
	function Planet(radius) {
		this.radius = radius;
		this.time = null;
	}
	
	/** Planet.DOM()
	 * 
	 * @description 设置高度
	 * @TODO 未完成
	 */
	Planet.prototype.DOM = {
		resize: function () {
			
		}
	}
	
	
	global.Planet = new Planet(150);
	
}(this));