import { defineStore } from 'pinia'
import createApi from '@CL/api'
import sha256 from '@CL/sha256'
const api = Object.freeze({
		user: createApi({ url: '/user' }),
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
		async login(login, password, onFail = () => {}) {
			const result = await api.login({ login, password: sha256(password) })
				.then(async res => {
					if (!res.ok) {
						onFail(await res.text())
						this.$reset()
						return false
					} else {
						try {
							// Patch user info json into the store
							return await this.update(await res.json())
						} catch (e) {
							this.$reset()
							onFail('[X] Server response is malformed')
							return false
						}
					}
				})
		},
		/**
		 * Log user out
		 * @param {(String) => Any} onFail Callback function for failed attempt
		 * @returns {Boolean} Indicates whether logout was successful
		 */
		async logout(onFail = () => {}) {
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
		},
		/**
		 * Update user store
		 * @param {(String) => Any} onFail Callback function for failed attempt
		 * @returns {Boolean} Indicates whether logout was successful
		 */
		async update(userData) {
			userData ||= await api.user().then(async res => {
				if (res.ok) return await res.json()
				else return undefined
			})
			if (userData) {
				this.$patch(userData)
				return this.loginState = true
			} else {
				this.$reset()
				return false
			}
		}
	}
})