// @codekit-prepend "Planet.js";
// @codekit-prepend "Mediator";
// @codekit-prepend "BUS";
// @codekit-prepend "Director";


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