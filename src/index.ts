import { fetch } from '@cloudflare/workers-types/2023-07-01';  // Fix: Type 'Response' is missing the following properties from type 'Response': cf, webSocket
import KV from './kv'
import { createError } from './errors'

declare global {
	interface Env {
		KV: KVNamespace;
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const kv = new KV(env)

		// #region user-agent
		const ua = await kv.get('ua', { caseSensitive: true })
		for (const x of ua) {
			if (request.headers.get('user-agent')?.includes(x)) {
				return createError('CFW_USER_AGENT_NOT_ALLOWED')
			}
		}
		// #endregion user-agent

		// #region country
		const country = await kv.get('country')
		if (country.has('tor')) {
			// From docs:
			// If your worker is configured to accept TOR connections, this may also be "T1", indicating a request that originated over TOR.
			// The country code "T1" is used for requests originating on TOR.
			country.delete('tor')
			country.add('t1')
		}

		if (request.cf?.country && country.has(request.cf.country as string)) {
			return createError('CFW_COUNTRY_NOT_ALLOWED')
		}
		// #endregion country

		// #region euCountry
		const euCountry = await kv.get('euCountry')
		if (request.cf?.isEUCountry && euCountry.has('true')) {
			return createError('CFW_COUNTRY_NOT_ALLOWED')
		}
		// #endregion euCountry

		// #region asn
		const asn = await kv.get('asn')
		if (request.cf?.asn && asn.has(request.cf.asn.toString())) {
			return createError('CFW_AS_NOT_ALLOWED')
		}
		// #endregion asn

		// #region asOrganization
		const asOrganization = await kv.get('asOrganization', { caseSensitive: true })
		if (request.cf?.asOrganization) {
			for (const x of asOrganization) {
				if ((request.cf.asOrganization as string).includes(x)) {
					return createError('CFW_AS_NOT_ALLOWED')
				}
			}
		}
		// #endregion asOrganization

		return await fetch(request)
	},
}
