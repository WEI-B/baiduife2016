(function(global, undefined) {

	if (global.SpaceShip) {
		throw new Error("SpaceShip 已经初始化过");
	}

	var Config = {
		speed: 40,			// 速度 s
		state: "stop",

		position: {
			height: 100,		// 距离地面高度 px
			rotate: "0"			// 旋转角度 deg
		},

		height: 40,				// 飞船高度

		energy: 100,				// 初始能量
		energy_consume: 0.2,		// 能耗 保留2位小数
		energy_recharge: 0.1		// 充能
	};

	var SpaceShipNum = 0;
	var SpaceShipList = {};

	/** SpaceShip( speed , mediums [, options ])
	 *
	 * @description 飞船类
	 * 
	 * @param id      String   飞船编号
	 * @param medium  Object   [{ medium ,    eventList    }...]
	 *                            object      array[str]
	 *                            介质对象    可以监听的介质事件
	 * 
	 * @param options Object   额外选项
	 * 
	 * 		energy_consume  Function  能耗公式
	 * 						Arguments speed   INT 速度
	 * 						Return    每秒消耗的能量
	 *      energy_recharge Function  充能公式
	 *                      Return    每秒补充的太阳能
	 */
	function SpaceShip(id, mediums, options) {

		if (SpaceShipList[id]) {
			var err = new Error("SpaceShip has exit!");
			err.code = 1;
			throw err;
		} else if (SpaceShipNum >= 4) {
			var err = new Error("Too Much SpaceShip");
			err.code = 2;
			throw err;
		}

		options = options || {};

		// 初始化飞船属性
		this.id = id;
		this.position = {
			height: Config.position.height,
			rotate: Config.position.rotate
		};
		this.height = options.height || Config.height;

		this.speed = options.speed || Config.speed;		// 速度
		this.energy = options.energy || Config.energy;	// 能量
		this.state = options.state || Config.state;		// 状态
		this.energy_consume = options.energy_consume || Config.energy_consume;	// 能量公式
		this.energy_recharge = options.energy_recharge || Config.energy_recharge;	// 充能速率

		this.commandList = [];

		/** SpaceShip.receiver( cmd )
 		 * 
 		 * @description 信号接收器
 		 */
		this.receiver = function(cmd, medium) {

			cmd = cmdAdapter.uncode(medium, cmd);

			// 忽略旧指令和已之行过的指令
			if (this.commandList.length && parseInt(cmd.command_id) <= this.commandList[0]) {
				return;
			}
			this.commandList.unshift(parseInt(cmd.command_id));

			if (cmd.id === this.id) {
				console.log(this.id + ":" + "收到指令");

				if (cmd.command & Command.List.run) {
					this.run();
				} else if (cmd.command & Command.List.stop) {
					this.stop();
				} else if (cmd.command & Command.List.destroy) {
					this.selfDestroy();
				} else {

				}
			}

		};



		var interval = this.sendMsg();

		this.selfDestroy = function() {
			this.state = "destroy";
			clearInterval(interval);

			SpaceShipNum--;
			this.DOM.selfDestroy.call(this);
			delete SpaceShipList[this.id];

			return this;
		};

		// 为飞船绑定监听器
		for (var key in mediums) {

			var medium = mediums[key].medium;
			var eventList = mediums[key].eventList;

			if ((Object.prototype.toString.call(eventList) !== "[object Array]") || !(medium instanceof BaseMedium)) {
				var err = new Error("错误的事件或介质");
				err.code = 3;
				throw err;
			}

			for (var i in eventList) {

				eventName = typeof eventList[i] === "string" ? eventList[i] : "Event Name Should Be String";

				if (medium.MessageStyle[eventName]) {
					medium.on(eventName, medium, this.receiver, this);


					// 自毁程序
					var destroyFun = this.selfDestroy;

					this.selfDestroy = function() {
						medium.off(eventName, this.receiver);
						destroyFun.call(this);
					}
				}
				else {
					console.warn(medium.name + "介质不存在事件：" + eventList[i]);
				}
			}
		}

		this.DOM.newShip.call(this);

		// 添加一个SpaceShip
		SpaceShipNum++;
		SpaceShipList[id] = this;
		return this;
	}


	/** SpaceShip.stop()
	 * 
	 * @description 停止
	 */
	SpaceShip.prototype.stop = function() {
		this.state = "stop";
	};

	/** SpaceShip.run()
	 * 
	 * @description 运动
	 */
	SpaceShip.prototype.run = function() {
		this.state = "run";
	};

	/** SpaceShip.getMsg()
	 * 
	 * @description 定时发送给地面信息
	 */
	SpaceShip.prototype.sendMsg = function() {

		var self = this;

		return setInterval(function() {
			BUS.sendMessage("to_director", cmdAdapter.code("BUS", new Command(self.id, [self.state], { energy: self.energy })));
		}, 1000);
	};


	SpaceShip.prototype.DOM = {
		newShip: function() {

			var li = "<li class=\"spaceship " + this.id + "\">" +
				"<p><span class=\"name\">" + this.id + "</span><br/><span class=\"energy\">" + this.energy + "%</span></p>" +
				"</li>";


			this.position.height = (this.speed * this.speed) / Planet.gravitation - Planet.radius;

			if (this.position.height < 0) {
				throw new Error("飞船速度不足，无法起飞");
			}

			this.position.height += this.height;

			$('#planet-spaceship .spaceship-list').append(li);
			var ship = $('#planet-spaceship .spaceship-list .' + this.id);
			ship.css('top', -this.position.height + "px").css('transform-origin', '50% ' + (this.position.height + Planet.radius) + "px");
		}
		, selfDestroy: function() {
			$("#planet-spaceship .spaceship-list ." + this.id).remove();
		}
	};


	// About Animation
	/** SpaceShip.renderAnimationFrame()
	 * 
	 * @description 每一帧渲染
	 * 
	 * @param time 时间差 ms
	 */
	SpaceShip.prototype.renderAnimationFrame = function(time) {
		time = time / 1000;

		if (this.state === "run" && this.energy > 0) {

			// 通过速度计算旋转角度
			var r = Planet.radius + this.position.height;

			var deg = (this.speed * time * 180) / (Math.PI * r);

			var energy_consume = typeof this.energy_consume === "function" ? this.energy_consume(this, time) : (this.energy_consume * time);

			// 耗能
			if (this.energy < energy_consume) {
				deg = (this.energy * deg) / energy_consume;
				this.energy = 0;
				this.stop();
			} else {
				this.energy = Math.round((this.energy - energy_consume) * 100) / 100;
			}

			this.position.rotate = Math.round((this.position.rotate + deg) * 1000) / 1000;
			$("#planet-spaceship .spaceship-list ." + this.id).css("transform", "rotate(" + this.position.rotate + "deg)");

		}

		if (this.energy < 100) {
			// 充能
			var energy_recharge = typeof this.energy_recharge === "function" ? this.energy_recharge(this, time) : (this.energy_recharge * time);
			this.energy = Math.round((this.energy + energy_recharge) * 100) / 100;

			if (this.energy > 100) {
				this.energy = 100;
			}
		}

		$("#planet-spaceship .spaceship-list ." + this.id + " .energy").html(this.energy.toFixed(2) + "%");
	};

	SpaceShip.renderAnimationFrame = function(time) {
		for (var key in SpaceShipList) {
			SpaceShipList[key].renderAnimationFrame(time);
		}
	}



	// 动力系统
	SpaceShip.PowerPart = {
		advance: { speed: 100, energy_consume: 6 },
		gallop: { speed: 150, energy_consume: 7 },
		surpass: { speed: 180, energy_consume: 8 }
	};

	// 能源系统
	SpaceShip.EnergyPart = {
		tradition: 2,
		light: 4,
		nuclear: 6
	};

	global.SpaceShip = SpaceShip;
} (this));