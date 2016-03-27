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