(function(global, undefined) {
	
	if( global.BaseMedium ) {
		throw new Error("BaseMedium 已经初始化过");
	}
	
	/** BaseMedium([ delay [, fail_probability ]])
	 *
	 * @description 传播介质
	 * 
	 * @param delay INT              延迟 ms
	 * @param fail_probability Float 失败率 0~1
	 */
	function BaseMedium( delay , fail_probability ) {
		
		this.name = "BaseMedium";
		
		this.delay = delay || 1000;
		this.fail_probability = fail_probability || 0.3;
		
		this.listener = {			// 观察者
			all: []
		};
	}
	
	/** BaseMedium.on( eventName [, data ], fun [, thisp ])
	 * 
	 * @description 绑定事件
	 */
	BaseMedium.prototype.on = function ( eventName ) {
		var data = null,fun = null,thisp = null;
		
		if( typeof eventName !== "string" ) {
			throw new TypeError("BaseMedium.on unexpect param");
		} else if( typeof arguments[1] === "function" ) {
			fun = arguments[1];
			thisp = arguments[2] || this;
		} else if( typeof arguments[2] === "function" ) {
			data = arguments[1];
			fun = arguments[2];
			thisp = arguments[3] || this;
		} else {
			throw new TypeError("BaseMedium.on unexpect param");
		}
		
		if( !this.MessageStyle[eventName] ) {
			var err = new Error("Medium cannot send such message!");
			err.code = 1;
			throw err;
		}
		
		if( !this.listener[eventName] ) {
			// 创建事件列表
			this.listener[eventName] = [];
		}
		
		this.listener[eventName].push({
			fun:  fun,
			data: data,
			thisp: thisp
		});
		
	};
	
	/** BaseMedium.off( eventName , fun )
	 * 
	 * @description 解除事件绑定
	 */
	BaseMedium.prototype.off = function ( eventName , fun ) {
		if ( typeof eventName !== 'string' ) {
			throw new TypeError("BaseMedium.off unexpect param");
		}
		
		// 事件不存在
		if( !this.listener[eventName] ) {
			return this;
		}
		
		if( fun ) {
			// 解除事件中的fun方法
			
			var event_list = this.listener[eventName];
			
			for ( var key in event_list ) {
				if( event_list[key].fun === fun ) {
					event_list.splice( key , 1 );
				}
			}
			
		}
		else
		{
			// 解除eventName所有方法
			delete this.listener[eventName];
		}
		
		return this;
	};
	
	/** BaseMedium.trigger( eventName [, data ])
	 * 
	 * @description 触发事件
	 */
	BaseMedium.prototype.trigger = function ( eventName , data ) {
		
		if ( typeof eventName !== 'string' ) {
			throw new TypeError("BaseMedium.trigger unexpect param");
		}
		
		if ( Object.prototype.toString.call(data) !== '[object Array]' ) {
			data = [];
		}
		
		if( !this.MessageStyle[eventName] ) {
			var err = new Error("Medium cannot send such message!");
			err.code = 1;
			throw err;
		}
		
		// 事件不存在
		if( !this.listener[eventName] ) {
			return this;
		}
		
		var event_list = this.listener[eventName];
		
		for ( var key in event_list ) {
			
			if( event_list[key].data ) {
				data.push( event_list[key].data );
			}
			
			event_list[key].fun.apply( event_list[key].thisp , data );
		}
		
	};
	
	/** BaseMedium.sendMessage( style , cmd )
	 * 
	 * @description 传播信息
	 * 
	 * @param style String 类型
	 * @param cmd   Object 命令
	 */
	BaseMedium.prototype.sendMessage = function ( style , cmd ) {
		this.trigger( style , [cmd] );
	};
	
	// 介质的传播信息类型列表
	BaseMedium.prototype.MessageStyle = {
		"to_spaceship": 1,
		"to_director" : 2,
		"two_way"     : 3
	};
	
	global.BaseMedium = BaseMedium;
} (this));

// @codekit-prepend "BaseMedium";

(function(global, undefined) {

	/** Mediator()
	 *
	 * @description Mediator介质
	 */
	function Mediator() {
		this.name = "Mediator";
	};

	Mediator.prototype = new BaseMedium();  // 继承BaseMedium属性

	Mediator.prototype.toSpaceShipMsg = function(cmd) {
		
		this.sendMessage("to_spaceship", cmd);
		
		return this;
	}

	/**Mediator.sendMessage( style , cmd )
	 * 
	 * @description 重写sendMessage方法
	 */
	Mediator.prototype.sendMessage = function ( style , cmd ) {
		
		if( Math.random() > this.fail_probability ) {
			
			var self = this;
			
			setTimeout(function(){
				self.__proto__.__proto__.sendMessage.call( self , style , cmd );
			},this.delay);
			
		}
		else{
			alert("发送失败\n此消息仅仅给你提示而地面控制室并不收到此消息");
		}
		
	};

	Mediator.prototype.MessageStyle = {
		"to_spaceship": 1,		// 只接受此事件
	};

	global.Mediator = new Mediator();
} (this));

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

(function( global , undefined ) {
	
	if( global.Command ) {
		throw new Error("Command 已经初始化过");
	}
	
	var counter = 1;
	
	/** Command( id , command )
	 *
	 * @description 命令类
	 * 
	 * @param id         String 目标编号
	 * @param command    String 命令内容
	 * @param command_id INT    命令唯一标示
	 */
	function Command( id , command ) {
		this.id = id.toString();
		this.command = command;
		
		this.command_id = counter++;
	}
	
	global.Command = Command;
}(this));

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

		this.speed = options.speed || Config.speed;		// 速度
		this.energy = options.energy || Config.energy;	// 能量
		this.state = options.state || Config.state;		// 状态
		this.energy_consume = options.energy_consume || Config.energy_consume;	// 能量公式
		this.energy_recharge = options.energy_recharge || Config.energy_recharge;	// 充能速率

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
					medium.on(eventName, this.receiver, this);
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


	/** SpaceShip.selfDestroy()
	 * 
	 * @description 自毁程序
	 */
	SpaceShip.prototype.selfDestroy = function() {
		SpaceShipNum--;

		this.DOM.selfDestroy.call(this);
		delete SpaceShipList[this.id];

		return this;
	};

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

	/** SpaceShip.receiver( cmd )
	 * 
	 * @description 信号接收器
	 */
	SpaceShip.prototype.receiver = function(cmd) {

		if (cmd.id === this.id) {

			switch (cmd.command) {
				case "stop":
					this.stop();
					break;
				case "run":
					this.run();
					break;
				case "destroy":
					this.selfDestroy();
					break;
				default:
			}
		}

	};


	SpaceShip.prototype.DOM = {
		newShip: function() {
			var li = "<li class=\"spaceship " + this.id + "\">" +
				"<p><span class=\"name\">" + this.id + "</span><br/><span class=\"energy\">" + this.energy + "%</span></p>" +
				"</li>";

			$('#planet-spaceship .spaceship-list').append(li);
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

		if (this.state === "run" && this.energy > 0) {

			// 通过速度计算旋转角度
			var r = Planet.radius + this.position.height;
			time = time / 1000;

			var deg = (this.speed * time * 180) / (Math.PI * r);

			var energy_consume = typeof this.energy_consume === "function" ? this.energy_consume(this, time) : this.energy_consume;

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
			var energy_recharge = typeof this.energy_recharge === "function" ? this.energy_recharge(this, time) : this.energy_recharge;
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

	global.SpaceShip = SpaceShip;
} (this));

// @codekit-prepend "Planet.js";
// @codekit-prepend "Command.js";
// @codekit-prepend "SpaceShip.js";

(function(global, undefined) {

	var Director = {

		// 控制中心飞船列表
		shipList: {}

		/** addShip( medium_1 [, medium_2 [, medium_3...]] )
		 * 
		 * @description 添加一个飞船
		 * 
		 * @param arguments 飞船可以监听的通信介质
		 * @param medium Object { medium ,    eventList    }
		 *                        object      array[str]
		 *                       介质对象    可以监听的介质事件
		 */
		, addShip: function() {

			if (arguments.length < 1) {
				throw new TypeError("至少有一个通信介质，否则无法通信");
			}

			var mediums = Array.prototype.slice.call(arguments, 0);
			var id = getUniqueId();
			
			// 创建一个新飞船
			try {
				this.shipList[id] = new SpaceShip(id, mediums);
			} catch (error) {
				if (error.code) {
					switch (error.code) {
						case 1:
							alert('太空中已经存在'+id+'号飞船');
							break;
						case 2:
							alert('太空中已经存在4个飞船');
							break;
					}
				}
				return null;
			}

			this.DOM.addShip(this.shipList[id]);

			return this.shipList[id];
		}

		/** removeShip( id , medium )
		 * 
		 * @description 删除一个飞船
		 * 
		 * @param id INT 飞船编号
		 */
		, removeShip: function(id, medium) {
			if (!medium instanceof BaseMedium) {
				throw new TypeError("medium is not right");
			}
			if (!this.shipList[id]) {
				throw new Error("Don't Exist SpaceShip of " + id);
			}

			this.sendComment(new Command(id, "destroy"), medium);
			
			this.DOM.removeShip(id);
			delete this.shipList[id];
			
			return this;
		}

		/** stopShip( id , medium )
		 * 
		 * @description 停止一个飞船
		 * 
		 * @param id INT 飞船编号
		 */
		, stopShip: function(id, medium) {
			if (!medium instanceof BaseMedium) {
				throw new TypeError("medium is not right");
			}
			if (!this.shipList[id]) {
				throw new Error("Don't Exist SpaceShip of " + id);
			}

			this.sendComment(new Command(id, "stop"), medium);
			this.DOM.stopShip(id);
			return this;
		}

		/** runShip( id , medium )
		 * 
		 * @description 使飞船飞行
		 * 
		 * @param id INT 飞船编号
		 */
		, runShip: function(id, medium) {
			if (!medium instanceof BaseMedium) {
				throw new TypeError("medium is not right");
			}
			if (!this.shipList[id]) {
				throw new Error("Don't Exist SpaceShip of " + id);
			}

			this.sendComment(new Command(id, "run"), medium);
			this.DOM.runShip(id);
			return this;
		}

		/** sendComment
		 * 
		 * @description 发送命令
		 */
		, sendComment: function(cmd, medium) {
			medium.sendMessage("to_spaceship", cmd);
			return this;
		}

		, DOM: {
			addShip: function(ship) {

				var li = "<li class=\"spaceship " + ship.id + "\" data-id=\"" + ship.id + "\">" +
					"<h6>飞船-<span class='name'>" + ship.id + "</span>-<span class='state'>" + ship.state + "</span></h6>" +
					"<div class=\"btn-grp\">" +
					"<button type=\"button\" class='fly'>飞行</button>" +
					"<button type=\"button\" class='stop'>停止</button>" +
					"<button type=\"button\" class='destroy'>销毁</button>" +
					"</div>" +
					"</li>";

				$("#director .spaceship-list").append(li);
			}

			, runShip: function(id) {
				$("#director .spaceship-list ." + id + " .state").html("run");
			}
			, stopShip: function(id) {
				$("#director .spaceship-list ." + id + " .state").html("stop");
			}
			
			, removeShip: function(id) {
				$("#director .spaceship-list ." + id ).remove();
			}
		}
	};

	/** getUniqueId
	 * 
	 * @description 获取唯一编码
	 */
	function getUniqueId() {
		return new Date().getTime().toString();
	}

	global.Director = Director;
} (this));

// @codekit-prepend "Mediator";
// @codekit-prepend "Director";


$(document).ready(function() {
	var AnimationId = null;

	/** step()
	 *
	 * @description 一帧动画
	 */
	function step( time ) {
		
		if( !Planet.time ) {
			Planet.time = time;
		}
		else {
			SpaceShip.renderAnimationFrame( time - Planet.time );
			Planet.time = time;
		}
		
		AnimationId = requestAnimationFrame(step);
	}
	
	AnimationId = requestAnimationFrame(step);
	
	
	$("#director .add-new-ship").click(function(){
		Director.addShip({medium: Mediator , eventList: ["to_spaceship"]});
	});
	
	
	$("#director .spaceship-list").on( "click" , ".fly" , function(){
		var id = $(this).parent().parent().data("id");
		console.log(id);
		
		Director.runShip(id,Mediator);
	});
	
	$("#director .spaceship-list").on( "click" , ".stop" , function(){
		var id = $(this).parent().parent().data("id");
		Director.stopShip(id,Mediator);
	});
	
	$("#director .spaceship-list").on( "click" , ".destroy" , function(){
		var id = $(this).parent().parent().data("id");
		Director.removeShip(id,Mediator);
	});
	
});


// QUnit 
/** $(document).ready(function() {
	QUnit.module("Director测试");



	QUnit.module("BaseMedium测试");

	QUnit.test("on to_spaceship", function(assert) {
		var medium = new BaseMedium();
		var medium_tip_1 = false;
		var medium_tip_2 = true;

		medium.on("to_spaceship", function() {
			medium_tip_1 = true;
		});

		medium.on("to_spaceship", false, function(data) {
			medium_tip_2 = data;
		});
		medium.trigger("to_spaceship");

		assert.ok(medium_tip_1, "to_spaceship is trigger");
		assert.notOk(medium_tip_2, "to_spaceship is trigger");
	});

	QUnit.test("off to_spaceship", function(assert) {

		var medium = new BaseMedium();
		var medium_tip_1 = false;
		var medium_tip_2 = true;

		function tip_1() {
			medium_tip_1 = true;
		}
		medium.on("to_spaceship", tip_1);

		medium.on("to_spaceship", false, function(data) {
			medium_tip_2 = data;
		});


		medium.off("to_spaceship", tip_1);

		medium.trigger("to_spaceship");
		assert.notOk(medium_tip_1, "to_spaceship is off");
		assert.notOk(medium_tip_2, "to_spaceship is trigger");
	});

	QUnit.test("data to_spaceship", function(assert) {

		var medium = new BaseMedium();
		var medium_tip_1 = false;
		var medium_tip_2 = true;

		function tip_1(a, b, c) {
			medium_tip_1 = b;
		}
		medium.on("to_spaceship", tip_1);

		medium.on("to_spaceship", false, function(a, b, c, data) {
			medium_tip_2 = data;
		});

		medium.trigger("to_spaceship", ["a", "b", "c"]);
		assert.equal(medium_tip_1, "b", "to_spaceship data is equal");
		assert.notOk(medium_tip_2, "to_spaceship data is equal");
	});

	QUnit.module("Mediator测试");

	QUnit.test("toSpaceShipMsg", function(assert) {
		var a = 0;

		Mediator.on("to_spaceship", function(cmd) {
			a = cmd.id;
		});

		Mediator.toSpaceShipMsg(new Command(1, "stor"));

		assert.ok(a, "toSpaceShipMsg is send");

		assert.throws(function() {
			Mediator.on("to_director", function() {
				var a = 1;
			});
		}, "to_director cannot bind");

		assert.throws(function() {
			Mediator.trigger("to_director");
		}, "to_director cannot trigger");
	});


	QUnit.module("Director测试");

	QUnit.test("addShip", function(assert) {

		var ship = Director.addShip({ medium: Mediator, eventList: ["to_spaceship"] });

		assert.equal(ship.state, "stop", "SpaceShip is Stoped");

		Director.runShip(ship.id, Mediator);

		assert.equal(ship.state, "run", "SpaceShip is Running");

		Director.removeShip(ship.id, Mediator);

		assert.notOk(Director.shipList[ship.id], "SpaceShip is Removed");

	});



});
*/

