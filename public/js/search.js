$(document).ready(function() {
  $(function() {

    $(".dropdown-menu li a").click(function() {

      $(".drop:first-child").text($(this).text());
      $(".drop:first-child").val($(this).text());

    });

  });
});

$('#searchButton').on('click', function(e) {
  $.ajax({
    url: '/searchorg',
    type: 'POST',
    data: {
      name: $('#searchText').val(),
      cause: $(".drop:first-child").val()
        /*var num = null;
			$(".btn-group-justified > .btn").on("click", function(){
				num = +this.innerHTML;
				alert("Value is " + num);
			});*/
    },
    datatype: 'json',
    success: function(message) {

    }
  });
  e.preventDefault();
});