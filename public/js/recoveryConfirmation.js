$(document).ready(function() {
  $("#confirmationForm").bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      password: {
        validators: {
          notEmpty: {
            message: 'The password is required'
          },
          stringLength: {
            min: 8,
            message: 'The password must have at least 8 characters'
          },
          identical: {
            field: 'confirmPassword',
            message: 'The password must be the same as the password confirmation'
          }
        }
      },
      confirmPassword: {
        validators: {
          notEmpty: {
            message: 'The confirmation password is required'
          },
          identical: {
            field: 'password',
            message: 'The password confirmation must be the same as the password'
          }
        }
      }
    }
  }).on('success.form.bv', function(e) {
    // Prevent form submission
    e.preventDefault();

    var frm = $(e.target);
    var frmdata = frm.serializeArray();

    var data = {
      password: frmdata[1].value,
      email: getQueryVariable("email"),
      code: getQueryVariable("code")
    };

    $.ajax({
      url: '/resetpassword',
      type: 'POST',
      data: data,
      datatype: 'json',
      success: function(message) {
        if (message.success)
          swal({
            allowOutsideClick: true,
            title: "Request completed!",
            text: "Please verify your inbox.",
            type: "success"
          });
      }
    });
    // Prevent form submission
    e.preventDefault();
  });
});