'use strict'

var RegExp = require("regex");

/*
 * this is used for debugging the program, if debug is true then it will print all the information that is in the print function calls
 */
var DEBUG = false;
var THRESHOLD = 50; // represents the level of information that is being displayed, change it to show or less information
function print(str){ printwp(str, 0); }
function printwp(str, priority){ if(DEBUG && THRESHOLD > priority) console.log(str); }

/*
  get token EOL = end of line
  
  @param1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
  @return {boolean} this value represents if it was able to find the corresponding token, in this case it would be end of line, so it would update the scope variables accordingly and figure out the indent level
*/
function getTokenEOL(source){
  // check if there is a new line
  var result = /^\n/.exec(source.text);
  if(!result) return false; // if there is not return false

  adjustString(source, result[0].length); // consume the necessary string

  //update all the necessary variables
  source.level = 0; // since a new line was added, the current level is 0
  source.column = 0;
  source.line += 1;
  source.lineBegin = true;
  print("inside the end of line reached, the lineBegin is " + source.lineBegin);

  // figure out the new indentation levels and add the necessary indents or outdents
  getTokenDent(source);
  return true; // return true because it found the tokens
}

/*
  If there is a dot, then it will place all the text inline and in the indented region as a raw text

  @param1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
  @return {boolean} this value represents if it was able to find the corresponding token
*/
function getTokenDot(source){
  // check if there is a dot
  var result = /^\. */.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  adjustString(source, result[0].length);

  var result = /^.*/.exec(source.text); // this will get the name of the variable
  if(result[0] !== ""){
    var currentRawText = result[0];
    var currentRawToken = { "type":"rawText", "value":result[0], "text":result[0]  };
    adjustString(source, result[0].length);

    // if the next one is an indent, place this raw text after this
    // this is the next rawtext
    var curPosition = source.tokens.length; // current index of the token
    var currentIndents = source.indentTokensStack.length;

    // check if there is an indent
    getTokenEOL(source);
    
    // if at curPosition there is a indent, the place it at position curPosition+1
    if(source.tokens.length > curPosition){
      if(source.tokens[curPosition].type === "indent"){
        print("lexer - getTokenDot : 1. first one");
        source.tokens.splice(curPosition+1, 0, currentRawToken);
      }else{
        print("lexer - getTokenDot : 2. inside the first else, curPosition: " + curPosition + " currentRawToken: " + JSON.stringify(currentRawToken) + " source.tokens: " + JSON.stringify(source.tokens, null, 2));
        // adding it backwards because its inserting in the middle it will be fine
        source.tokens.splice(curPosition, 0, {"type":"outdent", "text":"", "indents":currentIndents, "level":source.level});
        source.tokens.splice(curPosition, 0, currentRawToken);
        source.tokens.splice(curPosition, 0, {"type":"indent", "text":"", "indents":currentIndents+1, "level":source.level+1});
        return true;
      }
    }else{
      print("lexer - getTokenDot : 3. inside the second else");
      // that was the last thing in the string
      source.tokens.push({"type":"indent", "text":"", "indents":currentIndents+1, "level":source.level+1});
      source.tokens.push(currentRawToken);
      source.tokens.push({"type":"outdent", "text":"", "indents":currentIndents, "level":source.level, "asd":"asdasdasdasd"});
      return true;
    }
  }
   
  print("lexer - getTokenDot: 4. last, ");
  getTokenText(source, true);
  return true;
  /* source.tokens.splice() */
}

/*
 * this function will convert the next sequence of characters to tokens
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
function getTokenDirective(source){
  // it is only a directive if its the first thing in the line
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

  // check for attributes
  print("going inside the attributes function");
  getTokenAttributes(source);
  
  print("just added the directive from the getTokenDirective");
  // found the variable, actually start converting it
  return true;
}
/*
 * this function will convert a vertical bar to a lexed token, a vertical bar is used to add inline text
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
*/
function getTokenVerticalBar(source){
  var result = /^\| /.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var token = { type : "vertical bar", level: source.level, value: value, text : result[0] };
  // decided not to put the vertical bar token in the tokens list
  getTokenText(source, false);
  // found the variable, actually start converting it
  return true;
}

/*
 * this function will take one attirbute from the string, and convert it to an attribute token
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {String} this will create the value for the attribute of the directive, could be a string in quotation, or number
*/
function getAttributeValue(source){
  var ident = /^([\w_-]+|"[^"\n]*") */.exec(source.text); // this will get the name of the variable
  if(!ident) return undefined;
  var value = ident[0].trim();
  adjustString(source, ident[0].length);
  value = value.replace(/"/g, '');
  return value;
}
/*
 * this function will take one attirbute from the string, and convert it to an attribute token
 * 
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
*/
function getTokenAttribute(source){
  var comma= /^, */.exec(source.text); // this will get the name of the variable
  if(comma) adjustString(source, comma[0].length);
  
  print("inside the get single attribute ");
  var attribute = getTokenIdent(source);
  print("attribute: " + attribute);
  if(attribute === undefined) return false;
  
  // get the equal sign
  var equalSign= /^= */.exec(source.text); // this will get the name of the variable
  if(!equalSign){ getError("found no equal sign in attribute");  };
  /* var equalSign = ident[0].trim(); */
  adjustString(source, equalSign[0].length);

  var value = getAttributeValue(source);
  if(value === undefined){
    getError("directive attribute has attribute but no value attribute: " + attribute);
  }
  
  // make the token and return it
  var token = {
    "type":"attribute",
    "attribute":attribute,
    "value":value,
    "text":attribute + " = " + value
  }
  source.tokens.push(token);
  print("end single attribute function, added the token " + JSON.stringify(token)  );
  return true;
}
/*
 * This will create a start-attribute function if the current directive has an attribute, and an end-attribute after
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
*/
function getTokenAttributes(source){
  // if attributes exist then create a attribute started token
  var result = /^\( */.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);
  source.tokens.push({"type":"start-attributes", "text":""});
  
  /* var token = { type : "vertical bar", level: source.level, value: value, text : result[0] }; */
  /* // decided not to put the vertical bar token in the tokens list */
  /* source.tokens.push(token); */

  // keep getting the attribute until it returns false
  while(getTokenAttribute(source)); 
  
  var result = /^\) */.exec(source.text); // this will get the name of the variable
  if(!result){
    getError("no end bracket for attributes for directive at line " + source.line + " and collumn " + source.column);
    return ;
  }
  var value = result[0].trim();
  adjustString(source, result[0].length);
  source.tokens.push({"type":"end-attributes", "text":""});
  // found the variable, actually start converting it
  return true;
}

/*
 * this function will take the number of spaces in the begining of the line and will create the proper number of indent
 * and outdents appropiatly 
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
*/
function getTokenDent(source){
  // always match because an empty string is considered valid
  var result = /^ */.exec(source.text);
  adjustString(source, result[0].length);
  var numSpaces = result[0].length // number of spaces
  
  // check indent
  var currentLevel = 0;
  var lastIndentTokenIndex = source.indentTokensStack.length-1;
  if(lastIndentTokenIndex >= 0) currentLevel = source.indentTokensStack[source.indentTokensStack.length-1].level
  if(numSpaces > currentLevel){
    var indentTokens = {"type":"indent", "level":numSpaces, "indents":source.indentTokensStack.length+1};
    source.tokens.push(indentTokens);
    source.indentTokensStack.push(indentTokens);
    print("adding the token indent inside the getTokenDent function");
    return true;
  }
  else if(numSpaces == currentLevel) return false; // the next item is in the same div

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

/*
 * this function will create a block token, of type "createToken", it will be used a block and can be used later in the code
 * and the compiler will replace it with this part
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
function createBlock(source){
  var result = /^create *block *\(?/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);
  
  var blockName = getTokenIdent(source);

  var token = {
    "type":"createBlock",
    "name": blockName,
    "text":"--"
  }
  
  source.tokens.push(token);
  return true;
}
/*
 * this function is for calling the block, this will place the block with the respective name in place of the 
 * block
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
function callBlock(source){
  var result = /^block *\(?/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);
  
  var blockName = getTokenIdent(source);
  var token = {
    "type":"block",
    "name":blockName,
    "text":"block " + blockName
  }
  source.tokens.push(token);
  return true;
}

/*
 * this is for simple tokens, the current tokens are = () var else block create | . 
 * It will convert those symbols to tokens with those tokens
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
function getSimpleToken(source){
  var result = /^(=|\(|\)|var|else|;) */.exec(source.text); // this will get the name of the variable
  /* print("------------ getSimpleToken-------- result = " + result + " source: " + source); */
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

/*
 * this is an error function, used to throw an error and inform the user that invalid syntax was given
 * 
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @param 2 {String} errorString = this will be a string that will be a description of the error
 * @return {void} nohing
 */
function getError(source, errorString){
  throw ("lexer: " + errorString);
}

/*
 * this function will convert an if statement, to a token of an if statement
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
function getTokenSimpleIf(source){
  var result = /^if *\(?/.exec(source.text); // this will get the name of the variable
  if(!result) return false;
  var value = result[0].trim();
  adjustString(source, result[0].length);

  var result = /^[^)\n]*\)?/.exec(source.text); // this will get the name of the variable
  if(!result){ getError(source, "no condition specified for if statement"); return false;  };
  var condition = result[0];
  condition = condition.substr(0,condition.length).trim();
  if(condition[condition.length-1] === ")") condition = condition.substr(0, condition.length-1);
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

/*
 * this function will convert an if statement, to a token of a for statement
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {boolean} this value represents if it was able to find the corresponding token
 */
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

/*
 * this function will convert text to a token, each line will get converted as a single token
 * 
 * @param1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @param1 {boolean} runContinously = this is a boolean value that represents if there is a pipeless text in here, if it is false it will just convert that one line, or else it will parse everything in that line and everything inside an indent
 * @return {boolean} represents if it was successful getting the text or not
 */
function getTokenText(source, runContinously){
  // if runContinously is true, then its a dot, else just convert this line to text
  if(runContinously === undefined) runContinously = true;
  // get current level
  var currentLevel = source.indentTokensStack.length;
  print("inside the getTokenText currentLevel: " + currentLevel);
  var gotResult = false;
  
  do{
    print("inside the token text: source.text: " + source.text);
    // if this is a new line and the indentation is lower then the begining then 
    print("source.indentTokensStack.length: " + source.indentTokensStack.length + " currentLevel: " + currentLevel + " (source.indentTokensStack.length < currentLevel): " + (source.indentTokensStack.length < currentLevel));
    if(source.indentTokensStack.length < currentLevel) return gotResult; 
    if(source.text == "") return gotResult;

    // take everything from the begining and a $ symbol. (unless if its another $) or end of line
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

    var isNewLine = getTokenEOL(source);
    print("textToken: 5. isnew line : " + isNewLine);
  }while(runContinously)

  print("inside text function going to return " + gotResult);
  return gotResult;
}


/*
 * this will convert the next "word" to a ident, which is a sequence of characters used in things like directives, and so on
 * 
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {Token} an object that will hold the next token
 */
function getTokenIdent(source){
  var ident = /^[\w_-]+ */.exec(source.text); // this will get the name of the variable
  if(!ident) return undefined;
  var value = ident[0].trim();
  adjustString(source, ident[0].length);

  return value;
}

/*
 * this is a EOS token which means the string has ended, It only gets called once and it will add the apporpriate number 
 * of outdents before ending
 * 
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @return {Token} an object that will hold the next token
 */
function getTokenEOS(source){
  if(source.text.length > 0) return; // if the string is not empty then you have not reached end of string

  print("EOS: going to add this many outdents source.indentTokensStack.length: " + source.indentTokensStack.length);
  print("lastToken: " + JSON.stringify(source.tokens[source.tokens.length-1]));
  // add the proper amount of out tokens
  var numberOfIndents = source.indentTokensStack.length;
  for(var i = 0; i < numberOfIndents; i++){
    source.indentTokensStack.pop();
    source.tokens.push({"type":"outdent", "text":"", "indents":source.indentTokensStack.length});
  }

  // add the token and end the function
  source.tokens.push({"type":"eos", "text":""});
  return true;
}


/*
 * This is a function that will get the next token from the source text, it will return a boolean number which represents 
 * if it could find a token
 *
 * @param1 {object} source = is an object used to tokenize the string
 * @return {boolean} = returns if it was able to get the next token
 */
function nextToken(source){
  print("nextToken 0. '" + source.text + "'");
  // this is a list of functions that the token will use
  var tokenValidators = [ 
                          getSimpleToken, // all the simple tokens, such as = (  ) . var else
                          createBlock,
                          callBlock,
                          getTokenDot,
                          getTokenVerticalBar,
                          getTokenFor,
                          getTokenSimpleIf,
                          getTokenDirective,
                          getTokenEOL
                        ];

  var gotToken = false;
  var oldLineBegin = source.lineBegin;
  for(var i = 0; i < tokenValidators.length; i++){
    print("going to try out tokenValidators[i]: " + tokenValidators[i].name);
    if(tokenValidators[i](source)){
      gotToken = true;
      break;
    }
  }

  // if it was false before and true now, then keep it true. or else make it false
  if(!(!oldLineBegin && source.lineBegin)){ source.lineBegin = false; }
  return gotToken;
}





/*
 * this function will take the source.text and will remove the number of characters that is equal to the variable num, 
 * this function will also update the source.column variable so that debugging information is available if an error has occured
 *
 * @param 1 {object source} source = this is the source, which is used throughout the program, which was declared in the lexed function, has informations such as tokens, strings, indents and so on
 * @param 2 {number} num = this is a number that represents how much of the strings has been read
 * @return {void} returns nothing
 */
function adjustString(source, num){
  source.column += num; // assumption, this function only gets called per line
  source.text = source.text.substr(num);
}


/*
 * this function will take in the sourceText which will be the jadeimp code and will return the parsed lexed tokens as a list
 * 
 * @param1 {String} sourceText = this function takes in the jadeimp code as string
 * @return {object} this function returns a list of tokens
 * @api public
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
    var beforeString = source.text;
    if(!nextToken(source)){
      print("the before string is '" + beforeString + "' and after is '" + source.text + "' before token length is " + numberOfTokens + " after is " + source.tokens.length);
      print("ended the lexical analysis, the rest of the string is " + source.text);
      if(numberOfTokens === source.tokens.length)
        getError(source, "got lost on input at line " + source.line + " and column " + source.column);
      break;
    }
  }

  print("lexer going to get the end of string token tokens.length: " + source.tokens.length);
  getTokenEOS(source);
  print("tokens.length: " + source.tokens.length);
  return source.tokens;
}


// this is the part of the code that should be available to the rest of the program
module.exports = lexer;





var expect = require('chai').expect;


describe("trying inline with dot text", function(){
  it("trying inline with dot text", function(done){
    var result = lexer("p. 1. first line\n  2. second line");
    expect(result).to.be.an("array").with.length(6);

    /* var barToken = result[0]; */
    /* expect(barToken).to.have.property("type","vertical bar"); */


    var rawTextToken = result[0];
    expect(rawTextToken).to.be.an("object");
    expect(rawTextToken).to.have.property("type", "directive");
    expect(rawTextToken).to.have.property("name", "p");

    var rawTextToken = result[1];
    expect(rawTextToken).to.be.an("object");
    expect(rawTextToken).to.have.property("type", "indent");
    expect(rawTextToken).to.have.property("level", 2);
    expect(rawTextToken).to.have.property("indents", 1);

    var rawTextToken = result[2];
    expect(rawTextToken).to.be.an("object");
    expect(rawTextToken).to.have.property("type", "rawText");
    expect(rawTextToken).to.have.property("value", "1. first line");

    var rawTextToken = result[3];
    expect(rawTextToken).to.be.an("object");
    expect(rawTextToken).to.have.property("type", "rawText");
    expect(rawTextToken).to.have.property("value", "2. second line");

    var rawTextToken = result[4];
    expect(rawTextToken).to.be.an("object");
    expect(rawTextToken).to.have.property("type", "outdent");
    expect(rawTextToken).to.have.property("indents", 0);

    var rawTextToken = result[5];
    expect(rawTextToken).to.have.property("type", "eos");

    done();
  });
})


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
    
    expect(resultArr).to.be.an("array").with.length(6);

    var result = resultArr[0];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");
    expect(result).to.have.property("level", 0);

    /* //// decided not to have the token dot */
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

    var result = resultArr[4];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "outdent");
    expect(result).to.have.property("indents", 0);

    var result = resultArr[5];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "eos");

    done();
  });
});

describe("testing text", function(){
  it("going to test normal text with bar", function(done){
    var result = lexer("|  this is some text");
    expect(result).to.be.an("array").with.length(2);

    /* var barToken = result[0]; */
    /* expect(barToken).to.have.property("type","vertical bar"); */


    var rawTextToken = result[0];
    expect(rawTextToken).to.have.property("type", "rawText");
    expect(rawTextToken).to.have.property("value", " this is some text");

    var rawTextToken = result[1];
    expect(rawTextToken).to.have.property("type", "eos");

    done();
  })
});

describe("testing the if statement", function(){
  it("going to test a basic if statement", function(done){
    var result = lexer("if 1 == 0");
    expect(result).to.be.an("array").with.length(2);
    expect(result[0]).to.have.property("type","if");
    expect(result[0]).to.have.property("condition","1 == 0");


    expect(result[1]).to.have.property("type","eos");

    done();
  });
});

describe("going to test directives", function(){
  it("basic simple p directive", function(done){
    var resultArr = lexer("p");

    expect(resultArr).to.be.a("array")
    .to.have.length(2);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");


    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  })

  it("bar text + if statement", function(done){
    var resultArr = lexer("if 1 == 2\n  | this is also some text");

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

    var outdent= resultArr[3];
    expect(outdent).to.be.an("object");
    expect(outdent).to.have.property("type", "outdent");
    expect(outdent).to.have.property("indents", 0);


    var eos = resultArr[4];
    expect(eos).to.be.an("object");
    expect(eos).to.have.property("type", "eos");

    done();
  });

  it("bar text + if statement + outdent", function(done){
    var resultArr = lexer("if 1 == 2\n  | this is also some text\n| this is some more text");

    expect(resultArr).to.be.a("array")
    .to.have.length(6);

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


    var result = resultArr[5];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "eos");

    done();
  })

  it("directive with text inline and dot p. abc", function(done){
    var resultArr = lexer("p. abc");

    expect(resultArr).to.be.a("array")
    .to.have.length(5);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");

    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "indent");

    var result = resultArr[2];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "abc");

    var result = resultArr[3];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "outdent");

    var result = resultArr[4];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  });
  

  it("directive with text inline and dot and inline text with indent text", function(done){
    var resultArr = lexer("p. abc\n  def");

    expect(resultArr).to.be.a("array")
    .to.have.length(6);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");

    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "indent");

    var result = resultArr[2];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "abc");

    var result = resultArr[3];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "def");

    var result = resultArr[4];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "outdent");

    var result = resultArr[5];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  });


  it("directive with text inline and dot and inline text with indent text and outdent text", function(done){
    var resultArr = lexer("p. abc\n  def\n| last line");

    expect(resultArr).to.be.a("array")
    .to.have.length(7);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "p");

    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "indent");

    var result = resultArr[2];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "abc");

    var result = resultArr[3];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "def");

    var result = resultArr[4];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "outdent");

    var result = resultArr[5];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "last line");

    var result = resultArr[6];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  });

  it("directive test with multiple div statements", function(done){
    var resultArr = lexer("div \n  | abc \ndiv \n| def");

    expect(resultArr).to.be.a("array")
    .to.have.length(7);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "div");

    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "indent");
    expect(result).to.have.property("level", 2);
    expect(result).to.have.property("indents", 1);

    var result = resultArr[2];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "abc ");


    var result = resultArr[3];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "outdent");
    expect(result).to.have.property("level", 0);
    expect(result).to.have.property("indents", 0);

    var result = resultArr[4];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "div");

    var result = resultArr[5];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "rawText");
    expect(result).to.have.property("value", "def");


    var result = resultArr[6];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  });


  it("directive with attribute", function(done){
    var resultArr = lexer('div(id="main",class="zxc asd oi", value = 12)');

    expect(resultArr).to.be.a("array")
    .to.have.length(7);

    var result = resultArr[0];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "directive");
    expect(result).to.have.property("name", "div");

    var result = resultArr[1];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "start-attributes");

    var result = resultArr[2];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "attribute");
    expect(result).to.have.property("attribute", "id");
    expect(result).to.have.property("value", "main");


    var result = resultArr[3];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "attribute");
    expect(result).to.have.property("attribute", "class");
    expect(result).to.have.property("value", "zxc asd oi");

    var result = resultArr[4];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "attribute");
    expect(result).to.have.property("attribute", "value");
    expect(result).to.have.property("value", "12");

    var result = resultArr[5];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "end-attributes");


    var result = resultArr[6];
    expect(result).to.be.a("object");
    expect(result).to.have.property("type", "eos");

    done();
  });
})

describe("testing the for loop", function(){
  it("testing basic for statement", function(done){
    // get the lexed object
    var resultArr = lexer("for (var i = 0; i < 100; i++)");

    // run the tests
    expect(resultArr).to.be.a('array');
    expect(resultArr).to.have.length(2);

    var result = resultArr[0];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "for");
    expect(result).to.have.property("declaration", "var i = 0");
    expect(result).to.have.property("condition", "i < 100");
    expect(result).to.have.property("iteration", "i++");

    var result = resultArr[1];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "eos");

    done();
  });

  it("testing basic for statement without brackets", function(done){
    // get the lexed object
    var resultArr = lexer("for var i = 0; i < 100; i++");

    // run the tests
    expect(resultArr).to.be.a('array');
    expect(resultArr).to.have.length(2);

    var result = resultArr[0];
    expect(result).to.have.property("type", "for");
    expect(result).to.have.property("declaration", "var i = 0");
    expect(result).to.have.property("condition", "i < 100");
    expect(result).to.have.property("iteration", "i++");

    var result = resultArr[1];
    expect(result).to.be.an("object");
    expect(result).to.have.property("type", "eos");

    done();
  });

  it("for statement - brackets, +indents", function(done){
    // get the lexed object
    var resultArr = lexer("    for var i = 0; i < 100; i++");

    // run the tests
    expect(resultArr)
    .to.be.a('array')
    .to.have.length(4);

    var indentToken = resultArr[0];
    expect(indentToken).to.be.an("object");
    expect(indentToken).to.have.property("type", "indent");
    expect(indentToken).to.have.property("level", 4);
    expect(indentToken).to.have.property("indents", 1);

    var result = resultArr[1];
    expect(indentToken).to.be.an("object");
    expect(result).to.have.property("type", "for");
    expect(result).to.have.property("declaration", "var i = 0");
    expect(result).to.have.property("condition", "i < 100");
    expect(result).to.have.property("iteration", "i++");

    var indentToken = resultArr[2];
    expect(indentToken).to.be.an("object");
    expect(indentToken).to.have.property("type", "outdent");
    expect(indentToken).to.have.property("indents", 0);

    var indentToken = resultArr[3];
    expect(indentToken).to.be.an("object");
    expect(indentToken).to.have.property("type", "eos");

    done();
  });
})

describe("checking for text with pipes", function(){
  it("checking the line", function(done){
    // get the lexed object
    var resultArr = lexer("p\n  | 1. this is some text\n  | 2. this is the second text\n| 3. this is the third text");

    // run the tests
    expect(resultArr)
    .to.be.a('array')
    .to.have.length(7);

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

    var result = resultArr[6];
    expect(result).to.have.property("type", "eos");

    done();
  });
});



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
    if(expected[i] !== actual[i].type)
      throw("i:  " + i + " expected type to be " + expected + " but got " + actual[i].type);
  }
}
test();




