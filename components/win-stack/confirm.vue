<template>
	<div btn-group>
		<btn type="solid gray" @click="RETURN(false)">取消</btn>
		<btn type="solid green" @click="RETURN(true)">确定</btn>
	</div>
</template>

<script>
import Btn from '@CC/Button.vue'
import { createFactory, guardFactory } from '@CL/factory'
import { defineComponent } from 'vue'
const options = defineComponent({
	components: { Btn }
})
export default guardFactory(options)
export const createConfirm = createFactory(options)
</script>


<style lang="scss" scoped>
[btn-group] {
	display: flex;
	justify-content: center;
	padding: 1em 0;
	& > * {
		margin: 1em;
		max-width: 10em;
		padding: 0.8em 2em;
		width: calc(100% - 3em);
	}
}
</style>