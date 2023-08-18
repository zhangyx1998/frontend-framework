import { ref, reactive, computed, watch, markRaw } from 'vue';
export const
    stack = ref([]), depth = ref(0), display = ref(false), direction = ref(1),
    showBackButton = computed(() => !!(
        depth.value > 1
      && stack.value[depth.value - 1]?.abortable
    )),
    showCloseButton = computed(() => !stack.value
        .filter(({ abortable }, i) => !abortable && i < depth.value)
        .length
    ),
    transition = computed(() => direction.value ? 'push-left' : 'push-right'),
    content = ref(null),
    loading = ref(false);
// Update the size of the current frame
const size = reactive({ w: 0, h: 0, freeze: false });
export const sizeStyle = computed(() => ({
    width: `${size.w}px`,
    height: `${size.h}px`,
    transition: size.freeze ? 'none' : undefined
}));
let sizeUpdateCounter = 0;
export function updateSize(nextTick = sizeUpdateCounter > 0 ? sizeUpdateCounter - 1 : 0) {
    const
        el = content.value,
        w = el?.offsetWidth,
        h = el?.offsetHeight;
    sizeUpdateCounter = nextTick;
    if (!w || !h) return;
    if (size.w !== w || size.h !== h) {
        if (nextTick) {
            size.freeze = true;
        } else {
            size.freeze = false;
            size.w = w;
            size.h = h;
            sizeUpdateCounter = 10;
        }
    }
}
watch(content, () => updateSize());
setInterval(updateSize, 100);
// Watch the depth and set a small delay before updating display
watch(depth, (d, e) => {
    direction.value = d > e;
    loading.value = false;
    if (d) {
        display.value = true;
    } else setTimeout(() => display.value = !!depth.value, 100);
});
export function onLoading(state) {
    loading.value = state;
    if (depth.value) {
        stack.value[depth.value - 1].loading = !!state;
    }
    if (state) updateSize();
}
// LOAD and RETURN marco function
export function RETURN(...args) {
    onReturn(...args);
}
export function LOAD(...args) {
    onLoading(true);
    return new Promise(async (res, rej) => {
        try {
            const
                tasks = args.map(arg => typeof arg === 'function' ? arg() : arg),
                result = await Promise.all(tasks);
            res(result.length > 1 ? result : result[0]);
        } catch (e) {
            rej(e);
        } finally {
            onLoading(false);
        }
    });
}
// Resolve the returned value to the caller
export function onReturn(arg) {
    if (depth.value) {
        const { resolve } = stack.value[depth.value -= 1];
        resolve(arg);
        setTimeout(() => {
            while (stack.value.length > depth.value) stack.value.pop();
        }, 1000);
    } else {
        console.error('WinStack already drained');
    }
}
// Handle abort event
export function onAbort(abortAll = false) {
    if (!depth.value) return;
    const { abortable } = stack.value[depth.value - 1];
    if (abortable) {
        onReturn();
        // Recursively abort all abortable frames
        if (abortAll) onAbort(abortAll);
    }
}
// Initialize exposed enqueue function
let counter = 0;
/**
 * Create a new windowed component and push it into the stack
 * @param {import('vue').Component} component
 * @param {string} title
 * @param {boolean} abortable
 * @param {Function} resolve Resolve function provided by Promise
 * @param {Array} args Arguments passed to the component
 * @param {Object} props Props passed to the component
 */
function createWindow(component, title, abortable, resolve, args, props) {
    stack.value[depth.value++] = {
        title,
        props,
        component: markRaw({
            ...component,
            setup() {
                if (typeof component?.setup === 'function') return {
                    RETURN,
                    LOAD,
                    ...component?.setup(...args) ?? {}
                };
                else return { RETURN, LOAD, args };
            },
            emits: ['return', 'loading', ...component?.emits || []]
        }),
        uid: counter = parseInt(counter + 1),
        abortable,
        resolve
    };
}
/**
 *
 * @param {import('vue').Component} component Window's main component
 * @param {{*}} config Default
 */
export default function Window(component, title, abortable = true, props = {}) {
    function open(...args) {
        return new Promise(resolve =>
            createWindow(component, title, abortable, resolve, args, props)
        );
    }
    // Inject overlay to reset title, abortable and props
    Object.assign(open, {
        title(title) {
            return Window(component, title, abortable, props);
        },
        abortable(abortable = true) {
            return Window(component, title, abortable, props);
        },
        props(newProps = {}) {
            return Window(component, title, abortable, { ...props, ...newProps });
        }
    });
    // Return the open function with injected overlay functions
    return open;
}
