$( "#registerform" ).submit( function(event){
  var frm = $('#registerform');
  var frmdata = JSON.parse(JSON.stringify(frm.serializeArray()));

  var account = {
      name: frmdata[0].value,
      email: frmdata[1].value,
      password: frmdata[3].value,
      address: {
        address: frmdata[4].value,
        municipaly: frmdata[5].value,
        district: frmdata[6].value},
      birthdate: frmdata[7].value,
      occupation: frmdata[9].value,
      workplace: frmdata[10].value,
      gender: frmdata[8].value
  };

  $.ajax({
      url: '/register',
      type: 'POST',
      data: account,
      datatype: 'json'
  });

  event.preventDefault();
});
