<script setup>
import { computed } from "vue"
import { locale } from "@CL/locale"
const props = defineProps({
	name: {
		type: [Object, String],
		default: ''
	},
	locale: {
		type: String,
		default: locale.$
	},
	fallback: {
		type: String,
		default: "NO_NAME"
	}
}), displayName = computed(() => match(props.name, props.locale))
</script>

<template>{{ displayName || fallback }}</template>

<script>
export function match(name, locale, fallbackLocale = 'en') {
	if (typeof name === 'string') return name || undefined
	else if (name && typeof name === 'object') {
		if (!Object.keys(name).length) return undefined
		// name[lang] should be a string
		if (locale in name) return name[locale]
		else {
			const [lang, ...variants] = locale.split(/-|_/gi),
				variant = variants.join('-').toUpperCase(),
				candidates = []
			for (const l in name) {
				const [ln, ...vs] = l.split(/-|_/gi), v = vs.join('-').toUpperCase()
				if (ln.toLowerCase() == lang.toLowerCase()) {
					if (v == variant) return name[l]
					else candidates.push(name[l])
				}
			}
			if (candidates.length) return candidates[0]
			else if (locale !== fallbackLocale) return match(name, fallbackLocale)
			else return Object
				.values(name)
				.filter(val => val && typeof val === 'string')
				.reduce((a, b) => b || a, 'UNKNOWN_LOCALE_NAME')
		}
	} else console.error(`Unsupported input type '${typeof name}': ${name}`)
}
</script>
