/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global
    $,
    jQuery,
    alert */

(function () {
    "use strict";

    var $locale;
    
    $(document).ready(function () {
        if (navigator.userLanguage) {
            $locale = navigator.userLanguage;            
        } else if (navigator.language) { // FF
            $locale = navigator.language;
        } else if (navigator.browserLanguage) { // IE
            $locale = navigator.browserLanguage;
        } else if (navigator.systemLanguage) { // IE
            $locale = navigator.systemLanguage;
        } else {
            $locale = undefined;
        }
        
        var
            getTimeString = function (date) {
                return $locale ?
                        date.toLocaleTimeString($locale, {hour: '2-digit', minute: '2-digit'}) :
                        date.toLocaleTimeString({hour: '2-digit', minute: '2-digit'});
            },
            
            // http://stackoverflow.com/questions/11887934/check-if-daylight-saving-time-is-in-effect-and-if-it-is-for-how-many-hours
            //t is the date object to check, returns true if daylight saving time is in effect.
            isDST = function (t) {
                var jan = new Date(t.getFullYear(), 0, 1),
                    jul = new Date(t.getFullYear(), 6, 1);
                return Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) === t.getTimezoneOffset();
            },
        
            getCurTimeString = function () {
                return getTimeString(new Date());
            },
        
            makeDate = function (timeSt) {
                var date = new Date(new Date().toISOString().substring(0, 10) + "T" +
                    timeSt + ":00Z");
                    // timeSt + ":00+01:00");
                if (isDST(date)) {
                    date.setHours(date.getHours() - 1); // apply daylight saving time
                }
                return date;
            },
        
            $startTimeSt = $('#worktime-start').text(),
            $endTimeSt = $('#worktime-end').text(),
            
            startDate = makeDate($startTimeSt),
            endDate = makeDate($endTimeSt),
        
            startTimeSt = getTimeString(startDate),
            endTimeSt = getTimeString(endDate);
        
        $('#worktime-start').text(startTimeSt);
        $('#worktime-end').text(endTimeSt);
    });
    
}());