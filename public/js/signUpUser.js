/*Fields verifications for the register process using gen_validatorv4*/

var frmvalidator  = new Validator("registerForm");

frmvalidator.addValidation("name","req","Please enter your Name");
frmvalidator.addValidation("name","maxlen=30",	"Name exceeded maximum number of characters (Max: 30)");

frmvalidator.addValidation("email","maxlen=50", "Email exceeded maximum number of characters (Max: 50)");
frmvalidator.addValidation("email","req", "Please enter an Email");
frmvalidator.addValidation("email","email", "Email format is incorrect (eq: email@email.com)");

frmvalidator.addValidation("password", "req", "Please enter a Password");
frmvalidator.addValidation("password","neelmnt=name","The Password cannot be same as your Name");
frmvalidator.addValidation("password","minlen=6","Password requires a minimum of 6 characters");

frmvalidator.addValidation("password_confirmation","req", "Please confirm your Password");
frmvalidator.addValidation("password_confirmation","eqelmnt=password","Confirmed password is not the same as your Password");

frmvalidator.addValidation("address","req", "Please enter an Address");
frmvalidator.addValidation("address","maxlen=50", "Address exceeded maximum number of characters (Max: 50)");

frmvalidator.addValidation("municipality","req", "Please enter an Municipality");
frmvalidator.addValidation("municipality","maxlen=50", "Municipality exceeded maximum number of characters (Max: 50)");

frmvalidator.addValidation("district","req", "Please enter an District");
frmvalidator.addValidation("district","maxlen=50", "District exceeded maximum number of characters (Max: 50)");

frmvalidator.addValidation("birthdate","req", "Please enter a birthdate");

function DateValidation(){
  var today =new Date();
  var inputDate = new Date(document.forms["registerForm"]["birthdate"].value);
  if (inputDate > today) {
    sfm_show_error_msg('Date is invalid');
    return false;
  } else {
    return true;
  }
}

frmvalidator.setAddnlValidationFunction(DateValidation);

/*MISSING VALIDATION FOR CHECK BOXES AND RADIO BUTTONS  */

//frmvalidator.addValidation("Phone","maxlen=50");
//frmvalidator.addValidation("Phone","numeric","THIS IS NOT NUMERIC BITCH");

//frmvalidator.addValidation("Address","maxlen=50");
//frmvalidator.addValidation("Country","dontselect=000");


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
      gender: frmdata[8].value,
      role:"user"
  };

  $.ajax({
      url: '/register',
      type: 'POST',
      data: account,
      datatype: 'json'
  });

  event.preventDefault();
});
