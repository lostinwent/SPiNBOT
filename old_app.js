var url = "http://localhost:8071/motion-control/update";

$(document).ready(function(){

	$("#forward").click(function(){
		$.ajax(url, { dataType: 'jsonp', data: { forward: 1 } } );
	});

	$("#backward").click(function(){
		$.ajax(url, { dataType: 'jsonp', data: { forward: -1 } } );
	});

	$("#left").click(function(){
		$.ajax(url, { dataType: 'jsonp', data: { turn: -1 } } );
	});

	$("#right").click(function(){
	$.ajax(url, { dataType: 'jsonp', data: { turn: 1 } } );
	});

	$("#st-left").click(function(){
		$.ajax(url, { dataType: 'jsonp', data: { strafe: -1 } } );
	});

	$("#st-right").click(function(){
		$.ajax(url, { dataType: 'jsonp', data: { strafe: 1 } } );
	});		

	$(document).keydown(function(key){    //forward
		if (key.keyCode === 87 ){
			$.ajax(url, { dataType: 'jsonp', data: { forward: 1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode === 87){
			$.ajax(url, { dataType: 'jsonp', data: { forward: 0 } } );
		}
	});	

	$(document).keydown(function(key){    //backward
		if (key.keyCode === 83 ){
			$.ajax(url, { dataType: 'jsonp', data: { forward: -1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode === 83){
			$.ajax(url, { dataType: 'jsonp', data: { forward: 0 } } );
		}
	});	

	$(document).keydown(function(key){		//left
		if (key.keyCode === 65 ){
			$.ajax(url, { dataType: 'jsonp', data: { turn: -1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode === 65){
			$.ajax(url, { dataType: 'jsonp', data: { turn: 0 } } );
		}
	});	


	$(document).keydown(function(key){		//right
		if (key.keyCode === 68 ){
			$.ajax(url, { dataType: 'jsonp', data: { turn: 1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode === 68){
			$.ajax(url, { dataType: 'jsonp', data: { turn: 0 } } );
		}
	});	


	$(document).keydown(function(key){		//strafe left
		if (key.keyCode === 81 ){
			$.ajax(url, { dataType: 'jsonp', data: { strafe: -1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode === 81){
			$.ajax(url, { dataType: 'jsonp', data: { strafe: 0 } } );
		}
	});	

	$(document).keydown(function(key){		//strafe right
		if (key.keyCode === 69 ){
			$.ajax(url, { dataType: 'jsonp', data: { strafe: 1 } } );
		}
	});

	$('body').keyup(function(key){	
		if(key.keyCode === 69){
			$.ajax(url, { dataType: 'jsonp', data: { strafe: 0 } } );
		}
	});	


	// $('#sb1').mouseover(function () {
	//     $('.control_robot_overlay').show();
	// }).mouseout(function () {
	//     $('.control_robot_overlay').hide();
	// });

	// $('#sb2').mouseover(function () {
	//     $('.play_overlay').show();
	// }).mouseout(function () {
	//     $('.play_overlay').hide();
	// });

	// $('#sb3').mouseover(function () {
	//     $('.winning_overlay').show();
	// }).mouseout(function () {
	//     $('.winning_overlay').hide();
	// });
});

