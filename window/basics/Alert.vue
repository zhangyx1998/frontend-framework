<template>
    <div frame-prompt>
        {{ content }}
    </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    setup(...msgs) {
        return {
            content: msgs.map(m => m.toString()).join(' ')
        };
    }
});
</script>
