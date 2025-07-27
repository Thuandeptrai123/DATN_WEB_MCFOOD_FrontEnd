import React, { useEffect, useState } from "react";
import invoiceService from "../api/invoiceService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import InvoiceDetailModal from "./InvoiceDetailModal";

export default function OrderHistory() {
  const userInfo = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [selectedInvoice, setSelectedInvoice] = useState(null); 
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (!userInfo?.Id) {
          toast.error("Không tìm thấy thông tin người dùng!");
          return;
        }

        const res = await invoiceService.getInvoicesByCustomer(userInfo.Id, token);

        if (res.ErrorCode === 0) {
          console.log("Invoices from API:", res.Data);

          const normalized = res.Data.map((invoice) => ({
            id: invoice.Id,
            createdDate: invoice.CreatedDate,
            items: invoice.Items,
            totalAmount: invoice.TotalAmount,
            ...invoice,
          }));

          // Sort by newest first by default
          const sorted = normalized.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          setInvoices(sorted);
          setFilteredInvoices(sorted);
        } else {
          toast.error(res.Message || "Không thể tải danh sách đơn hàng");
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userInfo, token]);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...invoices];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(invoice => invoice.Status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter !== "all") {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdDate);
        switch (dateFilter) {
          case "today":
            return invoiceDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return invoiceDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        break;
      case "amount_high":
        filtered.sort((a, b) => b.TotalAmount - a.TotalAmount);
        break;
      case "amount_low":
        filtered.sort((a, b) => a.TotalAmount - b.TotalAmount);
        break;
      default:
        break;
    }

    setFilteredInvoices(filtered);
  }, [invoices, statusFilter, dateFilter, searchTerm, sortBy]);
  
  const handleViewInvoice = async (invoiceId) => {
    try {
      const res = await invoiceService.getInvoiceDetail(invoiceId, token);
      if (res?.ErrorCode === 0) {
        setSelectedInvoice(res.Data);
      } else {
        toast.error(res.Message || "Không thể lấy chi tiết hóa đơn");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy chi tiết hóa đơn");
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Paid": { class: "success", text: "Đã thanh toán", icon: "fas fa-check-circle" },
      "Pending": { class: "warning", text: "Chờ xử lý", icon: "fas fa-clock" },
      "Cancelled": { class: "danger", text: "Đã hủy", icon: "fas fa-times-circle" },
      "Processing": { class: "info", text: "Đang xử lý", icon: "fas fa-spinner" },
      "Delivered": { class: "success", text: "Đã giao", icon: "fas fa-truck" }
    };

    const config = statusConfig[status] || { class: "secondary", text: status, icon: "fas fa-question" };
    
    return (
      <span className={`badge bg-${config.class} d-flex align-items-center gap-1`}>
        <i className={config.icon} style={{ fontSize: '0.75rem' }}></i>
        {config.text}
      </span>
    );
  };

  const isNewestInvoice = (invoice, index) => {
    return index === 0 && filteredInvoices.length > 1;
  };

  const customStyles = {
    container: {
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    },
    cardHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      padding: '1.5rem'
    },
    title: {
      color: '#212529',
      fontWeight: '600',
      fontSize: '1.75rem',
      margin: 0
    },
    filterSection: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderBottom: '1px solid #e9ecef'
    },
    filterControl: {
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '6px',
      color: '#212529',
      fontSize: '0.9rem'
    },
    table: {
      backgroundColor: '#ffffff'
    },
    tableHeader: {
      backgroundColor: '#212529',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    newestRow: {
      backgroundColor: '#f8f9fa',
      borderLeft: '4px solid #212529',
      position: 'relative'
    },
    newestBadge: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: '#212529',
      color: '#ffffff',
      fontSize: '0.7rem',
      padding: '2px 6px',
      borderRadius: '10px'
    },
    viewBtn: {
      backgroundColor: 'transparent',
      border: '1px solid #212529',
      color: '#212529',
      borderRadius: '6px',
      padding: '5px 10px',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6c757d'
    }
  };

  return (
    <div style={customStyles.container}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div style={customStyles.card}>
              {/* Header */}
              <div style={customStyles.cardHeader}>
                <h2 style={customStyles.title}>
                  <i className="fas fa-history me-3"></i>
                  Lịch sử đơn hàng
                </h2>
              </div>

              {/* Filters Section */}
              <div style={customStyles.filterSection}>
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      <i className="fas fa-filter me-2"></i>Trạng thái
                    </label>
                    <select 
                      className="form-select form-select-sm"
                      style={customStyles.filterControl}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Pending">Chờ xử lý</option>
                      <option value="Processing">Đang xử lý</option>
                      <option value="Paid">Đã thanh toán</option>
                      <option value="Delivered">Đã giao</option>
                      <option value="Cancelled">Đã hủy</option>
                    </select>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      <i className="fas fa-calendar me-2"></i>Thời gian
                    </label>
                    <select 
                      className="form-select form-select-sm"
                      style={customStyles.filterControl}
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="all">Tất cả thời gian</option>
                      <option value="today">Hôm nay</option>
                      <option value="week">7 ngày qua</option>
                      <option value="month">30 ngày qua</option>
                    </select>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      <i className="fas fa-sort me-2"></i>Sắp xếp
                    </label>
                    <select 
                      className="form-select form-select-sm"
                      style={customStyles.filterControl}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="amount_high">Giá trị cao</option>
                      <option value="amount_low">Giá trị thấp</option>
                    </select>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <label className="form-label fw-semibold text-dark small">
                      <i className="fas fa-search me-2"></i>Tìm kiếm
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={customStyles.filterControl}
                      placeholder="Mã đơn hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Tìm thấy {filteredInvoices.length} đơn hàng
                  </small>
                  {(statusFilter !== "all" || dateFilter !== "all" || searchTerm) && (
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => {
                        setStatusFilter("all");
                        setDateFilter("all");
                        setSearchTerm("");
                        setSortBy("newest");
                      }}
                    >
                      <i className="fas fa-times me-1"></i>Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>

              {/* Table Content */}
              <div className="p-0">
                {loading ? (
                  <div style={customStyles.emptyState}>
                    <div className="spinner-border text-dark mb-3" role="status"></div>
                    <p className="mb-0">Đang tải dữ liệu...</p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div style={customStyles.emptyState}>
                    <i className="fas fa-inbox fa-3x mb-3" style={{ opacity: 0.3 }}></i>
                    <h5 className="text-muted">Không có đơn hàng nào</h5>
                    <p className="text-muted mb-0">
                      {invoices.length === 0 
                        ? "Bạn chưa có đơn hàng nào." 
                        : "Không tìm thấy đơn hàng phù hợp với bộ lọc."}
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0" style={customStyles.table}>
                      <thead>
                        <tr style={customStyles.tableHeader}>
                          <th className="border-0 py-3 px-3">
                            <i className="fas fa-hashtag me-2"></i>Mã đơn hàng
                          </th>
                          <th className="border-0 py-3 px-3">
                            <i className="fas fa-calendar me-2"></i>Ngày tạo
                          </th>
                          <th className="border-0 py-3 px-3 text-center">
                            <i className="fas fa-boxes me-2"></i>Số món
                          </th>
                          <th className="border-0 py-3 px-3 text-end">
                            <i className="fas fa-money-bill-wave me-2"></i>Tổng tiền
                          </th>
                          <th className="border-0 py-3 px-3 text-center">
                            <i className="fas fa-info-circle me-2"></i>Trạng thái
                          </th>
                          <th className="border-0 py-3 px-3 text-center">
                            <i className="fas fa-eye me-2"></i>Chi tiết
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice, index) => (
                          <tr 
                            key={invoice.id || index}
                            style={isNewestInvoice(invoice, index) ? customStyles.newestRow : {}}
                            className="position-relative"
                          >
                            {isNewestInvoice(invoice, index) && (
                              <div style={customStyles.newestBadge}>
                                <i className="fas fa-star me-1"></i>Mới nhất
                              </div>
                            )}
                            <td className="py-3 px-3">
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                                     style={{ width: '35px', height: '35px' }}>
                                  <i className="fas fa-receipt text-muted" style={{ fontSize: '0.8rem' }}></i>
                                </div>
                                <div>
                                  <div className="fw-semibold text-dark">#{invoice.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-muted">
                              {invoice.createdDate
                                ? new Date(invoice.createdDate).toLocaleString('vi-VN')
                                : "Không xác định"}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="badge bg-light text-dark px-3">
                                {Array.isArray(invoice.items) ? invoice.items.length : 0}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-end fw-semibold text-dark">
                              {Number(invoice.TotalAmount).toLocaleString("vi-VN")}₫
                            </td>
                            <td className="py-3 px-3 text-center">
                              {getStatusBadge(invoice.Status)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleViewInvoice(invoice.Id)}
                                style={customStyles.viewBtn}
                                className="btn-hover-dark"
                                title="Xem chi tiết đơn hàng"
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#212529';
                                  e.target.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                  e.target.style.color = '#212529';
                                }}
                              >
                                <i className="fas fa-eye me-1"></i>Xem
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}