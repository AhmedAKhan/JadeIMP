/*
  @param1 syntaxTree = this will be the syntax tree
  @return = this will return the intermediate code, currently that is the html
*/

var testTree = require("../testTree.json");

var treeLevel = 0;
var INDENTATION_VALUE = 2;
intCodeGen(testTree);

// HELPER FUNCTION: Returns "val" number of spaces as a string
function spaceRepeat(val) {
  var output = "";
  for (var i = 0; i < val; i++) output += " ";
  return output;
}

function intCodeGen(syntaxTree){
  var root = syntaxTree;
  var rootContent = root.content;
  var output = "<html>\n";

  // If content is not empty, then there's another level in this tree
  if (rootContent.length > 0) treeLevel++;

  // Parse and add the elements inside the content array
  for (var i = 0; i < rootContent.length; i++) {
    output += readContent(rootContent[i]);
  }

  // Go back up a level once done parsing all the content
  if (rootContent.length > 0) treeLevel--;

  output += "</html>";
  console.log(output);
  return "";
}

// Reads a single element inside the "contents" array for any given token
function readContent(content) {
  var output = "";
  if (content.type == "directive") output += readDirective(content);
  else if (content.type == "rawText") output += readRawText(content);
  return output;
}

// Parses the directive token
function readDirective(directiveToken) {
  // Indent the directive based on the current tree level
  var output = spaceRepeat(treeLevel*INDENTATION_VALUE);
  var directiveAttributes = directiveToken.attributes;
  var directiveContent = directiveToken.content;

  output += "<" + directiveToken.name;

  // Cache the closing tag (with same indentation as opening tag) to be added to the output later
  var closingTag = spaceRepeat(treeLevel*INDENTATION_VALUE);
  closingTag += "</" + directiveToken.name + ">\n";

  // Get attributes and add them to the HTML (goes inside the opening tag's triangular brackets)
  for (var i = 0; i < directiveAttributes.length; i++) {
    output += " " + readAttribute(directiveAttributes[i]);
  }

  // Close off the triangular bracket for opening tag
  output += ">\n";

  // If the directive is set not to have a closing tag (e.g. input directive), there's no need to check the content array (should be empty)
  if (directiveToken.isClosing == false) return output;

  // If content is not empty, then there's another level in this tree
  if (directiveContent.length > 0) treeLevel++;

  // Parse and add the elements inside the content array
  for (var i = 0; i < directiveContent.length; i++) {
    output += readContent(directiveContent[i]);
  }

  // Go back up a level once done parsing all the content
  if (directiveContent.length > 0) treeLevel--;

  // Add the closing tag text to the output
  output += closingTag;

  return output;
}

// Parses the rawText token
function readRawText(rawTextToken) {
  // return the rawtext value indented based on its level in the tree
  return spaceRepeat(treeLevel*INDENTATION_VALUE) + rawTextToken.value + "\n";
}

// Parses the readAttribute token
function readAttribute(attributeToken) {
  var value = attributeToken.value;
  var actualValue = "";
  var variableStart = false;

  for (var i = 0; i < value.length; i++) {
    // if (value[i] == "\\" && value[i+1] == "$") continue;
    // else if (value[i] == "$") {
    //   if (i)
    //   variableStart = true;
    // }
  }

  return attributeToken.parameter + "=\"" + attributeToken.value + "\"";
}


/*
  @param1 intermediateCode = this will be the intermediate code that is generated from the intermediate code generation part
  return = this will be the optimized html
*/
function codeOptimization(intermediateCode){ return intermediateCode; }


/*
  @param1 intermediateCode = This is the intermediate code
  return = the final html code that is needed after the compilation

  currently the intermediate code is the same as the final code, this function is still here
  to ensure that if we wanted to add a state for the code before html we could with ease
*/
function codeGeneration(intermediateCode){ return intermediateCode; }

/*

*/
function convert(syntaxTree){
  var intermediateCode = intCodeGen(syntaxTree);
  intermediateCode = codeOptimization(intermediateCode);
  return codeGeneration(intermediateCode);
}


module.exports.convert = convert;




