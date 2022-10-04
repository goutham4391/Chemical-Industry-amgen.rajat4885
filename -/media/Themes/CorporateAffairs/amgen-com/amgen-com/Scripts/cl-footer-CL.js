$(document).ready(function(){

$('ul.footer-links li.footerItem').each(function() {

  var $this = $(this);
 if ($.trim($this.children('u').html()).length < 1) { //if looking for direct descendants then do .children('div').length
      $this.addClass('footer-none');
  }
});  
});
 