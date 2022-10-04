$(document).ready(function(){
     /* ---- EnbrelPro---- */
	/*Top Navigation - GTM */
	$('.gtm-topNavCl').click(function(){
		if(typeof(trackGTM_topNav) !== 'undefined'){
			if ($.isFunction(trackGTM_topNav))
			{		
				var topNavName = $(this).attr('menu-name');
				var menuType = $(this).attr('menu-type');
				trackGTM_topNav(topNavName,menuType);	
			}
		}		
	}); 
	  
	/*Header Navigation - GTM */
	$('.gtm-header').click(function(){
		if(typeof(trackGTM_headerNav) !== 'undefined'){
			if ($.isFunction(trackGTM_headerNav))
				{		
					var headNavName = $(this).attr('menu-name');
					var menuType = $(this).attr('menu-type');
					var clickType=$(this).attr('click-type');
					if(clickType!=undefined)
					{
						trackGTM_headerNav(headNavName,menuType,clickType);
					}
					else
					{	
						trackGTM_headerNav(headNavName,menuType);
					}
				}
		}		
	}); 
	
	
	/*Accordion - GTM */
	$('.quantum-accordion__item-header').click(function(){
		if(typeof(trackGTM_inPageNav) !== 'undefined'){
			if ($.isFunction(trackGTM_inPageNav) ) 
			{
				if( $(this).closest('.quantum-accordion__item--open').length) {	
					var clickAction = $('.gtm-acc-open').attr('click-action');
					var contentName = $(this).closest('.quantum-accordion__item--open').find('.gtm-acc-open').attr('content-name');
					var contentPosition = $('.gtm-acc-open').attr('content-position');
					var toolName = $('.gtm-acc-open').attr('tool-name');
					trackGTM_inPageNav(clickAction,contentName,contentPosition,toolName);				
				}
				else{				
					var clickAction = $('.gtm-acc-close').attr('click-action');
					var contentName = $(this).closest('.quantum-accordion__item').find('.gtm-acc-close').attr('content-name');
					var contentPosition = $('.gtm-acc-close').attr('content-position');
					var toolName = $('.gtm-acc-close').attr('tool-name');				
					trackGTM_inPageNav(clickAction,contentName,contentPosition,toolName);
				}
			}
		}
	}); 
	
	/*InPageNav - GTM*/
	$('.gtm-inPageNavCl').click(function(){
		if(typeof(trackGTM_inPageNav) !== 'undefined'){
			if ($.isFunction(trackGTM_inPageNav))
			{
				var clickAction = $(this).attr('click-action');
				var contentName = $(this).attr('content-name');
				var contentPosition = $(this).attr('content-position');
				var toolName = $(this).attr('tool-name');
				trackGTM_inPageNav(clickAction,contentName,contentPosition,toolName);
			}
		}		
	}); 
	
	
	/*Caurousel - GTM*/
	$('.gtm-caurousel').click(function(){
		if(typeof(trackGTM_carousel) !== 'undefined'){
			if ($.isFunction(trackGTM_carousel))
			{
				var clickAction = $(this).attr('clickaction');
				var contentName = $(this).attr("contentName");
				var contentPosition = $(this).attr("contentposition");
				
				trackGTM_carousel(clickAction,contentName,contentPosition);
			}
		}		
	}); 
	
	/*Tabs - GTM*/
	$('.quantum-tabs__label-text').click(function(){
		if(typeof(trackGTM_tabs) !== 'undefined'){
			if ($.isFunction(trackGTM_tabs))
			{
			var topicName=	window.location.href.split('?')[0].split('index.html').slice(-1)[0]
				var contentName = $(this).attr('data-click-text');
				
				
				trackGTM_tabs(contentName,topicName);
			}
		}		
	}); 
	
		
	/*ModalPopupOpen - GTM*/
	$('.model-pop-up-open').click(function(){
		if(typeof(trackGTM_modalPopupOpen) !== 'undefined'){
			if ($.isFunction(trackGTM_modalPopupOpen))
			{
				if($('.quantum-modal--visible .vd-title').length>0){
					
				var title=$('.quantum-modal--visible .vd-title').html()
						
				
				trackGTM_modalPopupOpen(title);
				}
			}
		}		
	}); 
	
	
	
	/*Footer Navigation - GTM*/
	$('.gtm-footerCl').click(function(){
		if(typeof(trackGTM_footerNav) !== 'undefined'){
			if ($.isFunction(trackGTM_footerNav))
			{
				var footerNavName = $(this).attr('menu-name');
				var menuType = $(this).attr('menu-type');
				trackGTM_footerNav(footerNavName,menuType);
			}
		}		
	}); 
	
	/*Quick Links Navigation - GTM*/
	$('.gtm-QuickLinksCl').click(function(){
		if(typeof(trackGTM_qlNav) !== 'undefined'){
			if ($.isFunction(trackGTM_qlNav))
			{
				var footerNavName = $(this).attr('menu-name');
				var menuType = $(this).attr('menu-type');
				trackGTM_qlNav(footerNavName,menuType);
			}
		}		
	});
	
	/*Error-Page - GTM*/
	if($('body.page-error').length)
	{
		if(typeof(trackGTM_errorPage) !== 'undefined'){
			if ($.isFunction(trackGTM_errorPage))
			{
				var errorCode = $('.page-error').attr('http-code');		
				trackGTM_errorPage(errorCode);			
			}
		}			
	}
	
	/*PhoneNumber - GTM*/
	$('.gtm-phoneNumber').click(function(){
		if(typeof(trackGTM_phoneNumber) !== 'undefined'){
			if ($.isFunction(trackGTM_phoneNumber))
			{
				trackGTM_phoneNumber();
			}
		}		
	}); 
	
	/* HomePage Dropdown - GTM */
	$('.gtm-dropDown').change(function(){
		if(typeof(trackGTM_dropDown) !== 'undefined'){
			if ($.isFunction(trackGTM_dropDown))
			{
				
				var cancerType = $('option:selected', this).attr('cancer-type');		
				trackGTM_dropDown(cancerType);
			}
		}		
	}); 
	
	
	/* Form Start - GTM */
	
	$('#signupForm').one('click', function() {
		var formid = $(this).attr('id');
		
		if(typeof(trackGTM_formStart) !== 'undefined'){
			if ($.isFunction(trackGTM_formStart))
			{								
				trackGTM_formStart(formid);
			}
		}
	});
		
})	