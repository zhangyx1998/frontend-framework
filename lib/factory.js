import { markRaw } from 'vue'
// The guardian function
function beforeCreate() {
	throw new SyntaxError('Factory component called directly')
}
/**
 * Create a factory function that generates custom component
 * option objects.
 * @param {import('vue').options} options  
 * @param {(import('vue').options, Any[]) => undefined | Object} processor
 */
export function createFactory(options, processor = () => { }) {
	return function createComponent(...args) {
		const mixedOptions = {
			...options,
			// Extend original setup function
			setup() {
				const mixedSetup = {}
				// First call original setup
				if (options.setup && typeof options.setup === 'function') {
					Object.assign(mixedSetup, options.setup())
				}
				// Then call custom setup function with current context
				const processResult = processor.apply(mixedOptions, args)
				if (processResult && typeof processResult === 'object') {
					Object.assign(mixedSetup, processResult)
				}
				return mixedSetup
			}
		}
		// Remove the default guard
		if (mixedOptions.beforeCreate === beforeCreate) {
			delete mixedOptions.beforeCreate
		}
		// Add default RETURN function if not exists
		if (!mixedOptions.methods?.RETURN) {
			if (!mixedOptions.methods) mixedOptions.methods = { RETURN }
			else mixedOptions.methods.RETURN = RETURN
		}
		return markRaw(mixedOptions)
	}
}
/**
 * Prevent raw factory component from being initiated directly
 * @param {import('vue').options} options  
 * @param {(import('vue').options, Any[]) => undefined | Object} processor
 */
export function guardFactory(options) {
	if (Array.isArray(options.emits) && (options.emits.indexOf('return') < 0)) {
		options.emits.push('return')
	} else {
		options.emits = ['return']
	}
	return Object.assign(options, { beforeCreate })
}
/**
 * The custom function that returns the frame window result
 * @param  {...any} args
 */
export function RETURN(...args) {
	this.$emit('return', ...args)
}