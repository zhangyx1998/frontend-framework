/* eslint-disable spellcheck/spell-checker */
import { sjcl } from './sjcl.js'
/**
 * Returns a sha256 string of given value
 * @param {string} val
 * @returns {string}
 */
export default function(val) {
	return sjcl
		.codec
		.hex
		.fromBits(
			sjcl
				.hash
				.sha256
				.hash(val)
		)
}
