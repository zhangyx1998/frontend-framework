// eslint-disable-next-line spellcheck/spell-checker
/* eslint-disable no-undef */
/**
 * Create a function for dedicated API call
 * @param {{
 * 	url: String,
 * 	domain: String,
 * 	method: String,
 * 	processor: (Any) => String,
 * } | String} arg
 * @param {{...Any}} additionalArgs
 * @returns {(Any) => Promise<Response>}
 */
export default function createApi(arg, additionalArgs = {}) {
	if (typeof arg === 'string') arg = { url: arg }
	else if (!arg || !(typeof arg === 'object')) throw new TypeError
	const {
		url = '.',
		domain,
		method = 'POST',
		processor = obj => JSON.stringify(obj),
	} = arg
	const location = domain
		? formatDomain(domain) + formatUrl(url)
		: formatUrl(url)
	return async function (...args) {
		return await fetch(location, {
			method,
			body: processor(...args),
			headers: {
				'Content-Type': 'application/json'
			},
			...additionalArgs
		})
	}
}
/**
 * Add '//' to domain (if none was specified),
 * remove tailing slash from the domain
 * @param {String} str 
 * @returns {String}
 */
function formatDomain(str) {
	return str.replace(/^[a-z]+:\/\//i, (str) => str || '//').replace(/\/*$/i, '')
}
/**
 * Convert relative path to absolute path
 * @param {String} str 
 * @returns {String}
 */
function formatUrl(str) {
	return str.replace(/^((\.\/)?(?=\w)|\.?(?=$))/i, (prefix) => {
		switch (prefix) {
			case '.':
				return location.pathname
			default:
				return location.pathname.replace(/\/?$/i, '/')
		}
	})
}