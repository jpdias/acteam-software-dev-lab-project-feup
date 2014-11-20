/* Form field validation on the recovery request through email */
$(document).ready(function() {
  $("#recoveryForm").bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      email: {
        trigger: 'blur',
        validators: {
          notEmpty: {
            message: 'The email is required'
          },
          emailAddress: {
            message: 'The input is not a valid email address (Example: \'something@test.com\').'
          },
          remote: {
            message: 'The email doesn\'t exist',
            url: '/userexists',
            type: 'POST'
          }
        }
      }
    }
  }).on('success.form.bv', function(e) {
    // Prevent form submission
    e.preventDefault();

    // Get the form instance
    var frm = $(e.target);
    var frmdata = frm.serializeArray();

    var data = {
      email: frmdata[0].value
    };

    $.ajax({
      url: '/recovery',
      type: 'POST',
      data: data,
      datatype: 'json',
      success: function(message) {
        if (message.success) {
          swal({
            allowOutsideClick: true,
            title: "Request completed!",
            text: "Please verify your inbox.",
            type: "success"
          });
        } else {
          swal({
            allowOutsideClick: true,
            title: "Fail!",
            text: "An error occured, your request failed.",
            type: "error"
          });
        }
      }
    });
    // Prevent form submission
    e.preventDefault();
  });
});