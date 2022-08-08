import { defineStore } from 'pinia'

export const useNavStore = defineStore('nav', {
	state: () => {
		return {
			redirecting: false,
			expand: false,
			title: '',
		}
	},
	actions: {
		activeTitle(val) {
			this.title = val || 'Untitled'
			this.expand = false
		}
	}
})
