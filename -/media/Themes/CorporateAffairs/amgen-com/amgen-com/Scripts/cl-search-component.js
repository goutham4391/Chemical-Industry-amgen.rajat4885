function getUrlHashVars() {
    var vars = [],
        hash;
    var hashes = window.location.href
        .slice(window.location.href.indexOf("?") + 1)
        .split("&");
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split("=");
        vars.push(hash[0]);
        vars[hash[0]] = decodeURIComponent(hash[1]);
    }
    return vars;
}

/**
 * @description: redirects to search page with results for searchword
 * @param {} event
 * @param {*} searchWord
 */
function redirect(event, searchWord) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        if (searchWord == "") {
            alert("Please enter a valid search value");
            event.preventDefault();
            event.stopPropagation();
            return;
        } else {
            Cookies.set("search-keyword", searchWord);
            window.location.href =
                window.location.origin + "/search-results?q=" + searchWord;
        }
    } else {
        if (searchWord == "") {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        Cookies.set("search-keyword", searchWord);
        window.location.href =
            window.location.origin + "/search-results?q=" + searchWord;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function () {
    // replace type="search" to type"text" in search bar present in header
    $('.quantum-search-suggest input.quantum-search-box-input').clone().attr('type', 'text').
        insertAfter('.quantum-search-suggest input.quantum-search-box-input').prev().remove();

    // set value in search box of search page
    var str_search = getParameterByName("q");
    $("#searchTextBox-main").val(str_search);

    // searh in nav-bar
    $("input[name='textBoxSearch']").on("keyup keypress blur change", function (
        e
    ) {
        if (e.which == 13) {
            //Enter key pressed
            redirect(e, $(this).val());
            $("#searchTextBox-main").val($(this).val());
        }
    });
    //search button functionality for 404 and 500 page
    $(".redirect-searchBtn").click(function (e) {
        e.preventDefault();
        var searchTxt = $(this).prev(".search-input").val();
        redirect(e, searchTxt);
        $("#searchTextBox-main").val(searchTxt);
    });
    //search button functionality for header search bar in mobile view
    $(".component-content .quantum-search-box-button-with-redirect").click(function (e) {
        e.preventDefault();
        var searchTxt = $(".quantum-search-box-input").val();
        redirect(e, searchTxt);
        $("#searchTextBox-main").val(searchTxt);
    });
});
