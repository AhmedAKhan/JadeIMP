
var chai = require('chai');

var should = chai.should() //actually call the function
var fs = require("fs");
var normalizedPath = require("path").join(__dirname, "jadeimp");

fs.readdirSync(normalizedPath).forEach(function(file) {
  testFile(file);
});

function testFile(filename){

  var testname = filename.substr(0, filename.indexOf("."));
  console.log("got the filename: " + filename);

  // run the test case
  describe("going to test " + testname, function(){
    var jadeCode;
    var expectedHtml;
    var expectedHtml;

    beforeEach(function(){
        // load the files
        expectedJson = fs.readFileSync("./test/tree/"+testname + ".json");
        expectedHtml = fs.readFileSync("./test/html/"+testname+".html");
        jadeCode     = fs.readFileSync("./test/jadeimp/"+testname+".jimp");

        // parse the file
        // console.log("expectedJson: " + expectedJson);
         expectedJson = JSON.parse(expectedJson);
    });

    // it("going to try to find the file " + testname, function(done){
      // try{
      //   jadeCode     = fs.readFileSync("./test/jadeimp/"+testname+".jimp");
      // }catch(e){ throw("could not find the jade file, going to move to the next file"); }

      // try{
      //   expectedHtml = fs.readFileSync("./test/html/"+testname+".html");
      // }catch(e){ throw("could not find the html file, going to move to the next file"); }

      // try{
      //   expectedJson = fs.readFileSync("./test/tree/"+testname + ".json");
      // }catch(e){ throw("could not find the tree file, going to move to the next file"); }
      // done();
    // });

    // conver the file to a tree
    it("converting the file to tree", function(done){
      console.log("3. jadeCode: "+ jadeCode);
      done();
    })

    // convert the tree to html
    it("converting the tree to html", function(done){
      done();
    })

  })
}

describe("asdasd", function(){

  it("test 0", function(done){
    var expect = require('chai').expect
      , foo = 'bar'
      , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };

    expect(foo).to.be.a('string');
    expect(foo).to.equal('bar');
    expect(foo).to.have.length(3);
    expect(beverages).to.have.property('tea').with.length(3);
    done();
  });


  it("test 1", function(done){
    var foo = 'bar'
    , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
  foo.should.be.a('string');
  foo.should.equal('bar');
  foo.should.have.length(3);
  beverages.should.have.property('tea').with.length(3);

  it("inner test", function(done){ done();  });

  done();
  })
});






