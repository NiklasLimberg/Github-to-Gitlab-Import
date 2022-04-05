<template>
  <modal-dialog
    :title="'Prepare Import'"
    :open="isOpen"
    @close="emit('close')"
  >
    <div class="container">
      <div class="input">
        <label>Original Message</label>
        <textarea v-model="originalMessage" />
      </div>
      <div
        v-if="hasEdits"
        class="input"
      >
        <label>Modified message</label>
        <textarea v-model="modifiedMessage" />
      </div>
    </div>
    <template #actions>
      <div class="button-container">
        <button
          class="button-primary"
          @click="submit"
        >
          Import
        </button>
      </div>
    </template>
  </modal-dialog>
</template>

<script setup lang="ts">
const originalMessage = ref('')
const modifiedMessage = ref('')

const props = withDefaults(defineProps<{
    isOpen?: boolean,
    originalCommitMessage: string,
    hasEdits: boolean
}>(), {
    isOpen: false
})
const emit = defineEmits<{(e: 'close'): void, (e: 'submit', value: { originalOverride: string, overrideMessage: string}): void}>()

onMounted(() =>{
    originalMessage.value = props.originalCommitMessage;
})

function submit() {
    emit('submit', {
        originalOverride: originalMessage.value,
        overrideMessage: modifiedMessage.value
    })
}
</script>

<style scoped>
.button-container {
    display: flex;
    justify-content: right;
}

.container {
    margin: 16px 32px;
}

.input {
    display:flex;
    flex-direction:column;
}

label {
    margin-bottom: 4px;
}

textarea {
    height: 85px;
    background-color: var(--background-color);
    resize: vertical;
}
</style>