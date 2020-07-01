/* eslint-disable @typescript-eslint/typedef */
import AppStorage from "../index";
import { expect } from "chai";

export const masterkey = "example";
export const password = "test";

describe("Password Management", function() {
	it("Should create a new password", function(done) {
		AppStorage.createPassword(masterkey, password)
		.then(() => {
			done();
		})
		.catch((err: any) => {
			done(err);
		});
	});

	it("Should verify the created password", function(done) {
		AppStorage.verifyPassword(masterkey, password)
		.then((obfuscatekey) => {
			expect(obfuscatekey).to.be.a("string");
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should fail when verify with a wrong password", function(done) {
		AppStorage.verifyPassword(masterkey, "wrong password")
		.then((obfuscatekey) => {
			throw new Error("Invalid test, must throw");
		})
		.catch((err) => {
			expect(err.message).to.be.equal("Invalid password");
			done();
		});
	});

	after(function(done) {
		AppStorage.resetWallet().then(() => {
			done();
		});
	});

});
