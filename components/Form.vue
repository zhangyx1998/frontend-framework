<template>
    <div custom-form>
        <slot></slot>
    </div>
</template>

<style lang="scss">
div[custom-form] {
  * {
    user-select: none;
  }
  &[prompt] {
    width: 100%;
    max-width: 340px;
    padding: 1.4rem;
    margin: 1rem 0;
    border-radius: 6px;
    background-color: var(--cf-next-level);
  }
  @media (min-width: 720) {
    &[prompt] {
      border: 1px solid var(--cb-gray-light);
      margin: 1rem;
      padding: 1.4rem;
    }
  }
  label {
    display: block;
    margin-bottom: 10px;
    text-align: left;
  }
  [form-input],
  select,
  input {
    width: 100%;
    border: 1px solid var(--cb-gray);
    margin-top: 6px;
    margin-bottom: 20px;
    padding: 5px 12px;
    border-radius: 6px !important;
    background-color: var(--cf);
    color: var(--ct-gray-dark);
  }
  select,
  input {
    line-height: 24px;
    height: 34px;
    display: block;
  }
  select[disabled],
  input[disabled] {
    color: var(--ct-gray-light);
    background-color: var(--cf-next-level);
    cursor: not-allowed;
  }
  select:focus,
  input:focus {
    border-color: var(--c-brand);
    outline: none;
    box-shadow: 0 0 2px 1px var(--c-brand-light);
  }
  & > label {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    [alert-text] {
      color: var(--ct-red);
      font-size: 0.8em;
    }
    [info-text] {
      color: var(--ct-gray);
      font-size: 0.8em;
    }
    [success-text] {
      color: var(--ct-green);
      font-size: 0.8em;
    }
  }
  label {
    & > * {
      display: inline-block;
      width: unset;
      margin: 0 2px 0 0;
    }
    & > input {
      vertical-align: middle;
    }
  }
  [selection-group] {
    font-size: 0.9em;
    display: block;
    margin-bottom: 20px;
    & > * {
      color: var(--ct-gray-dark);
      height: 1.4em;
      padding: 0.2em 0;
      line-height: 1em;
      // margin-bottom: 1em;
    }
  }
  [button] {
    margin: 0 !important;
    font-weight: bold !important;
  }
}
</style>
