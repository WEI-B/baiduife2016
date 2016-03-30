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
	function Command(target, command, command_id) {
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
	}


	Command.List = {
		"run": parseInt("0001", 2),
		"stop": parseInt("0010", 2),
		"destroy": parseInt("0100", 2)
	};



	global.Command = Command;
} (this));