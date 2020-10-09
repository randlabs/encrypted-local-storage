/* eslint-disable @typescript-eslint/typedef */
import AppStorage from "../index";
import { expect } from "chai";
import { password, masterkey } from "./test-password";

describe("Strong Store Management", function() {
	const secretKey = "private_key";
	const secretItem = "Item to store";

	before(function(done) {
		AppStorage.createPassword(masterkey, password)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	describe("Save string to the storage", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should save the item", function(done) {
			AppStorage.savePrivatekeyToStorage(secretKey, password, new Uint8Array(Buffer.from(secretItem)))
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

	});

	describe("Load string from the storage with a invalid password", function() {

		it("Should throw error by load item with a wrong password", function(done) {
			AppStorage.loadPrivatekeyFromStorage(secretKey, "wrong password")
			.then(() => {
				done("Invalid test, must fail");
			})
			.catch((err) => {
				expect(err.message).to.be.equal("Invalid Password");
				done();
			});
		});

	});

	describe("Load string from the storage", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should load the item", function(done) {
			AppStorage.loadPrivatekeyFromStorage(secretKey, password)
			.then((storedItem) => {
				const item = (Buffer.from(storedItem)).toString();
				expect(item).to.be.equal(secretItem);
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		after(function(done) {
			AppStorage.removeItem(secretKey).then(() => {
				done();
			});
		});

	});

	describe("Load removed item", function() {
		before(function(done) {
			AppStorage.verifyPassword(masterkey, password)
			.then((result) => {
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should load the item", function(done) {
			AppStorage.loadPrivatekeyFromStorage(secretKey, password)
			.then(() => {
				done("Invalid test, must fail");
			})
			.catch((err) => {
				expect(err.message).to.be.equal("No privatekey found in the storage");
				done();
			});
		});

	});

	after(function(done) {
		AppStorage.resetStorage().then(() => {
			done();
		});
	});
});
