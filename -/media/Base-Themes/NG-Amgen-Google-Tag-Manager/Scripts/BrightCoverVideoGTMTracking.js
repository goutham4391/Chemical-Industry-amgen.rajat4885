$(document).ready(function(){$(".video-thumb").click(function(){var current=this.getElementsByClassName("vjs-control-bar")[0].getElementsByClassName("vjs-play-control")[0];var playing=current.classList.contains("vjs-playing");var paused=current.classList.contains("vjs-paused");var title=current.attributes['title'].value;if(!playing&&!paused&&title==="Play")
{var OpenVal=$(this).attr('video-play');$(this).attr('data-label',OpenVal);console.log('started');}
else if(!playing&&paused&&title=="Play")
{var OpenVal=$(this).attr('video-play');$(this).attr('data-label',OpenVal);console.log('Paused');}
else if(playing&&!paused&&title=="Pause")
{var OpenVal=$(this).attr('video-pause');$(this).attr('data-label',OpenVal);console.log('started');}
else
{console.log('Else end');}});});