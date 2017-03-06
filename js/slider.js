/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: admin@didactics.cz */

/*jslint browser: true*/
/*global
    $,
    jQuery,
    alert */

(function () {
    "use strict";

    $(document).ready(function () {
        var images = [
            "13718-a-smart-girl-with-glasses-reading-a-book-pv_7.jpg",
            "5038-a-beautiful-african-american-teen-girl-posing-by-a-lake-pv4.jpg",
//            "portrait-thoughtful-senior-businessman-over-white-background-30882942_2.jpg",
            "businessman-1146791_1280_2.jpg",
            "10130-a-beautiful-blonde-businesswoman-in-a-suit-isolated-on-a-white-backgrou-or5.jpg",
            "13255-a-young-businessman-writing-with-a-pen-pv2.jpg",
            "boy-286809_1280_6.jpg",
            "14115-a-beautiful-young-business-woman-posing-on-a-white-background-pv2.jpg",
//            "boy-1261760_1280_2.jpg",
            "eyewear-1243374_1920_2.jpg"
        ],
            i = 0,
            
            adjustHeight = function () {
//                // async call
//                setTimeout(function () {
//                    $('#home').height($('#page-header').height() + 10);
//                }, 1);
                $('#home').height($('#page-header').height() + 10);
//                alert("height ajusted");
            },
            
            // http://stackoverflow.com/questions/5057990/how-can-i-check-if-a-background-image-is-loaded
            $div = $('#home'),
            bg = $div.css('background-image'),
            src, $img;
        
        if (bg) {
//            alert("bg = " + bg);
            src = bg.replace(/(^url\()|(\)$|[\"\'])/g, ''); // strip url()
//            alert("src = " + src);
            $img = $('<img>').attr('src', src).on('load', function () {
                $(this).remove(); // prevent memory leaks
//                alert("img loaded");
                adjustHeight();
            });
        }
            
//            /**
//             * http://stackoverflow.com/questions/3877027/jquery-callback-on-image-load-even-when-the-image-is-cached
//             * Trigger a callback when the selected images are loaded:
//             * @param {String} selector
//             * @param {Function} callback
//             */
//            onImgLoad = function (selector, callback) {
//                var $selector = $(selector);
//                
//                $selector.each(function () {
//                    if ($selector.complete || /*for IE 10-*/ $selector.height() > 0) {
//                        callback.apply($selector);
//                    } else {
//                        alert('4');
//                        $selector.on('load', function () {
//                            alert('3');
//                            callback.apply($selector);
//                        });
//                    }
//                });
//            };
        
        setInterval(function () {
            i += 1;
            if (i === images.length) {
                i = 0;
            }


//            $(".background-photo").css("background-image",
//                            "url(/img/photos/" + images[i] + ")");

//            $(".background-photo").fadeOut("slow", "swing", function () {
//                $(this).css("background-image",
//                            "url(/img/photos/" + images[i] + ")");
//                $(this).fadeIn("slow", "swing");
//            });
//        }, 10000);

            $(".background-photo").fadeOut("slow", function () {
                $(this).css("background-image",
                            "url(/img/photos/" + images[i] + ")");
//                $(this).attr("src",
//                            "/img/photos/" + images[i]);
                $(this).fadeIn("slow");
            });
        }, 10000);

        $(window).resize(function () {
            adjustHeight();
        });
        
////        onImgLoad($(".background-photo").css("background-image"), function () {
//        onImgLoad($(".background-photo"), function () {
//            alert("img loaded");
//            adjustHeight();
//        });
        
//        alert($(".background-photo").css("background-image"));
      
//        adjustHeight();
    });
    
}());