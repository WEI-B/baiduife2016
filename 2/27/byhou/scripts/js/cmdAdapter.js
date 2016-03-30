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

			var id = StringToBit(cmd.id);
			var id_len = padNumber(id.length, 8, 2);
			var command_id = StringToBit(cmd.command_id);
			var command_id_len = padNumber(command_id.length, 8, 2);
			var command = padNumber(cmd.command, 4, 2);

			var byte = id_len + id + command_id_len + command_id + command;
			
			return byte;
		}

		, Mediator: function(cmd) {
			return JSON.stringify(cmd);
		}
		
	};
	
	
	var cmdUncode = {
		BUS: function(str) {

			var id_len = parseInt(str.substr(0, 8), 2);
			var id = BitToString(str.substr(8, id_len));
			var command_id_len = parseInt(str.substr(8 + id_len, 8), 2);
			var command_id = BitToString(str.substr(16 + id_len, command_id_len));
			var command = parseInt(str.substring(command_id_len + id_len + 16), 2);
			
			return new Command(id, command, command_id)
		}
		
		, Mediator: function (str) {
			var json = JSON.parse(str);
			
			return new Command(json.id,json.command,json.command_id);
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
			
			console.log( medium );

			return cmdCode[medium](cmd);
		}

		, uncode: function(medium, cmd) {
			
			if (typeof medium === "object") {
				medium = medium.name;
			}
			
			return cmdUncode[medium](cmd);
		}
	};

	global.cmdAdapter = cmdAdapter;

} (this));