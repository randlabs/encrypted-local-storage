// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function generateRandomValues(size: number = 32): Uint8Array {
	return window.crypto.getRandomValues(new Uint8Array(size));
}

export function fromHexString(hexString: string): Uint8Array {
	const values = hexString.match(/.{1,2}/gu);
	if (!values) {
		throw new Error("Invalid hexa string");
	}

	return new Uint8Array(values.map((byte: string): number => parseInt(byte, 16)));
}

export function toHexString(bytes: Uint8Array): string {
	const res = [];
	for (let i = 0; i < bytes.byteLength; i++) {
		res.push(bytes[i].toString(16).padStart(2, "0"));
	}

	return res.join("");
}

export async function digest(buffer: Uint8Array|ArrayBuffer, algorithm: "SHA-512" | "SHA-256"):
Promise<string> {
	const hash = await window.crypto.subtle.digest(algorithm, buffer);

	return toHexString(new Uint8Array(hash));
}
