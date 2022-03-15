import { defineStore } from 'pinia'
import createApi from '@CL/api'
const api = Object.freeze({
		login: createApi({ url: '/login' }),
		logout: createApi({ url: '/logout' }),
	}),
	onFail = () => { }
export default defineStore('user', {
	state() {
		return {
			loginState: false,
			userID: undefined,
			name: undefined,
			mail: undefined,
			groups: []
		}
	},
	actions: {
		/**
		 * Log user in using given identifier and password
		 * @param {String} login Can be either userID or mail
		 * @param {String} password User password, trimmed
		 * @param {(String) => Any} onFail Callback function for failed attempt
		 * @returns {Boolean} Indicates whether login was successful
		 */
		async login(login, password, onFail = onFail) {
			const result = await api.login({ login, password })
				.then(async res => {
					if (!res.ok) {
						onFail(await res.text())
						this.$reset()
						return false
					} else {
						try {
							// Patch user info json into the store
							this.$patch(await res.json())
						} catch (e) {
							this.$reset()
							onFail('[X] Server response is malformed')
							return false
						}
					}
					return this.loginState = true
				})
		},
		/**
		 * Log user out
		 * @param {(String) => Any} onFail Callback function for failed attempt
		 * @returns {Boolean} Indicates whether logout was successful
		 */
		async logout(onFail = onFail) {
			if (!this.loginState) {
				this.$reset()
				return true
			}
			const result = await api.logout()
				.then(async res => {
					if (!res.ok)
						onFail(await res.text())
					return res.ok
				})
			if (result)
				this.$reset()
			return result
		}
	}
})