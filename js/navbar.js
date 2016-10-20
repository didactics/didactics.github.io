/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global $, jQuery, History, alert, console*/

(function () {
    "use strict";
    
    // Close the collapsed menu (on small screens) on click
    $(document).on('click', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a') && $(e.target).attr('class') !== 'dropdown-toggle') {
            $(this).collapse('hide');
        }
    });

    //function updateAffixTop() {
    //    new_top = $('#home').height();
    //    $('nav').affix({
    //      offset: {
    //        top: new_top
    //      }
    //    });
    //    $('#signup').text(new_top + " !!!@@@");
    //}

    $(window).resize(function () {
    //     $('#signup').text($('#home').height());
    //    $('#signup').text(window.innerWidth);
    //    test(window.innerWidth)
    //    test($('.navbar').height());

    //    updateAffixTop();    
//        alert("!!!");
//        document.title = window.innerWidth;
    });
    
//    $(window).on('hashchange', function (e) {
//        var origEvent = e.originalEvent;
////        alert('Going to: ' + origEvent.newURL + ' from: ' + origEvent.oldURL);
//    });
    
//    $(window).bind('hashchange', function () {
////        alert("222");
//        var newHash = window.location.hash.substr(1);
////        $mainContent.load(newHash + " #content > *");
////        alert(newHash + "  -  " + window.location.hash);
//    });

    function test(st) {
        $('#signup').text(st);
    }

    // Select navbar items 
    // http://stackoverflow.com/questions/9301507/bootstrap-css-active-navigation
    $(document).ready(function () {
        
        $('.navbar-collapse ul.nav > li').click(function (e) {
//            e.preventDefault();
            $('.navbar-collapse ul.nav > li').removeClass('active');
            $(this).addClass('active');
        });
        
        //        $item = $('.navbar-collapse ul.nav > li > a[href=\"' + ref + '\"]');
        
        // If a navbar item has a path to the current document, select that item (the longest matching path is used) 
        
        var ref = window.location.pathname,
            $item,
            refAttr,
            len = 0,
            
            log = function (key, val) {
                if (!val) {
                    console.log(key);
                } else {
                    console.log(key + " = " + val);
                }
            };
        
        $('.navbar-collapse ul.nav > li > a').each(function (index) {
            refAttr = $(this).attr('href');
//            log("refAttr", refAttr);
            
            if (ref.indexOf(refAttr) === 0) {
                if (len < refAttr.length) {
                    len = refAttr.length;
                    $item = $(this);
//                    log("$item", $item);
                }
            }
        });
        
        if ($item) {
            $('.navbar-collapse ul.nav > li').removeClass('active');
            $item.parent().addClass('active');
        }
    });


	$(document).ready(function () {
        
//        $(".modal-draggable .modal-dialog").draggable({
//            handle: ".modal-header"
//        });
        
//        $('#home').ajaxify();
        
//        var siteUrl = 'http://' + (document.location.hostname || document.location.host);
////        alert(siteUrl);
//        $(document).delegate('a[href^="/"],a[href^="' + siteUrl + '"]', "click", function (e) {
//            e.preventDefault();
////            alert(this.pathname);
//            History.pushState({}, "", this.pathname);
//        });
//
//        History.Adapter.bind(window, 'statechange', function () {
//            var State = History.getState();
//            $.get(State.url, function (data) {
//                document.title = $(data).find("title").text();
//                $('#home').html($(data).find('#home'));
//    //            _gaq.push(['_trackPageview', State.url]);
//            });
//        });
        
        
        
//// Assign tabindex to all links (incl. menu items) so that ESC works on submenus
//        $(function(){
//            var tabindex = 1;
////            $('.navbar-nav ul.dropdown-menu').find('a').each(function() {
//            $('.navbar-nav li.dropdown').find('a').each(function() {
//                if (this.type != 'hidden') {
//                    $(this).attr('tabindex', tabindex);
//                    
//                    tabindex++;
//                }
//            });
//        });
        
        $('nav').affix({
            offset: {
                top: function () {
                    return $('#home').height();
                }
            }
        });
        
        // Show brand on page reload
        if ($('nav').hasClass('affix')) {
            $('#brand').show();
            $('#home-item').show();
            $('#search-item').show();
        }
        $('nav').on('affixed-top.bs.affix', function () {
            $('#brand').hide();
            $('#home-item').hide();
            $('#search-item').hide();
        });

        $('nav').on('affix.bs.affix', function () {
            $('#brand').show();
            $('#home-item').show();
            $('#search-item').show();
        });

        
        //*
        //* param String target: #anchor
        //* param function() callback
        //*
//        var scrollToAnchor = function (target, callback) {
//            var $target = $(target),
//                $table,
//                $tableHeader,
//                headerHeight,
//                scrollTop;
//            
//            $('html, body').stop().animate({
//                'scrollTop': $target.offset().top
//            },
//                Math.min(800, Math.abs(window.scrollY - $target.offset().top) / 3),
//                'swing', function () {
//                    window.location.hash = target;
//
//                    scrollTop = $target.offset().top - $('.navbar').height() - 10;
//                    $table = $target.closest('table');
//                    if ($table) {
//                        // target is inside a table, shift to the table header's height
//                        $tableHeader = $table.find('thead');
//                        headerHeight = $tableHeader.height();
//                        scrollTop -= headerHeight;
//                    }
//                
//                    $('html, body').stop().animate({
//                        'scrollTop': scrollTop
//                    }, 1, 'swing');
//                    if (callback) {
//                        callback();
//                    }
//                });
//        };
        
        //*
        //* param String target: #anchor
        //* param function() callback
        //*
//        var scrollToAnchor2 = function (target, callback) {
//            var $target = $(target),
//                $table,
//                $tableHeader,
//                headerHeight,
//                scrollTop;
//            
//            scrollTop = $target.offset().top - $('.navbar').height() - 10;
//            $table = $target.closest('table');
//            if ($table) {
//                // target is inside a table, shift to the table header's height
//                $tableHeader = $table.find('thead');
//                headerHeight = $tableHeader.height();
//                scrollTop -= headerHeight;
//            }
//            
//            window.location.hash = target;
//            $('html, body').stop().animate({
//                'scrollTop': scrollTop
//            },
//                Math.min(800, Math.abs(window.scrollY - $target.offset().top) / 3),
//                'swing', function () {
//                    if (callback) {
//                        callback();
//                    }
//                });
//        },
            
        //*
        //* param String target: #anchor
        //* param function() callback
        //*
        var scrollToAnchor = function (target, callback) {
            var $target = $(target),
                $table,
                $tableHeader,
                headerHeight,
                scrollTop;
            $(window).trigger('navbar.before-scroll-to-anchor', $target);
            scrollTop = $target.offset().top - $('.navbar').height() - 10;
            $table = $target.closest('table');
            if ($table) {
                // target is inside a table, shift to the table header's height
                $tableHeader = $table.find('thead');
                headerHeight = $tableHeader.height();
                scrollTop -= headerHeight;
            }

            $('html, body').stop().animate({
                'scrollTop': scrollTop
            },
                Math.min(800, Math.abs(window.scrollY - $target.offset().top) / 3),
                'swing', function () {
//                    var saveScrollTop = document.body.scrollTop;
                    window.location.hash = target;
//                    document.body.scrollTop = saveScrollTop;

                    $('html, body').stop().animate({
                        'scrollTop': scrollTop
                    }, 1, 'swing');
                    if (callback) {
                        callback();
                    }
                
                    $(window).trigger('navbar.after-scroll-to-anchor', $target);
                });
        };
        
//            scrollToAnchor = function (target, callback) {
//                window.location.hash = target;
//            };
        
        
//        $('#search-item').click(function () {
//            scrollToAnchor("#home");
//            $("#search-input").focus();
//        });
        
        
//    function closeIfOpen() {
//        // Close collapsed main menu on small screen scroll
//        var opened = $('.navbar-collapse').hasClass('collapse in');
//        if ( opened === true && $('.navbar').height() <= $(window).height()) {
////            $('.navbar-collapse').collapse('hide');
//        }
//    }
//        
//    $('body').on('touchmove', function(e) {
//        closeIfOpen();
//    });
//        
//    $(document).scroll(function(e) {
//        closeIfOpen();
//    });
        
        $('a[href^="#"]').on('click', function (e) {
            e.preventDefault(); // !!!            
            scrollToAnchor(this.hash);
            $(window).trigger('link.clicked', this);
        });

        $('.navbar-header, .banner').on('click', function (e) {
//            e.preventDefault(); // !!!
            scrollToAnchor("#contact", function () {
                $("#contact-form input[name=name]").focus();
            });
//            $("#search-input").focus();
//            scrollToAnchor("#search");
//            $("#search-input").focus();
        });
        
        $('#search-item').on('click', function (e) {
//            e.preventDefault(); // !!!
            scrollToAnchor("#home", function () {
                $("#search-input").focus();
            });
//            $("#search-input").focus();
//            scrollToAnchor("#search");
//            $("#search-input").focus();
        });
        
        function updateModalHeight(selector) {
            var height = $(window).height() - 220;
            selector.find(".modal-body").css("max-height", height);
        }
        
        $("#search-results-modal").on("show.bs.modal", function () {
            updateModalHeight($(this));
        });
     
        $(window).resize(function () {
            updateModalHeight($('#search-results-modal'));
        });
        
        // Focus the close button (besides html5 autofocus on the element)
        $('#search-results-modal').on('shown.bs.modal', function () {
            $(this).find('button').focus();
        });
        
        function processHash(hash) {
            if (hash) {
                switch (hash) {

                case "#home":
    //                scrollToAnchor("#home");
                    break;

                case "#contact":
//                    scrollToAnchor("#contact", function () {
//                        $("#contact-form input[name=name]").focus();
//                    });
                    $("#contact-form input[name=name]").focus();
                    break;

                case "#search":
//                    scrollToAnchor("#search", function () {
//                        $("#search-input").focus();
//                    });
                    $("#search-input").focus();
                    break;
                }
            }
        }
        
        $(window).on('hashchange', function (e) {
//            var origEvent = e.originalEvent;
//            alert('Going to: ' + origEvent.newURL + ' from: ' + origEvent.oldURL);
//            processHash(origEvent.newURL);
            processHash(window.location.hash);
        });
        
        // Hash passed in with the url
        processHash(window.location.hash);
        
	});
    
}());