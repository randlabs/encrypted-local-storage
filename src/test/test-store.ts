/* eslint-disable @typescript-eslint/typedef */
import AppStorage from "../index";
import { expect } from "chai";
import { password, masterkey } from "./test-password";

export const PHRASE = "TEST_PHRASE_FOR_STORAGE";

describe("Storage Management", function() {

	const item = { obj: { name: "test", age: 100 } };
	const key = "obj";
	let obfuscatekey = "";

	before(function(done) {
		AppStorage.createPassword(masterkey, password, PHRASE)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	describe("Save an item", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password, PHRASE)
			.then((result) => {
				obfuscatekey = result;
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should save an object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.saveItemToStorage(key, item)
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

	});

	describe("Load item", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password, PHRASE)
			.then((result) => {
				obfuscatekey = result;
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should load an object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.loadItemFromStorage(key)
			.then((result) => {
				expect(result).to.be.an("object");
				expect(result.obj.name).to.be.equal(item.obj.name);
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		after(function(done) {
			AppStorage.removeItem(key).then(() => {
				done();
			});
		});

	});

	describe("Load removed item", function() {

		before(function(done) {
			AppStorage.verifyPassword(masterkey, password, PHRASE)
			.then((result) => {
				obfuscatekey = result;
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

		it("Should throw for load a removed object", function(done) {
			const storage = new AppStorage(obfuscatekey);
			storage.loadItemFromStorage(key)
			.then((result) => {
				expect(result).to.be.equal(null);
				done();
			})
			.catch((err) => {
				done(err);
			});
		});

	});

	after(function(done) {
		AppStorage.resetStorage().then(() => {
			done();
		});
	});
});
