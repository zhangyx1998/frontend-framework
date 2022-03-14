// eslint-disable-next-line spellcheck/spell-checker
/* eslint-disable no-undef */
/**
 * Create a function for dedicated API call
 * @param {{
 * 	url: String,
 * 	domain: String,
 * 	method: String,
 * 	processor: (Any) => String,
 * }} param0 
 * @param {{...Any}} additionalArgs
 * @returns {(Any) => Promise<Response>}
 */
export default function createApi({
	url = '.',
	domain,
	method = 'POST',
	processor = obj => JSON.stringify(obj),
} = {}, additionalArgs = {}) {
	const location = domain
		? formatDomain(domain) + formatUrl(url)
		: formatUrl(url)
	console.log({ url, domain, location })
	return async function (...args) {
		return await fetch(location, {
			method,
			body: processor(...args),
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