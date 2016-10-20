/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global $, jQuery, History, alert, console*/

$(document).ready(function () {
    "use strict";
// TODO clip header when scrolled horizontally on mobile
    var $tables = $('table'),
        $activeTable,
        
        log = function (key, val) {
            if (!val) {
                console.log(key);
            } else {
                console.log(key + " = " + val);
            }
        },
        
//        detachHeader = function ($tableHeader) {
//            if ($tableHeader.hasClass('thaffix')) {
//                $tableHeader.css('position', 'static');
//                $tableHeader.css('z-index', '');
//                $tableHeader.css('left', '');
//                $tableHeader.css('top', '');
//                $tableHeader.removeClass('thaffix');
//
//                // Have scrollspy update its offset
//                $(window).trigger('thaffix.changed');
//            }
//        },
        
        clearHeaders = function () {
//            $tables.each(function (index) {
//                var $table = $(this),
//                    $tableHeader = $table.find('thead'),
//                    $headCells = $table.find('thead > tr:first > th');
//                
//                $headCells.css('min-width', "");
//                $headCells.css('max-width', "");
//            });
            
            var $headCells = $('table > thead > tr > th');
            
            $headCells.css('min-width', "");
            $headCells.css('max-width', "");
        },
        
        setWidths = function (doHeaders) {
            $tables.each(function (index) {
                var $table = $(this),
                    $tableHeader = $table.find('thead'),
                    $tableParent = $table.parent(), // div.table-responsive
                    $headRow = $table.find('thead > tr:first'),
                    $headCells = $table.find('thead > tr:first > th'),
                    $bodyCells = $table.find('tbody > tr:first > td'),
                    saveCss,
                    widths = [];
                
                // reset all cells to have Bootstrap rethink the layout
//                $headCells.css('min-width', "");
//                $headCells.css('max-width', "");
//                
//                $bodyCells.css('min-width', "");
//                $bodyCells.css('max-width', "");
                
                // setting css might change widths of next columns, so we need to collect initial width values first
                
//                // Detach the header for measurements
//                saveCss = $tableHeader.attr('style');
//                $tableHeader.removeAttr('style');
//                detachHeader($tableHeader);
//                $tableHeader.css('width', 0);
                
                $headCells.each(function (index) {
                    var $headCell = $(this),
                        $bodyCell = $($bodyCells.get(index)),
                        w = (doHeaders === true) ?
                                $bodyCell.outerWidth() :
                                $headCell.outerWidth();
//                        w = $headCell.width();
//                        w = $bodyCell.outerWidth();
                    
//                    log("w", w);
//                    if (w < $bodyCell.outerWidth()) {
//                        w = $bodyCell.outerWidth();
//                        log("new w", w);
//                    }
                    
                    widths.push(w);
                });
                
//                log("widths", widths);
//                log("saveCss", saveCss);
//                // restore header css
//                $tableHeader.attr('style', saveCss);
                
                $headCells.each(function (index) {
                    var $headCell = $(this),
                        $bodyCell = $($bodyCells.get(index)),
                        w = widths[index];
//                        w = $headCell.outerWidth();
////                        w = $bodyCell.outerWidth();
                    
                    // div.table-responsive has its horizontal scrollbar visible
//                    if ($tableParent[0].scrollWidth > $tableParent[0].clientWidth) {
//    //                    alert("!!!");
////                        $tableHeader.css('min-width', $table.width() + "px");
////                        $headRow.css('min-width', $table.width() + "px");
//                        if ($headCell[0] === $headCells.last()[0]) {
//                            // stretch last header cell based on the body cell's width
//                            w = $bodyCell.outerWidth();
//                        }
//                    }
                    
//                    if (w < $bodyCell.outerWidth()) {
////                        log("increasing w");
//                        w = $bodyCell.outerWidth();
//                    }
                    
                    $headCell.css('min-width', w + "px");
                    $headCell.css('max-width', w + "px");
                    
                    $bodyCell.css('min-width', w + "px");
                    $bodyCell.css('max-width', w + "px");
                    
//                    $headCell.css('width', w + "px");
//                    $bodyCell.css('width', w + "px");
//                    $headCell.css('min-width', w + "px");
//                    $bodyCell.css('min-width', w + "px");
                });
            });
        },
        
        updateTables = function (forceUpdate) {
            $tables.each(function (index) {
                var $mainMenu = $('#main-menu'),
                    
                    $table = $(this),
                    $tableHeader = $table.find('thead'),
                    headerHeight = $tableHeader.height(),
                    
                    // no reason to have a fixed header for a single row table
                    doIt = $table.find('tbody > tr').length > 1,
                    
                    tableTop = $table.offset().top,
                    tableLeft = $table.offset().left,
                    tableHeight = $table.height(),
                    tableBottom = tableTop + tableHeight,
                    
                    contentTopRel = $mainMenu.height(),
                    contentTopAbs = contentTopRel + $mainMenu.offset().top,
                    contentHeight = $(window).height() - contentTopRel;
                
//                log("headerHeight", headerHeight);
//                if (tableHeight > contentHeight &&
//                        tableTop < contentTopAbs &&
//                        tableBottom > contentTopAbs) {
                
                // Prevent unfixing the table when it has margin-top set
                if ($tableHeader.hasClass('thaffix')) {
                    tableTop -= headerHeight;
                }
                
//                log('---------------');
//                log('tableTop', tableTop);
//                log('contentTopAbs', contentTopAbs);
                if (doIt && tableTop <= contentTopAbs &&
                        tableBottom >= contentTopAbs + headerHeight) {
                    // compare DOM elements, not jQuery elements
                    if ((forceUpdate === true) || !$activeTable || ($activeTable[0] !== $table[0])) {
                        if (!$tableHeader.hasClass('thaffix')) {
                            $tableHeader.css({ position: 'fixed', left: tableLeft, top: contentTopRel, 'z-index': 99});
                            $tableHeader.addClass('thaffix');
                            
                            // Move the table body down, calc $tableHeader.height() again, because changes once fixed
//                            $table.css('top', contentTopRel + $tableHeader.height() + 'px');
                            $table.css('margin-top', $tableHeader.height() + 'px');
                            // Have scrollspy update its offset
                            $(window).trigger('thaffix.changed');
                        }
                        
//                        $tableHeader.css({ position: 'fixed', top: contentTopRel, 'z-index': 99 });
                        
                        // div.table-responsive, horizontal scroll bar on mobile sizes
                        $table.parent().scroll(function () {
                            $tableHeader.css('left', $table.offset().left);
//                            $tableHeader.css({ left: $table.offset().left,
//                                'margin-left': -$table.offset().left + 15});
                        });
                        $activeTable = $table;
                        setWidths();
                    }
                    
                } else {
//                    if ($activeTable) {
//                        $tableHeader.css('position', 'static');
//                        $tableHeader.removeClass('thaffix');
//                        $activeTable = undefined;
//                        setWidths();
//                    }
//                    detachHeader($tableHeader);
                    if ($tableHeader.hasClass('thaffix')) {
                        $tableHeader.css('position', 'static');
                        $tableHeader.removeClass('thaffix');
                        $activeTable = undefined;
                        $table.css('margin-top', '');

                        // Have scrollspy update its offset
                        $(window).trigger('thaffix.changed');
                    }
//                    setWidths();
                }
            });
        };
    
    if ($tables.length > 0) {
//        $('.table-responsive').scroll(function () {
//            alert("scroll !!!");
//        });
        
        $(window).scroll(function () {
            updateTables();
        });
        
        $(window).resize(function () {
//            setWidths();
            clearHeaders();
            updateTables(true);
            setWidths(true);
        });
        
        // init
        setWidths();
        updateTables(true);
    }
});

