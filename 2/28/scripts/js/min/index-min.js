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
	Mediator.prototype.sendMessage = function(style, cmd) {

		if (Math.random() > this.fail_probability) {
			console.log("Madiator:发送指令成功");

			var self = this;

			setTimeout(function() {
				self.__proto__.__proto__.sendMessage.call(self, style, cmd);
			}, this.delay);

		}
		else {
			console.warn("Madiator:发送命令失败");
		}

	};

	Mediator.prototype.MessageStyle = {
		"to_spaceship": 1,		// 只接受此事件
	};

	global.Mediator = new Mediator();
} (this));


(function(global, undefined) {

	if (global.BUS) {
		throw new Error("BUS has exits");
	}

	/** BUS()
	 *
	 * @description BUS介质
	 */
	function BUS() {
		this.name = "BUS";
	}

	BUS.prototype = new BaseMedium(300, 0.1);

	/** BUS.sendMessage( style, cmd )
	 * 
	 * @description 重写传播方式
	 */
	BUS.prototype.sendMessage = function(style, cmd) {

		var self = this;
		
		setTimeout(function() {

			if (Math.random() > self.fail_probability) {
				console.log("BUS: 发送成功");
				
				self.__proto__.__proto__.sendMessage.call(self, style, cmd);
			}
			else {
				console.warn("BUS: 发送失败 尝试重新发送");
				self.sendMessage(style, cmd);
			}
			
		}, this.delay);
		
	};

	BUS.prototype.MessageStyle = {
		"to_spaceship": 1,
		"to_director": 2
	};

	global.BUS = new BUS;

} (this));

(function(global, undefined) {

	if (global.Command) {
		throw new Error("Command 已经初始化过");
	}

	var counter = 1;

	/** Command( target , command [, command_id ])
	 *
	 * @description 命令类
	 * 
	 * @param target     String       目标编号
	 * @param command    INT/Array    命令内容
	 * @param command_id String       命令唯一标示
	 */
	function Command(target, command, attach , command_id) {
		
		this.id = target.toString();
		
		if( typeof command === "number" ) {
			this.command = command;
		} else if ( typeof command === "object" ) {
			var c = 0;
			
			for( var key in command ) {
				c |= Command.List[command[key]];
			}
			
			this.command = c;
		}
		
		
		this.command_id = command_id || (counter++).toString();
		
		this.attach = attach || {};
	}
	
	/** Command.getCommandName()
	 * 
	 * @description 获取命令的名字
	 */
	Command.prototype.getCommandName = function () {
		var arr = [];
		
		for( var key in Command.List ) {
			if( this.command & Command.List[key] ) {
				arr.push(key);
			}
		}
		
		return arr;
	};


	Command.List = {
		"run": parseInt("0001", 2),
		"stop": parseInt("0010", 2),
		"destroy": parseInt("0100", 2)
	};



	global.Command = Command;
} (this));

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

(function(global, undefined) {

	if (global.cmdAdapter) {
		throw new Error("cmdAdapter has already exit!");
	}


	/** StringToBit(str)
	 * 
	 * @description 字符串转二进制流 ascii
	 */
	function StringToBit(str) {

		var res = '';
		var len = str.length;

		for (var i = 0; i < len; i++) {
			res += padNumber(str.charCodeAt(i), 7, 2);
		}

		return res;
	}

	/** BitToString(str)
	 *
	 * @description 二进制流转字符串 ascii
	 */
	function BitToString(bit) {

		var str = '';

		str += String.fromCharCode(parseInt(bit.substr(0, 7), 2));

		if (bit.length <= 7)
			return str;

		str += BitToString(bit.substring(7));

		return str;
	}

	/** padNumber(num, fill, hex )
	 *
	 * @description 返回固定位数的数字，高位不足补零
	 * 
	 * @param num  INT 数字
	 * @param fill INT 位数
	 * @param hex  INT 进制
	 */
	function padNumber(num, fill, hex) {
		var num = num.toString(hex);
		var len = num.length;

		hex = hex || 10;

		return (Array(
			fill > len ? fill - len + 1 || 0 : 0
		).join(0) + num);
	}


	var cmdCode = {

		BUS: function(cmd) {

			/** 编码格式 String
			 * 
			 *       FF         1459141048000                 FF                   1               F
			 * cmd.id.length       cmd.id            cmd.command_id.length   cmd.command_id   cmd.command
			 */

			// var id = StringToBit(cmd.id);
			// var id_len = padNumber(id.length, 8, 2);
			// var command_id = StringToBit(cmd.command_id);
			// var command_id_len = padNumber(command_id.length, 8, 2);
			// var command = padNumber(cmd.command, 4, 2);


			return StringToBit(JSON.stringify(cmd));


			// var byte = id_len + id + command_id_len + command_id + command;

			// return byte;
		}

		, Mediator: function(cmd) {
			return JSON.stringify(cmd);
		}

	};


	var cmdUncode = {
		BUS: function(str) {

			var json = JSON.parse(BitToString(str));
			
			return new Command( json.id, json.command, json.attach, json.command_id);

			// var id_len = parseInt(str.substr(0, 8), 2);
			// var id = BitToString(str.substr(8, id_len));
			// var command_id_len = parseInt(str.substr(8 + id_len, 8), 2);
			// var command_id = BitToString(str.substr(16 + id_len, command_id_len));
			// var command = parseInt(str.substring(command_id_len + id_len + 16), 2);


			// return new Command(id, command, command_id)
		}

		, Mediator: function(str) {
			var json = JSON.parse(str);

			return new Command(json.id, json.command, json.attach, json.command_id);
		}
	};

	/** cmdAdapter()
	 *
	 * @description 命令格式转化适配器
	 */
	var cmdAdapter = {

		code: function(medium, cmd) {

			if (typeof medium === "object") {
				medium = medium.name;
			}

			return cmdCode[medium](cmd);
		}

		, uncode: function(medium, cmd) {

			if (typeof medium === "object") {
				medium = medium.name;
			}

			console.log(medium);
			
			return cmdUncode[medium](cmd);
		}
	};

	global.cmdAdapter = cmdAdapter;

} (this));


// @codekit-prepend "Command.js";
// @codekit-prepend "SpaceShip.js";
// @codekit-prepend "cmdAdapter.js";

(function(global, undefined) {

	var Director = {

		// 控制中心飞船列表
		shipList: {}

		/** addShip( medium , options )
		 * 
		 * @description 添加一个飞船
		 * 
		 * @param medium Object { medium ,    eventList    }
		 *                        object      array[str]
		 *                       介质对象    可以监听的介质事件
		 * 
		 * @param options 飞船配置
		 */
		, addShip: function(mediums, options) {

			if (mediums.length < 1) {
				throw new TypeError("至少有一个通信介质，否则无法通信");
			}

			var id = getUniqueId();

			// 创建一个新飞船
			try {
				this.shipList[id] = new SpaceShip(id, mediums, options);
			} catch (error) {
				if (error.code) {
					switch (error.code) {
						case 1:
							alert('太空中已经存在' + id + '号飞船');
							break;
					}
				}

				console.warn("飞船发射失败：" + error.message);
				return null;
			}

			console.log("飞船发射成功");

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

			this.sendComment(new Command(id, ["destroy"]), medium);

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

			this.sendComment(new Command(id, ["stop"]), medium);
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

			this.sendComment(new Command(id, ["run"]), medium);
			this.DOM.runShip(id);
			return this;
		}

		/** sendComment
		 * 
		 * @description 发送命令
		 */
		, sendComment: function(cmd, medium) {

			medium.sendMessage("to_spaceship", cmdAdapter.code(medium.name, cmd));
			return this;

		}

		, receiver: function(cmd) {
			cmd = cmdAdapter.uncode("BUS", cmd);

			console.log(cmd);


		}

		, DOM: {
			addShip: function(ship) {

				var li = "<li class=\"spaceship " + ship.id + "\" data-id=\"" + ship.id + "\">" +
					"<h6>飞船-<span class='name'>" + ship.id + "</span>-<span class='state'>" + ship.state + "</span>-<span class='energy'>100%</span></h6>" +
					"<div class=\"btn-grp\">" +
					"<button type=\"button\" class='fly'>飞行</button>" +
					"<button type=\"button\" class='stop'>停止</button>" +
					"<button type=\"button\" class='destroy'>销毁</button>" +
					"</div>" +
					"</li>";

				$("#director .spaceship-list").append(li);
			}

			, runShip: function(id) {
				// $("#director .spaceship-list ." + id + " .state").html("run");
			}
			, stopShip: function(id) {
				// $("#director .spaceship-list ." + id + " .state").html("stop");
			}
			
			, removeShip: function(id) {
				$("#director .spaceship-list ." + id).remove();
			}

			, shipState: function(id, state, energy) {
				$("#director .spaceship-list ." + id + " .state").html(state);
				$("#director .spaceship-list ." + id + " .energy").html(energy+"%");
				
			}
		}
	};

	BUS.on('to_director', Director.receiver);

	/** getUniqueId
	 * 
	 * @description 获取唯一编码
	 */
	function getUniqueId() {
		return new Date().getTime().toString();
	}



	global.Director = Director;
} (this));

(function(global, undefined) {

	if (global.DC) {
		throw new Error("DC already exits");
	}

	var newCmd = 0;

	var DC = {
		receiver: function(cmd) {
			cmd = cmdAdapter.uncode("BUS", cmd);

			if ( parseInt(cmd.command_id) > newCmd ) {
				newCmd = parseInt(cmd.command_id);
				this.DOM.shipState(cmd.id, cmd.getCommandName()[0], cmd.attach.energy);
			}
			
		},

		DOM: {
			shipState: function(id, state, energy) {
				$("#director .spaceship-list ." + id + " .state").html(state);
				$("#director .spaceship-list ." + id + " .energy").html(energy + "%");

			}
		}

	}

	BUS.on('to_director', DC.receiver, DC);

} (this));

// @codekit-prepend "Planet.js";
// @codekit-prepend "Mediator";
// @codekit-prepend "BUS";
// @codekit-prepend "Director";
// @codekit-prepend "DC";


$(document).ready(function() {
	var AnimationId = null;

	/** step()
	 *
	 * @description 一帧动画
	 */
	function step(time) {

		if (!Planet.time) {
			Planet.time = time;
		}
		else {
			SpaceShip.renderAnimationFrame(time - Planet.time);
			Planet.time = time;
		}

		AnimationId = requestAnimationFrame(step);
	}

	AnimationId = requestAnimationFrame(step);


	$("#director .add-new-ship").click(function() {
		
		var power = SpaceShip.PowerPart[$(':radio[name="power"]:checked').val()];
		var energy = SpaceShip.EnergyPart[$(':radio[name="energy"]:checked').val()];
		
		if( !power || !energy ) {
			alert("选择类型");
			console.log( $(':radio[name="power"]:checked').val() , energy);
			return;
		}
		
		Director.addShip(
			[{ medium: BUS, eventList: ["to_spaceship"] }],
			{
				speed: power.speed,
				energy_consume: power.energy_consume,
				energy_recharge: energy
			}
		);
		
	});


	$("#director .spaceship-list").on("click", ".fly", function() {
		var id = $(this).parent().parent().data("id");
		Director.runShip(id, BUS);
	});

	$("#director .spaceship-list").on("click", ".stop", function() {
		var id = $(this).parent().parent().data("id");
		Director.stopShip(id, BUS);
	});

	$("#director .spaceship-list").on("click", ".destroy", function() {
		var id = $(this).parent().parent().data("id");
		Director.removeShip(id, BUS);
	});

});





// QUnit-1
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

