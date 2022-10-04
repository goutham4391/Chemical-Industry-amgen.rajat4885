var myPlayer, playerHTML, playerData = { accountId: "4360108603001", playerId: "iXxrdu2La", videoId: "6180044567001" };

function addPlayer() {
    playerHTML = '<video-js id="myPlayerID" data-video-id="' + playerData.videoId + '"  data-account="' + playerData.accountId + '" data-player="' + playerData.playerId + '" data-embed="default" data-playlist-id="" data-application-id="" data-poster="-/media/Themes/CorporateAffairs/amgen-com/amgen-com/images/amgencommigration/home/Our-Story-desktop.jpg" class="vjs-fluid animation-video" muted loop playsinline></video-js>', document.getElementById("placeHolder").innerHTML = playerHTML;
    var e = document.createElement("script");
    e.src = "https://players.brightcove.net/" + playerData.accountId + "/" + playerData.playerId + "_default/index.min.js", document.body.appendChild(e), e.onload = callback
}

function addImage() { document.getElementById("placeHolder").innerHTML = '<img class="placeholder-image" src="assets/placeholder_200x100.svg" alt="">' }

function callback() {
    (myPlayer = bc("myPlayerID")).on("loadedmetadata", function() { myPlayer.play() })
}

function isInViewPort(e) { e = e.getBoundingClientRect(); return 0 <= e.top && 0 <= e.left && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth) }
const section = document.querySelector(".amgen_home .social-media"),
    options = { root: null, threshold: 0, rootMargin: "250px 250px 250px 250px" },
    observer = new IntersectionObserver(function(e, a) {
        e[0].isIntersecting && 767 < window.outerWidth && (addPlayer(), a.unobserve(e[0].target))
    }, options);
observer.observe(section);