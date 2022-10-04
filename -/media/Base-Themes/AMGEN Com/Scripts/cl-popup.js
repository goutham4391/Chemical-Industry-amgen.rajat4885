
$(document).ready(function(){
	//Trigger popup on "model-pop-up-open" class click
	const body = document.querySelector("body");
	
	$('.model-pop-up-open').click(function(e){
		var attr = $(this).attr('data-attr');
		$("#"+attr).addClass('quantum-modal--visible quantum-modal__dialog--fit-full');
		$(".quantum-modal#" + attr).show();
		// keep body from scrolling
		body.style.overflow = "hidden";
		e.preventDefault();
	}); 
	
	 $(".quantum-modal__close").click(function(){ 
		var videoelements=$('video');
		$.each( videoelements, function() {
			if($(this).parent().hasClass('vjs-playing'))
			{
				videojs($(this).prop('id')).pause();

			}
		});		
		
		$(this).closest("div.quantum-modal").removeClass("quantum-modal--visible");
		$(".quantum-modal").hide();
		 // resume body scrolling
		 body.style.overflow = "auto";
	// console.log($(this).parent().find('.vd-title').html());
	trackGTM_modalPopupClose($(this).parent().find('.vd-title').html());
	
    });
	
	
});// JavaScript Document