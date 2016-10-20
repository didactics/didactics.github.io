/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global $, jQuery, History, alert, console*/

$(document).ready(function () {
    "use strict";
    
//    var keepCollapsed = true,
    var keepCollapsed = false,
//        var $body   = $(document.body);
////        var navHeight = $('.navbar').outerHeight(true) + 10;
//
//        $body.scrollspy({
//            target: '#sb',
//            offset: 200
//        });

        ajustWidth = function () {
            $('.sidebar').width($('.sidebar-parent').width());
        },
        
        test = function (st) {
            $('#brand').text(st);
        },
        
        log = function (key, val) {
            if (!val) {
                console.log(key);
            } else {
                console.log(key + " = " + val);
            }
        },
        
        //*
        //* param String target: #anchor
        //* param function() callback
        //*
        scrollToAnchor = function (targetSt, callback) {
            var $target = $(targetSt);
            
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            },
                1,
                'swing', function () {
                    if (callback) {
                        callback();
                    }
                });
        },
        
        ajustTop = function () {
            var h = $('#main-menu').height(),
                $sidebarAffix = $(".sidebar.affix");

            $('.post-container').css("margin-top", function () {
                return h + 1;
            });
            
            $sidebarAffix.css("top", h + "px");
        },
        
        ajustHeight = function () {
            var h = $('#main-menu').height(),
                $sidebarAffix = $('.sidebar.affix'),
                sidebarHeight,
                sidebarOffs;

            sidebarOffs = parseFloat($sidebarAffix.css("top"), 10);
//            sidebarOffs = 0;
//            log('=========== sidebarOffs = ' + sidebarOffs);
            sidebarHeight = $(window).height() + h - sidebarOffs;
//            log('h = ' + h);
//            log('sidebarHeight = ' + sidebarHeight);
//            log('$(window).height() + h = ' + ($(window).height() + h));
            $sidebarAffix.css("min-height", sidebarHeight + "px");
//            $sidebarAffix.css("height", sidebarHeight + "px");
        },
        
        ajustTopAndHeight = function () {
            ajustTop();
            ajustHeight();
        },
        
//        saveRef,
        isAffixBottom = false,

        ensureActiveItemInView = function ($selector) {
            var $topItem, $bottomItem, $sidebar, $sidebarTOC, $sidebarAffix,
                sidebarTop, absTop, absBottom, relTop, relBottom, st, viewPortTop, viewPortBottom, viewPortHeight, $parentULs, itemHeight, $childULs, $mainMenu, newTop;
            
            // Expand/collapse TOC subtrees
            $sidebarTOC = $('.sidebar-toc');
            if (keepCollapsed) {
                $sidebarTOC.find('.collapse.in').removeClass('in');
            }

            //$a = $(".sidebar-toc li.active > a");
            $topItem = $selector.first();
            $bottomItem = $selector.last();
            $parentULs = $bottomItem.parents('.sidebar-toc ul');
            if (keepCollapsed) {
                $parentULs.last().addClass('in'); // open top parent ul
            }
            
//            saveRef = $bottomItem.attr("href");
//            console.log(saveRef);

            $childULs = $parentULs.last().find('ul');
            if (keepCollapsed) {
                $childULs.addClass('in'); // open subtree
            }
//            adjustTopAndHeight();

    //        console.log($parentULs.last().attr("id"));

//            console.log($topItem.text());
//            console.log($bottomItem.text());
    //        console.log($parentULs);
    //        console.log($childULs);

    //        console.log($(".sidebar.affix").css("top"));
    //        console.log(parseFloat($(".sidebar.affix").css("top"), 10));
            
            $sidebar = $(".sidebar");
            isAffixBottom = $sidebar.hasClass("affix-bottom");
            $sidebarAffix = isAffixBottom ?
                    $(".sidebar.affix-bottom") :
                    $(".sidebar.affix");
            
//            $sidebarAffix = $(".sidebar.affix");
            sidebarTop = $sidebar.offset().top;
//            log("", );
//            log("isAffixBottom", isAffixBottom);
//            log("sidebarTop", sidebarTop);
            absTop = $topItem.offset().top;
            absBottom = $bottomItem.offset().top + $bottomItem.height();
            relTop = absTop - sidebarTop;
            relBottom = absBottom - sidebarTop;
            itemHeight = relBottom - relTop;
            $mainMenu = $('#main-menu');
            viewPortTop = $mainMenu.offset().top + $mainMenu.height();
            viewPortHeight = $(window).height() - $mainMenu.height();
            viewPortBottom = viewPortTop + viewPortHeight;
//            log("absTop", absTop);
//            log("absBottom", absBottom);
//            log("itemHeight", itemHeight);
//            log("relTop", relTop);
//            log("relBottom", relBottom);
//            log("viewPortTop", viewPortTop);
//            log("viewPortHeight", viewPortHeight);
//            log("viewPortBottom", viewPortBottom);
            
            if (isAffixBottom) {
                // For collapsed nodes
                if (absBottom < absTop) {
                    absBottom = absTop;
                }
                if (absTop < viewPortTop) {
                    $sidebarAffix.css("top", (sidebarTop - relTop) + "px");
    //                st = st + "moved sidebar down for " + -aTop + "  \n\n";
//                    log("moving down");
                } else if (absTop > viewPortBottom - 10) {
                    newTop = sidebarTop - (absBottom - viewPortBottom + 10);
                    $sidebarAffix.css("top", newTop + "px");
//                    log("new top", newTop);

    //                st = st + "moved sidebar up for " + (aBottom - viewPortHeight) + "  \n\n";
//                    log("moving up");
                    ajustHeight();
                } else {
//                    ajustTopAndHeight();
                    ajustHeight();
//                    log("ajust");
                }
            } else { // affix
                // For collapsed nodes
                if (relBottom < relTop) {
                    relBottom = relTop;
                }
                if (relTop < 0) {
                    $sidebarAffix.css("top", (sidebarTop - relTop) + "px");
    //                st = st + "moved sidebar down for " + -aTop + "  \n\n";
//                    log("moving down");
                } else if (relBottom > viewPortHeight - 10) {
                    if (isAffixBottom) {
                        $sidebarAffix.css("top", (sidebarTop - (relBottom - viewPortHeight + 10)) + "px");
//                        log("new top", sidebarTop - (relBottom + 10));
                    } else {
                        $sidebarAffix.css("top", (viewPortHeight - relBottom - 10) + "px");
//                        log("new top", viewPortHeight - relBottom - 10);
                    }

    //                st = st + "moved sidebar up for " + (aBottom - viewPortHeight) + "  \n\n";
//                    log("moving up");
                    ajustHeight();
                } else {
                    ajustTopAndHeight();
//                    log("ajust");
                }
            }
            
    //                maxScrollTop = sidebar.get(0).scrollHeight - sidebar.outerHeight(),
    //                h = $sidebar.height(),
    //                h = $(window).height() - $('#main-menu').height(),
    //                thisTop = curItem.offset().top -
    //                    $sidebar.offset().top;

//            st = "sidebarTop " + sidebarTop + "  \n" +
//                    "$topItem " + $topItem.text() + "  \n" +
//                    "$bottomItem " + $bottomItem.text() + "  \n" +
//                    "aTop " + aTop + "  \n" +
//                    "aBottom " + aBottom + "  \n" +
//                    "viewPortHeight " + viewPortHeight + "  \n\n";
    //            alert(st);
    //            $(".nav > li > a").text(st);            

    //            alert(curItem.offset().top);
    //            alert(curItem.text() + " " +
    //                curItem.offset().top);

    //            if (thisTop < 10 || thisTop > h - 10) {
    ////                alert("gone for " + (thisTop - h));
    //                $('.sidebar.affix').css("top", h - thisTop);
    ////                $('.sidebar').affix('checkPosition');
    //            }
    //            if (thisTop < 10 || thisTop > maxScrollTop - 10) {
    ////                curItem.get(0).scrollIntoView();
    ////                $('.sidebar.affix').css("top", 0);
    //                alert(thisTop);
    //            }


    //        console.log(st);

    //            alert(curItem.offset().top);
    //            $('.sidebar').animate({
    //                scrollTop: curItem.offset().top
    //            }, 1);

    //            $("#info").empty().html("Currently you are viewing - " + curItem);
    //            alert(curItem);

        },
        
        winResize = function () {
//            log('========start resize');
    //        test($(window).width());
    //        $('#support-ie8-ie9').click();
    //        scrollToAnchor($('#support-ie8-ie9'));
    //        $('a[href="#support-ie8-ie9"]').click();

        //        var $a = $(".sidebar-toc li.active > a").last(),
    //            saveAnchor = $a.attr("href");
    //        var $saveAnchor = $(".sidebar-toc li.active > a").last();
    //        console.log($saveAnchor.attr("href"));
    //        saveRef = $(".sidebar-toc li.active > a").last().attr("href");
    //        console.log(saveRef);

//            try {
    //            alert(1 + ".sidebar-toc a[href=\"" + saveRef + "\"]");
    
            ajustTopAndHeight();
            ajustWidth();
            ensureActiveItemInView($(".sidebar-toc li.active > a"));

                // fires activate.bs.scrollspy which calls ensureActiveItemInView()
    //            scrollToAnchor($(saveRef));
    //            $(saveRef).click();
    //            test(saveRef);
    //            alert(".sidebar-toc a[href=\"" + saveRef + "\"]");
//                log(1 + " click saveRef = " + saveRef);
//                $(".sidebar-toc a[href=\"" + saveRef + "\"]").click();
//    //            $(saveRef).get(0).scrollIntoView();
//                log(1 + "focus saveRef = " + saveRef);
//                $(".sidebar-toc a[href=\"" + saveRef + "\"]").focus();
//    //            alert(2 + ".sidebar-toc a[href=\"" + saveRef + "\"]");
//                log(2 + " saveRef = " + saveRef);
//            } catch (e) {
//            } finally {
    //            $saveAnchor.click();
    //            $(saveAnchor).click();
//            }
//            log('========end resize');
        };
//        to = true,
//        throttle = function (func, delay) {
//            if (to) {
//                window.clearTimeout(to);
//            }
//            to = window.setTimeout(func, delay);
//        };

    $(".sidebar").on("activate.bs.scrollspy", function () {
        ensureActiveItemInView($(".sidebar-toc li.active > a"));
    });

//        $('.sidebar').on('affix.bs.affix', function () {
////            alert("affixed");
//            adjustTopAndHeight();
//        });
    
    $(window).resize(function () {
//        throttle(winResize, 250);
        winResize();
    });

    $('.sidebar').on('affixed.bs.affix', function () {
//            alert("affixed");        
        ajustTopAndHeight();
    });

    $('#test111').click(function (e) {
//        alert("aaa");
//        scrollToAnchor($('#support-ie8-ie9'));
//        $('.sidebar-toc a[href="#support-ie8-ie9"]').click();
//        $('.sidebar-toc a[href="#support-ie8-ie9"]').get(0).scrollIntoView();
//        $("#support-ie8-ie9").get(0).scrollIntoView();
//        $('#support-ie8-ie9').get(0).click();
        $('.sidebar-toc a[href="#support-ie8-ie9"]').focus();
    });
    
    $('.sidebar').addClass('js');
//    $('.sidebar-toc').addClass('js');
    if (keepCollapsed) {
        $('.sidebar-toc ul').addClass('collapse');
    }
    
//    $('.sidebar-toc > ul').addClass('in');

    $('.sidebar').affix({
        offset: {
//                top: function () {
//                    return (this.top = $('#main-menu').outerHeight(true));
//                },
            top: -1,
            bottom: function () {
                return (this.bottom = $('#footer').height() + 1);
            }
        }
    });
    
    $('.sidebar').affix('checkPosition');
    
    ajustTopAndHeight();
    ajustWidth();
});

