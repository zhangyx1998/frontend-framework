<template>
	<div frame-prompt v-if="content">{{ content }}</div>
	<div btn-group>
		<btn :type="`solid ${color || 'green'}`" @click="RETURN(true)">{{
			confirmText || "Confirm"
		}}</btn>
		<btn type="solid gray" @click="RETURN(false)">{{
		    cancelText || "Cancel"
        }}</btn>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	setup(content, { color, confirmText, cancelText } = {}) {
		return { content, color, confirmText, cancelText }
	}
})
</script>
