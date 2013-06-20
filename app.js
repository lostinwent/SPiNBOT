var url = "http://localhost:8071/motion-control/update";

$(document).ready(function(){

	// $("#forward").click(function(){
	// 	$.ajax(url, { dataType: 'jsonp', data: { forward: 1 } } );
	// });

	// $("#backward").click(function(){
	// 	$.ajax(url, { dataType: 'jsonp', data: { forward: -1 } } );
	// });

	// $("#left").click(function(){
	// 	$.ajax(url, { dataType: 'jsonp', data: { turn: -1 } } );
	// });

	// $("#right").click(function(){
	// $.ajax(url, { dataType: 'jsonp', data: { turn: 1 } } );
	// });

	// $("#stleft").click(function(){
	// 	$.ajax(url, { dataType: 'jsonp', data: { strafe: -1 } } );
	// });

	// $("#stright").click(function(){
	// 	$.ajax(url, { dataType: 'jsonp', data: { strafe: 1 } } );
	// });		

	$(document).keydown(function(key){
		if (key.keyCode == 87 ){
			$.ajax(url, { dataType: 'jsonp', data: { forward: 1 } } );
		}
	});

	$('body').keyup(function(key){
		if(key.keyCode == 87){
			$.ajax(url, { dataType: 'jsonp', data: { forward: 0 } } );
		}
	});

// 	$(document).keyup(function(key){

// 	});

});

