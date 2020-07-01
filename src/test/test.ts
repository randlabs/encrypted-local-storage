/* eslint-disable @typescript-eslint/typedef */
import AppStorage from "../index";
import { expect } from "chai";

describe("Test utils functions", function() {
	const itemKey = "item";
	const itemToStore = "item";

	it("Should save a string", function(done) {
		AppStorage.setItem(itemKey, itemToStore)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should load a string", function(done) {
		AppStorage.getItem(itemKey)
		.then((storedItem) => {
			expect(storedItem).to.be.equal(itemToStore);
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should not load a string", function(done) {
		AppStorage.getItem(itemKey + "1")
		.then((storedItem) => {
			expect(storedItem).to.be.equal(null);
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should has an item", function(done) {
		AppStorage.hasItem(itemKey)
		.then((isStored) => {
			expect(isStored).to.be.a("boolean");
			expect(isStored).to.be.equal(true);
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should not has an item", function(done) {
		AppStorage.hasItem(itemKey + "1")
		.then((isStored) => {
			expect(isStored).to.be.a("boolean");
			expect(isStored).to.be.equal(false);
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should remove an item", function(done) {
		AppStorage.removeItem(itemKey)
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

	it("Should reset the storage", function(done) {
		AppStorage.resetWallet()
		.then(() => {
			done();
		})
		.catch((err) => {
			done(err);
		});
	});

});
