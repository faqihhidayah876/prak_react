import axios from 'axios'

const API_URL = "https://cigysvkcjcslrmagefeq.supabase.co/rest/v1/note"
const API_KEY = "sb_publishable_-x6jX6-3ZjH66ajHxqaZdQ_-6zs6NaY"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    async createNote(data) {
        const response = await axios.post(API_URL, data, { headers })
        return response.data
    },
    async deleteNote(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    }
}