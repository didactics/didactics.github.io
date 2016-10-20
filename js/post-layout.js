/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global
    $,
    console,
    jQuery,
    alert */

$(document).ready(function () {
	"use strict";
//	alert('post-layout');
    var $sidebar = $('.sidebar');
    $sidebar.addClass('scrollspyable');
    
	$('#main-menu').addClass('navbar-fixed-top');

//    Moved to the <script/> tag in html
//    $('.main-menu-brand').addClass('js');
//    $('.main-menu-home-item').addClass('js');
//    $('.main-menu-search-item').addClass('js');
    
    function updateScrollSpy() {
        var $mainMenu = $('#main-menu'),
            $body = $('body'),
            $data,
            $fixedHeader = $('thead.thaffix'),
            // height of main menu
            h = $mainMenu.height(),
            offs;
        
        // if a table header is affixed, then increase the offset
        if ($fixedHeader.length > 0) {
            offs = h + $fixedHeader.height() + 20;
        } else {
            //            offs = h + 30;
            offs = h + 20;
        }
        
//        alert(offs);
        
        $body.scrollspy({ offset: offs, target: '.sidebar.scrollspyable' });

//        $body.scrollspy('refresh');
        $data = $body.data('bs.scrollspy');
        
        if ($data) {
            $data.options.offset = offs;
//            $body.data('bs.scrollspy', $data);
            $body.scrollspy('refresh');
        }
    }
    
    $(window).resize(function () {
        updateScrollSpy();
    });
    
    $(window).on('thaffix.changed', function () {
//        alert('thaffix.changed');
        updateScrollSpy();
    });

    // Block animation of TOC when scrolling doc from a TOC link click
    $(window).on('navbar.before-scroll-to-anchor', function (e, $target) {
        $sidebar.removeClass('scrollspyable');
    });
    
    $(window).on('navbar.after-scroll-to-anchor', function (e, $target) {
        $sidebar.addClass('scrollspyable');
        updateScrollSpy();
    });
    
// This module goes first to set the js class, and when 
// updateScrollSpy() gets called, the thaffix class is not set yet and we are unable
// to set the right offset; made trigger('thaffix.changed') from init of thaffix.js, so
// updateScrollSpy() is called when all table classes are in place
    
    updateScrollSpy(); // set data offset
});