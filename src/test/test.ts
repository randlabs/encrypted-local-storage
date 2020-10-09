/* eslint-disable @typescript-eslint/typedef */
import AppStorage from "../index";
import { expect } from "chai";

describe("Test utils functions", function() {
	const itemKey = "item";
	const itemToStore = "item";

	it("Should save a string", function(done) {
		AppStorage.setItem(itemKey, itemToStore).catch(done).then(done);
	});

	it("Should load a string", function(done) {
		AppStorage.getItem(itemKey).catch(done)
		.then((storedItem) => {
			expect(storedItem).to.be.equal(itemToStore);
			done();
		});
	});

	it("Should not load a string", function(done) {
		AppStorage.getItem(itemKey + "1").catch(done)
		.then((storedItem) => {
			expect(storedItem).to.be.equal(null);
			done();
		});
	});

	it("Should has an item", function(done) {
		AppStorage.hasItem(itemKey).catch(done)
		.then((isStored) => {
			expect(isStored).to.be.a("boolean");
			expect(isStored).to.be.equal(true);
			done();
		});
	});

	it("Should not has an item", function(done) {
		AppStorage.hasItem(itemKey + "1").catch(done)
		.then((isStored) => {
			expect(isStored).to.be.a("boolean");
			expect(isStored).to.be.equal(false);
			done();
		});
	});

	it("Should remove an item", function(done) {
		AppStorage.removeItem(itemKey).catch(done).then(done);
	});

	it("Should list all storage keys", function(done) {
		AppStorage.getKeys().catch(done)
		.then((keys) => {
			expect(keys).to.be.an("array");
			done();
		});
	});

	it("Should reset the storage", function(done) {
		AppStorage.resetStorage().catch(done).then(done);
	});

});
