<template>
    <v-form>
        <container
            v-for="(locName, loc) in LOCALE"
            :key="loc"
            flex-colum
            locale
            :pad="false"
            style="margin-bottom: 1em"
        >
            <span v-if="typeof locName === 'string'">
                <label expandable>
                    {{ locName }}
                    <badge>{{ loc }}</badge>
                </label>
                <input
                    v-model.trim="name[loc]"
                    type="text"
                    autocomplete="off"
                    :placeholder="match(name, loc)"
                />
            </span>
            <span v-else>
                <label
                    style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
                >
                    <span>
                        {{ locName._ }}
                        <badge>{{ loc }}</badge>
                    </span>
                    <responsive
                        style="
              font-size: 1.4em;
              width: 1.2em;
              height: 1.2em;
              text-align: center;
              border-radius: 0.2em;
            "
                        @click="locName._expand_ = !locName._expand_"
                    ><i
                        :class="`fas fa-angle-${
                            locName._expand_ ? 'down' : 'left'
                        }`"
                    ></i></responsive>
                </label>
                <input
                    v-model.trim="name[loc]"
                    type="text"
                    autocomplete="off"
                    :placeholder="match(name, loc)"
                />
                <container
                    v-if="locName._expand_"
                    next-level
                    round
                >
                    <span
                        v-for="(varName, varLoc) in variants(locName)"
                        :key="varLoc"
                    >
                        <label>
                            {{ varName }}
                            <badge>{{ loc }}-{{ varLoc }}</badge>
                        </label>
                        <input
                            v-model.trim="name[[loc, varLoc].join('-')]"
                            type="text"
                            autocomplete="off"
                            :placeholder="match(name, [loc, varLoc].join('-'))"
                        />
                    </span>
                </container>
            </span>
        </container>
        <Responsive
            v-for="(option, i) in options"
            :key="i"
            option
            :selected="!!option?.value"
            :disabled="!!option?.disabled"
            @click="option.value = !option.value"
        >
            <div option-name>
                {{ option.name }}
            </div>
            <div
                v-if="showKey"
                option-key
            >
                {{ option.key }}
            </div>
        </Responsive>
    </v-form>
    <div btn-group>
        <btn
            type="solid green"
            @click="RETURN(JSON.parse(JSON.stringify(name)))"
        >
            确定
        </btn>
        <btn
            type="solid gray"
            @click="reset"
        >
            重置
        </btn>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { match } from './LocaleName.vue';
import { LOCALE } from '@CL/locale';
export default defineComponent({
    setup(name) {
        return {
            name: ref({ ...name }),
            originalName: { ...name },
            LOCALE: ref(Object.fromEntries(
                Object
                    .entries(LOCALE)
                    .map(([key, val]) => {
                        if (typeof val === 'object') val = { ...val, _expand_: false };
                        return [key, val];
                    })
            )),
            match
        };
    },
    methods: {
        reset() {
            this.name = { ...this.originalName };
        },
        variants(locName) {
            return Object.fromEntries(
                Object
                    .entries(locName)
                    .filter(([key]) => key !== '_' && key !== '_expand_')
            );
        }
    }
});
</script>


<style lang="scss" scoped>
[custom-form] {
  padding: 1.2rem;
  min-width: 50vw;
}
</style>
