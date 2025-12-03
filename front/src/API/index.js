import axios from 'axios';
import API_ROUTES from './apiRoutes.js';

const sendForm = async (route, formData) => {
	try {
		const response = await axios.post(`${API_ROUTES.API_ROUTE}/${route}`, formData, {
			headers: {'Content-Type': 'multipart/form-data'}
		});
		return response.data;
	} catch (error) {
		console.error('Error sending form data:', error);
		throw error;
	}
};

export { sendForm };

