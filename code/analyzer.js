/*
  @param1 = the source text of the jade file
  @return = returns a sequence of tokens/symbols, more information about tokens 
                is available at --REF--
*/
function lexicalAnalysis(sourceText){
  return lexer(sourceText);
}

/*
  @param1 tokens_list = this is a list of tokens that got parsed from the jade code file. 
                more information about tokens is available at -REF--
  @return = This function will return the abstract syntax tree that is produced from the tokens list
*/
function syntacticAnalysis(tokens_list){
  return [];
}

/*
  @param1 syntaxTree = this is the syntax tree
  @return = a syntax tree with contextual information, in this case it is adding the information
  needed for the variables. More information is available at --REF--.
*/
function contextualAnalysis(syntaxTree){
  return syntaxTree;
}

/*
  @param1 sourceText = the source text which would be the jadeimp code as a string
  @return = this will be the abstract syntax tree with contextual analysis
*/
function parse(sourceText){
  return contextualAnalysis(syntacticAnalysis(lexicalAnalysis(sourceText)));
}



// this is the api of the program, the only function that should be visible from outside
// this file is parse. 
module.exports.parse = parse;


