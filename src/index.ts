import Storage from "./storage";
import * as StrongCipher from "./cipher/strong-cipher";
import Cipher from "./cipher/cipher";
import { generateRandomValues, fromHexString, toHexString } from "./cipher/cipher-utils";

export default class AppStorage {
	private cipher: Cipher;
	static readonly MY_ALGO_STORAGE: string = "MY_ALGO_STORAGE";

	constructor(storagekey?: string) {
		this.cipher = new Cipher(storagekey);
	}

	getStorageKey(): string {
		return this.cipher.getObfuscatekey();
	}

	async loadItemFromStorage(key: string): Promise<any> {
		const encryptedData = await Storage.getItem(key);
		if (!encryptedData) {
			return null;
		}
		try {
			const decryptedData = await this.cipher.decrypt(encryptedData);

			return decryptedData;
		}
		catch (err) {
			return null;
		}
	}

	async saveItemToStorage(key: string, item: any): Promise<void> {
		const encryptedData = await this.cipher.encrypt(item);
		await Storage.setItem(key, encryptedData);
	}

	// Private key storage
	async savePrivatekeyToStorage(key: string, password: string, pk: Uint8Array): Promise<void> {
		const masterkey = await StrongCipher.generateMasterKey(password);
		const encryptedPk = await StrongCipher.encrypt(toHexString(pk), masterkey);
		await AppStorage.setItem(key, encryptedPk);
	}

	async loadPrivatekeyFromStorage(key: string, password: string): Promise<Uint8Array> {
		const masterkey = await StrongCipher.generateMasterKey(password);
		const encryptedPk = await AppStorage.getItem(key);
		if (!encryptedPk) {
			throw new Error("No privatekey found in the storage");
		}
		try {
			const hexPK = await StrongCipher.decrypt(encryptedPk, masterkey);

			return fromHexString(hexPK);
		}
		catch (err) {
			if (err.message !== "Invalid object" && err.message !== "Invalid salt" && err.message !== "Invalid initial vector") {
				throw new Error("Invalid Password");
			}
			throw err;
		}
	}

	// Password storage
	static async verifyPassword(key: string, password: string, okPhrase?: string): Promise<string> {
		try {
			const encryptedMasterpass = await Storage.getItem(key);
			if (encryptedMasterpass) {
				const masterkey = await StrongCipher.generateMasterKey(password);
				const decryptedMasterpass = await StrongCipher.decrypt(encryptedMasterpass, masterkey);
				const obfuscatekey = decryptedMasterpass.substr(0, decryptedMasterpass.length - 24);
				const validate = decryptedMasterpass.substring(decryptedMasterpass.length - 24);
				const OK = Buffer.from(fromHexString(validate)).toString();
				const PHRASE = okPhrase ? okPhrase : AppStorage.MY_ALGO_STORAGE;
				if (OK === PHRASE) {
					return obfuscatekey;
				}
			}
		}
		catch (err) {
			console.warn("Something went wrong: " + err.message);
		}

		throw new Error("Invalid password");
	}

	static async createPassword(key: string, password: string, okPhrase?: string): Promise<void> {
		const masterkey = await StrongCipher.generateMasterKey(password);
		const obfuscatekey = generateRandomValues(32);
		const PHRASE = okPhrase ? okPhrase : AppStorage.MY_ALGO_STORAGE;
		const OK = new Uint8Array(Buffer.from(PHRASE));
		const masterpass = toHexString(obfuscatekey) + toHexString(OK);
		const encryptedMasterpass = await StrongCipher.encrypt(masterpass, masterkey);
		await this.setItem(key, encryptedMasterpass);
	}

	static async removeItem(key: string): Promise<void> {
		await Storage.removeItem(key);
	}

	static async setItem(key: string, item: string): Promise<void> {
		await Storage.setItem(key, item);
	}

	static async getItem(key: string): Promise<string|null> {
		const item = await Storage.getItem(key);

		return item;
	}

	static async hasItem(key: string): Promise<boolean> {
		const hasItem = await Storage.hasItem(key);

		return hasItem;
	}

	static async resetStorage(): Promise<void> {
		await Storage.clearStorage();
	}

	static zeroBuffer(pk: Uint8Array): void {
		for (let i = 0; i < pk.length; i++) {
			pk[i] = 0;
		}
	}
}
