$(document).ready(function(){
	
    // function modalpopup() {
        // $("#ExtNav").css({"visibility":"visible"}); 
      // }
         // $('body,html').removeClass('fix-back-on-modal-popup');

var pageHeight = $(document).height();
var overlayheight = pageHeight;
/*if($('.privacy-warning').height()==undefined) {
	var disclaimerHeight= 0;
	var overlayheight = pageHeight + disclaimerHeight;	
}
else {
	var disclaimerHeight= $('.privacy-warning.permisive').height();
	var overlayheight = pageHeight;
}*/
	 
		
    $('#history-of-amgen, #amgen-pipeline, #amgen-biosimilars, .externalLink.quantum-list-group__link, #investors, #amgen-science, #amgen-careers, #amgen-bio, .external-amgen-link').click(function(e){
        // modalpopup();
		$("#ExtNav").css("visibility","visible"); 
		if($(window).width()<768){
			$('#popup-body-overlay').css("display","block");
			$('#popup-body-overlay').height(overlayheight+"px");
			$('.privacy-warning .permisive').css("z-index","1");
		}
		else{
			$('#popup-body-overlay').css("display","none");
			$('.privacy-warning .permisive').css("z-index","initial");
		}
        e.preventDefault();
		$('body,html').addClass('fix-back-on-modal-popup');
		redirectURL = $(this).attr("href");
        $("#ExtNav a").attr("href",redirectURL);
        $("#ExtNav button.quantum-button.quantum-button--secondary.modal-continue, #ExtNav .quantum-modal__copy p a").click(function(){
			$('#popup-body-overlay').css("display","none !important");
			$('.privacy-warning .permisive').css("z-index","initial");
			window.open(redirectURL, '_blank');
			 $("#ExtNav").css({"visibility":"hidden"}); 
			   $('body,html').removeClass('fix-back-on-modal-popup');
			   $('#popup-body-overlay').css("display","none");
        });
		
    });
	
	  $("#ExtNav button.quantum-button.modal-cancel").click(function(){
            $("#ExtNav").css({"visibility":"hidden"}); 
			$('body,html').removeClass('fix-back-on-modal-popup');
			//$('#popup-body-overlay').css("display","none");
			$('#popup-body-overlay').hide();
			$('.privacy-warning .permisive').css("z-index","initial");
          });
		   $("#ExtNav button.quantum-button.quantum-modal__close").click(function(){
            $("#ExtNav").css({"visibility":"hidden"}); 
			$('body,html').removeClass('fix-back-on-modal-popup');
			$('#popup-body-overlay').hide();
			$('.privacy-warning .permisive').css("z-index","initial");
          });
		  
	// footer popup mobile
	if($(window).width()<576){
	// if ( /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) {
	$('#footer .quantum-quicklinks ul li.externalLink a, .amgensa_home .quantum-hero__text .quantum-hero__text-inner a.btn-1.external-amgen-link.btn-1, .quick-resources #amgen-biosimilars, .quick-resources #history-of-amgen').click(function(){
		var footerpopuptop = $(window).scrollTop();
		$('#ExtNav .quantum-modal__dialog').css({"top":footerpopuptop});
		$('#ExtNav').css({"background-color":"transparent"});
		$('#ExtNav').css({"opacity":"1"});
	});
	}

	//Leadership page pop up

	$('.amgen_leadership .quantum-cta').click(function(){
		/*if($(window).width()<576){
			var itemId = "#"+$(this).attr('id');
			var itemText = $(itemId +' .item-title').text();
			var splitText = (itemText).toLowerCase().split(".");
			var firstNameSplit = splitText[0].split(" ");
			console.log(firstNameSplit);

		} else {*/
			var popUpId = "#"+$(this).attr('id')+"-popup";
			$(popUpId).addClass('show-item-popup');
		//}
	});

	$('.amgen_leadership .quantum-tabs__pane.tab:nth-child(3) table a').click(function(){
			var popUpId = "#"+$(this).attr('id')+"-popup";
			$(popUpId).addClass('show-item-popup');

	});

	$(".amgen_leadership .quantum-modal .quantum-button.quantum-modal__close").click(function(){
		$('.amgen_leadership .quantum-modal').removeClass('show-item-popup');
	});

	$(document).click(function(){
		if($(event.target).attr('class')=="quantum-modal show-item-popup"){
			$('.amgen_leadership .quantum-modal').removeClass('show-item-popup');
		}
	});

		  
});