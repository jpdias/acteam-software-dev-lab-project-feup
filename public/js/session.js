$( "#loginform" ).submit( function(event){
  var frm = $('#loginform');
  var frmdata = JSON.parse(JSON.stringify(frm.serializeArray()));

  var account = {
      username: frmdata[0].value,
      password: frmdata[1].value
  };
  
  $.ajax({
      url: '/login',
      type: 'POST',
      data: account,
      datatype: 'json',
      success: function(){
         window.location.href = "/";
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         window.location.href = "signin";
      }
  });
  event.preventDefault();
});

$(document).ready(function(){
  $.get("/loggedIn", function( data ) {
    console.log(data);
    if(data.login!==false){
      $("#loggedInShow").show();
      $("#loggedName").text("Hello, "+data.name+"!");
    }
    else{
      $("#loginform").show();
      $("#loggedInShow").hide();
    }
  });
});
