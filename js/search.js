/*! http://rayhightower.com/blog/2016/01/04/how-to-make-lunrjs-jekyll-work-together/ */

/*jslint browser: true*/
/*global
    $,
    jQuery,
    lunr,
    SEARCH_STATISTICS,
    SEARCH_NOTHING_FOUND,
    alert */

$(document).ready(function () {
    "use strict";
    
    if (!String.format) {
        String.format = function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/\{(\d+)\}/g, function (match, number) {
                return typeof args[number] !== 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }
    
    // Initialize lunr with the fields to be searched, plus the boost
    window.idx = lunr(function () {
        this.field('id');
        this.field('title');
        this.field('content', { boost: 10 });
        //this.use(lunr.ru);
        this.use(lunr.multiLanguage('en', 'ru'));
    });
    
    // Get the generated search_data.json file so lunr.js can search it locally.
    window.data = $.getJSON('/search_data.json');

    // Wait for the data to load and add it to lunr
    window.data.then(function (loaded_data) {
        $.each(loaded_data, function (index, value) {
            window.idx.add(
                $.extend({ "id": index }, value)
            );
        });
    });

    function display_search_results(results) {
        var $search_results = $("#search-results-list"),
            $search_results_statistics = $("#search-results-statistics"),
            st;

            // Wait for data to load
        window.data.then(function (loaded_data) {

            // Are there any results?
            if (results.length) {
                $search_results.empty(); // Clear any old results
              
                var st = '<ul>';
                
                // Iterate over the results
                results.forEach(function (result) {
                    var item = loaded_data[result.ref];

                    // Build a snippet of HTML for this result
                    st = st.concat('<li><a href="' + item.url + '" target="_blank">' + item.title + '</a></li>');
                });
                
                st = st.concat('</ul>');
                
                $search_results.html(st);
                $search_results_statistics.html(String.format(SEARCH_STATISTICS, results.length));
            } else {
                $search_results_statistics.empty();
                // If there are no results, let the user know.
                // $search_results.html('<li>No results found.<br/>Please check spelling, spacing, yada...</li>');
                $search_results.html(SEARCH_NOTHING_FOUND);
            }
        });
    }

    $("#site_search").submit(function (event) {
        var query = $("#search-input").val(), // Get the value for the text field
            results;
        
        if (!query.trim()) {
            $("#search-input").val('');
            $("#search-input").focus();
            event.preventDefault();
            return;
        }
        
        $("#search-results-phrase").html(query);
        
        $("#search-results-modal").modal('show');
        event.preventDefault();
        
        results = window.idx.search(query); // Get lunr to perform a search
        display_search_results(results); // Hand the results off to be displayed
    });
});
