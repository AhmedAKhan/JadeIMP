'use strict'

var RegExp = require("regex");

var DEBUG = true;
var THRESHOLD = 50; // represents the level of information that is being displayed, change it to show or less information
function print(str){ printwp(str, 0); }
function printwp(str, priority){ if(DEBUG && THRESHOLD > priority) console.log(str); }




function getTokenEOL(source){
  print("inside the end of line reached");
  var result = /^\n/.exec(source.text);
  if(!result) return undefined;
  adjustString(source, result[0].length);
  source.level = 0; // since a new line was added, the current level is 0
  findLevel(source);
  return true;
}


/*
 * this function will find the level of the current line. It will be called after end of line and the will set the level depending on the level of the first character
 */
function findLevel(source){
  var result = /^ */.exec(source.text); // always match because an empty string is considered valid
  adjustString(source, result[0].length);
  source.level = result[0].length/2; // since a new line was added, the current level is 0
}
/*
 * this function will convert the next sequence of characters to tokens
 *
 * @param1 {String} sourceText = the current jadeimp code
 * return {Token} an object that will hold the next token
 */
function getTokenDirective(source){}
/**/
function getTokenVerticalBar(source){
  var sourceText = source.text;
  var result = /^\| /.exec(sourceText); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "vertical bar",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenAttributes(source){}
/**/
function getTokenCondition(source){}
/**/
function getTokenStatement(source){}
/**/
function getTokenStatements(source){}
/**/
function getTokenExpression(source){
  //

  //

}
/**/
function operator(source){
  var result = /^(\+|-|\*|\/)/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "operator",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}

/**/
function boolOperator(source){
  var result = /^(==|!==|>=?|<=?)\s*/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "boolOperator",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}

/**/
function getTokenVariable(source){
  var sourceText = source.text;
  var result = /^\$[\w_-]+ */.exec(sourceText); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "variable",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenRawText(source){}
/**/
function getTokenBlock(source){}

function getTokenNumber(source){
  var number = /^[0-9]+ */.exec(source.text);
  if(!number) return undefined;
  var value = number[0].trim();
  adjustString(source, number[0].length);
  var token = {
    type : "number",
    level: source.level,
    value: parseInt(value),
    text : number[0]
  };
  source.tokens.push(token);
  return true;
}

/// simple tokens
/*
  = () var if for else block create | .
*/
function getSimpleToken(source){
  var result = /^(=|\(|\)|var|for|if|else|block|create|\| ) */.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  var token = {};
  if(value == "|") result[0] = result[0].trim() + " ";
  adjustString(source, result[0].length);
  token = {
    type  : value,
    value : value,
    text  : result[0],
    level : source.level
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenSimpleIf(source){
  var sourceText = source.text;
  var result = /^if */.exec(sourceText); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "if",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenSimpleFor(source){
  var sourceText = source.text;
  var result = /^for */.exec(sourceText); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "for",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
}
/**/
function getTokenSimpleVar(source){
  var sourceText = source.text;
  var result = /^var */.exec(sourceText); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "var",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenDot(source){
  var result = /^\. *\n/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "dot",
    level: source.level,
    value: value,
    text : result[0]
  };
  source.tokens.push(token);
  source.level = 0; // because a new line was created by the dot
  
  // the raw text
  findLevel(source);
  getTokenText(source);

  // found the variable, actually start converting it
  return true;
}

/*
  @param1 {object source} = 
  @return {boolean} represents if it was successful getting the text or not
*/
function getTokenText(source){
  // get current level
  console.log("inside the getTokenText");
  var currentLevel = source.level;
  
  while(true){
    print("inside the token text: source.text: " + source.text);
    var isNewLine = getTokenEOL(source);
    // if this is a new line and the indentation is lower then the begining then 
    // exit the function
    if(isNewLine && source.level < currentLevel) return; 
    if(source.text == "") return;

    // take everything from the begining and a $ symbol. (unless if its another $) or end of line
    var result = /^[^\n$]+/.exec(source.text);
    if(result){
      var textToken = {
        type:"rawText",
        level:source.level,
        value:result[0],
        text:result[0]
      };
      source.tokens.push(textToken);
      adjustString(source, result[0].length);
    }

    //check for the dollor sign
    result = /^\$[^\s$][\S]*/.exec(source.text);
    if(result){
      var asgToken = {
        type:"varCall",
        level:source.level,
        name:result[0].substr(1), // remove the $ from the variable name
        text:result[0]
      };
      source.tokens.push(asgToken);
      adjustString(source, result[0].length);
    }
  }
}


/*
 * this function will convert the next sequence of characters to the token
 * ident, which means variable names, or just names in general
 * 
 * @param1 {String} sourceText = the current jadeimp code
 * return {Token} an object that will hold the next token
 */
function getTokenIdent(source){
  var sourceText = source.text;
  var ident = /^[\w_-]+ */.exec(sourceText); // this will get the name of the variable
  if(!ident) return false;
  var value = ident[0].trim();
  adjustString(source, ident[0].length);

  var token = {
    type : "ident",
    level: source.level,
    value: value,
    text : ident[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}


/*
 * @param1 {object} source = is an object used to tokenize the string
 * @return {boolean} = returns if it was able to get the next token
 */
function nextToken(source){
  print("the source text is '" + source.text + "'");
  // this is a list of functions that the token will use
  var tokenValidators = /***

                        'blank', 'endInterpolation', 'interpolation', 'block',
                        'conditional', 'each', 'while', 'directive',
                        'attrs', 'indent', 'text', this.fail()

                        ---idk
                        'slash'     , 'textHtml'  , 'dot'  ,
                        'className' , 'blockCode' , 'code' ,
                        'colon'     ,

                        --- should add
                        'include',

                        **/
                        [ 
                          /* getTokenMaker("="), */
                          /* getTokenMaker("("), */
                          /* getTokenMaker(")"), */
                          /* getTokenMaker("var"), */
                          /* getTokenMaker("if"), */
                          /* getTokenMaker("for"), */
                          /* getTokenMaker("else"), */
                          /* getTokenMaker("block"), */
                          /* getTokenMaker("create"), */
                          /* getTokenMaker("|"), */
                          /* getTokenMaker("."), */
                          getTokenDot,
                          getSimpleToken, // all the simple tokens, such as = (  ) . var if else for

                          getTokenDirective,
                          getTokenAttributes,
                          getTokenVariable,
                          /* getTokenSimpleIf, */
                          /* getTokenSimpleFor, */
                          getTokenCondition,
                          getTokenStatement,
                          /* getTokenStatements, */
                          getTokenExpression,
                          getTokenRawText,
                          /* getTokenText, */
                          getTokenBlock,

                          getTokenNumber,
                          getTokenIdent,
                          getTokenEOL
                        ];

  var curToken = null;
  for(var i = 0; i < tokenValidators.length; i++){
    print("going to try out tokenValidators[i]: " + tokenValidators[i].name);
    if(tokenValidators[i](source)) return true;
  }
  return false;
}



/*
*/
function adjustString(source, num){
  source.text = source.text.substr(num);
}
/*
 * this function is for creating simple tokens, for example vertical bar, | or var, 
 * /// not really used so far
 * @param1 {object}
 * @param2 {string}
 * @param3 {--} value
 * @return {Object token} this will be the newly created token
 */
/* function createToken(source, type, val){ */
  /* var token = { */
  /*   type: name, */
  /*   level: source.level, */
  /*   text: type */
  /* } */
  /* if(val !== undefined){ token.val = val; token.text = val; } */
  /* return token; */
/* } */

/*
  @param1 {String} sourceText = this function takes in the jadeimp code as string
  @return {object} this function returns a list of tokens
  @api public
*/
function lexer(sourceText){
  // convert all the tabs to four spaces
  print("sourceText: " + sourceText);
  var source = {
    "text":sourceText,
    "level":0,
    "tokens":[]
  };
  source.text = sourceText.replace(/\t/, "    ");

  // start lexing the code
  while(sourceText.length > 0){
    if(!nextToken(source)) break; // ok so if the next token returns false meaning error, stop everything
  }
  return source.tokens;
}


// this is the part of the code that should be available to the rest of the program
module.exports = lexer;




/*

*/
function test(){
  var result = "";
  /* result = {"text":"original"}; */
  /* adjustString(result, 4); */
  /* if(result.text != "inal"){ print("did not get the proper result for test 1, got: " + result.text + " expected inal"); return; } */

  /* var source = {"text":"var numberOfApples = 10", "tokens":[], "level":0}; */
  /* result = nextToken(source); */
  /* if(result && result.type == "ident" && result.level == 0){ print("--broke 1---");  } */
  /* print("source: '" + source.text + "'"); */

  result = lexer("p. \n  asdasd asda \n  sdasdasd asdsa \n  dsa $zcxz adsad \n  asdad asda \nsdas d asd ");
  print(" result: " + JSON.stringify(result));
}
test();



