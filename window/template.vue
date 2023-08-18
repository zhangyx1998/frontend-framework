<script>
import { defineComponent } from 'vue';
import * as setup from './setup';
export default defineComponent({
    setup() { return setup }
});
</script>

<template>
    <div frame-wrapper>
        <div
            frame-background
            :display="display"
        ></div>
        <transition name="frame">
            <div
                v-if="display"
                frame-window
                @transitionend="updateSize(0)"
            >
                <div frame-header>
                    <responsive
                        button
                        back-button
                        :display="showBackButton"
                        @click="onAbort(false)"
                    >
                        <svg viewBox="0 0 20 20">
                            <g style="fill: var(--ct-gray-dark)">
                                <path
                                    d="M12,19.5a1.51,1.51,0,0,1-1.06-.44l-8-8a1.49,1.49,0,0,1,0-2.12l8-8a1.5,1.5,0,0,1,2.12,2.12L6.47,9.65a.5.5,0,0,0,0,.7L13,16.86A1.59,1.59,0,0,1,13.15,19,1.54,1.54,0,0,1,12,19.5Z"
                                />
                            </g>
                        </svg>
                    </responsive>
                    <transition-group :name="transition">
                        <div
                            :key="
                                stack[depth && depth - 1]?.title +
                                    (depth && depth - 1)
                            "
                            title-text
                            frame-animation-element
                            :style="{
                                left: `${showBackButton ? 3.6 : 1.2}rem`,
                                right: `${showCloseButton ? 3.6 : 1.2}rem`,
                            }"
                        >
                            {{
                                stack[depth && depth - 1]?.title ||
                                    "Untitled frame"
                            }}
                        </div>
                    </transition-group>
                    <responsive
                        button
                        close-button
                        :display="showCloseButton"
                        @click="onAbort(true)"
                    >
                        <svg viewBox="0 0 20 20">
                            <g style="fill: var(--ct-gray-dark)">
                                <path
                                    d="M12.12,10l4.94-4.94a1.5,1.5,0,1,0-2.12-2.12L10,7.88,5.06,2.94A1.5,1.5,0,0,0,2.94,5.06L7.88,10,2.94,14.94a1.49,1.49,0,0,0,0,2.12,1.5,1.5,0,0,0,2.12,0L10,12.12l4.94,4.94a1.5,1.5,0,0,0,2.12,0,1.49,1.49,0,0,0,0-2.12Z"
                                />
                            </g>
                        </svg>
                    </responsive>
                </div>
                <div
                    frame-container
                    :style="sizeStyle"
                    @transitionend="updateSize(0)"
                >
                    <transition-group :name="transition">
                        <div
                            v-for="(el, i) in stack"
                            v-show="i + 1 == depth || (!depth && !i)"
                            :key="el.uid"
                            :ref="
                                (_) => {
                                    if (i + 1 == depth) content = _;
                                }
                            "
                            frame-content
                            frame-animation-element
                        >
                            <keep-alive>
                                <component
                                    :is="el?.component"
                                    v-bind="el?.props"
                                    @return="onReturn"
                                    @loading="onLoading"
                                />
                            </keep-alive>
                        </div>
                    </transition-group>
                    <transition name="fade">
                        <div
                            v-if="loading"
                            frame-animation-element
                            frame-loading-cover
                        >
                            <chasing-circle :scale="5" />
                        </div>
                    </transition>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
[frame-wrapper] {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overscroll-behavior: none;
  * {
    pointer-events: all;
  }
}

[frame-background] {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  background-color: var(--cf);
  opacity: 0.6;
  &[display="false"] {
    opacity: 0;
    pointer-events: none;
  }
}

[frame-window] {
  position: absolute;
  overflow: hidden;
  padding: 0;
  background-color: var(--cf);
  @media (max-width: 719px) {
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px 12px 0 0;
  }
  @media (min-width: 720px) {
    left: 50%;
    top: 50%;
    border-radius: 12px;
    transform: translate(-50%, -50%);
    transform-origin: 0 0;
  }
  box-shadow: 0 0 20px 0 var(--c-box-shadow);
  [frame-header] {
    height: 3.6rem;
    margin: 0;
    padding: 0;
    position: relative;
    background-color: var(--cf-next-level);
    // ICON normalization
    svg {
      width: 1.2rem;
      height: 1.2rem;
      margin: 1.2rem;
    }
    [button] {
      position: absolute !important;
      top: 0;
      opacity: 0;
      cursor: pointer;
      pointer-events: none;
      &[back-button] {
        left: 0;
        transform: translateX(-100%);
      }
      &[close-button] {
        right: 0;
        transform: translateX(100%);
      }
      &[display="true"] {
        opacity: 1;
        transform: translateX(0);
      }
    }
    [title-text] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 1.2rem 0;
      height: 100%;
      line-height: 100%;
      color: var(--ct-gray);
      font-size: 1.2rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  [frame-container] {
    position: relative;
    overflow: hidden;
    @media (max-width: 719px) {
      width: 100vw !important;
    }
    [frame-content] {
      position: absolute;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: scroll;
      @media (max-width: 719px) {
        max-height: 85vh;
        width: 100vw;
      }
      @media (min-width: 720px) {
        max-height: 90vh;
        max-width: 80vw;
        min-width: 360px;
      }
      :deep([btn-group]) {
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        justify-content: center;
        padding: 1em 0;
        border-top: 1px solid var(--cb-gray-light);
        &:not([compact]) > * {
          margin: 1em;
          flex-grow: 1;
          max-width: 10em;
          padding: 0.8em 2em;
        }
                &[compact] > * {
          // flex-grow: 1;
          max-width: 10em;
          padding: 0.6em 0.8em;
                }
      }
      :deep([frame-prompt]) {
        text-align: left;
        justify-content: center;
        font-size: 1.2rem;
        color: var(--ct-gray);
        font-weight: normal;
        padding: 2rem 1.2rem;
      }
    }
    [frame-loading-cover] {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--cf);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      opacity: 0.6;
      & > * {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
// Frame container animation
.frame {
  &-enter-active,
  &-leave-active {
    transition-duration: 0.5s;
    & *:not([frame-loading-cover]) {
      transition: none !important;
    }
  }
  &-enter-from,
  &-leave-to {
    @media (max-width: 719px) {
      transform: translateY(105%);
    }
    @media (min-width: 720px) {
      transform: scale(0.9) translate(-50%, -50%);
      opacity: 0;
    }
  }
}
// Frame content animation
[frame-animation-element] {
  transition-duration: 0.8s !important;
}
.push {
  &-left-enter-from,
  &-right-leave-to {
    transform: translateX(50%);
    opacity: 0;
  }
  &-right-enter-from,
  &-left-leave-to {
    transform: translateX(-50%);
    opacity: 0;
  }
}
.fade {
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
  &-leave-active {
    transition-duration: 0.5s;
    transition-delay: 0.1s;
  }
}
</style>
