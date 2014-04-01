// ==UserScript==
// @name       fixTimer
// @version    0.60
// @description Script for fix bugs with time-tracker plugin and add some features in redmine
// @match      TYPE_REDMINE_SITE_URL (Example: http://rm.innomdc.com/*)
// @copyright  2014+, Broznich Dmitry
// ==/UserScript==

window.tsRepoBaseUrl = location.protocol + '//rawgithub.com/broznich/time-tracker-script/dev/';
document.head.appendChild((function(){ 
    var el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = window.tsRepoBaseUrl + 'loader.js';
    return el;
})());