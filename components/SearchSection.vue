<template>
  <search-bar v-model="searchTerm" />
  <multi-select-button 
    :selection="selectedOptions.repository"
    title="Repository"
    :options="repositoryOptions.options.value"
    :search-term="repositoryOptions.searchTerm.value"
    @search="search => repositoryOptions.searchTerm.value = search"
    @option-click="selection => toggleSelection(selection, 'repo')"
  />
  <multi-select-button
    :selection="selectedOptions.author"
    title="Author"
    :options="authorOptions.options.value"
    :search-term="authorOptions.searchTerm.value"
    @search="search => authorOptions.searchTerm.value = search"
    @option-click="selection => toggleSelection(selection, 'author')"
  />
  <multi-select-button
    :selection="selectedOptions.assignee"
    title="Assignee"
    :options="assigneeOptions.options.value"
    :search-term="assigneeOptions.searchTerm.value"
    @search="search => assigneeOptions.searchTerm.value = search"
    @option-click="selection => toggleSelection(selection, 'assignee')"
  />
  <multi-select-button
    :selection="selectedOptions.label" 
    title="Label"
    :options="labelOptions.options.value"
    :search-term="labelOptions.searchTerm.value"
    @search="search => labelOptions.searchTerm.value = search"
    @option-click="selection => toggleSelection(selection, 'label')"
  />
  <multi-select-button
    :selection="selectedOptions.review"
    title="Review" 
    :options="reviewOptions.options.value"
    :search-term="reviewOptions.searchTerm.value"
    @search="search => reviewOptions.searchTerm.value = search"
    @option-click="selection => toggleSelection(selection, 'review')"
  />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{modelValue: string}>(), {
    modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchTerm = computed({
    get: () => props.modelValue, 
    set: (value: string) => emit('update:modelValue', value)
})

interface SelectedOptions {
  repository: string[],
  author: string[],
  assignee: string[],
  label: string[],
  review: string[]
}

const repositoryOptions = useRepositoryOptions()
const authorOptions = useUserOptions()
const assigneeOptions = useUserOptions()
const labelOptions = useLabelOptions()
const reviewOptions = useReviewOptions()

const selectedOptions = computed(() => {
    const selection = {
        repository: [],
        author: [],
        assignee: [],
        label: [],
        review: []
    } as SelectedOptions

    const options = searchTerm.value.split(' ').map(substr => substr.split(':'));

    options.forEach(option => {
        if (option.length !== 2) {
            return
        }

        switch (option[0]) {
        case 'repo':
            selection.repository.push(option[1])
            break;
        case 'author':
            selection.author.push(option[1])
            break;
        case 'assignee':
            selection.assignee.push(option[1])
            break;
        case 'label':
            selection.label.push(option[1])
            break;
        case 'review':
            selection.review.push(option[1])
            break;
        }
    })

    return selection
})

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function toggleSelection(selection: string, kind: 'repo' | 'author' | 'assignee' | 'label' | 'review') {
    const option = escapeRegExp(`${kind}:${selection}`)

    const regex = new RegExp(` *${option} *`, 'g')

    if (regex.test(searchTerm.value)) {
        searchTerm.value = searchTerm.value.replaceAll(regex, '')
        return
    }

    searchTerm.value += ` ${option}`
}

</script>