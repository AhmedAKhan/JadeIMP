var analyzer = require('./analyzer');
var synthesizer = require('./synthesizer');


var analyzer = require('./analyzer');
var synthesizer = require('./synthesizer');


/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/*
  this function will take in the jade input and will return the parseTree
  also called analyzer
*/
function parse(jadeString, parseDebug){
  return analyzer.parse(jadeString, parseDebug);
}

/*
  this function will take in the jade input and will return the parseTree
  also called analyzer
*/
function parse(jadeString, parseDebug){
  return analyzer.parse(jadeString, parseDebug);
}

/*
  this function will take a
 */
function synthesis(syntaxTree, scope){
  return synthesizer.convert(syntaxTree, scope);
}



/*
  this function will take a
 */
function synthesis(syntaxTree, scope){
  return synthesizer.convert(syntaxTree, scope);
}



/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render; // will take in the jadeimp code and return the html as a string
module.exports.compile = function(jadeimpString){
  var syntaxTree = parse(jadeString);
  return function(scope){ 
    scope = extend({}, scope, syntaxTree.scope);
    var outputHtml = synthesis(syntaxTree, syntaxTree.scope);
    return render(jadeString, scope);  
  }
}


// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render; // will take in the jadeimp code and return the html as a string
module.exports.compile = function(jadeimpString){
  var syntaxTree = parse(jadeString);
  return function(scope){ 
    scope = extend({}, scope, syntaxTree.scope);
    var outputHtml = synthesis(syntaxTree, syntaxTree.scope);
    return render(jadeString, scope);  
  }
}



var analyzer = require('./analyzer');
var synthesizer = require('./synthesizer');


var analyzer = require('./analyzer');
var synthesizer = require('./synthesizer');


/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/*
  this function will take in the jade input and will return the parseTree
  also called analyzer
*/
function parse(jadeString, parseDebug){
  return analyzer.parse(jadeString, parseDebug);
}

/*
  this function will take in the jade input and will return the parseTree
  also called analyzer
*/
function parse(jadeString, parseDebug){
  return analyzer.parse(jadeString, parseDebug);
}

/*
  this function will take a
 */
function synthesis(syntaxTree, scope){
  return synthesizer.convert(syntaxTree, scope);
}



/*
  this function will take a
 */
function synthesis(syntaxTree, scope){
  return synthesizer.convert(syntaxTree, scope);
}



/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




/* 
 * a function that will compile the jadeimp code to html, an example use for this function is given inside the howToUse
 *
 * @param {String} source is the jadeimp code that you want to convert to html
 * @param {object} scope  {optional} should have all the variables in the jade code that is defined
 * @returns {function} to generate the html from an object containing scope
 */
function render(jadeString, scope){
  console.log("inside the render, going to call the jadeString");
  var syntaxTree = parse(jadeString);
  console.log("calling extend, scope: " + JSON.stringify(scope) + " syntaxTree.scope: " + JSON.stringify(syntaxTree.scope));
  scope = extend({}, scope, syntaxTree.scope);
  var outputHtml = synthesis(syntaxTree, scope);
  return outputHtml;
}

/*
 * this function takes in an objects and will output the objects merged together
 * 
 * @param object target this function takes in any number of arguments that is an object
 * @return {object} an object that combines the objects given as inputs
*/
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}




// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render; // will take in the jadeimp code and return the html as a string
module.exports.compile = function(jadeimpString){
  var syntaxTree = parse(jadeString);
  return function(scope){ 
    scope = extend({}, scope, syntaxTree.scope);
    var outputHtml = synthesis(syntaxTree, syntaxTree.scope);
    return render(jadeString, scope);  
  }
}


// make the API functions, it will only have render and compile
module.exports.parse = parse;
module.exports.synthesis = synthesis;
module.exports.render = render; // will take in the jadeimp code and return the html as a string
module.exports.compile = function(jadeimpString){
  var syntaxTree = parse(jadeString);
  return function(scope){ 
    scope = extend({}, scope, syntaxTree.scope);
    var outputHtml = synthesis(syntaxTree, syntaxTree.scope);
    return render(jadeString, scope);  
  }
}



