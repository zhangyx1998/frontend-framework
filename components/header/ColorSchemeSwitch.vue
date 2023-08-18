<script setup>
import { ref, watch } from 'vue';
const [AUTO, LIGHT, DARK] = [0, 1, 2],
    override = ref(AUTO),
    preferred = ref(AUTO);
function toggle() {
    if (override.value === AUTO) {
        override.value = LIGHT + DARK - preferred.value;
    } else {
        override.value = AUTO;
    }
}
const html = window.document.querySelector('html');
function toggleHtmlTheme(mode, preferred) {
    html.classList.toggle('light', (mode || preferred) === LIGHT);
    html.classList.toggle('dark', (mode || preferred) === DARK);
}
watch(override, mode => {
    if (mode) {
        localStorage.setItem(
            'color-scheme-override',
            ['AUTO', 'LIGHT', 'DARK'][mode]
        );
    } else {
        localStorage.removeItem('color-scheme-override');
    }
    toggleHtmlTheme(mode, preferred.value);
});
watch(preferred, mode => {
    if (override.value === AUTO) return toggleHtmlTheme(AUTO, mode);
    else if (override.value === mode) return override.value = AUTO;
});
if (window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', event => {
        preferred.value = event.matches ? DARK : LIGHT;
    });
    preferred.value = media.matches ? DARK : LIGHT;
} else {
    preferred.value = DARK;
}
override.value
  = { LIGHT, DARK }[localStorage.getItem('color-scheme-override')] || AUTO;
</script>

<template>
    <Responsive
        class="scheme-switch"
        @click="toggle()"
    >
        <transition-group name="rot-fade">
            <svg
                v-if="(override || preferred) === LIGHT"
                focusable="false"
                viewBox="0 0 32 32"
            >
                <path
                    d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z"
                    fill="currentColor"
                />
                <path
                    d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z"
                    fill="currentColor"
                />
                <path
                    d="M2 15.005h5v2H2z"
                    fill="currentColor"
                />
                <path
                    d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z"
                    fill="currentColor"
                />
                <path
                    d="M15 25.005h2v5h-2z"
                    fill="currentColor"
                />
                <path
                    d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z"
                    fill="currentColor"
                />
                <path
                    d="M25 15.005h5v2h-5z"
                    fill="currentColor"
                />
                <path
                    d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z"
                    fill="currentColor"
                />
                <path
                    d="M15 2.005h2v5h-2z"
                    fill="currentColor"
                />
            </svg>
            <svg
                v-else
                focusable="false"
                viewBox="0 0 32 32"
            >
                <path
                    d="M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3z"
                    fill="currentColor"
                />
            </svg>
        </transition-group>
    </responsive>
</template>

<style scoped>
.scheme-switch {
  width: 1.7em;
  height: 1.7em;
  display: block;
  position: relative;
  overflow: visible;
  border-radius: 5px;
  cursor: pointer;
}
.scheme-switch svg {
  color: var(--ct-gray);
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
}

.scheme-switch:hover svg {
  color: var(--ct);
}

.rot-fade-enter-from {
  transform: rotate(-60deg);
  opacity: 0;
}
.rot-fade-leave-to {
  transform: rotate(60deg);
  opacity: 0;
}
.rot-fade-enter-active,
.rot-fade-leave-active {
  transition-duration: 1s;
}
</style>
