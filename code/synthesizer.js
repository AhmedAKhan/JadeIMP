/*
  @param1 syntaxTree = this will be the syntax tree
  @return = this will return the intermediate code, currently that is the html
*/

var testTree = require("../testTree.json");
var scope = testTree.scope;

var treeLevel = 0;
var INDENTATION_VALUE = 2;
var hasHeadTag = false;
var headContent = "";

var bindingScript = "";
var JQUERY_CDN = "<script src=\"https://code.jquery.com/jquery-2.2.2.min.js\" integrity=\"sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=\" crossorigin=\"anonymous\"></script>\n";

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
  var output = "";

  // If content is not empty, then there's another level in this tree
  if (rootContent.length > 0) treeLevel++;

  // Parse and add the elements inside the content array
  for (var i = 0; i < rootContent.length; i++) {
    output += readContent(rootContent[i]);
  }

  // Go back up a level once done parsing all the content
  if (rootContent.length > 0) treeLevel--;

  // If no head tag is input by the user, create one and put the JQUERY_CDN inside it (so JQuery could be used inside the binding script)
  if (!hasHeadTag) headContent += "<head>\n" + spaceRepeat(INDENTATION_VALUE) + JQUERY_CDN + "</head>\n";

  // If both head tag and body tag are missing, put the entire output inside a body tag
  // if (!bodyTag && !headTag) body += "<body>\n" + output + "</body>\n";
  // // If only the body tag is missing, concatenate the closing body tag string (the opening tag would be part of the output)
  // else if (!bodyTag) body += output + "</body>\n";

  output = "<html>\n" + headContent + "<body>\n" + output + "</body>\n" + "</html>";
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
  var indentation = spaceRepeat(treeLevel*INDENTATION_VALUE);
  var directiveAttributes = directiveToken.attributes;
  var directiveContent = directiveToken.content;

  var openingTag = "";
  var attributes = "";
  var content = "";
  var closingTag = "";
  var output = "";

  // Get attributes and add them to the HTML (goes inside the opening tag's triangular brackets)
  for (var i = 0; i < directiveAttributes.length; i++) {
    attributes += " " + readAttribute(directiveAttributes[i]);
  }

  // Add attributes inside opening tag
  openingTag = indentation + "<" + directiveToken.name + attributes + ">\n";

  // Cache the closing tag (with same indentation as opening tag) to be added to the output later
  closingTag = indentation + "</" + directiveToken.name + ">\n";

  // If the directive is set not to have a closing tag (e.g. input directive), there's no need to check the content array (should be empty)
  if (directiveToken.isClosing == false) {
    var variableName = attributes.match(/bind=\"[\w-_]+\"/g);
    if (variableName != null) {
      variableName = variableName[0].match(/\"[\w-_]+\"/g)[0].replace(/\"/g, "");
      console.log(variableName);
    }
    return openingTag;
  }

  // If content is not empty, then there's another level in this tree
  if (directiveContent.length > 0) treeLevel++;

  // Parse and add the elements inside the content array
  for (var i = 0; i < directiveContent.length; i++) {
    content += readContent(directiveContent[i]);
  }

  // Go back up a level once done parsing all the content
  if (directiveContent.length > 0) treeLevel--;

  // Add the closing tag text to the output
  output = openingTag + content + closingTag;

  // If user included a head tag, add the JQUERY CDN to its contents so it can be used inside the binding script
  if (directiveToken.name == "head") {
    headContent = "<head>\n" + content + spaceRepeat((treeLevel+1)+INDENTATION_VALUE) + JQUERY_CDN + "</head>\n";
    hasHeadTag = true;
    // Return nothing because the head tag will be injected at the top via the headContent global variable
    return "";
  }

  return output;
}

// Parses the rawText token
function readRawText(rawTextToken) {
  var value = rawTextToken.value;
  var actualValue = value;

  // Match with the given REGEX to get all the variables from the rawtext value
  var variables = value.match(/ \$[\w-_]+/g);

  if (variables != null) {
    // Loop through all the variables, and replace each one of them with their values
    // NOTE: Each variable is put inside a <span> tag to make variable referencing easier in the double binding script
    for (var i = 0; i < variables.length; i++) {
      var variableName = variables[i].substring(2,variables[i].length);
      var replaceValue = "<span class=\"variable_" + variableName + "\">" + scope[variableName].value + "</span>";
      actualValue = actualValue.replace("$"+variableName, replaceValue);
    }
  }

  // Replace all the escaped dollar signs by a dollar sign string
  actualValue = actualValue.replace(/\\\$/g, "$");

  // Put all the words in the value into an array
  // var words = value.split(" ");
  //
  // for (var i = 0; i < words.length; i++) {
  //   if (words[i].length == 0) continue;
  //
  //   // Check if the current word is a variable (starts with a "$"); if it is, then get the value of that variable from the scope
  //   if (words[i][0] == "$") {
  //     var variableName = words[i].substring(1,words[i].length);
  //     actualValue += scope[variableName];
  //   }
  //   // If the "$" has a <backslash> before it, treat that word as a normal string instead of a variable
  //   else if (words[i].length > 1 && words[i][0] == "\\" && words[i][1] == "$") {
  //     actualValue += words[i].substring(1,words[i].length);
  //   }
  //   else actualValue += words[i];
  //
  //   // Add a space after each word
  //   if (i < words.length-1) actualValue += " ";
  // }

  // return the rawtext value indented based on its level in the tree
  return spaceRepeat(treeLevel*INDENTATION_VALUE) + actualValue + "\n";
}

// Parses the readAttribute token
function readAttribute(attributeToken) {
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




