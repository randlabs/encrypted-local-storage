import AppStorage from "../index";

describe("Password management", function() {
    const passwordKey = "example";
    const password = "test";
    it("Should create a new password", function() {
        AppStorage.createPassword(passwordKey, password)
        .catch((err: any) => {
            throw err;
        })
    })
})