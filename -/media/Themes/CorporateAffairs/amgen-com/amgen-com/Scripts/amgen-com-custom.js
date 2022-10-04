//Script to load font file
try {
    Typekit.load({ async: true });
} catch (e) {}


function check_recaptcha() {
    var captcha_error;
    var reCaptchaVersion = $("input[name=reCaptchaVersion]").val();
    if (reCaptchaVersion != "v3") {
        if (grecaptcha.getResponse().length < 1) {
            $(".go-recaptcha").addClass("error");
            $(".g-recaptcha-error").addClass("error");
            $(".go-recaptcha").append($(".g-recaptcha-error"));
            $(".captcha-error-container").css("display", "block");
            $(
                ".m-amgen-form.feedback-form section.l-form-section.row.error-container"
            ).css("display", "block");
            captcha_error = true;
        } else if (grecaptcha.getResponse().length > 0) {
            $(".go-recaptcha").removeClass("error");
            $(".g-recaptcha-error").removeClass("error");
            $(".captcha-error-container").css("display", "none");
            // $(".m-amgen-form.feedback-form section.l-form-section.row.error-container").css("display", "block");
            captcha_error = false;
        }
    }
    return captcha_error;
}

var showErrorAndSuccessMsg = function(successCallback, errorCallback) {
    var pathMsg = window.location.href;
    var queryParam = pathMsg.split("?");
    queryParam = queryParam[1];
    if (queryParam) {
        queryParam = queryParam.split("&&");
        queryParam = queryParam[0];
        queryParam = queryParam.split("=");
        if (queryParam[0] == "IsSuccess") {
            if (queryParam[0] == "IsSuccess" && queryParam[1] === "true") {
                $(".contact-feedback-content").css("display", "none");
                $(".contact-form-success").css("display", "block");
            } else if (queryParam[0] == "IsSuccess" && queryParam[1] === "false") {
                console.log("notsuccess");
            }
        }
    }
};
/*Script for pushing footer to bottom of the page functionality*/

$(window).resize(function() {

    var minWidth = $(window).width();
    if (minWidth > 1440) {
        var h = $(document).height() - $('body').height() + $('header').height();
        if (h > 0) {
            $('#footer').css({
                marginTop: h
            });
        }
    } else {
        $('#footer').css({ "margin-top": "0" });
    }
});

function isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}

// if (isIOSDevice()) {
//     var script = document.createElement('script');
//     script.src = "https://www.youtube.com/iframe_api";
//     document.body.appendChild(script);
// }

var player1;
var player2;
//Function to play youtube video
function onYouTubeIframeAPIReady() {
    player1 = new YT.Player("ytvideo-player", {
        height: "100%",
        width: "100%",
        videoId: "zH6J4xFwxU0",
        events: {
            'onReady': onPlayerReady
        }
    });

    //Function to play a list of youtube videos
    player2 = new YT.Player("ytvideo-player-list", {
        height: "100%",
        width: "100%",
        playerVars: {
            listType: "playlist",
            list: "PL0FF085BE5B410E20",
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
    if (isIE) {
        console.log('here');
    }
}

/*Script for youtube video player functionality*/

/*mac chrome browser starts here*/
if ((navigator.userAgent.indexOf('Mac OS X') != -1) && (navigator.appVersion.indexOf("Chrome/index.html") != -1)) {
    $("body").addClass("mac-devicecrm");
} else {
    $("body").addClass(" ");
}

if ((navigator.userAgent.indexOf('Mac OS X') != -1) && (navigator.userAgent.indexOf("Firefox") > 0)) {
    $("body").addClass("mac-deviceff");
} else {
    $("body").addClass(" ");
}
/*mac chrome browser ends here*/
$(document).ready(function() {
    $('.brightcove-onload').attr('src', $('.brightcove-onload').data('src'));

    var ua = window.navigator.userAgent;
    var isIE = /MSIE|Trident/.test(ua);
    /* IE Firefox text button Navigation issue starts*/
    $("button.quantum-button").click(function() {
        if ($(this).find("a.quantum-button__text").length > 0) {
            window.location.href($(this).find("a.quantum-button__text").attr("href"));
        }
    });
    /* IE Firefox text button Navigation issue ends*/

    /*megamenu links hover adding class starts*/
    var menuTimer;
    $("li.quantum-megamenu__list-item").hover(function() {

        var nav = $(this);
        menuTimer = setTimeout(function() {
            nav.addClass("primary-nav-megamenu-open");
        }, 600);

    }, function() {
        $(this).removeClass("primary-nav-megamenu-open");
        clearTimeout(menuTimer);

    });

    /*onclick popup body class overflow-hidded adding  script starts*/
    $('.sub-page-countries-popup .model-pop-up-open').click(function() {
        $('body.sub-page-countries-popup').addClass('overfloe-hidden');
    });
    $('.quantum-modal__close').click(function() {
        $('body.sub-page-countries-popup').removeClass('overfloe-hidden');
    });
    /*onclick popup body class adding script ends*/

    /*megamenu links hover adding class ends*/

    /* Sitemap font-highlighting functionality*/
    $(".site-map .container.vertical-nav div>ul>li:has(ul)").addClass(
        "sub-child"
    );
    /* Sitemap font-highlighting functionality*/

    /* Leadership margin top issue-Mobile starts*/

    $(
        ".leadership-page .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label"
    ).click(function() {
        var winWidth = $(window).width();
        if (winWidth <= 576) {
            $(this).closest(".quantum-tabs__labels").css("margin-top", "115px");
        }
    });
    $(
        ".leadership-page .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(2)"
    ).click(function() {
        var winWidth = $(window).width();
        if (winWidth <= 576) {
            $(this).closest(".quantum-tabs__labels").css("margin-top", "77px");
        }
    });
    /* Leadership margin top issue-Mobile ends*/

    /*mob menu class adding starts here*/
    $('ul.quantum-drop-down-menu__menu').parent('li.quantum-drop-down-menu__list-item').addClass('first-level-menulist');
    $('.desktop-submenu-right-icon').parent('li.quantum-drop-down-menu__menu-list-item').addClass('second-level-menulist');
    /*mob menu class adding ends here*/

    /* Accordion Animation Starts */
    $(
        ".faq-accordion-container .quantum-accordion__item .quantum-accordion__item-header"
    ).click(function() {
        if ($(this).parent(".quantum-accordion__item").hasClass('quantum-accordion__item--open')) {
            $(this)
                .parent()
                .children(".quantum-accordion__item-contents")
                .slideDown('slow', 'swing');
            var tabIndex = $(this).attr("tabindex");
            $(this)
                .parent()
                .children(".quantum-accordion__item-contents")
                .find("a")
                .each(function() {
                    $(this).attr("tabindex", ++tabIndex);
                });
        } else {
            $(this)
                .parent()
                .children(".quantum-accordion__item-contents")
                .slideUp('slow', 'swing');
            $(this)
                .parent()
                .children(".quantum-accordion__item-contents")
                .find("a")
                .each(function() {
                    $(this).attr("tabindex", -1);
                });
        }
    });

    /* Accordion Animation Ends */

    /* image library download attr script starts here */
    $(".image-library-container a.category-link").attr("download", true);

    /*var oldUrl = $('.image-library a.category-link').attr("href");
    $(".image-library .thumbnail").find ('a').attr("href", oldUrl );*/
    // $('.image-library .thumbnail').click(function(event) {
    //     /* var oldUrl = $('.image-library .wb-category').find ('a').attr("href")
    //      $(".image-library .thumbnail").find ('a').attr("href", oldUrl );*/
    //     console.log($(this).parent());
    //     event.preventDefault();
    //     $(this).parent().find(".category-link").click();
    // });

    $('.image-library-container .wb-tiles .thumbnail').click(function(event) {
        event.preventDefault();
        window.location.href = $(this).parent().find('.category-link').attr('href');
    });

    $('.amgen-photography .wb-tiles .thumbnail').off();

    $('.amgen-photography .wb-tiles .thumbnail').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        var a = $("<a>")
            .attr("href", $(this).parent().find(".category-link").attr('href'))
            .attr("download", "true")
            .appendTo("body");
        a[0].click();
        a.remove();
    });

    /* image library download attr script starts here */

    /*Carousel Slide count*/
    var Totalslides = $("#banner-carousel .slides li").length;
    $(".total-slide").text(Totalslides);
    /*Carousel Slide count*/

    /*Carousel functionality for mobile*/
    $("#banner-carousel .nav .sxa-bullets").on("click", function() {
        $(this).siblings().removeClass("active");
        $(this).next(".sxa-bullets").addClass("active");
        $(".prev-text").click();
    });
    /*Carousel functionality for mobile*/

    /*youtube video functionality for home page*/
    $(".amgen_home .video-data__container a.play-button").click(function() {
        var videoId = $(this).data("videoid");
        $(".bg-video,.video-data__container").hide();
        $(".social-media .video-story__container").css("opacity", "1");
        if (isIE) {
            $("#myPlayerID").hide();
            $(".video-ie-player").show();
            $(".video-ie-player")[0].src += "&autoplay=1";
        } else {
            var script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(script);
            $("#ytvideo-player").show();
            if ($(window).outerWidth() < 768) {
                $(".bg-video").show();
                $(".bg-video").removeClass("bg-video").removeClass("d-none"); // show() was not working alone because of these classes\
            }
        }
    });
    /*youtube video functionality for home page*/

    /*Youtube video functionality for landing pages*/
    $(".ytvideo-btn").click(function() {
        var playlistId = $(this).data("listid");
        var videoId = $(this).data("videoid");
        $(".video-data__container").hide();
        $(".video-story__container").css({
            "background-image": "none",
            "box-shadow": "none",
            "margin-top": "0",
        });
        if (isIE) {
            $(".video-ie-player").show();
            $(".video-ie-player")[0].src += "&autoplay=1";
            if ($(this).is("[data-listid]")) {
                $(".video-ie-player").attr("src", $(".video-ie-player").attr("data-src"));
            }
        } else {
            var script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(script);
            if ($(this).is("[data-listid]")) {
                $("#ytvideo-player-list").show();
            }
            if ($(this).is("[data-videoid]")) {
                $("#ytvideo-player").show();
            }
        }
    });
    /*Youtube video functionality for landing pages*/


    /*post-marketing-commitments table status links scrolltop script starts*/
    $(".pm-status").click(function() {
        var headerht = $('.quantum-header.mega-menu-container').height();
        var headerhtmob = $('#amgen-header').height();

        var offset = 0;
        var target = this.hash;
        if ($(window).width() > 1024) {
            $('html, body').animate({
                'scrollTop': $(target).offset().top - headerht - 10

            });
        } else {
            $('html, body').animate({
                //'scrollTop': $(target).offset().top - headerht - 20
                'scrollTop': $(target).offset().top - headerhtmob - 10
            });
        }

    });
    /*post-marketing-commitments script ends*/

    /*onclick body search close*/
    $("body").click(function() {
        $(".quantum-search-suggest").css("display", "none");
        $(
            "#searchSubmitBtn-mobile.search-btn,.quantum-header__mobile-content>button.quantum-button:first-child"
        ).css("display", "block");
        $(".search-close,.quantum-search-btn-close.menu-search-close-button").css(
            "display",
            "none"
        );
    });
    $("header").click(function() {
        event.stopPropagation();
    });

    showErrorAndSuccessMsg();
    $("#ReCaptchContainer").addClass("go-recaptcha");
    $("#captcha-checkbox-empty").addClass("g-recaptcha-error");
    $("#lblMessage").remove();
    $("#lblSuccessMessage").remove();
    $("#lblErrorMessage").remove();
    var formError = false;
    $("#contentrow_0_middleleftpane_0_submit").click(function(e) {
        if ($(".go-recaptcha").length > 0) {
            formError = check_recaptcha();
        }
    });

    $("form.test1").submit(function(evt) {
        if (formError) {
            evt.preventDefault();
            return false;
        }
    });

    $(
        "#searchSubmitBtn-mobile.search-btn,.quantum-header__mobile-content>button.quantum-button:first-child"
    ).click(function(e) {
        e.preventDefault();
        //$(".right-links.media").css("margin-left", "0px");
        $(".quantum-search-suggest").css("display", "block");
        $(
            "#searchSubmitBtn-mobile.search-btn,.quantum-header__mobile-content>button.quantum-button:first-child,.quantum-header__menu-trigger--collapse-menu"
        ).css("display", "none");
        $(
            ".search-close,.quantum-search-btn-close.menu-search-close-button,.quantum-header__menu-trigger--expand-menu"
        ).css("display", "block");
        $(".quantum-header")
            .removeClass("quantum-header--menu-panel-visible")
            .removeClass("header-collapse");
        $(".quantum-search-box-input")[0].focus();
    });
    $(".search-close,.quantum-search-btn-close.menu-search-close-button").click(
        function(e) {
            e.preventDefault();
            $(".quantum-search-suggest").css("display", "none");
            $(
                "#searchSubmitBtn-mobile.search-btn,.quantum-header__mobile-content>button.quantum-button:first-child"
            ).css("display", "block");
            $(".search-close,.quantum-search-btn-close.menu-search-close-button").css(
                "display",
                "none"
            );
        }
    );

    /*amgen-investors cta script*/
    $(".amgen-investors").click(function() {
        $(".amgen-investors .quantum-cta__text p.quantum-cta__copy").css(
            "display",
            "block"
        );
        $(".amgen-investors .quantum-button").css("display", "block");
    });

    $(".careers-with-amgen").click(function() {
        $(".careers-with-amgen .quantum-cta__text p.quantum-cta__copy").css(
            "display",
            "block"
        );
        $(".careers-with-amgen .quantum-button").css("display", "block");
    });

    // Home Pafe Feature Article Arrow Link
    $(".breakthrough-series-text").each(function() {
        var lnk = $(this).find(".section-heading a").attr("href");
        $(this).find(".arrow-link").attr("href", lnk);
    });
    $(".breakthrough-series-view-more").each(function() {
        var lnk = $(this).find("a").attr("href");
        $(this).find(".arrow-link").attr("href", lnk);
    });

    //amgen-com-custom.js

    //mobile view header nav code
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 0) {
            if (!$("body").hasClass("fixed-nav")) $("body").addClass("fixed-nav");
        } else {
            if ($("body").hasClass("fixed-nav")) $("body").removeClass("fixed-nav");
        }
    });

    //hamburger menu expand
    $(".quantum-header__menu-trigger--collapse-menu").click(function() {
        $(".quantum-drop-down-menu__list-item:first-child").removeClass("d-none");
    });
    $(".quantum-header__menu-trigger--expand-menu").click(function() {
        $(".quantum-drop-down-menu__list-item:first-child").addClass("d-none");
        var pageHeight = $(document).height() + "px";
        $(".quantum-header__menu").css({
            width: "100vw",
            height: pageHeight,
            top: "58px",
        });
        $(".quantum-drop-down-menu__list-item").removeClass(
            "quantum-drop-down-menu__list-item--dropdown-visible"
        );
        $(
            ".amgensa_home .quantum-drop-down-menu__list-item > .quantum-drop-down-menu__menu,.quantum-search-btn-close.menu-search-close-button,.quantum-search-suggest "
        ).css({ display: "none" });
        $(".quantum-header__mobile-content>button.quantum-button:first-child").css({
            display: "block",
        });
        $(".quantum-drop-down-menu__list-item").show();
        $(".quantum-drop-down-menu__link .quantum-icon").show();
        if ($(".quantum-header").hasClass("quantum-header--menu-panel-visible")) {
            //$("body>div").css({ "margin-right": "0px", "margin-left": "0px" });
            $(
                "#footer, div.quantum-header__mobile-content,div.quantum-header__left"
            ).css({ "margin-right": "0px", "margin-left": "0px" });
            $(".quantum-header__left").css({ left: "0" });
            // cookiepopup
            $("#footer .component .privacy-warning.permisive").css({
                position: "fixed",
            });
        } else {
            $("#footer .component .privacy-warning.permisive").css({
                position: "absolute",
            });
        }
        $(".back-bttn").hide();
    });

    //hamburger menu collapse

    /*$("body>div").click(function() {
        $("header>div").each(function() {
            if ($("div").hasClass("quantum-header--menu-panel-visible")) {
                $(".quantum-header").removeClass("quantum-header--menu-panel-visible");
                $("body>div").css({
                    "margin-right": "0px",
                    left: "0px",
                    "margin-left": "0px",
                });
                $(
                    "div.quantum-header__left, div.quantum-header__mobile-content, #footer"
                ).css({ "margin-right": "0px", left: "0px", "margin-left": "0px" });
                $("div.quantum-header__left").css({ margin: "0 auto" });
            }
        });

        $(".privacy-warning.permisive").css({ "margin-right": "0px", left: "0px" });
    });*/

    //focus search in mobile main nav ,
    $(".search-result-box #searchTextBox-mobile").click(function(e) {
        $("#searchTextBox-mobile").focus();
        e.preventDefault();
    });

    //mobile nav menu click, show sub menu
    $(
        ".quantum-drop-down-menu__list-item.first-level-menulist > a.quantum-drop-down-menu__link"
    ).click(function() {
        if (
            ($(window).width() >= 768 && $(window).width() < 1024) ||
            $(window).width() < 768
        ) {
            $(
                ".quantum-drop-down-menu__list-item,.quantum-drop-down-menu__top-nav-list"
            ).hide();
            $(".quantum-drop-down-menu__list-item:first-child").show();
            $(".quantum-drop-down-menu__list-item.back-bttn").css({
                display: "block",
                height: "55px",
            });
            $(".quantum-drop-down-menu__link .quantum-icon").hide();
            $(this)
                .parent(".quantum-drop-down-menu__list-item")
                .addClass("quantum-drop-down-menu__list-item--dropdown-visible");
            $(".quantum-drop-down-menu__list-item--dropdown-visible").show();
            $(
                ".amgensa_home .quantum-drop-down-menu__list-item > .quantum-drop-down-menu__menu"
            ).css({ display: "inline-block" });
            $(".quantum-drop-down-menu__list-item--dropdown-visible > a").addClass(
                "quantum-prevent-nav"
            );
            $("a.desktop-submenu-right-icon").click(function(e) {
                e.preventDefault();
            });
        }
    });
    var menuText = "Main Menu ";
    $(
        ".quantum-drop-down-menu__list-item.first-level-menulist > ul.quantum-drop-down-menu__menu > li.quantum-drop-down-menu__menu-list-item.second-level-menulist"
    ).click(function(e) {
        if (
            ($(window).width() >= 768 && $(window).width() < 1024) ||
            $(window).width() < 768
        ) {
            $(this).siblings().hide();
            var homeMenuText = $(this)
                .parent("ul.quantum-drop-down-menu__menu")
                .siblings("a.quantum-drop-down-menu__link.quantum-prevent-nav")
                .children("span.quantum-drop-down-menu__link-text")
                .text();
            $(this)
                .parent("ul.quantum-drop-down-menu__menu")
                .siblings("a.quantum-drop-down-menu__link.quantum-prevent-nav")
                .hide();
            var htmlCont = $(
                ".quantum-drop-down-menu__list-item.back-bttn > a.quantum-drop-down-menu__link > span.quantum-drop-down-menu__link-text"
            ).html();
            htmlCont = htmlCont.replace(menuText, homeMenuText);
            menuText = homeMenuText;
            $(
                ".quantum-drop-down-menu__list-item.back-bttn > a.quantum-drop-down-menu__link > span.quantum-drop-down-menu__link-text"
            ).html(htmlCont);
            $(".quantum-drop-down-menu__list-item.back-bttn").addClass("submenu");
            $(".quantum-drop-down-menu__list").addClass("submenu-cont");
        }
    });

    //back button click functionality
    $(".quantum-drop-down-menu__list-item.back-bttn").click(function(e) {
        if ($(".quantum-drop-down-menu__list-item.back-bttn").hasClass("submenu")) {
            $(
                ".quantum-drop-down-menu__list-item.quantum-drop-down-menu__list-item--dropdown-visible > a.quantum-drop-down-menu__link.quantum-prevent-nav"
            ).show();
            $(
                    ".quantum-drop-down-menu__list-item.quantum-drop-down-menu__list-item--dropdown-visible > a.quantum-drop-down-menu__link.quantum-prevent-nav"
                )
                .siblings("ul.quantum-drop-down-menu__menu")
                .children("li.quantum-drop-down-menu__menu-list-item")
                .show();
            var htmlCont = $(
                ".quantum-drop-down-menu__list-item.back-bttn > a.quantum-drop-down-menu__link > span.quantum-drop-down-menu__link-text"
            ).html();
            htmlCont = htmlCont.replace(menuText, "Main Menu ");
            menuText = "Main Menu ";
            $(
                ".quantum-drop-down-menu__list-item.back-bttn > a.quantum-drop-down-menu__link > span.quantum-drop-down-menu__link-text"
            ).html(htmlCont);
            $(".quantum-drop-down-menu__list-item.back-bttn").removeClass("submenu");
            $(".quantum-drop-down-menu__list").removeClass("submenu-cont");
        } else {
            $(".quantum-drop-down-menu__list-item--dropdown-visible > a").removeClass(
                "quantum-prevent-nav"
            );
            $(".quantum-drop-down-menu__list-item").removeClass(
                "quantum-drop-down-menu__list-item--dropdown-visible"
            );
            $(
                ".amgensa_home .quantum-drop-down-menu__list-item > .quantum-drop-down-menu__menu"
            ).css({ display: "none" });
            $(
                ".quantum-drop-down-menu__list-item,.quantum-drop-down-menu__top-nav-list"
            ).show();
            $(".quantum-drop-down-menu__list-item.back-bttn").css({
                display: "none",
            });
        }
        e.preventDefault();
    });

    //web resources click hide and show
    $("#webresources_link").click(function(e) {
        if ($(".webresources:visible").length) {
            $(".webresources").hide();
            $(".WebResources").removeClass("active");
            var headerHeight = $(".header-nav").height();
            $(".banner-div").css("top", headerHeight);
        } else {
            $(".webresources").show();
            $(".worldwidelinks").hide();
            $(".AmgenWW").removeClass("active");
            $(".quantum-search-suggest").hide();
            $(".quantum-top-nav__search-link").removeClass("active");
            $(".WebResources").addClass("active");
            var headerHeight = $(".header-nav").height();
            $(".banner-div").css("top", headerHeight);
            e.preventDefault();
            e.stopPropagation();
        }
        e.preventDefault();
    });

    $(".webresources").click(function(e) {
        e.stopPropagation();
    });

    $(".worldwidelinks").click(function(e) {
        e.stopPropagation();
    });

    $(".quantum-search-suggest").click(function(e) {
        e.stopPropagation();
    });

    $(".AmgenWW").click(function(e) {
        if ($(".worldwidelinks:visible").length) {
            $(".worldwidelinks").hide();
            $(".AmgenWW").removeClass("active");
            var headerHeight = $(".header-nav").height();
            $(".banner-div").css("top", headerHeight);
        } else {
            $(".worldwidelinks").show();
            $(".webresources").hide();
            $(".WebResources").removeClass("active");
            $(".quantum-search-suggest").hide();
            $(".quantum-top-nav__search-link").removeClass("active");
            $(".AmgenWW").addClass("active");
            var headerHeight = $(".header-nav").height();
            $(".banner-div").css("top", headerHeight);
            e.stopPropagation();
            e.preventDefault();
        }
        e.preventDefault();
    });

    $(document).click(function(e) {
        $(".webresources").hide();
        $(".WebResources").removeClass("active");
        var headerHeight = $(".header-nav").height();
        $(".banner-div").css("top", headerHeight);
        $(".worldwidelinks").hide();
        $(".AmgenWW").removeClass("active");
        var headerHeight = $(".header-nav").height();
        $(".banner-div").css("top", headerHeight);

        if ($(window).width() >= 768 && $(window).width() < 1024) {
            if (
                $(event.target).attr("class") !=
                "span.quantum-drop-down-menu__link-text"
            ) {
                if (
                    $(this).parent().attr("id") != "webresources_link" ||
                    $(this).parent().attr("class") != "AmgenWW"
                ) {
                    $(".quantum-drop-down-menu__list-item").removeClass(
                        "tab-menu-visible"
                    );
                }
            }
        }
    });

    //side menu navigation active class setting

    var currentPage = location.pathname;
    $(".amgensa_global .col-md-4.col-lg-3 .quick-resources a").each(function() {
        currElementPath = $(this).attr("href");
        if (currentPage == currElementPath) {
            $(this).addClass("active");
        }
    });

    $(".amgensa_global .col-md-4.col-lg-3 .related-links a").each(function() {
        currElementPath = $(this).attr("href");
        if (currentPage == currElementPath) {
            $(this).hide();
        }
    });

    // TEST PAGE ACTIVE CLASS SETTING
    $(
        ".amgensa_testpage .col-md-4.col-lg-3 .quick-resources .quantum-list-group__item"
    ).each(function(e) {
        currElementPath = $(this).find(">:first-child").attr("href");
        if (currentPage == currElementPath) {
            $(this).addClass("active");
            if ($(this).find("ul.quantum-list-group__nested-list").length !== 0) {
                $(this).children().show();
            }

            if (
                $(".quick-container.active").parents(
                    ".quantum-list-group__nested-list"
                ) !== 0
            ) {
                $(".quick-container.active")
                    .parents(".quantum-list-group__nested-list")
                    .show();
                $(".quick-container.active")
                    .parents(".quantum-list-group__nested-list")
                    .closest(".quantum-list-group__item")
                    .addClass("subMenuHeading");
            }
        }
    });

    // cookies margin
    $("#footer .component .privacy-warning.permisive .close").click(function() {
        $(
            ".amgensa_home #footer .quantum-container--primary.quantum-footer"
        ).addClass("footerMarginZero");
    });

    if (
        $(".privacy-warning").height() == undefined ||
        $(".privacy-warning").height() == 0
    ) {
        $(
            ".amgensa_home #footer .quantum-container--primary.quantum-footer"
        ).addClass("footerMarginZero");
    }

    //hero-div banner overlay height
    var divHeight = $(".quantum-hero__inner").height();
    $(".banner-div").css("height", divHeight + "px");

    //Form Validations

    $("#medicalQuestionForm #submit").click(function(e) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($("#name").length == 0 || $("#name").val() == "") {
            $(".errormessage").show();
            $("#name").focus();
            e.preventDefault();
        } else if ($("#country").length == 0 || $("#country").val() == "") {
            $(".errormessage").show();
            $("#country").focus();
            e.preventDefault();
        } else if ($("#telephone").length == 0 || $("#telephone").val() == "") {
            $(".errormessage").show();
            $("#telephone").focus();
            e.preventDefault();
        } else if ($("#question").length == 0 || $("#question").val() == "") {
            $(".errormessage").show();
            $("#question").focus();
            e.preventDefault();
        } else if ($("#email").length == 0 || $("#email").val() == "") {
            $(".errormessage").show();
            $("#email").focus();
            e.preventDefault();
        } else if (!regex.test($("#email").val())) {
            $(".emailerrormessage").show();
            $(".errormessage").hide();
            $("#email").focus();
            e.preventDefault();
        } else if ($("#form_type").val == "none" || $("#form_type").val() == "") {
            $(".errormessage").show();
            $("#form_type").first.focus();
            e.preventDefault();
        } else if (
            document.getElementById("ReCaptchContainer").children.length > 0 &&
            $("input[name=reCaptchaVersion]").val() != "v3"
        ) {
            if (grecaptcha.getResponse().length <= 0) {
                $(".quantum-form__field-error-text").hide();
                e.preventDefault();
            }
            if (typeof grecaptcha != "undefined") {
                var response = grecaptcha.getResponse();
                response.length === 0 ?
                    (message = lblErrorMessage) :
                    (message = successMessage);
            }
            $("#lblMessage").html(message);
            $("#lblMessage").css(
                "color",
                message.toLowerCase() == successMessage.toLowerCase() ? "green" : "red"
            );
        } else {
            $(".errormessage").hide();
            $(".emailerrormessage").hide();
            $(".quantum-form__field-error").hide();
            $(".quantum-form__field-error-text").hide();
        }
    });

    $("#ReportAdverseEventForm #submit").click(function(e) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($("#name").length == 0 || $("#name").val() == "") {
            $(".errormessage").show();
            $("#name").focus();
            e.preventDefault();
        } else if ($("#telephone").length == 0 || $("#telephone").val() == "") {
            $(".errormessage").show();
            $("#telephone").focus();
            e.preventDefault();
        } else if (
            $("#adverse_event_desc").length == 0 ||
            $("#adverse_event_desc").val() == ""
        ) {
            $(".errormessage").show();
            $("#question").focus();
            e.preventDefault();
        } else if ($("#email").length == 0 || $("#email").val() == "") {
            $(".errormessage").show();
            $("#email").focus();
            e.preventDefault();
        } else if (!regex.test($("#email").val())) {
            $(".emailerrormessage").show();
            $(".errormessage").hide();
            $("#email").focus();
            e.preventDefault();
        } else if (
            document.getElementById("ReCaptchContainer").children.length > 0 &&
            $("input[name=reCaptchaVersion]").val() != "v3"
        ) {
            if (grecaptcha.getResponse().length <= 0) {
                $(".quantum-form__field-error-text").hide();
                e.preventDefault();
            }
            if (typeof grecaptcha != "undefined") {
                var response = grecaptcha.getResponse();
                response.length === 0 ?
                    (message = lblErrorMessage) :
                    (message = successMessage);
            }
            $("#lblMessage").html(message);
            $("#lblMessage").css(
                "color",
                message.toLowerCase() == successMessage.toLowerCase() ? "green" : "red"
            );
        } else {
            $(".errormessage").hide();
            $(".emailerrormessage").hide();
            $(".quantum-form__field-error").hide();
            $(".quantum-form__field-error-text").hide();
        }
    });

    if ($(".amgensa_medquestion").length > 0) {
        $(document).ready(function() {
            $(".quantum-form__field-error").hide();
        });
    }

    //Arabic breadcrumb-aligment
    var breadCrumbText = document.querySelector("#breadcrumbContainer a");
    if (breadCrumbText != null) {
        var mainText = breadCrumbText.text.trim();
        var arRegExp = /[\u0600-\u06FF]/;
        if (arRegExp.test(mainText)) {
            $("#breadcrumbContainer .component-content > span").addClass(
                "breadCrumbArabic"
            );
            $("#breadcrumbContainer .component-content > div").addClass(
                "breadCrumbArabic"
            );
        } else {
            $("#breadcrumbContainer .component-content > span").removeClass(
                "breadCrumbArabic"
            );
            $("#breadcrumbContainer .component-content > div").removeClass(
                "breadCrumbArabic"
            );
        }
    }

    /******japan main menu click*************/
    $(".amgenjp_home a.quantum-prevent-nav").click(function() {
        redirectURL = $(
            ".amgenjp_home .quantum-drop-down-menu__list-item--dropdown-visible > a"
        ).attr("href");
        window.open(redirectURL, "_self");
    });

    /*tabs click - leadership page*/

    $(".quantum-tabs__label").click(function() {
        $(this).addClass("quantum-tabs__label--selected");
    });

    $(".field-heading").click(function() {
        var aPaneId = $(this).parent().attr("href");
        var paneId = aPaneId.slice(1, aPaneId.length);
        var tabs_pane = document.getElementsByClassName("quantum-tabs__pane tab");
        var tabs = document.getElementsByClassName("quantum-tabs__label");
        var paneToOpen;
        for (let i = 0; i < tabs_pane.length; i++) {
            if (tabs_pane[i].getAttribute("id").localeCompare(paneId) == 0) {
                paneToOpen = tabs_pane[i];
            }
            tabs_pane[i].classList.remove("quantum-tabs__pane--visible");
            tabs[i].classList.remove("quantum-tabs__label--selected");
        }
        paneToOpen.classList.add("quantum-tabs__pane--visible");
    });

    /*tabs click - leadership page - ends*/
    /*Leadership page tabs IE */
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        $(".quantum-tabs li:first").addClass("quantum-tabs__label--selected");
        $(".quantum-tabs__pane.tab:first-child").addClass(
            "quantum-tabs__pane--visible"
        );

        $(".quantum-tabs").each(function() {
            var tabsvar = $(this).data("tabsvar");
            if (tabsvar != undefined && tabsvar != "") {
                $(this).addClass(tabsvar);
            }
            $("this li:first").addClass("quantum-tabs__label--selected");
        });
        $(".quantum-tabs__label-text").click(function() {
            var href = $(this).attr("href");
            if (href.length) {
                $(this)
                    .parents(".quantum-tabs__labels")
                    .siblings(".quantum-tabs__panes")
                    .children(".quantum-tabs__pane")
                    .removeClass("quantum-tabs__pane--visible");
                $(href).addClass("quantum-tabs__pane--visible");
                $(this)
                    .parents(".quantum-tabs__label")
                    .removeClass("quantum-tabs__label--selected");
                $(this)
                    .parents(".quantum-tabs__label")
                    .siblings()
                    .removeClass("quantum-tabs__label--selected");
                $(this)
                    .parents(".quantum-tabs__label")
                    .addClass("quantum-tabs__label--selected");
            }
        });
    }

    /*Leadership page tabs IE Ends*/

    /*******stackable plugin for the Clincal Trials Support Numbers page*********/
    if ($("body").hasClass("clinical-support-page")) {
        $("#responsive-table-one").stacktable({ myClass: "your-class-name" });
        $("#responsive-table-two").stacktable({ myClass: "your-class-name" });
    } else {}

    // Leadership Page Tab highlights JS starts
    var currentPage = location.pathname;
    if (currentPage === "/about/leadership") {
        let hash = location.hash;
        $(
            ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label.quantum-tabs__label--selected"
        ).removeClass("quantum-tabs__label--selected");
        if (hash === "#board-of-directors" || hash === "#bod") {
            $(
                ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(2) .field-heading"
            ).click();
        } else if (hash === "#scientific-advisory-boards" || hash === "#sab") {
            $(
                ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(3) .field-heading"
            ).click();
        } else {
            $(
                ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label:first-child .field-heading"
            ).click();
        }
    }
    // Leadership Page Tab highlights JS ends

    // World Wide Page Tab highlights JS starts
    var currentPage = location.pathname;
    if (currentPage === "/amgen-worldwide") {
        let hash = location.hash;
        $(
            ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label.quantum-tabs__label--selected"
        ).removeClass("quantum-tabs__label--selected");
        if (hash === "#more-from-amgen") {
            $(
                ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(2) .field-heading"
            ).click();
        } else {
            $(
                ".quantum-tabs .quantum-tabs__labels .quantum-tabs__labels-inner .quantum-tabs__label:first-child .field-heading"
            ).click();
        }
    }
    // World Wide Page Tab highlights JS ends
    // function to scroll to top of page
    function scrollToTop() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }


    // worldwide Page select functionality  Starts
    if ($(window).width() < 768) {
        $(".world-wide-web .main-container-wrapper .quantum-tabs__labels").append(
            '<div class="select-container">' +
            "   <select>" +
            "   </select>" +
            "</div>"
        );
        $(
            ".world-wide-web .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading"
        ).each(function() {
            $(".world-wide-web .select-container select").append(
                "<option value='" + $(this).html() + "'>" + $(this).html() + "</option>"
            );
        });
        $(".world-wide-web .select-container select").change(function() {
            var selectedOption = $(this).val();
            $(
                ".world-wide-web .main-container-wrapper .quantum-tabs__label a .field-heading"
            ).each(function() {
                if ($(this).html() == selectedOption) $(this).click();
            });
        });
    }

    $(".quantum-drop-down-menu__list-item.right-links-search a").attr(
        "tabindex", -1
    );
    $(".quantum-drop-down-menu__list-item.right-links-search a button").attr(
        "tabindex", -1
    );
    $(".breadcrumb .breadcrumb-item.last a").each(function() {
        $(this).attr("tabindex", -1);
    });
    // $("footer .quantum-footer__links-row a:odd").each(function() {
    //     $(this).attr("tabindex", -1);
    // });

    // Adding Bootstrap link for table
    if ($("body.sub-page div.table-responsive>table.table").length > 0) {
        $("head").prepend(
            "<link rel='stylesheet' href='../maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css'>"
        );
        $(".sub-page .main-content-container .row.column-splitter").addClass(
            "no-wrap-flex"
        );
    }

    // Contact-us
    if ($(window).width() < 768 && $("body").hasClass("contact-us")) {
        var rightNavHeight = 0;
        $(".contact-us .main-content-container").each(function() {
            rightNavHeight = rightNavHeight + $(this).height();
        });
        rightNavHeight =
            rightNavHeight + $(".contact-us .rich-text.patient-assistance").height();
        $(
            ".contact-us .main-content-container .right-nav>.navigation.navigation-title"
        ).css("top", rightNavHeight + "px");
    }

    // Press Releases Page starts
    if ((currentPage = "/newsroom/press-releases")) {
        var firstOption = $("#Years").find("option:first-child").val();
        $("#Years").val(firstOption);
    }
    // Press Releases Page ends

    //script summary of data page starts
    if ($("body").hasClass("summary-of-data")) {
        $("#summary-energy").stacktable();
        $("#summary-carbon").stacktable();
        $("#summary-other-carbon").stacktable();
        $("#summary-water").stacktable();
        $("#summary-waste").stacktable();
        $("#summary-fleet").stacktable();
        $("#summary-compliance").stacktable();

        $("#notes-general").stacktable();
        $("#notes-energy").stacktable();
        $("#notes-carbon").stacktable();
        $("#notes-other-carbon").stacktable();
        $("#notes-water").stacktable();
        $("#notes-waste").stacktable();
        $("#notes-fleet").stacktable();
        $("#notes-compliance").stacktable();

        //Hightlight Assurance tab
        if (window.location.hash && window.location.hash.length > 0) {
            var item = window.location.hash.substring(1, window.location.hash.length);
            var label = $('.quantum-tabs__labels ul li').children();
            for (var i = 0; i < label.length; i++) {
                console.log(label.eq(i).attr('name'));
                if (label.eq(i).attr('name').toLowerCase() == item) {
                    $(this).find(".field-heading").click();
                }

            }
        }

        // Toggle tables depending on media width
        $(".sub-page .summary-content-container h3 a").click(function(e) {
            e.preventDefault();
            //console.log($(this).parent('tr'));
            var tog = $(this).attr("id");
            if (window.matchMedia("(max-width: 800px)").matches) {
                $(this).parents().children(".small-only").slideToggle(100);
            } else {
                $(this).parents().children(".large-only").slideToggle(100);
            }

            var iconClass = $(this).children().hasClass("fa-plus-square-o") ?
                "fa-minus-square-o" :
                "fa-plus-square-o";
            $(this)
                .find("em")
                .removeClass()
                .addClass("fa " + iconClass + " fa-lg");
            return false;
        });

        // if media width changes, reset the table
        if ($(window).width() > 576) {
            $(window).resize(function() {
                $(".fa-minus-square-o")
                    .removeClass()
                    .addClass("fa fa-plus-square-o fa-lg");
                $(".small-only").css("display", "none");
                $(".large-only").css("display", "none");
            });
        }

        // hide all, show all functions

        $(".all-show-data").click(function() {
            $("[data-nav-data]").removeClass().addClass("fa fa-minus-square-o fa-lg");
            if (window.matchMedia("(max-width: 800px)").matches) {
                $(".data.small-only").css("display", "table");
            } else {
                $(".data.large-only").css("display", "table");
            }
        });

        $(".all-hide-data").click(function() {
            $("[data-nav-data]").removeClass().addClass("fa fa-plus-square-o fa-lg");
            if (window.matchMedia("(max-width: 800px)").matches) {
                $(".data.small-only").css("display", "none");
            } else {
                $(".data.large-only").css("display", "none");
            }
        });

        $(".all-show-notes").click(function() {
            $("[data-nav-notes]")
                .removeClass()
                .addClass("fa fa-minus-square-o fa-lg");
            if (window.matchMedia("(max-width: 800px)").matches) {
                $(".notes.small-only").css("display", "table");
            } else {
                $(".notes.large-only").css("display", "table");
            }
        });

        $(".all-hide-notes").click(function() {
            $("[data-nav-notes]").removeClass().addClass("fa fa-plus-square-o fa-lg");
            if (window.matchMedia("(max-width: 800px)").matches) {
                $(".notes.small-only").css("display", "none");
            } else {
                $(".notes.large-only").css("display", "none");
            }
        });
    }
    //script summary of data page ends


    // Carousel Animation starts
    if ($("#banner-carousel").length > 0 && window.location.pathname == "/test-science") {
        $("#banner-carousel").hide(); // Hide the exisitng carousel

        $("#carousel").addClass("carousel-fade");

        // Copy the content from exisiting carousel to bootstrap carousel
        var count = 0;
        $("#banner-carousel .slides .slide").each(function() {
            var childSelector = count == 0 ? "first-child" : "nth-child($)".replace("$", count + 1)
            $("#carousel .carousel-inner .carousel-item:" + childSelector + " .slide").html($(this).html());
            count++;

            $("#carousel .carousel-inner .carousel-item:" + childSelector + " .slide")
                .find(".prev-text")
                .attr("data-slide", "prev")
                .attr("href", "#carousel")

            $("#carousel .carousel-inner .carousel-item:" + childSelector + " .slide")
                .find(".next-text")
                .attr("data-slide", "next")
                .attr("href", "#carousel")
        });
    }


    // Scroll to top on pages where tab component is present
    $(window).on('pagehide', function() {
        if ($('.quantum-tabs').length > 0) {
            if (window.document.documentMode) {
                scrollToTop();
            } else $(window).scrollTop(0);

        }
    });

    // Remove the date field from DOM in spotlight tiles if no date has been provided
    if ($(".wb-tiles").length > 0) {
        $(".wb-tiles").each(function() {
            if ($(this).find(".wb-content .wb-details .wb-date").html() == "") {
                $(this).find(".wb-content .wb-details .wb-date").remove();
            }
        })
    }

    //Remove id attr of anchor tag for 404 and 500 page  
    if ($("body").hasClass("page-error")) {
        $(".redirect-searchBtn").removeAttr("id");
    }
});