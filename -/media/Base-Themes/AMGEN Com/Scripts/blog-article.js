/*var findArticleClass = $(".text-wrapper").hasClass("wrapper-landscape-img");
if (findArticleClass == true) {
    $(".wb-article-detail").addClass("paddingTop");
}*/

/*blog artical portarate image margin-top starts*/

function imagePosition() {
    if (window.innerWidth >= 768) {
        var elementHeight = document.querySelector('.article-banner').offsetHeight;
        $('.wrapper-image .image-section').css("margin-top", 108 - elementHeight);
    } else {
        $('.wrapper-image .image-section').css("margin-top", "0");
    }
}

// imagePosition();
$(window).resize(function() {
    imagePosition();
});

/*blog artical portarate image margin-top ends*/

$(document).ready(function() {
    // Blog Article Design 1 - check if image wrapper class is present, If Yes then add class - "article-square-image"
    if ($('.article-banner .text-wrapper').hasClass('wrapper-image')) {
        imagePosition();
        $(window).resize(function() {
            imagePosition();
        });
        if (!$('.wb-article-detail > .row:first-child').hasClass('article-square-image'))
            $('.wb-article-detail > .row:first-child').addClass('article-square-image');
    }

    // Blog Article Design 2 - check if video wrapper class is present, If Yes then add class - "article-square-video"
    else if ($('.article-banner .text-wrapper').hasClass('wrapper-video')) {
        if (!$('.wb-article-detail > .row:first-child').hasClass('article-square-video'))
            $('.wb-article-detail > .row:first-child').addClass('article-square-video');
    }

    // Blog Article Design 3(Landscape Header) - check if landscape wrapper class is present, If Yes then add class - "article-landscape-image"
    else if ($('.article-banner .text-wrapper').hasClass('wrapper-landscape-img')) {
        if (!$('.wb-article-detail > .row:first-child').hasClass('article-landscape-image'))
            $('.wb-article-detail > .row:first-child').addClass('article-landscape-image');
    }

    // Blog Article Design 4 - check if default wrapper class is present, If Yes then add class - "article-no-image"
    else if ($('.article-banner .text-wrapper').hasClass('wrapper-default')) {
        if (!$('.wb-article-detail > .row:first-child').hasClass('article-no-image'))
            $('.wb-article-detail > .row:first-child').addClass('article-no-image');
    }

    // Blog Article Design 5 - check if background wrapper class is present, If Yes then add class - "article-bg-image"
    else if ($('.article-banner .text-wrapper').hasClass('wrapper-bgimage')) {
        if (!$('.wb-article-detail > .row:first-child').hasClass('article-bg-image'))
            $('.wb-article-detail > .row:first-child').addClass('article-bg-image');
    }

    // Hide Default Icons
    $('.wb-entry-share.wb-panel .wb-entries .stButton .stArrow').remove();
    /*$('.wb-entry-share.wb-panel .wb-entries .st_facebook_hcount .stButton span .stMainServices').css({
        "background-image": "url(-/media/Themes/CorporateAffairs/amgen-com/amgen-com/images/Common/Icon/Icons/Facebook/FacebookSVG.svg)"
    });
    $('.wb-entry-share.wb-panel .wb-entries .st_twitter_hcount .stButton span .stMainServices.st-twitter-counter').css({
        "background-image": "url(-/media/Themes/CorporateAffairs/amgen-com/amgen-com/images/Common/Icon/Icons/Twitter/TwitterSVG.svg)"
    });
    $('.wb-entry-share.wb-panel .wb-entries .st_sharethis_hcount .stButton span .stMainServices.st-sharethis-counter').css({
        "background-image": "url(-/media/Themes/CorporateAffairs/amgen-com/amgen-com/images/Common/Icon/Icons/Email/EmailSVG.svg)"
    });*/


    // category selected code

    // $('.listing-page .wb-categories ul li a').first().addClass('blue')
    // $('.listing-page .wb-categories ul li a').each(function () {
    //     if (window.location.href.indexOf($(this).text().replace(/\ /g, '-')) > 1) {
    //         $('.listing-page .wb-categories ul li a').first().removeClass('blue')
    //         $(this).addClass('blue');
    //     }
    // });
    if (window.location.pathname.split("index.html")[1] == 'stories') {
        $('.listing-page .wb-categories ul li a').first().addClass('blue');
        $('.listing-page .wb-categories ul li a').each(function() {
            if ($(this).attr("href") == window.location.pathname) {
                $('.listing-page .wb-categories ul li a').first().removeClass('blue');
                $(this).addClass('blue');
            }
        })
    }

    // mobile category dropdown toggle
    $(".listing-page .wb-categories.wb-panel .wb-category-title").click(function() {
        $(".listing-page .wb-categories.wb-panel").addClass("dropdown-active");
        $(".listing-page .wb-categories.wb-panel ul").toggle();
        $(".listing-page .wb-categories.wb-panel .wb-category-title i.fa-angle-down").toggle();
        $(".listing-page .wb-categories.wb-panel .wb-category-title i.fa-angle-up").toggle();

        //        $(".listing-page .wb-categories.wb-panel .wb-category-title i.fa-angle-down, .listing-page .wb-categories.wb-panel .wb-category-title i.fa-angle-up, .listing-page .wb-categories.wb-panel ul").toggle();
    });

    var location = window.location.href;
    if (window.location.pathname === '/stories') {
        if (location.includes('?')) {
            var queryParam = location.split('?');
            var tag = queryParam[1].split("tag=")[1];
            if (tag) {
                $('.listing-page .wb-categories.wb-panel').addClass('d-none');
                $('.listing-page .wb-entry-list').addClass('mt-60');
            }
        }
    }
    if (window.location.pathname.startsWith("stories/categories/index.html")) {
        var category = window.location.pathname;
        if ($(window).width() < 992 && $(".listing-page .wb-categories.wb-panel select").length > 0) {
            $(".listing-page .wb-categories.wb-panel select").val(category);
        }
    }


});