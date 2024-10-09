// var JavaScriptObfuscator = require('javascript-obfuscator');

// JavaScriptObfuscator.obfuscate(
//     (function(){
    if (!$("body").hasClass("opaque-mode")) {

        switch (window.location.pathname) {
            case '/':
                require('./pokemons.js');
                break;
            case '/pokestop.html':
                require('./pokestops.js');
                break;
            case '/rank-checker':
                require('./rankChecker.js');
                break;
        }
    }
//     })()
// )
