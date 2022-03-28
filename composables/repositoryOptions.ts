const availableOptions = [
    'Platform',
    'Development',
    'Production',
    'Shopware'
].map(option => { return { id: option, name: option }})


export function useRepositoryOptions() {
    const searchTerm = ref('')
    const options = computed(() => availableOptions.filter(option => option.name.includes(searchTerm.value)))
  
    return {
        searchTerm,
        options
    }
}