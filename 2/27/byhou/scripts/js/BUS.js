
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