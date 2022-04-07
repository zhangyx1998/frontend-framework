import { watch } from 'vue'
import { router } from '@/router'
import useUserStore from '@CS/user'
const user = useUserStore()
export default function guard(
	watchState = () => user.loginState,
	redirect = '/login',
	// eslint-disable-next-line no-undef
	query = `from=${encodeURIComponent(location.pathname)}`
) {
	if (query) redirect = [redirect, query].join(
		redirect.indexOf('?') >= 0
			? '&'
			: '?'
	)
	watch(watchState, state => guardState(state, redirect))
	guardState(watchState(), redirect)
}

function guardState(state, redirect) {
	if (!state) router.push(router.resolve(redirect))
}
