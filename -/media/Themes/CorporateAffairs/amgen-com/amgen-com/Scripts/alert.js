// JavaScript Document

function tabSelect() {
    if (location.hash.substring(1).toLowerCase() === "english") {
        setTimeout(function() {
            document.querySelector('.quantum-tabs.white-bg .quantum-tabs__labels-inner .quantum-tabs__label:first-child .quantum-tabs__label-text').click();
        }, 0);

    } else if (
        location.hash.substring(1).toLowerCase() === "ukrainian"
    ) {
        setTimeout(function() {
            document.querySelector('.quantum-tabs.white-bg .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(2) .quantum-tabs__label-text').click();
        }, 0);
    } else if (
        location.hash.substring(1).toLowerCase() === "russian"
    ) {
        setTimeout(function() {
            document.querySelector('.quantum-tabs.white-bg .quantum-tabs__labels-inner .quantum-tabs__label:nth-child(3) .quantum-tabs__label-text').click();
        }, 0);
    }

}
tabSelect();
window.addEventListener('hashchange', function() {
    tabSelect();
}, false);


(function() {
	
    if(document.cookie.match(/covidAlert=false/)) {
		
        $('.alert').hide();

		
    } else {
	
        $('.alert').show();

    }

    $('.alert__close').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        document.cookie = "covidAlert%3dfalse%3b%20path%3d/index.html";
        $('.alert').hide();
		
		
    });
    
})();

