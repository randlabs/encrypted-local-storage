import AppStorage from "../index";

describe("Password management", function() {
    const passwordKey = "example";
    const password = "test";
    it("Should create a new password", function(done) {
        AppStorage.createPassword(passwordKey, password)
        .then(() => {
            done();
        })
        .catch((err: any) => {
            done(err);
        })
    });
    it("Should verify the created password", function(done) {
        AppStorage.verifyPassword(passwordKey, password)
        .then((obfuscateKey) => {
            done();
        })
        .catch((err) => {
            done(err);
        })
    })
})