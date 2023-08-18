/* eslint-env browser */
function tryClearTimeout(timer) {
    try { clearTimeout(timer) } catch (e) { console.error(e) }
}
/**
 * Generator function to dump an array.
 * @param {Array} array
 */
function* dump(array) {
    while (array.length) yield array.shift();
}
/**
 * Timeout Utility that waits for a specified amount of time before executing
 * a callback that is likely to be triggered repeatedly.
 * @param {Function} callback
 * @param {number} timeout
 */
export default function TimeOut(callback, timeout = 1000) {
    const queue = [];
    let timer = undefined;
    // Function to create a promise that resolves upon timeout
    function enqueue() {
        return new Promise((res, rej) => queue.push({ res, rej }));
    }
    // Function to execute the callback and resolve all results
    async function execute(...args) {
        try {
            const result = await callback(...args);
            for (const { res } of dump(queue)) {
                try { res(result) } catch (e) { console.error(e) }
            }
        } catch (error) {
            for (const { rej } of dump(queue)) {
                try { rej(error) } catch (e) { console.error(e) }
            }
        }
    }
    // Force the callback to execute immediately
    const handle = function(...args) {
        if (timer) tryClearTimeout(timer);
        timer = setTimeout(async () => {
            timer = undefined;
            handle.force(...args);
        }, timeout);
        return enqueue();
    };
    // Force the callback to execute immediately
    handle.force = function(...args) {
        if (timer) tryClearTimeout(timer);
        timer = undefined;
        execute(...args);
        // Async execute() will run after enqueue() finishes
        return enqueue();
    };
    // Getter and setter for callback function
    Object.defineProperty(handle, 'callback', {
        get: () => callback,
        set: value => {
            callback = value;
        }
    });
    // Getter and setter for timeout value
    Object.defineProperty(handle, 'timeout', {
        get: () => timeout,
        set: value => {
            timeout = value;
        }
    });
    // Return the injected handle
    return handle;
}
