type KVOptions = {
	cacheTtl?: number,
	split?: string,
	caseSensitive?: boolean,
	trim?: boolean,
}

const defaultKVOptions: KVOptions = {
	cacheTtl: 3600,
	split: ',',
	caseSensitive: false,
	trim: true,
}

export default class KV {
	private env: Env
	private availableKeys?: string[]

	constructor(env: Env) {
		this.env = env
	}

	async init() {
		this.availableKeys = await this.env.KV.list().then((list) => list.keys.map((x) => x.name))
	}

	async get(key: string, options?: KVOptions): Promise<Set<string>> {
		if (!this.availableKeys) await this.init()
		if (!this.availableKeys!.includes(key)) return new Set()

		const opts = Object.assign({}, defaultKVOptions, options) as Required<KVOptions>
		const value = await this.env.KV.get(key, { cacheTtl: opts.cacheTtl })

		if (value === null) return new Set()

		let items = value.split(opts.split)
		if (opts.trim) items = items.map((s) => s.trim())
		if (!opts.caseSensitive) items = items.map((s) => s.toLowerCase())
		return new Set(items)
	}
}
