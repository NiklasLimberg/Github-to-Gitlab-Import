import axios from "axios"

interface GithubResponse {
    data: {
        items: [{
            login: string
        }]
    }
}

export function useUserOptions() {
    const searchTerm = ref('')
    const options = ref<{id: string, name: string}[]>([])

    async function getOptions() {
        const searchParams = new URLSearchParams()
        searchParams.append('q', `${searchTerm.value} in:login`);
        searchParams.append('per_page', '10');

        const response = await axios({
            method: 'GET',
            url: 'https://api.github.com/search/users',
            headers: { Accept: 'application/vnd.github.v3+json' },
            params: searchParams,
        }) as GithubResponse;

        const users = response.data.items;

        return users.map(user => {
            return { 
                id: user.login,
                name: user.login
            }
        })
    }
  
    watchEffect(async () => {
        options.value = await getOptions()
    })
  
    return {
        searchTerm,
        options
    }
}