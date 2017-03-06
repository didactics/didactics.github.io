/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global $, jQuery, alert,
    NAME_EMPTY,
    NAME_TOO_SHORT,
    EMAIL_EMPTY,
    EMAIL_NOT_VALID,
    MESSAGE_EMPTY,
    MESSAGE_TOO_LONG
    */

$(document).ready(function () {
    "use strict";
    
    $('#email-subscription-form #webinar-rggu-registration-modal').bootstrapValidator({
        container: '#messages',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: NAME_TOO_SHORT
                    },
                    notEmpty: {
                        message: NAME_EMPTY // The full name is required and cannot be empty
                    }
                }
            },
            primaryemail: {
                validators: {
                    regex: {
                        regexp: '/^$/' // The e-mail address is required and cannot be empty
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: EMAIL_EMPTY // The e-mail address is required and cannot be empty
                    },
                    emailAddress: {
                        message: EMAIL_NOT_VALID // The e-mail address is not valid
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {

        // Prevent form submission
        e.preventDefault();
        
        // Get the form instance
        var po,
            error = false,
            $button = $('#email-subscription-form button'),
            $modal = $('#email-subscription-modal'),
            $form = $(e.target),
            $bv = $form.data('bootstrapValidator');
        
        // Use Ajax to submit form data
        $.post($form.attr('action'), $form.serialize(), function (result) {
            error = false;
        }, 'json').fail(function () {
            error = true;
        });
        
        $form.find("input[type=text], input[type=email]").val("");
        $bv.resetForm();
        
        $button.prop('disabled', true);
        try {
            po = error ? $('#email-subscription-form-popover-error') :
                    $('#email-subscription-form-popover-success');
            po.popover('show');
            setTimeout(function () {
                po.popover('hide');
                $button.prop('disabled', false);
                $modal.modal('hide');
            }, 3000);
        } catch (err) {
            $button.prop('disabled', false);
        }
    });
    
    
    $('#contact-form').bootstrapValidator({
        container: '#messages2',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    stringLength: {
                        min: 2,
                        message: NAME_TOO_SHORT
                    },
                    notEmpty: {
                        message: NAME_EMPTY // The full name is required and cannot be empty
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: EMAIL_EMPTY // The e-mail address is required and cannot be empty
                    },
                    emailAddress: {
                        message: EMAIL_NOT_VALID // The e-mail address is not valid
                    }
                }
            },
            primaryemail: {
                validators: {
                    regex: {
                        regexp: '/^$/' // The e-mail address is required and cannot be empty
                    }
                }
            },
            message: {
                validators: {
                    notEmpty: {
                        message: MESSAGE_EMPTY // The content is required and cannot be empty
                    },
                    stringLength: {
                        max: 1000,
                        message: MESSAGE_TOO_LONG // The content must be less than 1000 characters long
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var po,
            error = false,
            $button = $('#contact-form button'),
            $form = $(e.target),
            $bv = $form.data('bootstrapValidator');
        
        // Use Ajax to submit form data
        $.post($form.attr('action'), $form.serialize(), function (result) {
            error = false;
        }, 'json').fail(function () {
            error = true;
        });
        
        $form.find("input[type=text], input[type=email], textarea").val("");
        $bv.resetForm();
        
        $button.prop('disabled', true);
        try {
            po = error ? $('#contact-form-popover-error') :
                    $('#contact-form-popover-success');
            po.popover('show');
            setTimeout(function () {
                po.popover('hide');
                $button.prop('disabled', false);
            }, 3000);
        } catch (err) {
            $button.prop('disabled', false);
        }
    });
    
    // Focus the user name (besides html5 autofocus on the element)
    $('#email-subscription-modal').on('shown.bs.modal', function () {
        $(this).find('input[name=name]').focus();
    });
});
