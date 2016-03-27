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