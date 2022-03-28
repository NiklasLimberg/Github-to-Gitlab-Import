const availableOptions = [
    'Accepted',
    'Administration',
    'Backend / PHP',
    'Bug',
    'Closed by author',
    'Declined',
    'Design',
    'Documentation',
    'Duplicate',
    'Feature Request',
    'Frontend / JS',
    'Good first issue',
    'hacktoberfest-accepted',
    'Incomplete',
    'invalid',
    'Missing tests',
    'QuickPick',
    'Refactoring',
    'Scheduled',
    'stale',
    'Storefront',
    'Waiting for major',
    'Missing Tests',
    'Question',
    'Quick-Pick',
    'Ready'
].map(option => { return { id: option, name: option }})


  
export function useLabelOptions() {
    const searchTerm = ref('')
    const options = computed(() => availableOptions.filter(option => option.name.includes(searchTerm.value)))
    
    return {
        searchTerm,
        options
    }
}