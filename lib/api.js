// eslint-disable-next-line spellcheck/spell-checker
/* eslint-env node, browser */
/**
 * Create a function for dedicated API call
 * @param {{
 * 	url: String,
 * 	domain: String,
 * 	method: String,
 * 	processor: (Any) => String,
 * 	...Any: additionalArgs
 * } | String} arg
 * @returns {(Any) => Promise<Response>}
 */
export default function createApi(arg) {
	if (typeof arg === 'string') arg = { path: arg }
	else if (!arg || !(typeof arg === 'object')) throw new TypeError
	const {
		path = '.',
		domain,
		method = 'POST',
		processor = obj => JSON.stringify(obj),
		...additionalArgs
	} = arg
	const url = domain
		? location.protocol + formatDomain(domain) + formatPath(path)
		: formatPath(path)
	console.log({ url, domain, path, arg, method })
	return async function (...args) {
		return await fetch(url, {
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
	return str.replace(/^([a-z]+:\/\/)?/i, (str) => str || '//').replace(/\/*$/i, '')
}
/**
 * Convert relative path to absolute path
 * @param {String} str 
 * @returns {String}
 */
function formatPath(str) {
	return str.replace(/^((\.\/)?(?=\w)|\.?(?=$))/i, (prefix) => {
		switch (prefix) {
			case '.':
				return location.pathname
			default:
				return location.pathname.replace(/\/?$/i, '/')
		}
	})
}