<template>
  <dropdown-button
    button-text="Repository"
    :options="options"
  />
</template>

<script setup lang="ts">
const options = [{
  name: 'Platform',
  selected: true
}, {
  name: 'Development',
  selected: false
}, {
  name: 'Production',
  selected: false
}, {
  name: 'Shopware',
  selected: false
}]

</script>