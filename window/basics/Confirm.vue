<template>
    <div
        v-if="content"
        frame-prompt
    >
        {{ content }}
    </div>
    <div btn-group>
        <btn
            :type="`solid ${confirmColor}`"
            @click="RETURN(true)"
        >
            {{ confirmText }}
        </btn>
        <btn
            type="solid gray"
            @click="RETURN(false)"
        >
            {{ cancelText }}
        </btn>
    </div>
</template>

<script>
import { defineComponent, defineProps } from 'vue';
export default defineComponent({
    props: {
        confirmColor: {
            type: String,
            default: 'brand'
        },
        confirmText: {
            type: String,
            default: 'CONFIRM'
        },
        cancelText: {
            type: String,
            default: 'CANCEL'
        },
    },
    setup(...msgs) {
        return {
            content: msgs.map(e => e.toString()).join(' ')
        };
    }
});
</script>
