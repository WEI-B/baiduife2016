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