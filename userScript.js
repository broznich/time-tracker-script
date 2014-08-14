// ==UserScript==
// @name       fixTimer
// @version    0.62
// @grant       none
// @description Script for fix bugs with time-tracker plugin and add some features in redmine
// @match      http://rm.innomdc.com/*
// @copyright  2014+, Broznich Dmitry
// ==/UserScript==
var debugBranch = localStorage.getItem('ht-debug-branch');

window.tsRepoBaseUrl = location.protocol + '//rawgithub.com/broznich/time-tracker-script/'+(debugBranch || 'master')+'/';
document.head.appendChild((function(){ 
    var el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = tsRepoBaseUrl + 'loader.js';
    return el;
})());
