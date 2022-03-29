<template>
  <img
    v-if="iconPath"
    :style="{height: size, width: size}"
    :src="iconPath"
  >
</template>

<script setup lang="ts">
withDefaults(defineProps<{ iconPath?: string, size?: string}>(), {
    iconPath: '',
    size: '16px'
})
</script>

<style scoped>
img  {
    height: 16px;
    width: 16px;
    border-radius: 50%
}
</style>