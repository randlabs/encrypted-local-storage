import AppStorage from "../index";
import Mocha from "mocha";

describe("Password management", function() {
	const key = "example";
	const password = "test";
	it("Should create a password", function (done: Mocha.Done) {
		AppStorage.createPassword(key, password)
		.then(() => {
			done();
		})
		.catch((err: any) => {
			done(err);
		});
	});
	// it("Should verify password", function(done: Mocha.Done) {
	// 	done();
	// });
});
