'use strict'



/**/
function getError(errString){ 
  console.trace("parser error: " + errString);
  throw ("parser: " + errString); 
}

/**/
function getAttributes(tokenStream){
  var hasAttributes = tokenStream.accept("start-attributes");
  if(hasAttributes === undefined) return [];

  var tokens = [];
  /* while(tokenStream.accept("end-attributes") === undefined){ */
  while(tokenStream.peek() !== undefined && tokenStream.peek().type !== "end-attributes"){
    var curAttributeToken = tokenStream.advance();
    if(curAttributeToken === undefined) break;
    if(curAttributeToken.type !== "attribute"){
      getError("the tokens in between the start-attributes and end-attributes is not an attribute");
    }
    tokens.push(curAttributeToken);
  }

  tokenStream.expect("end-attributes");
  return tokens;
}
/**/
function handleDirective(tokenStream){
  var tok = tokenStream.advance();

  var token = {
    "type":"directive",
    "name":tok.name,
    "attributes":[],
    "content":[],
    "isClosing":tok.isClosing,
    "text":"--"
  }

  // get the attributes
  if(tokenStream.peek() !== undefined && tokenStream.peek().type === "start-attributes"){
    token.attributes = getAttributes(tokenStream);
  }

  if(tokenStream.peek() !== undefined && tokenStream.peek().type === "indent"){
    token.content = handleBlock(tokenStream);
  }

  return token;
}
function handleFor(tokenStream){
  var tok = tokenStream.advance();
  var token = {
    "type":"for",
    "declaration":tok.declaration,
    "condition":tok.condition,
    "iteration":tok.iteration,
    "statement":[],
    "else":[],
    "text":""
  }


  // get the inner content
  if(tokenStream.peek() !== undefined && tokenStream.peek().type === "indent"){
    token.content = handleBlock(tokenStream);
  }

  return token;
}
function handleRawText(tokenStream){
  return tokenStream.advance();
}
function handleIf(tokenStream){
  var tok = tokenStream.accept("if");
  if(tok === undefined) return undefined;
  var token = {
    "type":"if",
    "condition":tok.condition,
    "statement":[],
    "else":[],
    "text":""
  }


  // get the inner content
  /* if(tokenStream.peek() !== undefined && tokenStream.peek().type === "indent"){ */
  if(tokenStream.isNext("indent")){
    token.statements = handleBlock(tokenStream);
  }

  // if else is next then get the block for else
  if(tokenStream.accept("else")){
    token["else"] = handleBlock(tokenStream);
  }

  return token;
}

function handleBlock(tokenStream){
  tokenStream.expect("indent");

  var block = handleList(tokenStream);

  tokenStream.expect("outdent");
  return block;
}

function createBlock(tokenStream){
  var createBlockToken = tokenStream.accept("createBlock");
  if(createBlockToken === undefined) return false;

  // create the token
  var token = {
    "type":"createBlock",
    "name":createBlockToken.name,
    "content":[],
    "text":"--"
  }

  // get the inner content
  if(tokenStream.peek() !== undefined && tokenStream.peek().type === "indent"){
    token.content = handleBlock(tokenStream);
  }

  // add that to the scope
  tokenStream.scope[createBlockToken.name] = token;
  return true;
}

function callBlock(tokenStream){
  var blockToken = tokenStream.accept("block");
  var token = {
    "type":"block",
    "name":blockToken.name,
    "text":"--"
  }
  return token;
}

/*
  @param1 {list of lexed tokens} sourceText = this function takes in the jadeimp code as string
  @return {object} this function returns a list of tokens
  @api public
*/
function parser(tokensList){
  // convert all the tabs to four spaces
  tokensList.reverse();
  if(tokensList=== undefined) throw("the given input string was undefined");
  var source = {};
  source.tokens = tokensList;
  source.peek = function(){ return this.tokens.slice(-1).pop(); }
  source.accept = function(type){ if(this.peek() !== undefined && this.peek().type === type) return this.advance(); }
  source.isNext = function(type){ if(this.peek() !== undefined && this.peek().type === type) return true; }
  /* source.advance = function(type){ if(this.peek().type === type) return this.advance(); } */

  source.advance = function(type){ return this.tokens.pop(); };
  source.expect = function(type){
    if(this.peek().type === type) return this.advance();
    else getError("expected to have " + type + " but got " + this.peek().type);
  }
  source.isEmpty = function(type){ return (this.tokens.length === 0);  }
  source.scope = {};

  print("starting the parser");
  var tree = {
   "type":"root",
   "content":handleList(source),
   "scope":{},
   "text":""
  }

  tree.scope = source.scope;

  return tree;
}


function handleList(tokenStream){
  var tokens = [];
  while(!tokenStream.isEmpty()){
    var currentToken = tokenStream.peek();
    switch(tokenStream.peek().type){
      case "directive" : tokens.push(handleDirective(tokenStream)) ; break;
      case "for"       : tokens.push(handleFor(tokenStream));      ; break;
      case "rawText"   : tokens.push(handleRawText(tokenStream))   ; break;
      case "eos"       : return tokens;
      /* case "indent"    : tokens.push(handleIndent(tokenStream))    ; break; */
      case "outdent"   : return tokens;
      case "if"        : tokens.push(handleIf(tokenStream))        ; break;
      case "createBlock": createBlock(tokenStream); break;
      case "block"    : tokens.push(callBlock(tokenStream)); break;
      default:
        getError("got an unexpected token recieved " + tokenStream.peek().type);
        return;
        break;
    }
    if( tokens.length > 0 && tokens[tokens.length-1] === undefined) getError("got a horrible error, the last token is undefined, the stream peak is " + tokenStream.peek().type + " the last token is " + currentToken.type);
  }
  return tokens;
}

var DEBUG = false;
var THRESHOLD = 50; // represents the level of information that is being displayed, change it to show or less information
function print(str){ printwp(str, 0); }
function printwp(str, priority){ if(DEBUG && THRESHOLD > priority) console.log(str); }



// this is the part of the code that should be available to the rest of the program
module.exports = parser;





