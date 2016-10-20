/*! Copyright (c) 2016 Didactics CZ. All rights reserved. Proprietary software. Legal issues: legal@didactics.cz */

/*jslint browser: true*/
/*global
    $,
    jQuery,
    alert,
    dir_lookup,
    language_lookup,
    FALLBACK_LOCALE,
    region_lookup*/

(function () {
    "use strict";
    
    var
		LOCAL_STORAGE = 'localStorage',
		LOCALE_ITEM = 'locale',
		$locale,
        loc,
        newLoc,
        storage,
        item,
        pageLoc,
        x;

    function checkLocale(loc) {
        return loc && dir_lookup[loc];
    }

    function fixLocale(loc) {
        if (loc) {
            loc = loc.toLocaleLowerCase();  // en_US to en_us
            loc = loc.replace(/_/g, '-');   // en_us to en-us
        }
        return loc;
    }

    function localStorageAvailable() {
        try {
            if (window.hasOwnProperty(LOCAL_STORAGE) && window[LOCAL_STORAGE]) {
                storage = window[LOCAL_STORAGE];
                x = '_x_';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    function storeLocale(loc) {
        if (localStorageAvailable()) {
            window.localStorage.setItem(LOCALE_ITEM, loc);
        }
    }

    function removeLocale() {
        if (localStorageAvailable()) {
            window.localStorage.removeItem(LOCALE_ITEM);
        }
    }
    
    function switchToLocale(loc) {
        if (dir_lookup[loc] !== dir_lookup[$locale]) {
            window.location.href = dir_lookup[loc] + "index.html";
        }
        
    }

    // Select language selector items 
    $(document).ready(function () {
        
        function selectLocale(loc) {
            if (!loc) {
                return;
            }
            
            item = $('#' + loc);
            if (!item) {
                return;
            }

            $('#language-selector ul.nav > li').removeClass('active');
            item.addClass('active');
        }

        $('#language-selector ul.nav > li').click(function (e) {
            e.preventDefault();
            newLoc = $(this).attr('id');
            if (newLoc !== $locale) {
                storeLocale(newLoc);
                switchToLocale(newLoc);
            }
            selectLocale(newLoc);
        });
             
        pageLoc = $('html').attr('lang'); // en
        $locale = language_lookup[pageLoc]; // en-us
                
        // Don't detect if path is present
        if (window.location.pathname !== "/") {
            selectLocale($locale);
            return;
        }

        // If the local storage contains a different locale, switch to it
        if (localStorageAvailable()) {
            loc =  window.localStorage.getItem(LOCALE_ITEM); // en-gb
            if (!checkLocale(loc)) {
                loc = fixLocale(loc);
            }
            if (checkLocale(loc)) {
                // Locale found in LS, switch to the locale
                switchToLocale(loc);
            }
            
            $locale = loc; // en-us
        }
        
        // If locale was read from LS, select it on the loaded page
        if (checkLocale($locale)) {
            selectLocale($locale);
            // No need to store the same thing again
            return;
        }
        
        // If something was found in LS, but doesn't look good, try to fix
        $locale = fixLocale($locale);
        if (checkLocale($locale)) {
            selectLocale($locale);
            storeLocale($locale);
            return;
        }
        
        // Still no good, try the browser setting
        if (navigator.userLanguage) {
            $locale = navigator.userLanguage;
        } else if (navigator.language) { // FF
            $locale = navigator.language;
        } else if (navigator.browserLanguage) { // IE
            $locale = navigator.browserLanguage;
        } else if (navigator.systemLanguage) { // IE
            $locale = navigator.systemLanguage;
        } else {
            $locale = FALLBACK_LOCALE;
        }
        
        if ($locale !== FALLBACK_LOCALE) {
            $locale = language_lookup[$locale];
            if (checkLocale($locale)) {
                selectLocale($locale);
                storeLocale($locale);
                return;
            }
        }
        
        // Still no good, try geolocation
        jQuery.ajax({
            url: '//freegeoip.net/json/',
            type: 'POST',
            dataType: 'jsonp',
            success: function (location) {
                loc = fixLocale(location.country_code);
                $locale = region_lookup[loc];
                
                if (!checkLocale($locale)) {
                    $locale = FALLBACK_LOCALE;
                }
                
                selectLocale($locale);
                storeLocale($locale);
            },
            error: function (request, status, error) {
                $locale = FALLBACK_LOCALE;
                selectLocale($locale);
                storeLocale($locale);
            }
        });
    });
    
}());