<template>
  <dialog
    ref="modalRef"
    aria-labelledby="dialog_title"
    aria-describedby="dialog_description"
    @keydown="restrictClosing"
  >
    <div>
      <div class="header">
        <div class="space-between">
          <span class="title">{{ title }}</span>
          <icon-close v-if="closeable" />
        </div>
        <slot name="header" />
      </div>
      <div class="body">
        <slot />
      </div>
    </div>
    <div class="actions">
      <slot name="actions" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
interface HTMLDialogElement extends HTMLElement {
    open:boolean;
    returnValue:string;
    close():void
    show():void
    showModal():void
}
const props = withDefaults(defineProps<{title:string, open?: boolean, closeable?: boolean}>(), {
    closeable: true,
    open: false
})
const emits = defineEmits<{(e: 'open'): void, (e: 'close'): void}>()
const modalRef = ref<HTMLDialogElement | null>(null)

const isOpen = computed<boolean>({
    get: () => modalRef.value?.open ?? false,
    set: (desiredSate) => {
        if (desiredSate) {
            console.log(modalRef.value)
            modalRef.value?.showModal()
            emits('open')
            return
        }

        modalRef.value?.close()
        emits('close')
    }
})

onMounted(() => {
    isOpen.value = props.open
})

watch(() => props.open, open => {
    isOpen.value = open
})


function restrictClosing(event: KeyboardEvent) {
    if(!props.closeable) {
        event.preventDefault()
        return
    }

    isOpen.value = false;
}


</script>

<style scoped>
dialog {
	background-color: var(--background-color);
	padding: 0;
	border-radius: 6px;
	width: 670px;
	border: 1px solid var(--neutrals-dark-gray-400);;
}

dialog::backdrop {
	background-color: #14191F;
	opacity: 0.85;
}
.space-between {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header {
	padding: 16px 32px;
	border-bottom: 1px solid var(--neutrals-dark-gray-400);
	background-color: var(--neutrals-dark-gray-700);
}

.title {
	font: var(--headline-small);
}

.body {
	min-height: 400px;
}

.actions {
	padding: 16px 32px;
	border-top: 1px solid var(--neutrals-dark-gray-400);
	background-color: var(--neutrals-dark-gray-700);
}
</style>