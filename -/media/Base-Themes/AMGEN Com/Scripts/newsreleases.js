// on crée une variable pour stocker l'état de AJAX
var ajaxIsRunning = false;

// quand AJAX est déclenché, on fait signe à notre variable
$(document).ajaxStart(function() {
    ajaxIsRunning = true;
});

//quand AJAX a finit son boulot, on fait signe à notre variable
$(document).ajaxStop(function() {
    ajaxIsRunning = false;
});




(function($) {
    "use strict";

    // variables
    var $newsReleaseListings = $('.m-listings #news-release-listings .listings'), // Liste des articles
        $newsReleaseRootId = $("#rootId").val(), // Champs caché
        $newsReleaseYearDdl = $('.m-listings #Years'), // Select year
        $newsReleaseSearchBar = $('.m-listings #search-newsreleases'), // Barre de recherche
        $newsReleaseSearchButton = $('.m-listings button.search-submit'), // Bouton submit
        $newsReleaseMonthMarkup = '<div class="listing-months"><h2 class="first">MONTH_NAME</h2><div class="articles-by-month"><ul>',
        $newsReleaseMarkup = '<li id="article-NR_INDEX"><p class="article-date">NR_DATE</p><img src="/-/media/Themes/CorporateAffairs/amgen-com/amgen-com/images/amgencommigration/Common/Icons/arrow-long.svg" class="arrow-link"><a href="NR_URL">NR_TITLE</a></li>',
        $newsReleaseCloseMonthMarkup = '</ul></div></div>',
        $spinnerHtml = '<div id="loading" class="clearfix"><div class="spinner"><div class="cube1"></div><div class="cube2"></div></div></div>', // Cube tournant
        $spinnerSelector = '#loading',

        $filterYear = Number($newsReleaseYearDdl.find('option:selected').text()),
        $resultIndex = 0,
        $loadMore = true,
        $searchModeSearchTerm = '',
        $searchModeCurrentMonth = '',
        $searchModeViewPerPage = 50,
        $searchModePage = 0,
        $currentWaypoint = null;

    var clearResult;
    var eventOver;

    function ResetSearch() {
        $searchModeSearchTerm = '';
        $searchModePage = 0;
        $searchModeCurrentMonth = '';
        if ($currentWaypoint) {
            $currentWaypoint.destroy();
        }
    }

    function ClearResults() {
        $newsReleaseListings.find('.listing-months').remove();
        $resultIndex = 0;
        $loadMore = true;

    }


    // HTML Encode/Decode method from http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
    function htmlEscape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function htmlUnescape(value) {
        return String(value)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }


    function SearchNewsReleases(isNewSearch, searchTerm) {
        // new search
        if (isNewSearch) {
            ResetSearch();
            $searchModeSearchTerm = searchTerm;
        }
        // existing search (load more)
        else {
            // no more results, exit
            if (!$loadMore) {
                $currentWaypoint = null;
                return;
            }
            searchTerm = $searchModeSearchTerm;
        }
        // empty search term, reset to original list
        if (searchTerm.length == 0) {
            ResetSearch();
            ClearResults();
            GetNewsReleaseMarkup();
        }
        // search term length valid
        else if (searchTerm.length > 2) {
            // set spinning wheel
            if (isNewSearch) {
                $newsReleaseListings.html('').after($spinnerHtml);
            } else {
                $newsReleaseListings.after($spinnerHtml);
            }

            // set query parameters
            var params = {
                searchTerm: $searchModeSearchTerm,
                pageNumber: $searchModePage,
                showPerPage: $searchModeViewPerPage,
                rootId: $newsReleaseRootId
            };
            $searchModePage++;
            // set query command
            var json = JSON.stringify(params);
            var searchMethod = 'SearchReleases';
            if ($('.m-fn-listings').length > 0) {
                searchMethod = 'SearchFeaturedNews';
            }
            if ($('.m-fn-noindex-listings').length > 0 || $('.m-nr-noindex-listings').length > 0) {
                searchMethod = 'SearchNewsArticlesNoIndex';
            }
            // call web service
            $.ajax({
                type: "POST",
                url: "/MyApi/Custom/SearchCl/results",
                data: '{"q":"' + searchTerm + '","tag":"Press Releases"}',
                contentType: "application/json",
                async: true,
                dataType: 'text',
                success: function(data) {
                    // if search returns data...
                    if (data) {
                        var results = JSON.parse(data);

                        if (results.Results.length == 0) {
                            $newsReleaseListings.append('<p class="no-results">No Results Found</p>');
                            $('.year-select-wrapper').hide();
                        } else {
                            $('.year-select-wrapper').show();
                            $('p.no-results').hide();
                            $loadMore = results[0] != null && results[0].LoadMore;
                            var removeCloseTags = false;
                            var markup = '';
                            var lastIndex = $resultIndex;

                            results.Results.sort(function(a, b) {
                                return new Date(b.Date) - new Date(a.Date);
                            });
                            var groupedData = {};
                            for (var key in results.Results) {
                                var record = results.Results[key];
                                var year = new Date(record.Date).getFullYear();
                                year = "year" + year;
                                var month = record.Month;
                                if (!groupedData[year]) {
                                    groupedData[year] = {};
                                }
                                if (!groupedData[year][month]) {
                                    groupedData[year][month] = [];
                                }
                                groupedData[year][month].push(results.Results[key]);
                            }
                            for (var yearIndex in groupedData) {
                                var yearDetails = groupedData[yearIndex];
                                for (var monthIndex in yearDetails) {
                                    var monthDetails = yearDetails[monthIndex];
                                    // print month header
                                    if (monthIndex != $searchModeCurrentMonth) {
                                        markup += $newsReleaseMonthMarkup
                                            .replace('MONTH_NAME', monthIndex);
                                    }
                                    monthDetails.forEach(function(dayDetails, dayIndex) {
                                        $resultIndex++;
                                        // find URL start index (13 = length of string 'www-amgen-com')
                                        var startIndex = dayDetails.Url.indexOf('www-amgen-com') + 27;
                                        if (startIndex < 27) {
                                            startIndex = 0;
                                        }
                                        // print article link
                                        markup += $newsReleaseMarkup
                                            .replace('NR_INDEX', $resultIndex)
                                            .replace('NR_DATE', dayDetails.Date)
                                            .replace('NR_URL', dayDetails.Url.substring(startIndex, dayDetails.Url.length))
                                            .replace('NR_TITLE', dayDetails.Name);
                                    });
                                    // print month footer and change month
                                    if (monthIndex != $searchModeCurrentMonth) {
                                        markup += $newsReleaseCloseMonthMarkup;
                                        $searchModeCurrentMonth = monthIndex;
                                    }
                                    // print spacer
                                    else {
                                        $('.articles-by-month ul').last().append(markup);
                                        markup = ' ';
                                    }
                                }
                            }
                            // print results
                            $newsReleaseListings.append(markup);
                        }
                    }

                    // remove spinning wheel
                    $('#loading').remove();
                    $('#loading').remove();

                    // set up the waypoint to get more results halfway down the new search results
                    var midpointIndex = lastIndex + Math.floor(($resultIndex - lastIndex) / 2);
                    $currentWaypoint = $('#article-' + midpointIndex).waypoint({
                        handler: function(direction) {
                            SearchNewsReleases(false, $searchModeSearchTerm);
                            this.destroy();
                        },
                        offset: 'bottom-in-view'
                    })[0];
                }
            });
        }
        // search term must be at least 3 characters
        else {
            $newsReleaseSearchBar.attr('placeholder', 'Search term must be at least 3 characters long').val('');
        }
    }

    function GetNewsReleaseMarkup() {
        // set spinning wheel
        $newsReleaseListings.append($spinnerHtml);
        // set query parameters
        var params = {
            rootId: $newsReleaseRootId,
            selectedYear: $filterYear,
            isNasdaq: $('.m-nr-listings').length > 0
        };
        // set query command
        var json = JSON.stringify(params);
        $.ajax({
            type: "POST",
            url: "/MyApi/Custom/NewsListing/GetNewsReleases",
            data: '{"rootId":"' + $("#rootId").val() + '","selectedYear":"' + $("#Years option:selected").text() + '","isNasdaq":true}',
            contentType: "application/json",
            async: true,
            dataType: 'text',
            success: function(data) {
                // if the search returns data...
                if (data) {
                    // Show sorting options by default
                    $('.year-select-wrapper').show();
                    $('p.no-results').hide(); // hide no results found paragraph
                    var results = JSON.parse(data);
                    var markup = '';
                    // parse months
                    $.each(results,
                        function(index, month) {
                            // print month header
                            markup += $newsReleaseMonthMarkup
                                .replace('MONTH_NAME', htmlEscape(month.Month));
                            // parse articles
                            $.each(month.NewsReleases,
                                function(index, nr) {
                                    $resultIndex++;
                                    // print article link
                                    markup += $newsReleaseMarkup
                                        .replace('NR_INDEX', $resultIndex)
                                        .replace('NR_DATE', htmlEscape(nr.Date))
                                        .replace('NR_URL', nr.Url)
                                        .replace('NR_TITLE', htmlEscape(nr.Title));
                                });
                            // print month footer
                            markup += $newsReleaseCloseMonthMarkup;
                        });
                    // print results
                    $newsReleaseListings.append(markup);
                    // Arrow Click functionality - Will redirect to correct article
                    $('img.arrow-link').click(function() {
                        var newPageUrl = $($(this).parent().find('a')).attr('href');
                        window.location.pathname = newPageUrl;
                    })
                }
                // remove spinning wheel
                $('#loading').remove();
                $('#loading').remove();

            }
        });
    }


    // if the news-release container exists, populate it on page-load and bind events
    if ($newsReleaseListings.length > 0) { // Si la liste des articles est sup. a 0
        // populate on page load
        ResetSearch();
        GetNewsReleaseMarkup();
        ClearResults();
        $searchModeSearchTerm = $newsReleaseSearchBar.val().trim();
        //SearchNewsReleases(true, $searchModeSearchTerm);
        // bind search bar event
        $newsReleaseSearchBar.keydown(function(e) {
            if (e.keyCode == 13) {
                //Si une requête ajax est en cours on bloque le bouton

                ClearResults();
                $searchModeSearchTerm = $newsReleaseSearchBar.val().trim();
                SearchNewsReleases(true, $searchModeSearchTerm);
                return false;
            }
        });
        // bind search button event
        $newsReleaseSearchButton.click(function(e) {
            //Si une requête ajax est en cours on bloque le bouton
            // if (ajaxIsRunning == true) {
            // e.preventDefault();
            // return false;
            // }
            ClearResults();
            $searchModeSearchTerm = $newsReleaseSearchBar.val().trim();
            SearchNewsReleases(true, $searchModeSearchTerm);
            return false;
        });
        // bind year drop down list event
        $newsReleaseYearDdl.change(function() {
            ResetSearch();
            ClearResults();
            $filterYear = Number($newsReleaseYearDdl.find('option:selected').text());
            GetNewsReleaseMarkup();
            return false;
        });
    }


   

})(jQuery);