const availableOptions = [{
    id: 'none',
    name : 'No reviews'
}, {
    id: 'required',
    name: 'Review required'
}, {
    id: 'approved',
    name: 'Approved review'
}, {
    id: 'changes-requested',
    name: 'Changes requested'
}]
  
  
export function useReviewOptions() {
    const searchTerm = ref('')
    const options = computed(() => availableOptions.filter(option => option.name.includes(searchTerm.value)))
    
    return {
        searchTerm,
        options
    }
}