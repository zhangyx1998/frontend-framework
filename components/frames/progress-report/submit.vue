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
			<container flex-row option-group :pad="false">
				<btn @click="toggleEdit" :type="btnType(mode === 'edit')">
					<i class="far fa-edit"></i>&nbsp;
					<span>编辑</span>
				</btn>
				<btn @click="togglePreview" :type="btnType(mode === 'preview')">
					<i class="far fa-eye"></i>&nbsp;
					<span>预览</span>
				</btn>
				<btn @click="toggleDiff" :type="btnType(mode === 'diff')">
					<i class="fa fa-search"></i>&nbsp;
					<span>Diff</span>
				</btn>
			</container>
		</h3>
		<container
			round
			next-level
			style="width: 100%; min-width: 70vw; height: 20em"
			:pad="false"
		>
			<keep-alive>
				<code-editor
					v-if="mode === 'edit'"
					ref="editor"
					style="width: 100%; height: 100%"
					:code="content"
					@update="update"
				/>
				<div
					v-else
					markdown-body
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
import "@CR/markdown.scss"
import { defineComponent, ref } from 'vue'
import { marked } from 'marked';
export default defineComponent({
	setup(reportID = undefined, original = null) {
		return {
			reportID: ref(reportID),
			original,
			preview: ref(undefined),
			editor: ref(null),
			content: ref(undefined),
			showDiff: ref(false),
			update(_content) {
				// console.log(_content)
				content.value = _content
			},
		}
	},
	computed: {
		result() {},
		mode() {
			if (typeof this.content !== 'string') return undefined
			if (typeof this.preview !== 'undefined') return 'preview'
			if (this.showDiff) return 'diff'
			return 'edit'
		}
	},
	methods: {
		reset() {
			for (const option of this.options) {
				option.value = option.initial
			}
		},
		getContent() {
			if (this.$refs.editor?.getContent()) {
				return this.content = this.$refs.editor?.getContent()
			} else {
				return this.content
			}
		},
		btnType(activated = false) {
			return activated ? 'solid brand' : 'solid gray-brand'
		},
		toggleEdit() {
			this.preview = undefined
			this.showDiff = false
		},
		togglePreview() {
			this.preview = marked.parse(this.getContent())
			this.showDiff = false
		},
		toggleDiff() {
			this.getContent()
			this.preview = undefined
			this.showDiff = true
		},
	},
	mounted() {
		if (!this.content)
			this.LOAD(
				fetch('/templates/progress-report.md')
					.then(res => res.text())
					.then(text => this.content = text)
			)
	}
})
</script>

<style lang="scss" scoped>
[progress-report] {
	& > * {
		margin-bottom: 10px;
	}
}
[option-group] {
	border-radius: 5px;
	overflow: hidden;
	& > * {
		border-radius: 0 !important;
		font-size: 0.8rem !important;
		margin: 0 !important;
		padding: 0.3em 0.8em !important;
	}
}
</style>