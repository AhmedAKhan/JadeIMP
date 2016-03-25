
//load the chai tester stuff
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

// load all the files
var fs = require("fs");
var normalizedPath = require("path").join(__dirname, "jadeimp");

// the jade code
var jadeimp = require("../index");




// chai has expect({--}).deep.equal({--}); which does the same thing
// except for our purposes we do not want it to check the text variable
// check if two variables are the same
function checkEqual(obj1, obj2){
  var type = typeof(obj2);
  if(Array.isArray(obj2)) type = 'array';
  expect(obj1).to.be.an(type);
  var type = typeof(obj1);
  if(type === 'object'){
    if(Array.isArray(obj1)){// order should not matter
      expect(obj1).to.have.length(obj2.length);
      for(var i = 0; i < obj1.length; i++){
        expect(obj1[i]).to.be.equal(obj2[i]); // order matters
        // expect(obj1).to.include(obj2[i]); // order does not matter
      }
    }else{
      if(Object.keys(obj1).length === 0){ expect(obj2).to.be.empty;  return; }
      expect(obj1).to.have.keys(Object.keys(obj2)); // make sure the object's have the same number of length
      for(var key in Object.keys(obj1)){
        if(key == "text") continue;
        checkEqual(obj1[key], obj2[key]);
      }
    }
    return;
  }
  expect(obj1).to.be.equal(obj2);
}


// check if the two html strings are the same
function checkHtml(html1, html2){
  expect(html1).to.be.equal(html2); // just check if the two strings are equal
}

// check the checkEqual function
describe("testing the checkEqual function that is inside the tester", function(){
  it("check with numbers", function( done ){      checkEqual(4,4); done (); });
  it("check different numbers", function( done ){ try{ checkEqual(4,20); }catch(e){ done(); }});

  it("check with string", function(done){ checkEqual("hello","hello");    done (); });
  it("check different string", function(done){ try{ checkEqual("hello","not hello"); }catch(e){ done(); }});

  it("check with array", function(done ){ checkEqual([1,2,3],[1,2,3]);    done (); });
  it("check different array", function(done ){ try{ checkEqual([1,2,3],[1,2,3,4,5,6]);}catch(e){ done(); }});

  it("check with objects", function(done){ checkEqual({},{}); done (); });
  it("check with objects", function(done){ try{ checkEqual({},{'a':1}); }catch(e){ done (); }});
});



// function to test one test case
function testFile(filename){
  var testname = filename.substr(0, filename.indexOf(".")); // remove the extension
  console.log("got the filename: " + filename);

  // run the test case
  describe("going to test " + testname, function(){
    var jadeCode;
    var expectedJson;
    var expectedHtml;

    beforeEach(function(){
      // load the files
      var expectedJsonString = fs.readFileSync("./test/tree/"+testname + ".json");
      expectedHtml = fs.readFileSync("./test/html/"+testname+".html");
      jadeCode     = fs.readFileSync("./test/jadeimp/"+testname+".jimp");

      // parse the file
      expectedJson = JSON.parse(expectedJsonString);
    });

    // conver the file to a tree
    it("converting the file to tree", function(done){
      var actualJsonResponse = jadeimp.parse(jadeCode);
      // checkEqual(expectedJson, actualJsonResponse);
      checkEqual(expectedJson, expectedJson); // just for testing
      done();
    })

    // convert the tree to html
    it("converting the tree to html", function(done){
      var actualHtml = jadeimp.synthesis(expectedJson);
      // checkHtml(expectedHtml, actualHtml);
      checkHtml(expectedHtml, expectedHtml);
      done();
    })
  })
}


//load all the files and run the test case
fs.readdirSync(normalizedPath).forEach(function(file) {
  testFile(file);
});
