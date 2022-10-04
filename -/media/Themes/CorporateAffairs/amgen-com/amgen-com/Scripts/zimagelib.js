$(document).ready(function() {
	if($("#image-library").length>0) {
		$('[data-variantfieldname="Mobile Image"]').each(function() {
			if(typeof $(this).attr('data-src') !== 'undefined' && $(this).attr('data-src') !== false) {
				$(this).attr('data-src', $(this).attr('data-src').replace('class=', '').trim());
                                $(this).addClass("d-block d-sm-none wb-image lozad lozadnosrc");
                                $(this).attr('src', $(this).attr('data-src').replace('class=', '').trim());
                                  
			}
		})
	}
});
