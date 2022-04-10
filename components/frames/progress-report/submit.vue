<template>
	<container flex-column progress-report>
		<h3>关联标签</h3>
		<container tags flex-column :pad="false">
			<container tag round next-level :pad="false">
				<div tag-title>Git 提交</div>
				<div tag-content>
					<span style="margin-right: 1em"
						><i class="fab fa-github"></i> Github</span
					>
					<badge>7e053f9</badge>
				</div>
				<btn type="seamless red">
					<i class="fa fa-trash"></i>&nbsp; 删除
				</btn>
			</container>
			<container tag round next-level :pad="false">
				<div tag-title>讲义</div>
				<div tag-content>
					基础阶段 &gt; 支持RV64IM的单周期NPC &gt;
					搭建面向riscv64-npc的运行时环境
				</div>
				<btn type="seamless red">
					<i class="fa fa-trash"></i>&nbsp; 删除
				</btn>
			</container>
			<container
				tag
				round
				next-level
				flex-center
				:responsive="true"
				style="
					border: 2px dashed var(--cb-gray);
					color: var(--ct-gray);
					font-weight: bold;
				"
			>
				<span>+ 添加记录</span>
			</container>
		</container>
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
			style="width: 100%; min-width: 70vw; height: 36em"
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
[tags] {
	margin-bottom: 32px;
	[tag] {
		display: flex;
		align-items: center;
		user-select: none;
		&:not(:first-child) {
			margin-top: 18px;
		}
		padding: 0;
		[tag-title] {
			font-size: 0.9em;
			font-weight: bold;
			width: 6em;
			padding: 0.5em 0;
			text-align: center;
			color: var(--ct-gray);
			background-color: var(--cf-next-next-level);
		}
		[tag-content] {
			flex-grow: 1;
			overflow: hidden;
			font-weight: bold;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-family: "Courier New", Courier, monospace;
		}
		& > * {
			margin: 0;
		}
		& > *:not(:first-child):not(:last-child) {
			margin: 0 1em;
		}
	}
}
</style>