$(document).ready(function() {
    function tabSelect() {
        if (location.hash.substring(1).toLowerCase() === "global-presence") {
            setTimeout(function() {
                $('.quantum-tabs .quantum-tabs__labels-inner .quantum-tabs__label:first-child .quantum-tabs__label-text').click();
            }, 0);
        } else if (location.hash.substring(1).toLowerCase() === "more-from-amgen") {
            setTimeout(function() {
                $('.quantum-tabs .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(2) .quantum-tabs__label-text').click();
            }, 0);
        }
    }
    tabSelect();
    window.addEventListener('hashchange', function() {
        tabSelect();
    }, false);
})