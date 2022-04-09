<template>
	<div ref="el" name="monaco">
		<chasing-circle
			style="
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -100%);
				opacity: 0.3;
			"
			:scale="5"
			v-if="loading"
		/>
	</div>
</template>

<script>
// The MONSTER
self.MonacoEnvironment = {
	getWorker(workerId, label) {
		const getWorkerModule = (moduleUrl, label) => new Worker(
				self.MonacoEnvironment.getWorkerUrl(moduleUrl),
				{
					name: label,
					type: 'module'
				}
			),
			$p = ([lang], [variant = lang]) =>
				`/monaco-editor/esm/vs/language/${lang}/${variant}.worker?worker`
		switch (label) {
			case 'json':
				return getWorkerModule($p`json`, label);
			case 'css':
			case 'scss':
			case 'less':
				return getWorkerModule($p`css`, label);
			case 'html':
			case 'handlebars':
			case 'razor':
				return getWorkerModule($p`html`, label);
			case 'typescript':
			case 'javascript':
				return getWorkerModule($p`typescript${ts}`, label);
			default:
				return getWorkerModule($p`editor`, label);
		}
	}
};
export default {
	props: {
		code: { type: String, default: '' },
		lang: { type: String, default: 'markdown' },
		placeholder: { type: String, default: '' }
	},
	data() {
		return {
			content: this.code,
			loading: true
		}
	},
	async mounted() {
		const monaco = await import('monaco-editor'),
			html = window.document.querySelector("html");
		this.loading = false
		this.monacoEditor = monaco.editor.create(this.$refs.el, {
			value: this.content,
			language: this.lang,
			theme: html.classList.contains('light')
				? 'vs'
				: 'vs-dark',
			fontSize: '16px',
			minimap: { enabled: false },
			padding: {
				top: 20,
				bottom: 20
			}
		})
	},
	methods: {	
		getContent() {
			return this?.monacoEditor?.getValue() || ''
		}
	}
}
</script>

<style lang="scss" scoped>
[name="monaco"] :deep(*) {
	&.monaco-editor,
	&.monaco-editor-background,
	&.inputarea,
	&.ime-input,
	&.margin {
		background: none;
	}
	transition: none !important;
}
</style>