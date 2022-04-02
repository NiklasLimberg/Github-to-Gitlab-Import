import axios from 'axios'

export const createFileProvider = (owner: string, repository: string, baseRef: string, headRef: string) => {
  
    const axiosInstance = axios.create({baseURL: `https://raw.githubusercontent.com/${owner}/${repository}`})
  
    return async function getFile(path: string) {
        let baseFile = ''
        try {
            const baseFileResponse = await axiosInstance.get(`${baseRef}/${path}`)
            baseFile = baseFileResponse.data
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status !== 404) {
                throw  error;
            }
        }

        let modifiedFile = ''
        try {
            const modifiedFileResponse = await axiosInstance.get(`${headRef}/${path}`)
            modifiedFile = modifiedFileResponse.data
        } catch (error) {
            if (axios.isAxiosError(error) && error?.response?.status !== 404) {
                throw  error;
            }
        }

        return {
            path,
            baseFile,
            modifiedFile
        }
    }
}

