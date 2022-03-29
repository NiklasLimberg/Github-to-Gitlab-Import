const availableOptions = [{
    id: 'shopware/platform',
    name: 'Platform'
}, {
    id: 'shopware/development',
    name: 'Development'
}, {
    id: 'shopware/production',
    name: 'Production'
}, {
    id: `shopware/shopware`,
    name: 'Shopware'
}]

export function useRepositoryOptions() {
    const searchTerm = ref('')
    const options = computed(() => availableOptions.filter(option => option.name.includes(searchTerm.value)))
  
    return {
        searchTerm,
        options
    }
}