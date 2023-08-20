// Default stack function export
import Window from './setup.js';
export default Window;
// Export basic frame APIs
import Alert from './basics/Alert.vue';
export const alert = Window(Alert, 'Alert');

import Confirm from './basics/Confirm.vue';
export const confirm = Window(Confirm, 'Confirm');


import Prompt from './basics/Prompt.vue';
export const prompt = Window(Prompt, 'Prompt');

import Select from './basics/Select.vue';
export const select = Window(Select, 'Select', false, {});
