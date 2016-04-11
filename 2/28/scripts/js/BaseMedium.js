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