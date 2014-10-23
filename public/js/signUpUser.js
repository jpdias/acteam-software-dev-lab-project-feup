/*Fields verifications for the register process using Bootstrap validator*/

/*function DateValidation(){
  var today =new Date();
  var inputDate = new Date(document.forms["registerForm"]["birthdate"].value);
  if (inputDate > today) {
    sfm_show_error_msg('Date is invalid');
    return false;
  } else {
    return true;
  }
}*/

$(document).ready(function() {
    $( "#registerform").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required '
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[^0-9]+$/,
                        message: 'The username can only consist of alphabetical and number'
                    },
                    different: {
                        field: 'password',
                        message: 'The username and password cannot be the same as each other'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required'
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    },
                    stringLength: {
                        min: 8,
                        message: 'The password must have at least 8 characters'
                    }
                }
            },
            password_confirmation: {
              triger:'focus blur',
                validators: {
                    notEmpty: {
                        message: 'The confirmation password is required'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password confirmation must be the same as the password'
                    }
                }
            },
            address: {
                message: 'The address is not valid',
                validators: {
                    notEmpty: {
                        message: 'The address is required'
                    },
                    stringLength: {
                        max: 150,
                        message: 'The address must be less than 150 characters long'
                    },
                }
            },
            municipality: {
                message: 'The municipality is not valid',
                validators: {
                    notEmpty: {
                        message: 'The municipality is required'
                    },
                    stringLength: {
                        max: 100,
                        message: 'The municipality must be less than 100 characters long'
                    },
                }
            },
            district: {
                message: 'The district is not valid',
                validators: {
                    notEmpty: {
                        message: 'The district is required'
                    },
                    stringLength: {
                        max: 100,
                        message: 'The district must be less than 100 characters long'
                    },
                }
            },
            gender: {
                validators: {
                    notEmpty: {
                        message: 'Gender selection is required'
                    }
                }
            },
            birthdate: {
                validators: {
                    notEmpty: {
                        message: 'The birthdate is required'
                    },
                    callback: {
                        message: 'The birthdate is not in the range',
                        callback: function(value, validator) {
                            var m = new moment(value, 'DD/MM/YYYY', true);
                            if (!m.isValid()) {
                                return false;
                            }
                            // Check if the date in our range
                            return m.isAfter('01/01/1000') && m.isBefore(moment().format('L'));
                        }
                    }
                }
            }
        }
    })
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            var frmdata = JSON.parse(JSON.stringify($form.serializeArray()));

            console.log(frmdata);

            var account;

            if (frmdata[9].value === ""){
              account = {
                  name: frmdata[0].value,
                  email: frmdata[1].value,
                  password: frmdata[3].value,
                  address: {
                    address: frmdata[4].value,
                    municipality: frmdata[5].value,
                    district: frmdata[6].value},
                  birthdate: frmdata[7].value,
                  occupation: frmdata[9].value,
                  workplace: '',
                  gender: frmdata[8].value,
                  role:"user"
              };
            } else {

              account = {
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

            }

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post('/register', account, function(result) {
                swal({allowOutsideClick:true,title: "Account created with success!",text:"Please confirm your account.", type:"success"});
                $( "#registerform").find("input[type=text], textarea").val("");
            }, 'json');
        });
});
