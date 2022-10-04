
$(document).ready(function () {
	//Download - Outbound
	$("a:not(header a, footer a)").each(function (){
		if($(this).attr('href')!=undefined){
			if($(this).attr('href').indexOf(".pdf") >=0&& $(this).attr('data-click-type') != undefined){
				var str = $(this).attr('href').split('index.html')
				var txt = str[str.length - 1].replace('.pdf','');
				$(this).attr('data-click-type','download');
				$(this).attr('data-click-text',txt);
			}
			else if($(this).attr('target') == "_blank"){
				var txt = $(this).text().trim();
				$(this).attr('data-click-type','outbound');
				$(this).attr('data-click-text',txt);
				$(this).attr('rel','noopener');
			}
			else if($(this).attr('href').indexOf("tel:") <0 && $(this).attr('href').indexOf("#") <0&& $(this).attr('data-click-type') == undefined){
				var txt = $(this).text().trim();
				$(this).attr('data-click-type','promo');
				$(this).attr('data-click-text',txt);
			}
		}
	});
	
	// phone
	  $('.dial-number').on("click", function (e) {
		dataLayer.push({
		  'event': 'e_clickToCall',
		  'phoneNumber': $(this).find('a').attr('href').replace("tel:", "")
		});
	  });
	  
	// Navigation anchor  
	  $('a[href*=\\#]').on('click', function (event) {
		if(this.pathname === window.location.pathname){
			dataLayer.push({
				' event ':' e_anchorNav ',
				' buttonText ':$(this).text().trim()
			}); 
		}
	});	

	$('.brand-image-container a').each(function(){
var hrefval = $(this).attr("href").split('.')[1];
$(this).attr("data-click-text",hrefval+" - logo");
});

$('.heading-section').each(function(){$(this).attr("data-click-type","outbound");});

});
