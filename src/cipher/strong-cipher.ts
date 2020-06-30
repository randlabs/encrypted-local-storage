import { fromHexString, toHexString, generateRandomValues } from "./cipher-utils";

const IV_SIZE = 12;
const SALT_SIZE = 32;
const ITERATIONS = 1000000;

// -----------------------------------------------------------------------------

async function createMasterKey(password: string): Promise<CryptoKey> {
	const encoder = new TextEncoder();
	const passphraseKey = encoder.encode(password);
	const masterkey = await window.crypto.subtle.importKey("raw", passphraseKey, "PBKDF2", false, [ "deriveBits", "deriveKey" ]);

	return masterkey;
}

async function importDerivedKey(masterkey: CryptoKey, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
	const derivedKey = await window.crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt, iterations, hash: "SHA-512" },
		masterkey,
		{ name: "AES-GCM", length: 256 },
		false,
		[ "encrypt", "decrypt" ]
	);

	return derivedKey;
}

// ----------------------------------------------------------------------------------------

/* tslint:disable:await-promise */
export async function encrypt(value: string, key: CryptoKey): Promise<string> {
	if (typeof value !== "string") {
		throw new Error("Invalid string");
	}
	// Generate random IV and SALT values
	const iv = generateRandomValues(IV_SIZE);
	const salt = generateRandomValues(SALT_SIZE);

	// Generate derivedkey and encrypt item
	const derivedKey = await importDerivedKey(key, salt, ITERATIONS);
	const encoder = new TextEncoder();
	const encrypted = await window.crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv
		},
		derivedKey,
		encoder.encode(value)
	);

	return toHexString(iv) + toHexString(salt) + toHexString(new Uint8Array(encrypted));
}

export async function decrypt(encrypted: string, key: CryptoKey): Promise<string> {
	if (typeof encrypted !== "string") {
		throw new Error("Invalid string");
	}
	const salt = fromHexString(encrypted.substr(IV_SIZE * 2, SALT_SIZE * 2));
	if (!salt || salt.length !== SALT_SIZE) {
		throw new Error("Invalid salt");
	}
	const derivedKey = await importDerivedKey(key, salt, ITERATIONS);

	const iv = fromHexString(encrypted.substr(0, IV_SIZE * 2));
	if (!iv || iv.length !== IV_SIZE) {
		throw new Error("Invalid initial vector");
	}
	const decrypted = await window.crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv
		},
		derivedKey,
		fromHexString(encrypted.substr((SALT_SIZE + IV_SIZE) * 2))
	);
	const decoder = new TextDecoder();

	return decoder.decode(decrypted);
}

export async function generateMasterKey(password: string): Promise<CryptoKey> {
	const masterKey = await createMasterKey(password);

	return masterKey;
}

export async function isSupportedStrongCipher(): Promise<boolean> {
	try {
		const masterkey = await createMasterKey("test");
		const random = generateRandomValues(SALT_SIZE);
		const derivedKey = await importDerivedKey(masterkey, random, 10);
		const iv = generateRandomValues(IV_SIZE);
		const encoder = new TextEncoder();
		const encrypted = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv
			},
			derivedKey,
			encoder.encode("test")
		);
		const decrypted = await window.crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv
			},
			derivedKey,
			encrypted
		);
		const decoder = new TextDecoder();
		if (decoder.decode(decrypted) === "test") {
			return true;
		}
	}
	catch (err) {
		// Does not support strong cipher
	}

	return false;
}
