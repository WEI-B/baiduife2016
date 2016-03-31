(function(global, undefined) {

	if (global.Planet) {
		throw new Error("Planet 已经初始化过");
	}

	/** Planet(radius)
	 *
	 * @description 星球
	 */
	function Planet(radius) {
		this.radius = radius;		// 地球半径
		this.time = null;			// 当前时间
		this.gravitation = 100;	// 引力
	}

	/** Planet.DOM()
	 * 
	 * @description 设置高度
	 * @TODO 未完成
	 */
	Planet.prototype.resize = function() {
		$('#planet-spaceship .adjust').css('width', (2 * this.radius) + "px").css('height', (2*this.radius) + "px");
	}


	global.Planet = new Planet(80);

	$(document).ready(function() {
		global.Planet.resize();
	});

} (this));