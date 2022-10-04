 // function to scroll to top of page
 function scrollToTop() {
     $("html, body").animate({ scrollTop: 0 }, "slow");
 }



 $(document).ready(function() {
     // Awards and Accolades Page Starts
     var flagPaginationForScroll = false;

     if ($(window).width() < 768) {
         $(
             ".awards-and-accolades .main-container-wrapper .quantum-tabs__labels"
         ).append(
             '<div class="select-container">' +
             "   <select>" +
             "   </select>" +
             "</div>"
         );
         $(
             ".awards-and-accolades .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading"
         ).each(function() {
             $(".awards-and-accolades .select-container select").append(
                 "<option " +
                 "value=" +
                 $(this).html() +
                 " >" +
                 $(this).html() +
                 "</option>"
             );
         });
         $(".awards-and-accolades .select-container select").change(function() {
             var year = $(this).val();
             $(
                 ".awards-and-accolades .main-container-wrapper .quantum-tabs__label a .field-heading"
             ).each(function() {
                 if ($(this).html() == year) $(this).click();
             });
         });
     }

     // Pagination Starts
     function paginationOnAwardsPage() {
         $(".awards-and-accolades .pagination li.disabled").removeClass("disabled");
         var activeYear = $(".awards-and-accolades .quantum-tabs__labels-inner .quantum-tabs__label.quantum-tabs__label--selected .field-heading").html();
         // Check whether it is the first or last year
         if (
             $(".awards-and-accolades .quantum-tabs__labels-inner .quantum-tabs__label:first-child .quantum-tabs__label-text .field-heading").html() == activeYear
         ) {
             $(".awards-and-accolades .pagination #next-page").show();
             $(".awards-and-accolades .pagination #prev-page").hide(); // hide previous year option
             $(".awards-and-accolades .pagination #next-page a span").html(
                 parseInt(activeYear) - 1
             );
         } else if (
             $(".awards-and-accolades .quantum-tabs__labels-inner .quantum-tabs__label:last-child .quantum-tabs__label-text .field-heading").html() == activeYear
         ) {
             $(".awards-and-accolades .pagination #prev-page").show();
             $(".awards-and-accolades .pagination #next-page").hide(); // hide next year option
             $(".awards-and-accolades .pagination #prev-page a span").html(
                 parseInt(activeYear) + 1
             );
         } else {
             $(".awards-and-accolades .pagination #prev-page").show();
             $(".awards-and-accolades .pagination #next-page").show();
             // Replace previous and next year with appropriate numbers
             $(".awards-and-accolades .pagination #prev-page a span").html(
                 parseInt(activeYear) + 1
             );
             $(".awards-and-accolades .pagination #next-page a span").html(
                 parseInt(activeYear) - 1
             );
         }
         if (flagPaginationForScroll) scrollToTop();
         flagPaginationForScroll = false;
     }

     // redirect to correct tab on basis of hash
     function hashChangeOnAwardsPage() {
         setTimeout(function() {
             var year = window.location.hash.substring(1);
             $(".awards-and-accolades .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading").each(function() {
                 if ($(this).html() == year) {
                     $(this).parent().click();
                 }
             });
         }, 0);
     }

     // Add Event Listeners
     $(".awards-and-accolades .pagination li a").click(function() {
         flagPaginationForScroll = true;
         var targetYear = $(this).find("span").html();
         $(".awards-and-accolades .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading").each(function() {
             if ($(this).html() == targetYear) $(this).click();
         });
         // Change dropdown in mobile view
         if ($(window).width() < 768) {
             $(
                 ".awards-and-accolades .main-container-wrapper .quantum-tabs__labels .select-container select"
             ).val(targetYear);
         }
     });

     $(".awards-and-accolades .main-container-wrapper .quantum-tabs__label a .field-heading").click(function() {
         setTimeout(paginationOnAwardsPage, 0);
     });
     // Pagination ends

     function foo() {
         if ($(window).width() < 768) {
             $(".awards-and-accolades .main-container-wrapper .quantum-tabs__labels .select-container select").val(year);
         }
     }

     if (window.location.pathname == "/about/awards-and-accolades") {
         //  hashChangeOnAwardsPage();
         paginationOnAwardsPage();
         window.addEventListener('hashchange', function(event) {
             event.stopImmediatePropagation();
         });
     }
 });