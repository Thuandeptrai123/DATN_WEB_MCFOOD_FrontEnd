import axios from "axios";

const API_URL = "https://localhost:7233/api/invoice";

const getMyCart = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/my-cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// const createInvoice = async (customerId) => {
//   const token = localStorage.getItem("token");
//   const response = await axios.post(
//     `${API_URL}/create`,
//     { customerId },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.data;
// };

const createInvoice = async (customerId) => {
  const token = localStorage.getItem("token");

  console.log("➡️ Gửi API /invoice/create với customerId:", customerId);

  const response = await axios.post(
    `${API_URL}/create`,
    { customerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


const getInvoicesByCustomer = async (customerId, token) => {
  const response = await axios.get(`${API_URL}/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getInvoiceDetail = async (invoiceId, token) => {
  const response = await axios.get(`${API_URL}/detail/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // ✅ trả về chuẩn
};

const exportInvoice = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/export-pdf/${invoiceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.data && res.data.Data) {
      const fileUrl = `https://localhost:7233${res.data.Data}`;
      window.open(fileUrl, "_blank");
    } else {
      alert("Không thể xuất hóa đơn.");
      console.error("Không có dữ liệu để xuất hóa đơn.", res.data);
    }
  } catch (err) {
    console.error("❌ Lỗi xuất hóa đơn:", err);
    alert("Lỗi khi xuất hóa đơn.");
  }
};
const getLastInvoiceRecommendations = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/recommendation/latest`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getFavoriteFoods = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/recommendation/favorite`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getMostPopularFoods = async () => {
  const response = await axios.get(`${API_URL}/recommendation/popular`);
  return response.data;
};





const invoiceService = {
  getMyCart,
  createInvoice,
  getInvoicesByCustomer,
  getInvoiceDetail,
  exportInvoice,
  getLastInvoiceRecommendations,
  getFavoriteFoods,
  getMostPopularFoods,
};

export default invoiceService;






// import axios from "axios";

// const API = "https://localhost:7233/api/invoice";

// const invoiceService = {
//   createInvoice: (data) => axios.post(`${API}/create`, data),

//   getInvoicesByCustomer: (customerId) => axios.get(`${API}/${customerId}`),

//   getInvoiceDetail: (invoiceId) => axios.get(`${API}/detail/${invoiceId}`),

//   processPayment: (invoiceId, method) =>
//     axios.post(`${API}/process-payment/${invoiceId}?paymentMethod=${method}`),

//   updateInvoiceStatus: (invoiceId, newStatus, updatedBy = "admin") =>
//     axios.put(`${API}/update-status/${invoiceId}?newStatus=${newStatus}&updatedBy=${updatedBy}`),

//   getCustomersWithInvoices: () => axios.get(`${API}/customers-with-invoices`),
// };

// export default invoiceService;




// import axios from "axios";

// const API_URL = "https://localhost:7233/api/invoice";

// const createInvoice = (customerId) => {
//   return axios.post(`${API_URL}/create`, { customerId });
// };

// const processPayment = (invoiceId, paymentMethod) => {
//   return axios.post(`${API_URL}/process-payment/${invoiceId}?paymentMethod=${paymentMethod}`);
// };

// export default {
//   createInvoice,
//   processPayment,
// };
