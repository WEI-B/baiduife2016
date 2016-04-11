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