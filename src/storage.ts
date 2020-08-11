import localforage from "localforage";

export default class Storage {
	static async getItem(key: string): Promise<string|null> {
		const value = await localforage.getItem(key);
		if (!value) {
			return null;
		}

		return value as string;
	}

	static async setItem(key: string, value: string): Promise<void> {
		await localforage.setItem(key, value);
	}

	static async removeItem(key: string): Promise<void> {
		await localforage.removeItem(key);
	}

	static async clearStorage(): Promise<void> {
		await localforage.clear();
	}

	static async hasItem(key: string): Promise<boolean> {
		const ret = await localforage.getItem(key);

		return ret !== null;
	}
}
