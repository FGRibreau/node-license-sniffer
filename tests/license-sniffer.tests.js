var assert = require("assert");
var path = require("path");

var licenseSniffer = require("../");


describe("license-sniffer.sniff", function() {
    it("detects itself as BSD", function(done) {
        licenseSniffer.sniff(path.join(__dirname, ".."), function(err, license) {
            assert.ifError(err);
            assert.deepEqual(license.names, ["BSD"]);
            done();
        });
    });
    
    it("errors if package.json doesn't exist", function(done) {
        licenseSniffer.sniff(__dirname, function(err, license) {
            assert.ok(err);
            done();
        });
    });
});


describe("license-sniffer.sniffPackageJson", function() {
    it("reads license as null if it cannot be sniffed", function(done) {
        licenseSniffer.sniffPackageJson({}, function(err, license) {
            assert.ifError(err);
            assert.equal(license, null);
            done();
        });
    });
    
    it("reads license field", function(done) {
        licenseSniffer.sniffPackageJson({license: "BSD"}, function(err, license) {
            assert.ifError(err);
            assert.deepEqual(license.names, ["BSD"]);
            done();
        });
    });
    
    it("packageJson is parsed to JSON object if its a string", function(done) {
        licenseSniffer.sniffPackageJson('{"license": "BSD"}', function(err, license) {
            assert.ifError(err);
            assert.deepEqual(license.names, ["BSD"]);
            done();
        });
    });
    
    it("passes error to callback if JSON is badly formed", function(done) {
        licenseSniffer.sniffPackageJson('{license: "BSD"}', function(err, license) {
            assert.ok(err);
            done();
        });
    });
    
    it("reads licenses field if license field is not present", function(done) {
        var packageJson = {
            licenses: [
                {
                    type: "BSD",
                    url: "http://opensource.org/licenses/BSD-2-Clause"
                }
            ]
        };
        licenseSniffer.sniffPackageJson(packageJson, function(err, license) {
            assert.ifError(err);
            assert.deepEqual(license.names, ["BSD"]);
            done();
        });
    });
    
    it("reads multiple licenses if licenses has many elements", function(done) {
        var packageJson = {
            licenses: [{type: "BSD"}, {type: "MIT"}]
        };
        licenseSniffer.sniffPackageJson(packageJson, function(err, license) {
            assert.ifError(err);
            assert.deepEqual(license.names, ["BSD", "MIT"]);
            done();
        });
    });
});
