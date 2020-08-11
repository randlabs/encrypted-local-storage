import { isSupportedStrongCipher } from "./strong-cipher";
import { generateRandomValues, fromHexString, toHexString } from "./cipher-utils";

const IV_SIZE = 16;
const OBFUSCATEKEY_SIZE = 32;

export default class AesCBC {
	private obfuscatekey: Uint8Array;
	private masterkey: CryptoKey|null;

	constructor(obfuscatekey?: string) {
		if (obfuscatekey) {
			this.obfuscatekey = fromHexString(obfuscatekey);
		}
		else {
			this.obfuscatekey = AesCBC.generateObfuscatekey();
		}
		this.masterkey = null;
	}

	static generateObfuscatekey(): Uint8Array {
		return generateRandomValues(OBFUSCATEKEY_SIZE);
	}

	private async importMasterkey(): Promise<void> {
		this.masterkey = await window.crypto.subtle.importKey(
			"raw",
			this.obfuscatekey,
			{
				name: "AES-CBC",
				length: 256
			},
			false,
			[ "encrypt", "decrypt" ]
		);
	}

	getObfuscatekey(): string {
		return toHexString(this.obfuscatekey);
	}

	async encrypt(value: any): Promise<string> {
		if (!this.masterkey) {
			await this.importMasterkey();
		}
		const iv = generateRandomValues(IV_SIZE);
		const encoder = new TextEncoder();
		const encryptedValue = await window.crypto.subtle.encrypt(
			{
				name: "AES-CBC",
				iv
			},
			this.masterkey!,
			encoder.encode(JSON.stringify(value))
		);

		return toHexString(new Uint8Array(encryptedValue)) + toHexString(iv);
	}

	async decrypt(value: string): Promise<any> {
		if (!this.masterkey) {
			await this.importMasterkey();
		}
		const iv = fromHexString(value.substr(value.length - (IV_SIZE * 2)));
		if (!iv || iv.length !== IV_SIZE) {
			throw new Error("Invalid initial vector");
		}
		const decryptedValue = await window.crypto.subtle.decrypt(
			{
				name: "AES-CBC",
				iv
			},
			this.masterkey!,
			fromHexString(value.substr(0, value.length - (IV_SIZE * 2)))
		);
		const decoder = new TextDecoder();

		return JSON.parse(decoder.decode(decryptedValue));
	}
}

// Check browser support
export async function isSupportedCipher(): Promise <boolean> {
	const isSupportedCryptoSubtle = Boolean(window.crypto && window.crypto.subtle && window.crypto.getRandomValues &&
	window.crypto.subtle.importKey && window.crypto.subtle.encrypt && window.crypto.subtle.decrypt &&
	window.crypto.subtle.digest);
	if (isSupportedCryptoSubtle) {
		const isStrongCipher = await isSupportedStrongCipher();
		if (isStrongCipher) {
			const cipher = new AesCBC();
			const value = { test: "test" };
			try {
				const encryptedValue = await cipher.encrypt(value);
				const decryptedValue = await cipher.decrypt(encryptedValue);

				return value.test === decryptedValue.test;
			}
			catch (err) {
				// Does not support cipher
			}
		}
	}

	return false;
}
