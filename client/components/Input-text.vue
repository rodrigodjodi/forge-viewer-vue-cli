<template>
  <div class="field">
    <label class="label">{{label}}</label>
    <p class="control">
        <input class="input" type="text" placeholder="Placeholder">
    </p>
</div>
</template>

<script>
// @ts-check
export default {
  props: ['label']
}
</script>
