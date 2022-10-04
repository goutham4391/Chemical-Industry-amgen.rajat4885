/*Top Navigation - GTM*/
var trackGTM_topNav = function (topNavName, menuType) {
	trackGTM.form.dlpush({ 'event': 'e_menuNav', 'menuName': topNavName, 'menuType': menuType }, false);
};

/*Header Navigation - GTM*/
var trackGTM_headerNav = function (headerNavName, menuType) {
	
	trackGTM.form.dlpush({ 'event': 'e_menuNav', 'menuName': headerNavName, 'menuType': menuType }, false);
};

/*Footer Navigation - GTM*/
var trackGTM_footerNav = function (footerNavName, menuType) {
	trackGTM.form.dlpush({ 'event': 'e_menuNav', 'menuName': footerNavName, 'menuType': menuType }, false);
};

/*Error Page - GTM*/
var trackGTM_errorPage = function (errorCode) {
	trackGTM.form.dlpush({ 'event': 'e_httpError', 'httpErrorCode': errorCode }, false);
};



/*Caurousel - GTM*/
var trackGTM_carousel = function (clickAction, contentName, contentPosition) {
	trackGTM.form.dlpush({ 'event': 'e_carouselClick', 'clickAction': clickAction, 'contentName': contentName, 'contentPosition': contentPosition }, false);
};

/*Tabs - GTM*/
var trackGTM_tabs = function (contentName, topicName) {
	trackGTM.form.dlpush({ 'event': 'e_inPageClickNav', 'contentName': contentName, 'topicName': topicName }, false);
};

/*ModalPopupOpen - GTM*/
var trackGTM_modalPopupOpen = function (modalHeader) {
	trackGTM.form.dlpush({ 'event': 'e_popupOpen', 'modalHeader': modalHeader }, false);
};

/*ModalPopupClose - GTM*/
var trackGTM_modalPopupClose = function (modalHeader) {
	trackGTM.form.dlpush({ 'event': 'e_popupClose', 'modalHeader': modalHeader }, false);
};

var trackGTM_buttonClick = function (contentName) {
	trackGTM.form.dlpush({ 'event': 'e_buttonClick', 'contentName': contentName }, false);
};

var trackGTM_hoverClick = function (contentName) {
	trackGTM.form.dlpush({ 'event': 'e_hover', 'contentName': contentName }, false);
};

var trackGTM_sliderClik = function (contentName) {
	trackGTM.form.dlpush({ 'event': 'e_slider', 'sliderName': contentName }, false);
};

var trackGTM_contentExpand = function (contentName) {
	trackGTM.form.dlpush({ 'event': 'e_expand', 'contentName': contentName }, false);
};

var trackGTM_contentCollapse = function (contentName) {
	trackGTM.form.dlpush({ 'event': 'e_collapse', 'contentName': contentName }, false);
};

var trackGTM_clickToCall = function (phoneNumber) {
	trackGTM.form.dlpush({ 'event': 'e_clickToCall', 'phoneNumber': phoneNumber }, false);
};

var trackGTM_socialClick = function (clickAction, socialType) {
	trackGTM.form.dlpush({ 'event': 'e_socialClick', 'clickAction': clickAction, 'socialType': socialType }, false);
};

$(document).ready(function () {
	console.log(dataLayer);
	$('.gtm-buttonclick').click(function () {
		if (typeof (trackGTM_buttonClick) !== 'undefined') {
			if ($.isFunction(trackGTM_buttonClick)) {
				var contentName = $(this).attr('content-name');
				trackGTM_buttonClick(contentName);
			}
		}
	});

	$("[gtm-hover-track]").mouseenter(function () {
		if (typeof (trackGTM_hoverClick) !== 'undefined') {
			if ($.isFunction(trackGTM_hoverClick)) {
				var contentName = $(this).attr('content-name');
				trackGTM_hoverClick(contentName);
			}
		}
	});

	$('.gtm-sliderClick').click(function () {
		if (typeof (trackGTM_sliderClik) !== 'undefined') {
			if ($.isFunction(trackGTM_sliderClik)) {
				var contentName = $(this).attr('content-name');
				trackGTM_sliderClik(contentName);
			}
		}
	});
	
	
	/* window.onload=$('.st-btn').click(function () {
		console.log($(this));
	});
 */
	

	
	$('.quantum-accordion__item-header').click(function(){
			if ($.isFunction(trackGTM_contentCollapse) && $.isFunction(trackGTM_contentExpand) ) 
			{
				var contentName='Accordion content';
				if( $(this).closest('.quantum-accordion__item--open').length) {	
				if($(this).closest('.quantum-accordion__item--open').find('h4')!='undefined')
				{
					
					contentName = $(this).closest('.quantum-accordion__item--open').find('h4')[0].innerText;
				}
					trackGTM_contentExpand(contentName);
				}
				else{	
					if($(this).closest('.quantum-accordion__item').find('h4')!='undefined')
					{
						contentName = $(this).closest('.quantum-accordion__item').find('h4')[0].innerText;
					}				
					trackGTM_contentCollapse(contentName);
				}
			}
		
	}); 

$('.navigation .field-navigationtitle a').click(function(){
	if(typeof(trackGTM_headerNav) !== 'undefined'){
			if ($.isFunction(trackGTM_headerNav))
				{
					trackGTM_headerNav($(this)[0].innerText,'right navigation');
				}
	}
});

	$('.gtm-click-to-call').click(function () {
		if (typeof (trackGTM_hoverClick) !== 'undefined') {
			if ($.isFunction(trackGTM_hoverClick)) {
				var phoneNumber = $(this).attr('phone-number');
				if (phoneNumber != undefined) {
					trackGTM_clickToCall(phoneNumber);
				}

			}
		}
	});
	
	
	
	$('.gtm-social-click').click(function () {
		if (typeof (trackGTM_socialClick) !== 'undefined') {
			if ($.isFunction(trackGTM_socialClick)) {
				var clickAction = $(this).attr('click-action');
				var socialType = $(this).attr('social-type');
				if (clickAction != undefined && socialType != undefined) {
					trackGTM_socialClick(clickAction, socialType);
				}

			}
		}
	});
	
	$('.slide-count a').click(function(){
	  if (typeof (trackGTM_carousel) !== 'undefined') {
		  if ($.isFunction(trackGTM_carousel)) {
			  var clickAction;
			  var contentName;
			  var contentPosition;
			  var Totalslides = $(".carousel ul li").length;
			  if($(this).hasClass("prev-text")){
				 clickAction = "slideShow-leftClick"; 
			  }
			  else{
				clickAction = "slideShow-rightClick";  
			  }
			   contentName=$('.slick-carousel .slick-active').find('.slider-title').html();
				contentPosition = $('.slick-carousel .slick-active').find('.current-slide').html();
			  trackGTM_carousel(clickAction, contentName, contentPosition);
		  }
	  }
	});
	
});
$('.gtm-custom-accordion').click(function () {
					var content=$(this).attr('gtm-accordion-content');

		if($(this).has('.fa-plus-square-o').length>0)
		{
			trackGTM_contentExpand(content);
		}
		else
		{
			trackGTM_contentCollapse(content);
		}
		

	});
 $(window).on('load', function () {
   $('.st-btn').click(function () {
	   if($(this).data('network')=='email')
	   {
		   dataLayer.push({
			 'event':'e_email',
			'contentName':$('.field-title').text()
			 });

	   }
	   else
	   {
		   dataLayer.push({
			 'event':'e_share',
			'shareType':$(this).data('network'),
			'contentName':$('.field-title').text()
			 });

	   }
   });
  });