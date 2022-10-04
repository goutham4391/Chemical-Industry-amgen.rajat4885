//scripts for 8shapes component
$(document).ready(function(){
var text;
$('.search-box-button-with-redirect').empty();
$('.quantum-top-nav__search-link').on('click');
	//$('.search-box-button-with-redirect').css('display','none');
	//$('.search-box-input.tt-input').css('display','none');
	var btn = $('<button></button>');	
	$('.search-box .component-content').append(btn);
	var closebtn = $('<button></button>').text('X');
	$('.search-box .component-content').append(closebtn);
	btn.addClass('icon-srch');	
	closebtn.addClass('close-search-block');
	$('.close-search-block').css('display','none');
 $('.close-search-block').click(function(){
		$('.search-box-input[type="text"].tt-input').val('');
		$('.search-box-input[type="text"].tt-input').animate({width: '0px'});
		$('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
		$('.search-box-button-with-redirect,.search-box-input.tt-input,.close-search-block').css('display','none');
		$('.search-box').css('display','none');
		$('.quantum-top-nav__warning').css('display','block');
		$('.quantum-top-nav__links').css('visibility','visible');
		$('.search-box').removeClass('block-div');
		
	});	

	//var text = $(".search-box-input.tt-input").val();	
	$ ('.search-box-input tt-input').attr('data-toggle','tooltip');
	$('.search-box-input tt-input').prop("title", text);
	 $('.search-box-button-with-redirect').click(function(e){
		
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	        var search = $(".search-box-input.tt-input").val();		
			if (search == '') {        
				e.preventDefault();
				e.stopPropagation();
				return false;
			}	
			$(".cl-search-keyword").html(search);	
			$('.search-box').removeClass('block-div');
			$('.search-box-input[type="text"].tt-input').animate({width: '0px'});
			$('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
			$('.search-box-button-with-redirect,.search-box-input.tt-input,.btn-close').css('display','none');
		}
		else {
			var search = $(".search-box-input.tt-input").val();		
			if (search == '') {        
				e.preventDefault();
				e.stopPropagation();
				$('.search-box').removeClass('block-div');
				$('.search-box-input[type="text"].tt-input').animate({width: '0px'});
				$('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
				$('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');					
			}
			$(".cl-search-keyword").html(search);			
		    if( $('.search-box-input.tt-input').width() >= 0 ){
              $('.search-box').removeClass('block-div');				
			  $('.search-box-input[type="text"].tt-input').animate({width: '0px'});
			  $('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
			  $('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');			  
			}			
		}		
	});
	
	$('.quantum-top-nav__search-link').click(function(){
		//if( $('.search-box-input[type="text"].tt-input').width() != 0 ){
			
			
			$('.quantum-top-nav__warning').css('display','none');
			$('.quantum-top-nav__links').css('visibility','hidden');
			if($('.search-box-input[type="text"].tt-input').val()){
			$('.search-box-input[type="text"].tt-input').val('');
			}
		    if( /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				if(window.innerHeight > window.innerWidth){
					$('.search-box-input.tt-input').animate({width: '88%'});
					if($('.quantum-indications').css('display') == 'block'){
						var height = $('.quantum-indications').height() + 16;
						var top =  height + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					if($('.quantum-indications').css('display') == 'none'){
						var top =  0 + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					
				}
				else if(window.innerWidth > window.innerHeight){
					$('.search-box-input.tt-input').animate({width: '91%'});
					if($('.quantum-indications').css('display') == 'block'){
						var height = $('.quantum-indications').height() + 32;
						var top =  height + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					if($('.quantum-indications').css('display') == 'none'){
						var top =  0 + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					
				}
				$('.search-box').addClass('block-div');
				$('.search-box-input.tt-input').animate({width: '88%'});
		        $('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
		        $('.search-box-button-with-redirect').css('display','block');
				$('.close-search-block').css('display','block');
				
				
				
			
			}else if(/iPad|iPod/i.test(navigator.userAgent)){
				if(window.innerHeight > window.innerWidth){
					if($('.quantum-indications').css('display') == 'block'){
						var height = $('.quantum-indications').height() + 16;
						var top =  height + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					if($('.quantum-indications').css('display') == 'none'){
						var top =  0 + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					$('.search-box-input.tt-input').animate({width: '91%'});
					
				}
				else if(window.innerWidth > window.innerHeight){
					$('.search-box-input.tt-input').animate({width: '92%'});
					if($('.quantum-indications').css('display') == 'block'){
						var height = $('.quantum-indications').height() + 32;
						var top =  height + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					if($('.quantum-indications').css('display') == 'none'){
						var top =  0 + "px";
						$('.search-box').css( {
							'top': top
						});
					}
					
				}
				$('.search-box').addClass('block-div');
				$('.search-box-input.tt-input').animate({width: '88%'});
		        $('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
		        $('.search-box-button-with-redirect').css('display','block');
				$('.close-search-block').css('display','block');
			}
			else {
				$('.search-box').addClass('block-div');
				if($('.quantum-indications').css('display') == 'block'){
						var height = $('.quantum-indications').height() + 32;
						var top =  height + "px";
						$('.search-box').css( {
							'top': top
						});
					}
				if($('.quantum-indications').css('display') == 'none'){
					var top =  0 + "px";
					$('.search-box').css( {
						'top': top
					});
				}
				$('.search-box-input.tt-input').animate({width: '199px'});
				$('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
				$('.search-box-button-with-redirect').css({'display':'block','top':'0'});
				$('.close-search-block').addClass('close-search-block');
				$('.close-search-block').css({'padding':'0','display':'block'
				,'width':'12%','z-index':'11','height':'34px','font-size':'18px','padding-right':'6px','top':'0','right':'0'});
			}
		//}
		/* else{
			$('.search-box').removeClass('block-div');
			//$('.close-search-block').Class('close-search-block');
			$('.quantum-top-nav__warning').css('display','block');
			$('.quantum-top-nav__links').css('visibility','visible');
			
			
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$('.close-search-block').css('display','none');
				$('.search-box-input.tt-input').animate({width: '0px'});
		    $('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
		    $('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');
			
			}else {
				$('.search-box-input.tt-input').animate({width: '0px'});
		    $('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
		    $('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');
			$('.search-box').css('display','none');
			}
		} */		
	});
	
	$( ".search-box-input.tt-input").on('keyup keypress blur change', function(e){
                                $(".search-box-button-with-redirect").attr("disabled", "disabled");
								console.log(e.which);
        if(e.which == 13){//Enter key pressed
                                                var searchKeyword=$(this).val();
                                                var str_search = getParameterByName('q');
                                                if(searchKeyword!=str_search && searchKeyword!=''){
                                                                console.log(searchKeyword);
                                                                Cookies.set('search-keyword', searchKeyword );
                                                                $('.search-box-button-with-redirect').click();//Trigger search button click event
                                                                $('#searchTextBox').val(searchKeyword);
                                                }
												else{
													e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
				return false;
												}
                                }
                               
    });

	// $( "input[name='textBoxSearch']").on('keyup keypress blur change', function(e){
        // if(e.which == 13){//Enter key pressed			
            // $('.search-box-button-with-redirect').click();
			// //Trigger search button click event
        // }
    // });
	$('.search-box').css('display','none');
	$('.search-icon').click(function(){
		//if( $('.search-box-input[type="text"].tt-input').width() != 0 ){
			if($('.search-box-input[type="text"].tt-input').val()){
			$('.search-box-input[type="text"].tt-input').val('');
			}
		    if( /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				if(window.innerHeight > window.innerWidth){
					$('.search-box-input.tt-input').animate({width: '88%'});
				}
				else if(window.innerWidth > window.innerHeight){
					$('.search-box-input.tt-input').animate({width: '91%'});
				}
				$('.search-box').css('display','block');
				$('.search-box-input.tt-input').animate({width: '88%'});
		        $('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
		        $('.search-box-button-with-redirect').css('display','block');
				$('.btn-close').css('display','block');
			}else if(/iPad|iPod/i.test(navigator.userAgent)){
				if(window.innerHeight > window.innerWidth){
					$('.search-box-input.tt-input').animate({width: '91%'});
				}
				else if(window.innerWidth > window.innerHeight){
					$('.search-box-input.tt-input').animate({width: '92%'});
				}
				$('.search-box').css('display','block');
				$('.search-box-input.tt-input').animate({width: '88%'});
		        $('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
		        $('.search-box-button-with-redirect').css('display','block');
				$('.btn-close').css('display','block');
			}
			else {
				$('.search-box-input.tt-input').animate({width: '199px'});
				$('.search-box-input.tt-input').css({'padding':'8px 2px 8px 10px','border':'1px solid #d2d2d2','display':'block'});
				$('.search-box-button-with-redirect').css('display','block');
			}
		//}
		/* else{
			
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				$('.btn-close').css('display','none');
				$('.search-box-input.tt-input').animate({width: '0px'});
		    $('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
		    $('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');
			
			}else {
				$('.search-box-input.tt-input').animate({width: '0px'});
		    $('.search-box-input.tt-input').css({'padding-left':'0','border':'none','padding':'0px'});
		    $('.search-box-button-with-redirect,.search-box-input.tt-input').css('display','none');
			}
		}	 */	
	});
	
	
	
	var str_search = getParameterByName('q');
	var clsearch=$(".cl-search-keyword");
	if(clsearch!=null&& clsearch!=undefined)
	{
	clsearch.html(str_search);	
	 var str=$('.results-count').html();
    if(str!=null||str!=undefined){
   $('.results-count').html(str.replace(/{search-keyword}/g, str_search));
		Cookies.set('search-keyword',  str_search);
    }
	}
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}	
});


$('.quantum-accordion__item-header').click(function(){
	if($(this).parent().parent().hasClass('accordion-toggle-effect')){
		if(!$(this).parent('.quantum-accordion__item').hasClass('quantum-accordion__item--open') ){
			$('.quantum-accordion__item-header').parent('.quantum-accordion__item').removeClass('quantum-accordion__item--open');
			$(this).parent('.quantum-accordion__item').addClass('quantum-accordion__item--open');
		}
		else{
			$(this).parent('.quantum-accordion__item').removeClass('quantum-accordion__item--open');
		}
	}
	else{
		if(!$(this).parent('.quantum-accordion__item').hasClass('quantum-accordion__item--open') ){
			$(this).parent('.quantum-accordion__item').addClass('quantum-accordion__item--open');
		}
		else{
			$(this).parent('.quantum-accordion__item').removeClass('quantum-accordion__item--open');
		}
	}
});
$('button[data-modal-id="Demo"]').click(function(){
	if(!$('#Demo').hasClass('quantum-modal--visible')){
		$('body').addClass('no-scroll');
	}
});
$('#Demo .quantum-modal__close').click(function(){
	if($('#Demo').hasClass('quantum-modal--visible')){
		$('body').removeClass('no-scroll');
	}
}); 

