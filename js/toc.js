/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global $, jQuery, History, alert, console*/

$(document).ready(function () {
    "use strict";
//    alert('toc');
    
    var $sidebar = $('.sidebar'),
        ajustWidth = function () {
            $sidebar.width($('.sidebar-parent').width());
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
        
        dir = function (obj) {
            console.dir(obj);
        },
                
        scrollingUp = false,
        
        ajustActive = function () {
            // Make sure highlight has active parent li
            var $aa = $('.sidebar-toc li > a.highlight'),
                $curLi,
                $curA = $aa.length === 1 ?
                        $aa :
                        scrollingUp ?
                                $aa.first() :
                                $aa.last();
            if ($curA) {
                $curLi = $curA.closest('li');
                $curLi.addClass('active');
            }
        },
        
        // win resize (by dragging and full screen/ restore)
        // win zoom in/out
        // scrollspy TOC change
        // win scroll
        updateSidebar = function () {
            
            // Update content top (right below the menu, affects the sidebar too)
            $('.post-container').css("margin-top", function () {
                return $('#main-menu').height();
            });
            
            ajustWidth(); // Can increase height of wrapped text elements
//            ajustActive();
            
            var $window = $(window),
                $document = $(document),
                $footer = $('#footer'),
                $mainMenu = $('#main-menu'),
                isAffixTop = !$sidebar.hasClass('affix-bottom'),
                $selector = $('.sidebar-toc li.active > a'),
                $topItem,
                $bottomItem,
                bottomItemTop,
                bottomItemBottom,
                sidebarTop,
                
                // height of main menu
                h = $mainMenu.height(),
                
                // from top of document to menu bottom
                contentTopAbs = $mainMenu.offset().top + h,
                
                // from main menu to window bottom
                contentHeight = $(window).height() - h,
                
                // from top of document to footer top
                footerTopAbs = $footer.offset().top,
                
                // from top of window to footer top
                footerTopRelWin = footerTopAbs - $(window).scrollTop(),
                
                // from main menu to footer top
                footerTopRelContent = footerTopRelWin - h,
                
                $sidebarAffix = $(".sidebar.affix"),
                $sidebarAffixBottom = $(".sidebar.affix-bottom"),
                sidebarHeight;

            if (isAffixTop) {
                $sidebarAffix.css("top", h + "px");
                
                if (footerTopRelContent < contentHeight) {
                    sidebarHeight = footerTopRelContent;
                } else {
                    sidebarHeight = contentHeight;
                }
                
                if (sidebarHeight < 0) {
                    sidebarHeight = 0;
                }
                
                $sidebarAffix.css("min-height", sidebarHeight + "px");
                
            } else { // affix-bottom
                sidebarTop = $sidebar.offset().top;
                sidebarHeight = footerTopAbs - sidebarTop;
                $sidebarAffixBottom.css("min-height", sidebarHeight + "px");
//                $sidebarAffixBottom.css("top", contentTopAbs + "px");
            }
            
            // Ensure the highlighted item is visible in the view
            if ($selector.length > 0) { // Some TOC elements are the active class

                $('.sidebar-toc li.active .highlight').removeClass('highlight');
                $topItem = $selector.first();
                $bottomItem = $selector.last();
                bottomItemTop = $bottomItem.offset().top - contentTopAbs;
                bottomItemBottom = bottomItemTop + $bottomItem.height();

                // Highlight only the bottom-most active-class element                
                $bottomItem.addClass('highlight');
                                
                if (bottomItemBottom > contentHeight - 15 ||
                        bottomItemTop < h) {
                    // Make a gap above and below the highlighted item when the item touches the top or bottom                                
                    $bottomItem.css('margin-top', -15);
                    $bottomItem.css('margin-bottom', 15);
                    $bottomItem[0].scrollIntoView();
                    $bottomItem.css('margin', 0);
                }
                
//                $sidebar[0].scrollTop -= 15; // leave a gap above the highlight    
                
//                if (isAffixTop) {
//                    
//                } else { // affix-bottom
//
//                }
            }
            
            
            // Sync window and sidebar
            // Top
            if ($window.scrollTop() <= 0) {
                $sidebar[0].scrollTop = 0;
            // Bottom
            } else if ($window.scrollTop() >=
                    $document.height() - $window.height() - 10) {
                $sidebar[0].scrollTop = $sidebar[0].scrollHeight;
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
        };

    $sidebar.on("activate.bs.scrollspy", function () {
        updateSidebar();
    });
    
    $(window).scroll(function () {
        updateSidebar();
        ajustActive();
    });
    
    $(window).resize(function () {
        updateSidebar();
    });

    $sidebar.on('affixed.bs.affix', function () {
        updateSidebar();
    });
    
    $(window).on('navbar.scrolled', function () {
        updateSidebar();
    });
    
    $(window).on('link.clicked', function (e, $link) {
        $('.sidebar-toc li.active').removeClass('active');
        var li = $link.closest('li');
        $(li).addClass('active');
        updateSidebar();
    });
    
        
//    $(window).bind('DOMMouseScroll mousewheel wheel', function (e) {
//        // Bottom reached
//        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
//            if (e.originalEvent.wheelDelta > 0 ||
//                    e.originalEvent.detail > 0 ||
//                    e.originalEvent.deltaY > 0) {
//                alert("down");
//            }
//        }
//    });
    
//    $(window).bind('DOMMouseScroll mousewheel', function (e) {
//        // Bottom reached
//        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
//            if (e.originalEvent.wheelDelta > 0 ||
//                    e.originalEvent.detail > 0) {
//                alert("down");
//            }
//        }
//    });
    
    // When doc is scrolled all the way down to the bottom, in some docs bottom TOC items don't get highlighted as their anchors are already visible on the screen; the same for doc top
//    $(window).bind('DOMMouseScroll mousewheel', function (e) {
//        var $curItem,
//            $allItems = $('.sidebar-toc a'),
//            $nextItem,
//            li,
//            index;
//        log('wheel');
//        
//        // We need this to know the last wheel event direction. On short pages,
//        // highlighting of the TOC items that are not made active by scrollspy,
//        // disappears. It happens when wheelling through the document,
//        // and updateSidebar doesn't find an item with the active class (set by
//        // scrollspy), so we need to select such an item ourselves depending on
//        // the scroll direction.
//        scrollingUp = e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0;
//        
//        // Bottom reached
//        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
//            if (scrollingUp) {
//                $curItem = $('.sidebar-toc a.highlight').first();
//                index = $allItems.index($curItem); //$allItems.indexOf($curItem);
//                if (index > 0) {
//                    $nextItem = $allItems[index - 1];
//                }
//            } else {
//                e.preventDefault();
//                $curItem = $('.sidebar-toc a.highlight').last();
//                index = $allItems.index($curItem); //$allItems.indexOf($curItem);
//                if (index > -1 && index < $allItems.length - 1) {
//                    $nextItem = $allItems[index + 1];
//                }
//            }
//            
//            if ($nextItem) {
//                li = $nextItem.closest('li');
//                $('.sidebar-toc li.active').removeClass('active');
//                $(li).addClass('active');
//                updateSidebar();
//            }
//        // Top reached
//        } else if ($(window).scrollTop() === 0) {
//            if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
//                $curItem = $('.sidebar-toc a.highlight').first();
//                index = $allItems.index($curItem); //$allItems.indexOf($curItem);
//                
//                if (index > 0) {
//                    $nextItem = $allItems[index - 1];
//                }
//                if ($nextItem) {
//                    $('.sidebar-toc li.active').removeClass('active');
//                    li = $nextItem.closest('li');
//                    $(li).addClass('active');
//                    updateSidebar();
//                }
//            }
////        } else {
////            updateSidebar();
//        }
//    });
    
    $sidebar.bind('DOMMouseScroll mousewheel', function (e) {
        var delta,
            scrollTop = this.scrollTop;
        
        if (e.originalEvent.wheelDelta) {
            delta = -e.originalEvent.wheelDelta;
        } else if (e.originalEvent.detail) {
            delta = e.originalEvent.detail;
        }
        
        if ((delta < 0 && scrollTop === 0) || (delta > 0 && this.scrollHeight - this.clientHeight - scrollTop === 0)) {
            e.preventDefault();
        }
    });

    $('#test111').click(function (e) {
        $('.sidebar-toc a[href="#support-ie8-ie9"]').focus();
    });
    
    // init
    
    $sidebar.addClass('js');
    
    $sidebar.affix({
        offset: {
//            top: function () {
//                return (this.top = $('#main-menu').outerHeight(true));
//            },
            top: -1,
//            bottom: function () {
////                return (this.bottom = $('#footer').height());
//                return (this.bottom = 0); // blocks affix-bottom
//            }
            bottom: 0  // blocks affix-bottom
        }
    });
    
    $sidebar.affix('checkPosition');
    
    updateSidebar();
});

