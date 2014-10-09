$(function() {
        $(".timeline").mousewheel(function(event, delta) {
            this.scrollLeft -= (delta * 30);
            event.preventDefault();
        });
    });

jQuery(document).ready(function($){
  $('.timeline').perfectScrollbar({suppressScrollY: true});
});
