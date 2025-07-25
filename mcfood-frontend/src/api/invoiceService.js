import axios from "axios";

const API_URL = "https://localhost:7233/api/invoice";

const createInvoice = (customerId) => {
  return axios.post(`${API_URL}/create`, { customerId });
};

const processPayment = (invoiceId, paymentMethod) => {
  return axios.post(`${API_URL}/process-payment/${invoiceId}?paymentMethod=${paymentMethod}`);
};

export default {
  createInvoice,
  processPayment,
};
