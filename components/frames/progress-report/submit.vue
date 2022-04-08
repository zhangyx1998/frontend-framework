<template>
	<container flex-column progress-report>
		<h3
			style="
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
			"
		>
			报告正文
			<btn
				@click="
					preview =
						typeof preview === 'undefined'
							? getPreview()
							: undefined
				"
				type="solid gray-brand"
				style="font-size: 0.8rem; margin: 0; padding: 0.3em"
			>
				<i :class="preview ? 'far fa-edit' : 'far fa-eye'"></i>&nbsp;
				<span v-if="preview">编辑</span>
				<span v-else>预览</span>
			</btn>
		</h3>
		<container
			round
			next-level
			style="width: 100%; min-width: 70vw; height: 20em"
			:pad="false"
		>
			<keep-alive>
				<code-editor
					v-if="typeof preview === 'undefined'"
					ref="editor"
					style="width: 100%; height: 100%"
					placeholder="正文支持 Markdown 语法"
					@update="update"
				/>
				<div
					v-else
					class="markdown-body"
					style="
						width: 100%;
						height: 100%;
						padding: 1em 2em;
						overflow: scroll;
						user-select: none;
					"
					v-html="preview"
				></div>
			</keep-alive>
		</container>
	</container>
	<div btn-group>
		<btn type="solid green" @click="RETURN(result)">确定</btn>
		<btn type="solid gray" @click="reset">重置</btn>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { marked } from 'marked';
export default defineComponent({
	setup(reportID) {
		const content = ref('')
		return {
			reportID,
			preview: ref(undefined),
			editor: ref(null),
			content,
			update(_content) {
				// console.log(_content)
				content.value = _content
			},
		}
	},
	computed: {
		result() {}
	},
	methods: {
		reset() {
			for (const option of this.options) {
				option.value = option.initial
			}
		},
		getPreview() {
			return marked.parse(this.$refs.editor?.getContent() || '')
		}
	}
})
</script>

<style lang="scss" scoped>
@import "@CR/markdown.css";
[progress-report] {
	& > * {
		margin-bottom: 10px;
	}
}
</style>