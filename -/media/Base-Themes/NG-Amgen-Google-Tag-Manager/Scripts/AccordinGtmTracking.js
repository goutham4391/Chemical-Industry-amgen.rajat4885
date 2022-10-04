$(document).ready(function(){$(".gtm-accordin").click(function(){if(this.attributes['aria-expanded'].value=="false")
{var OpenVal=$(this).attr('accor-open');$(this).attr('data-label',OpenVal);}
else{var closeVal=$(this).attr('accor-close');$(this).attr('data-label',closeVal);}});});