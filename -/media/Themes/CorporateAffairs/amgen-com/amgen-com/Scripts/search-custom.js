$(document).ready(function () {
  $(".gtm-header.external-link").click(function (event) {
    event.trigger();
  });

  /****HEADER SEARCH FUNCTIONALITY****/
  -$(".quantum-top-nav__search-link").on("click", function () {
    if ($(".quantum-search-suggest:visible").length) {
      $(".quantum-top-nav__warning").css("display", "block");
      $(".quantum-top-nav__links").css("visibility", "visible");
      $("label").css("display", "block");
      $(".icon-srch").css("display", "block");
      $(".quantum-search-suggest").css("display", "none");
      $(".quantum-top-nav__search-link").removeClass("active");
      $(".banner-div").css({ top: "50px" });
    } else {
      $(".quantum-top-nav__warning").css("display", "none");
      $(".quantum-top-nav__links").css("visibility", "visible");
      $("label").css("display", "none");
      $(".icon-srch").css("display", "none");
      $(".quantum-search-suggest").css("display", "block");
      $(".quantum-top-nav__search-link").addClass("active");
      $(".WebResources").removeClass("active");
      $(".AmgenWW").removeClass("active");
      $(".webresources").hide();
      $(".worldwidelinks").hide();
      $(".banner-div").css({ top: "157px" });
      if (
        /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        if (window.innerHeight > window.innerWidth) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height() + 16;
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
        } else if (window.innerWidth > window.innerHeight) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height() + 32;
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
        }
      } else if (/iPhone|iPod/i.test(navigator.userAgent)) {
        if (window.innerHeight > window.innerWidth) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height();
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
            $(".quantum-search-box-button-with-redirect").css(
              "margin-top",
              "7px"
            );
            $(".quantum-search-suggest .quantum-search-btn-close").css(
              "margin-top",
              "10px !important"
            );
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
            $(".quantum-search-box-button-with-redirect").css(
              "margin-top",
              "7px"
            );
            $(".quantum-search-suggest .quantum-search-btn-close").css(
              "margin-top",
              "10px !important"
            );
          }
        } else if (window.innerWidth > window.innerHeight) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height();
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
        }
      } else if (/iPad/i.test(navigator.userAgent)) {
        if (window.innerHeight > window.innerWidth) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height() + 34;
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
        } else if (window.innerWidth > window.innerHeight) {
          if ($(".quantum-indications").css("display") == "block") {
            var height = $(".quantum-indications").height();
            var top = height + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
          if ($(".quantum-indications").css("display") == "none") {
            var top = 0 + "px";
            $(".quantum-search-suggest").css({
              top: top,
            });
          }
        }
      } else {
        if ($(".quantum-indications").css("display") == "block") {
          var height = $(".quantum-indications").height() + 32;
          var top = height + "px";
          $(".quantum-search-suggest").css({
            top: top,
          });
        }
        if ($(".quantum-indications").css("display") == "none") {
          var top = 0 + "px";
          $(".quantum-search-suggest").css({
            top: top,
          });
        }
      }
    }
  });

  // Function for hamburger menu click (Mobile).
  $(".quantum-header .quantum-header__menu-trigger").on("click", function () {
    if ($(".quantum-header").hasClass("header-collapse")) {
      // If the menu panel is already visible, remove the --menu-panel-visible modifier class to hide the menu
      $(".quantum-header").removeClass("header-collapse");
      // $('.quantum-header__mobile-content button:first-of-type').css('display', 'block');
      $(".quantum-header__mobile-content button:nth-of-type(2)").css(
        "display",
        "block"
      );
      $(".quantum-header__mobile-content button:last-of-type").css(
        "display",
        "none"
      );
    } else {
      // The menu is not visible, add the modifier class instead
      $(".quantum-header").addClass("header-collapse");
      // $('.quantum-header__mobile-content button:first-of-type').css('display', 'none');
      $(".quantum-header__mobile-content button:nth-of-type(2)").css(
        "display",
        "none"
      );
      $(".quantum-header__mobile-content button:last-of-type").css(
        "display",
        "block"
      );
    }
  });

  // Function for search close icon click.
  $(".quantum-search-btn-close").on("click", function () {
    $(".quantum-top-nav__warning").css("display", "block");
    $(".quantum-top-nav__links").css("visibility", "visible");
    $(".quantum-drop-down-menu").css("min-height", "85px");
    $('.quantum-search-box-input[type="text"]').val("");
    $(".quantum-search-suggest").css("display", "none");
  });

  //To Disable the Redirecting of Dropdown main menu on clickevent.

  $(".quantum-drop-down-menu__link.first-level").on("click", function (e) {
    e.preventDefault();
  });
});
