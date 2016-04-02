'use strict'

var RegExp = require("regex");

var DEBUG = false;
var THRESHOLD = 50; // represents the level of information that is being displayed, change it to show or less information
function print(str){ printwp(str, 0); }
function printwp(str, priority){ if(DEBUG && THRESHOLD > priority) console.log(str); }



/**/
/* function getTokenAttribute(source){ */
  /* // it is only a directive if its the first thing in the line */

  /* // get ident */
  /* if(!getTokenIdent(source)) throw("got an error in attributes "); */
  

  /* /1* var result = /^[\w_-] *= *"?[\w_ -]"? *2/.exec(source.text); // this will get the name of the variable *1/ */
  /* var result = /^= *1/.exec(source.text); // this will get the name of the variable */
  /* if(!result) return false; */
  /* var value = result[0].trim(); */
  /* adjustString(source, result[0].length); */

  /* var equalToken = { type : "=", level: source.level, value: value, text : result[0] }; */
  /* source.tokens.push(equalToken); */

  /* // get ident */
  /* if(!getTokenIdent(source)) throw("got an error in attributes");; */



  /* // get equals */
  /* // get ident */

  /* /1* /2* var result = /^[\w_-] *= *"?[\w_ -]"? *3/.exec(source.text); // this will get the name of the variable *2/ *1/ */
  /* /1* if(!result) return false; *1/ */
  /* /1* var value = result[0].trim(); *1/ */
  /* /1* adjustString(source, result[0].length); *1/ */

  /* /1* var token = { *1/ */
  /* /1*   type : "directive", *1/ */
  /* /1*   level: source.level, *1/ */
  /* /1*   value: value, *1/ */
  /* /1*   text : result[0] *1/ */
  /* /1* }; *1/ */
  /* /1* source.tokens.push(token); *1/ */
  /* /1* // found the variable, actually start converting it *1/ */
  /* /1* return true; *1/ */
/* } */

// div(id=10, bind=403)
/**/
/* function getTokenAttributes(source, directive){ */
  /* // it is only a directive if its the first thing in the line */
  /* if('(' !== source.text.charAt(0)) return; */

  /* /1* var result = /^ *2/.exec(source.text); // this will get the name of the variable *1/ */
  /* /1* if(!result) return false; *1/ */
  /* /1* var value = result[0].trim(); *1/ */
  /* /1* adjustString(source, result[0].length); *1/ */

  /* /1* var token = { *1/ */
  /* /1*   type : "directive", *1/ */
  /* /1*   level: source.level, *1/ */
  /* /1*   value: value, *1/ */
  /* /1*   text : result[0] *1/ */
  /* /1* }; *1/ */
  /* /1* source.tokens.push(token); *1/ */
  /* /1* // found the variable, actually start converting it *1/ */
  /* /1* return true; *1/ */

  /* directive.attr = []; // make a new directive */
  /* var currentAttr = getTokenAttribute(source); // find the first attribute */
  /* while(currentAttr != null){ */
  /*   // while there are attributes then continue */
  /*   directive.attr.push(currentAttr); */
  /*   currentAttr = getTokenAttribute(source); */
  /* } */
/* } */

function getTokenEOL(source){
  var result = /^\n/.exec(source.text);
  if(!result) return false;
  adjustString(source, result[0].length);
  source.level = 0; // since a new line was added, the current level is 0
  source.column = 0;
  source.line += 1;
  /* findLevel(source); */
  getTokenDent(source);
  source.lineBegin = true;
  print("inside the end of line reached, the lineBegin is " + source.lineBegin);
  return true;
}


/*
 * this function will find the level of the current line. It will be called after end of line and the will set the level depending on the level of the first character
 */
/* function findLevel(source){ */
/*   var result = /^ *1/.exec(source.text); // always match because an empty string is considered valid */
/*   adjustString(source, result[0].length); */
/*   source.level = result[0].length/2; // since a new line was added, the current level is 0 */
/* } */
/*
 * this function will convert the next sequence of characters to tokens
 *
 * @param1 {String} sourceText = the current jadeimp code
 * return {Token} an object that will hold the next token
 */
function getTokenDirective(source){
  // it is only a directive if its the first thing in the line
  if(!source.lineBegin) return;

  var result = /^[\w_-]+ */.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "directive",
    name: value,
    level: source.level,
    text : result[0]
  };
  source.tokens.push(token);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenVerticalBar(source){
  var sourceText = source.text;
  var result = /^\| /.exec(sourceText); // this will get the name of the variable
  /* console.log("checking for the vertical bar, " + result); */
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = { type : "vertical bar", level: source.level, value: value, text : result[0] };
  // decided not to put the vertical bar token in the tokens list
  /* source.tokens.push(token); */
  getTokenText(source, false);
  // found the variable, actually start converting it
  return true;
}
/**/
function getTokenAttributes(source){
  
}
/**/
function getTokenExpression(source){
  //

  //
}

function handleCondition(source){
  /* var result = /^ *1/.exec(source.text); // this will get the name of the variable */
  /* if(!result) return false; */
  /* var value = result[0].trim(); */
  /* adjustString(source, result[0].length); */

  /* var token = { */
  /*   type : "if", */
  /*   level: source.level, */
  /*   value: value, */
  /*   text : result[0] */
  /* }; */
  /* source.tokens.push(token); */
  /* // found the variable, actually start converting it */
  /* return true; */
}

/* probably not used */
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

/* probably not used */
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
/* indent + outdent */
function getTokenDent(source){
  // source.level = current number of spaces in the last token
  // source.indentTokensStack = all the indent tokens and the number of spaces for them

  // always match because an empty string is considered valid
  var result = /^ */.exec(source.text);
  adjustString(source, result[0].length);
  var numSpaces = result[0].length // number of spaces
  
  // check indent
  var currentLevel = 0;
  var lastIndentTokenIndex = source.indentTokensStack.length-1;
  if(lastIndentTokenIndex >= 0) currentLevel = source.indentTokensStack[source.indentTokensStack.length-1].level
  /* console.log("2. updating token dents, numSpaces: " + numSpaces + " currentLevel: " + currentLevel); */
  if(numSpaces > currentLevel){
    var indentTokens = {"type":"indent", "level":numSpaces, "indents":source.indentTokensStack.length+1};
    source.tokens.push(indentTokens);
    source.indentTokensStack.push(indentTokens);
    /* console.log("3.1"); */
    return true;
  }
  else if(numSpaces == currentLevel) return false; // the next item is in the same div

  /* console.log("3.2 inside the dent there is an outdent"); */
  // check the outdents
  for(var i = source.indentTokensStack.length-1; i >= 0 ;  i--){
    if(source.indentTokensStack[i].level < numSpaces)
      getError("the number of spaces is mismatched at line " + source.line + " numberOfSpaces are " + numSpaces + " execpted to have " + source.indentTokensStack[i].level);
    
    if(source.indentTokensStack[i].level == numSpaces) return true;
    source.indentTokensStack.pop();
    source.tokens.push({"type":"outdent", "level":numSpaces, "indents":i, "text":""});
  }

  if(numSpaces === 0) return true;
  
  // 
  getError("got the number of spaces as -1 for some reason");
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
  = () var else block create | .
*/
function getSimpleToken(source){
  var result = /^(=|\(|\)|var|else|block|create|;) */.exec(source.text); // this will get the name of the variable
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

function getError(source, errorString){
  throw errorString;
}

/**/
function getTokenSimpleIf(source){
  var result = /^if *\(?/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var result = /^[^)\n]*\)?/.exec(source.text); // this will get the name of the variable
  if(!result){ getError(source, "no condition specified for if statement"); return false;  };
  var condition = result[0];
  condition = condition.substr(0,condition.length).trim();
  adjustString(source, result[0].length);

  var token = {
    type : "if",
    level: source.level,
    condition: condition,
    text : result[0]
  };
  source.tokens.push(token);
  return true;
}
/**/
function getTokenFor(source){
  // get the for token
  var result = /^for *\(?/.exec(source.text); // this will get the name of the variable
  if(!result) return false;

  /* var forValue = result[0].trim(); // value not necessary*/
  adjustString(source, result[0].length);
  var totalString = result[0];

  // get the declaration
  result = /^[^;]*;/.exec(source.text); // this will get the name of the variable
  var declaration = result[0].trim(); // get the value
  declaration = declaration.substring(0,declaration.length-1);// remove the semicolon
  adjustString(source, result[0].length);
  totalString = totalString + result[0];

  // get the condition
  result = /^[^;]*;/.exec(source.text); // this will get the name of the variable
  var condition = result[0].trim(); // get the value
  condition  = condition .substring(0,condition .length-1);// remove the semicolon
  adjustString(source, result[0].length);
  totalString = totalString + result[0];

  // get the iteration
  result = /^[^)\n]*\)?/.exec(source.text); // this will get the name of the variable
  var iteration = result[0].trim(); // get the value
  totalString = totalString + result[0];
  
  // if there is an end bracket, remove it
  if(iteration[iteration.length-1] == ")")
    iteration  = iteration.substring(0,iteration.length-1);// remove the semicolon
  adjustString(source, result[0].length);

  var token = {
    type : "for",
    declaration: declaration,
    condition:condition,
    iteration:iteration,
    level: source.level,
    text : totalString
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
  var result = /^\. */.exec(source.text); // this will get the name of the variable
  /* var result = /^\. *\n/.exec(source.text); // this will get the name of the variable */
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = {
    type : "dot",
    level: source.level,
    value: value,
    text : result[0]
  };
  /// decided to remove the dot 
  /* source.tokens.push(token); */ 
  /* source.level = 0; // because a new line was created by the dot */
  
  // the raw text
  // TODO
  /* findLevel(source); */
  getTokenDent(source);
  getTokenText(source);

  // found the variable, actually start converting it
  return true;
}

/*
  @param1 {object source} = 
  @return {boolean} represents if it was successful getting the text or not
*/
function getTokenText(source, runContinously){
  // if runContinously is true, then its a dot, else just convert this line to text
  if(runContinously === undefined) runContinously = true;
  // get current level
  print("inside the getTokenText");
  var currentLevel = source.indentTokensStack.length;
  var gotResult = false;
  
  do{
    print("inside the token text: source.text: " + source.text);
    /* getTokenDent(source); */
    /* console.log("inside the getTokenDent " + JSON.stringify(source.indentTokensStack)); */
    // if this is a new line and the indentation is lower then the begining then 
    // exit the function
    /* console.log("isnewline: " + isNewLine + " source.level: " + source.indentTokensStack.length + " currentLevel: " + currentLevel); */
    if(source.indentTokensStack.length < currentLevel) return gotResult; 
    if(source.text == "") return gotResult;

    // take everything from the begining and a $ symbol. (unless if its another $) or end of line
    /* var result = /^[^\n$]+/.exec(source.text); */
    // take everything in that line
    var result = /^.+/.exec(source.text); 
    if(result){
      var textToken = {
        type:"rawText",
        level:source.indentTokensStack.length,
        value:result[0],
        text:result[0]
      };
      source.tokens.push(textToken);
      adjustString(source, result[0].length);
      gotResult = true;
    }

    //check for the dollor sign
    /*result = /^\$[^\s$][\S]*//*.exec(source.text);*/
    /*if(result){*/
      /*var asgToken = {*/
        /*type:"varCall",*/
        /*level:source.level,*/
        /*name:result[0].substr(1), // remove the $ from the variable name*/
        /*text:result[0]*/
      /*};*/
      /*source.tokens.push(asgToken);*/
      /*adjustString(source, result[0].length);*/
    /*}*/
    var isNewLine = getTokenEOL(source);
  }while(runContinously)
}


/*
 * this function will convert the next sequence of characters to the token
 * ident, which means variable names, or just names in general
 * 
 * @param1 {String} sourceText = the current jadeimp code
 * return {Token} an object that will hold the next token
 */
function getTokenIdent(source){
  var ident = /^[\w_-]+ */.exec(source.text); // this will get the name of the variable
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

/* end of string */
function getTokenEOS(source){
  if(source.text.length > 0) return; // if the string is not empty then you have not reached end of string
  
  // add the proper amount of out tokens
  for(var i = 0; i < source.level; i++){
    source.tokens.push({"type":"outindent", "text":""});
  }

  // add the token and end the function
  source.tokens.push({"type":"eos", "text":""});
  return true;
}


/*
 * @param1 {object} source = is an object used to tokenize the string
 * @return {boolean} = returns if it was able to get the next token
 */
function nextToken(source){
  print("the source text is '" + source.text + "'");
  // this is a list of functions that the token will use
  var tokenValidators = [ 
                          getTokenEOS,
                          /* getTokenDent, */
                          getTokenDot,
                          getTokenVerticalBar,
                          getTokenFor,
                          getTokenSimpleIf,
                          getSimpleToken, // all the simple tokens, such as = (  ) . var else
                          getTokenDirective,
                          getTokenAttributes,
                          getTokenVariable,
                          getTokenExpression,
                          getTokenRawText,
                          getTokenBlock,
                          getTokenNumber,
                          /* getTokenIdent, */
                          getTokenEOL
                        ];

  var gotToken = false;
  var oldLineBegin = source.lineBegin;
  for(var i = 0; i < tokenValidators.length; i++){
    /* print("going to try out tokenValidators[i]: " + tokenValidators[i].name); */
    if(tokenValidators[i](source)){ gotToken = true; break; }
  }

  // if it was false before and true now, then keep it true. or else make it false
  if(!(!oldLineBegin && source.lineBegin)){ source.lineBegin = false; }
  return gotToken;
}





/*
*/
function adjustString(source, num){
  source.column += num; // assumption, this function only gets called per line
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
    "tokens":[],
    "lineBegin":true,
    "line":1,
    "column":1,
    "indentTokensStack":[]
  };
  if(sourceText === undefined) throw("the given input string was undefined");
  source.text = sourceText.replace(/\t/g, "    ");
  getTokenDent(source);
  // start lexing the code
  while(source.text.length > 0){
    // ok so if the next token returns false meaning error, stop everything
    var numberOfTokens = source.tokens.length;
    if(!nextToken(source)){
      /* console.log("numberOfTokens: " + numberOfTokens + " source.tokens.length: " + source.tokens.length); */
      if(numberOfTokens === source.tokens.length)
        getError(source, "got lost on input at line " + source.line + " and column " + source.column);
      break;
    }
  }
  return source.tokens;
}


// this is the part of the code that should be available to the rest of the program
module.exports = lexer;





var expect = require('chai').expect;
console.log("this is from the test file");


describe("testing the adjustString", function(){
    it("giving it no input", function(done){
        var input = {text:"1234567890", column:0}
        adjustString(input, 0);
        expect(input).to.have.property("text", "1234567890")
        expect(input).to.have.property("column", 0)
        done();
        })
    });


describe("testing text with dot", function(){
  it("basic p with dot text ", function(done){
    var resultArr = lexer("p.  \n  1. this is the first line\n  2. this is the second line");
    /* console.log("text with dot result: " + JSON.stringify(result, null, 2)); */
    
    expect(resultArr).to.be.an("array").with.length(4);

    var result = resultArr[0];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");
    expect(result).to.have.property("level", 0);

    /* var result = resultArr[1]; */
    /* expect(result).to.be.an("object"); */
    /* expect(result).to.have.property("type", "dot"); */
    /* expect(result).to.have.property("level", 0); */

    var result = resultArr[1];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "indent");
    expect(result).to.have.property("indents", 1);

    var result = resultArr[2];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("level", 1);
    expect(result).to.have.property("value", "1. this is the first line");

    var result = resultArr[3];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("level", 1);
    expect(result).to.have.property("value", "2. this is the second line");

    done();
  });
});

describe("testing text", function(){
    it("going to test normal text with bar", function(done){
        var result = lexer("|  this is some text");
        /* console.log("result: " + JSON.stringify(result, null, 2)); */
        expect(result).to.be.an("array").with.length(1);

        /* var barToken = result[0]; */
        /* expect(barToken).to.have.property("type","vertical bar"); */


        var rawTextToken = result[0];
        expect(rawTextToken).to.have.property("type", "rawText");
        expect(rawTextToken).to.have.property("value", " this is some text");
        done();
        })
    });

describe("testing the if statement", function(){
    it("going to test a basic if statement", function(done){
        var result = lexer("if 1 == 0");
        /* console.log("result: " + JSON.stringify(result)); */
        expect(result).to.be.an("array").with.length(1);
        expect(result[0]).to.have.property("type","if");
        expect(result[0]).to.have.property("condition","1 == 0");
        done();
        });
    });

describe("going to test directives", function(){
    it("basic simple p directive", function(done){
      var resultArr = lexer("p");
      console.log("result: " + JSON.stringify(resultArr, null, 2));

      expect(resultArr).to.be.a("array")
      .to.have.length(1);

      var result = resultArr[0];
      expect(result).to.be.a("object");
      expect(result).to.have.property("type", "directive");
      expect(result).to.have.property("name", "p");

      done();
    })

    it("bar text + if statement", function(done){
        var resultArr = lexer("if 1 == 2\n  | this is also some text");
        /* console.log("result: " + JSON.stringify(resultArr, null, 2)); */

        expect(resultArr).to.be.a("array")
        .to.have.length(3);

        var ifToken = resultArr[0];
        expect(ifToken).to.be.a("object");
        expect(ifToken).to.have.property("type", "if");
        expect(ifToken).to.have.property("condition", "1 == 2");

        var indent = resultArr[1];
        expect(indent).to.be.an("object");
        expect(indent).to.have.property("type", "indent");
        expect(indent).to.have.property("level", 2);
        expect(indent).to.have.property("indents", 1);

        var rawText = resultArr[2];
        expect(rawText).to.be.an("object");
        expect(rawText).to.have.property("type", "rawText");
        expect(rawText).to.have.property("value", "this is also some text");

        done();
    });

    it("bar text + if statement + outdent", function(done){
        var resultArr = lexer("if 1 == 2\n  | this is also some text\n| this is some more text");
        /* console.log("result: " + JSON.stringify(resultArr, null, 2)); */

        expect(resultArr).to.be.a("array")
        .to.have.length(5);

        var ifToken = resultArr[0];
        expect(ifToken).to.be.a("object");
        expect(ifToken).to.have.property("type", "if");
        expect(ifToken).to.have.property("condition", "1 == 2");

        var indent = resultArr[1];
        expect(indent).to.be.an("object");
        expect(indent).to.have.property("type", "indent");
        expect(indent).to.have.property("level", 2);
        expect(indent).to.have.property("indents", 1);

        var rawText = resultArr[2];
        expect(rawText).to.be.an("object");
        expect(rawText).to.have.property("type", "rawText");
        expect(rawText).to.have.property("value", "this is also some text");

        var outdent = resultArr[3];
        expect(outdent).to.be.an("object");
        expect(outdent).to.have.property("type", "outdent");
        expect(outdent).to.have.property("indents", 0);
        expect(outdent).to.have.property("level", 0);


        var rawText = resultArr[4];
        expect(rawText).to.be.an("object");
        expect(rawText).to.have.property("type", "rawText");
        expect(rawText).to.have.property("value", "this is some more text");

        done();
    })

    it("directive with text inline and dot p. abc", function(done){
      var resultArr = lexer("p. abc");
      console.log("result: " + JSON.stringify(resultArr, null, 2));

      expect(resultArr).to.be.a("array")
      .to.have.length(2);

      var result = resultArr[0];
      expect(result).to.be.a("object");
      expect(result).to.have.property("type", "directive");
      expect(result).to.have.property("name", "p");

      var result = resultArr[1];
      expect(result).to.be.a("object");
      expect(result).to.have.property("type", "rawText");
      expect(result).to.have.property("value", "abc");

      done();
    });
})

describe("testing the for loop", function(){
    it("testing basic for statement", function(done){
        // get the lexed object
        var resultArr = lexer("for (var i = 0; i < 100; i++)");
        console.log("text with dot result: " + JSON.stringify(resultArr, null, 2));

        // run the tests
        expect(resultArr)
        .to.be.a('array')
        .to.have.length(1);

        var result = resultArr[0];
        expect(result).to.have.property("type", "for");
        expect(result).to.have.property("declaration", "var i = 0");
        expect(result).to.have.property("condition", "i < 100");
        expect(result).to.have.property("iteration", "i++");
        done();
    });


    it("testing basic for statement", function(done){
        // get the lexed object
        var resultArr = lexer("for (var i = 0; i < 100; i++)");

        // run the tests
        expect(resultArr)
        .to.be.a('array')
        .to.have.length(1);

        var result = resultArr[0];
        expect(result).to.have.property("type", "for");
        expect(result).to.have.property("declaration", "var i = 0");
        expect(result).to.have.property("condition", "i < 100");
        expect(result).to.have.property("iteration", "i++");
        done();
    });


    it("testing basic for statement without brackets", function(done){
        // get the lexed object
        var resultArr = lexer("for var i = 0; i < 100; i++");

        // run the tests
        expect(resultArr)
        .to.be.a('array')
        .to.have.length(1);

        var result = resultArr[0];
        expect(result).to.have.property("type", "for");
        expect(result).to.have.property("declaration", "var i = 0");
        expect(result).to.have.property("condition", "i < 100");
        expect(result).to.have.property("iteration", "i++");
        done();
    });


    it("for statement - brackets, +indents", function(done){
        // get the lexed object
        var resultArr = lexer("    for var i = 0; i < 100; i++");
        /* console.log("result: " + JSON.stringify(resultArr, null, 2)); */

        // run the tests
        expect(resultArr)
        .to.be.a('array')
        .to.have.length(2);

        var indentToken = resultArr[0];
        expect(indentToken).to.have.property("type", "indent");
        expect(indentToken).to.have.property("level", 4);
        expect(indentToken).to.have.property("indents", 1);


        var result = resultArr[1];
        expect(result).to.have.property("type", "for");
        expect(result).to.have.property("declaration", "var i = 0");
        expect(result).to.have.property("condition", "i < 100");
        expect(result).to.have.property("iteration", "i++");

        done();
    });
})

describe("checking for text with pipes", function(){
  it("checking the line", function(done){
    // get the lexed object
    var resultArr = lexer("p\n  | 1. this is some text\n  | 2. this is the second text\n| 3. this is the third text");
    console.log("result: " + JSON.stringify(resultArr, null, 2));

    // run the tests
    expect(resultArr)
    .to.be.a('array')
    .to.have.length(6);

    var indentToken = resultArr[0];
    expect(indentToken).to.have.property("type", "directive");
    expect(indentToken).to.have.property("level", 0);
    expect(indentToken).to.have.property("name", "p");

    var result = resultArr[1];
    expect(result).to.have.property("type", "indent");
    expect(result).to.have.property("indents", 1);
    expect(result).to.have.property("level", 2);

    var result = resultArr[2];
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("level", 1);
    expect(result).to.have.property("value", "1. this is some text");

    var result = resultArr[3];
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("level", 1);
    expect(result).to.have.property("value", "2. this is the second text");

    var result = resultArr[4];
    expect(result).to.have.property("type", "outdent");
    expect(result).to.have.property("level", 0);
    expect(result).to.have.property("indents", 0);

    var result = resultArr[5];
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("level", 0);
    expect(result).to.have.property("value", "3. this is the third text");

    done();
  });
});

console.log("after the describe part");


/*

 */
function test(){
  var result = "";

  /* var source = {"text":"var numberOfApples = 10", "tokens":[], "level":0}; */
  /* result = nextToken(source); */
  /* if(result && result.type == "ident" && result.level == 0){ print("--broke 1---");  } */
  /* print("source: '" + source.text + "'"); */

  /* result = lexer("p. \n  asdasd asda \n  sdasdasd asdsa \n  dsa $zcxz adsad \n  asdad asda \nsdas d asd "); */
  /* print(" result: " + JSON.stringify(result)); */

  /* result = lexer("var apples = 10"); */
  /* expectedTypeOrder(result, ["var", "ident", "=", "number"]) */

  /* result = lexer("  var apples = 10"); */
  /* expectedTypeOrder(result, ["var", "ident", "=", "number"]) */

  /* result = lexer("div. \n  abc\n  | def"); */
  /* print("result: " + JSON.stringify(result)); */

  /* result = lexer("div. \n  abc asd sfsdf \ndiv  \n  | inside the second div"); */
  /* result = lexer("div \n  abc \ndiv  \n  | inside the second div"); */

  /*
     div 
     asd
     asdasd
     zcasd
     asdsad
   */
  /* result = lexer("div \n  asd\n    asdasd\n  zcasd\nasdsad"); */
  /* result = lexer("if true \n  var i = 10\nelse\n  var i = 20"); */

  /* result = lexer("div\n  if true \n    var i = 10\n  else\n    var i = 20"); */

  /* result = lexer("if 1 = 10\n  p\n    | this is in the true condition\nelse\n  p. \n    this is in the false condition"); */

  /* result = lexer("create block title\n  h1. \n  Welcome to our website"); */
  /* result = lexer("create block title\n  h1.  Welcome to our website"); */

  /* result = lexer("for(var i = 0; i < 10; i++)\n  p.\n    this is the $i div"); */


  /* result = lexer('div(num = 10)'); */
  /* print("result: " + JSON.stringify(result, null, 2)); */
}
function expectedTypeOrder(actual, expected){
  if(expected.length != actual.length)
    throw("the length is not the same expected: " + JSON.stringify(expected) +" actual: " + JSON.stringify(actual));
  for(var i = 0; i < actual.length; i++){
    /* console.log("i: " + i + " actual: " + actual[i]); */
    if(expected[i] !== actual[i].type)
      throw("i:  " + i + " expected type to be " + expected + " but got " + actual[i].type);
  }
}
test();





/**

start

the ones i will use 
'else-if'
'conditional'
'block'
'start attribute block'
'end attribute block'
'attribute'
'text'
'new line'
'start pipeless text'
'end pipeless text'


done
'directive'
'for'
'eos'
'indent'
'outdent'
'raw text'
'if'
'else'





i dont know what it is
'append' 
'prepend' 
'yield'
'interpolation' 
'colon'
'slash'

the ones i may use
'case' 
'each'
'while'
'code'

**/
