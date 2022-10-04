jQuery(function(){
	jQuery('.wb-view-more', '.wb-view-more-wrapper').click(function () {
            var viewMore = jQuery(this);
            var loading = viewMore.next(".wb-loading-animation");
			var entryWrapper = jQuery(".wb-entry-list");
            var entries = jQuery("section", entryWrapper);
            viewMore.hide();
            loading.show();

            var params = {
                startIndex: entries.length,
                blogAjax: 1
            };
			
			var currentUrl = new Url(document.location.href);
			
            if (currentUrl.query.tag) {
                params.tag = currentUrl.query.tag;
            }
            
            if (currentUrl.query.sort) {
                params.sort = currentUrl.query.sort;
            }            
			
			var href = new Url(viewMore.attr("href"));
			var url = href.path
			function getParamsUrl(k){
				 var p={};
				 $(".wb-view-more").attr("href").replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
				 return k?p[k]:p;
			}
        var postCount = parseInt($('.wb-view-more-wrapper .wb-view-more').attr('data-maxcount'));
        var postLength = parseInt(getParamsUrl("count")) / 2;
            jQuery.get(url, params, function (data) {
				var posts = jQuery("<div/>").html(data).find(".wb-entry-list section");
                jQuery(".wb-view-more-wrapper").before(posts);
                $('.wb-entry-list section').each(function () {
                    if ($('.img-banner-main-div .wb-content').data('id') == $(this).data('id')) {
                        $(this).css('display', 'none')
                    }
                });
                loading.hide();
                if (window.location.href.indexOf('categories') < 0 && window.location.href.indexOf('tag') < 0) {
                    if ($('.wb-entry-list section').length < postCount)
                        viewMore.show();
                }
                else {
                    if (posts.length >= postLength)
                        viewMore.show();
                }
            });
			
            return false;
        });
});