$(document).ready(function(){
	$('dropdown').dropdown();
});

$('#searchButton').on('click', function(e) {
	$.ajax({
        url: '/searchorg',
        type: 'POST',
        data: {
			name: $('#searchText').val(),
			region: $('#').val()
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