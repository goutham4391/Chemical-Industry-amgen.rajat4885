 // function to scroll to top of page
 function scrollToTop() {
     $("html, body").animate({ scrollTop: 0 }, "slow");
 }

 $(document).ready(function() {
     // History Page Starts
     var flagPaginationForScroll = false;
     if ($(window).width() < 768) {
         $(".amgen-history .main-container-wrapper .quantum-tabs__labels").append(
             '<div class="select-container">' +
             "   <select>" +
             "   </select>" +
             "</div>"
         );
         $(
             ".amgen-history .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading"
         ).each(function() {
             $(".amgen-history .select-container select").append(
                 "<option " +
                 "value=" +
                 $(this).html() +
                 " >" +
                 $(this).html() +
                 "</option>"
             );
         });
         $(".amgen-history .select-container select").change(function() {
             var year = $(this).val();
             $(
                 ".amgen-history .main-container-wrapper .quantum-tabs__label a .field-heading"
             ).each(function() {
                 if ($(this).html() == year) $(this).click();
             });
         });
     }
     // Pagination Starts
     function paginationOnHistoryPage() {
         $(".amgen-history .pagination li.disabled").removeClass("disabled");
         var activeYear = $(
             ".amgen-history .quantum-tabs__labels-inner .quantum-tabs__label.quantum-tabs__label--selected .field-heading"
         ).html();
         // Check whether it is the first or last year
         if (
             $(
                 ".amgen-history .quantum-tabs__labels-inner .quantum-tabs__label:first-child .quantum-tabs__label-text .field-heading"
             ).html() == activeYear
         ) {
             $(".amgen-history .pagination #next-page").show();
             $(".amgen-history .pagination #prev-page").hide(); // hide previous year option
             $(".amgen-history .pagination #next-page a span").html(
                 parseInt(activeYear) + 10 + "s"
             );
         } else if (
             $(
                 ".amgen-history .quantum-tabs__labels-inner .quantum-tabs__label:last-child .quantum-tabs__label-text .field-heading"
             ).html() == activeYear
         ) {
             $(".amgen-history .pagination #prev-page").show();
             $(".amgen-history .pagination #next-page").hide(); // hide next year option
             $(".amgen-history .pagination #prev-page a span").html(
                 parseInt(activeYear) - 10 + "s"
             );
         } else {
             $(".amgen-history .pagination #prev-page").show();
             $(".amgen-history .pagination #next-page").show();
             // Replace previous and next year with appropriate numbers
             $(".amgen-history .pagination #prev-page a span").html(
                 parseInt(activeYear) - 10 + "s"
             );
             $(".amgen-history .pagination #next-page a span").html(
                 parseInt(activeYear) + 10 + "s"
             );
         }
         if (flagPaginationForScroll) scrollToTop();
         flagPaginationForScroll = false;
     }
     if (window.location.pathname == "/about/amgen-history") paginationOnHistoryPage();

     // Add Event Listeners
     $(".amgen-history .pagination li a").click(function() {
         flagPaginationForScroll = true;
         var targetYear = $(this).find("span").html();
         $(
             ".amgen-history .main-container-wrapper .quantum-tabs__labels-inner .quantum-tabs__label .field-heading"
         ).each(function() {
             if ($(this).html() == targetYear) $(this).click();
         });
         // Change dropdown in mobile view
         if ($(window).width() < 768) {
             $(
                 ".amgen-history .main-container-wrapper .quantum-tabs__labels .select-container select"
             ).val(targetYear);
         }
     });
     $(
         ".amgen-history .main-container-wrapper .quantum-tabs__label a .field-heading"
     ).click(function() {
         setTimeout(paginationOnHistoryPage, 500);
     });
     // Pagination ends
     // History Page ends
 });