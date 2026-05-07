const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

const getAuthHeadersMultipart = () => {
    const token = localStorage.getItem('auth_token');
    return {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    async post(endpoint, data) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        
        return this.handleResponse(response);
    },

    async postMultipart(endpoint, formData) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeadersMultipart(),
            body: formData
        });
        
        return this.handleResponse(response);
    },

    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        let result;
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
        }

        if (!response.ok) throw new Error(result.message || 'Something went wrong');
        return result;
    },

    async get(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        return this.handleResponse(response);
    }
};

