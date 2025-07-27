import React from "react";

const InvoiceDetailModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

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
      <span className={`badge bg-${config.class} fs-6 px-3 py-2 d-inline-flex align-items-center gap-2`}>
        <i className={config.icon}></i>
        {config.text}
      </span>
    );
  };

  const customStyles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #e9ecef'
    },
    modalHeader: {
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      color: '#212529',
      fontSize: '1.5rem',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    closeBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      color: '#6c757d',
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    modalBody: {
      padding: '2rem',
      maxHeight: 'calc(90vh - 200px)',
      overflowY: 'auto'
    },
    infoCard: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem'
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    infoLabel: {
      color: '#6c757d',
      fontSize: '0.875rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoValue: {
      color: '#212529',
      fontSize: '1rem',
      fontWeight: '500'
    },
    table: {
      backgroundColor: '#ffffff',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    },
    tableHeader: {
      backgroundColor: '#212529',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    tableRow: {
      borderBottom: '1px solid #f1f3f4',
      transition: 'background-color 0.2s ease'
    },
    tableCell: {
      color: '#495057',
      fontSize: '0.95rem',
      padding: '1rem 0.75rem',
      verticalAlign: 'middle'
    },
    totalSection: {
      backgroundColor: '#212529',
      color: '#ffffff',
      padding: '1.5rem 2rem',
      marginTop: '2rem',
      borderRadius: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    totalText: {
      fontSize: '1.25rem',
      fontWeight: '600',
      margin: 0
    },
    modalFooter: {
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    actionBtn: {
      backgroundColor: '#212529',
      borderColor: '#212529',
      color: '#ffffff',
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  return (
    <div 
      style={customStyles.modalOverlay}
      onClick={onClose}
    >
      <div 
        style={customStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={customStyles.modalHeader}>
          <h2 style={customStyles.modalTitle}>
            <i className="fas fa-file-invoice"></i>
            Chi tiết hóa đơn
          </h2>
          <button
            style={customStyles.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.color = '#212529';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6c757d';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div style={customStyles.modalBody}>
          {/* Invoice Information */}
          <div style={customStyles.infoCard}>
            <h5 className="mb-4" style={{ color: '#212529', fontWeight: '600' }}>
              <i className="fas fa-info-circle me-2"></i>
              Thông tin hóa đơn
            </h5>
            
            <div style={customStyles.infoGrid}>
              <div style={customStyles.infoItem}>
                <div style={customStyles.infoLabel}>
                  <i className="fas fa-hashtag"></i>
                  Mã hóa đơn
                </div>
                <div style={customStyles.infoValue}>#{invoice.Id}</div>
              </div>

              <div style={customStyles.infoItem}>
                <div style={customStyles.infoLabel}>
                  <i className="fas fa-calendar-alt"></i>
                  Ngày tạo
                </div>
                <div style={customStyles.infoValue}>
                  {new Date(invoice.CreatedDate).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div style={customStyles.infoItem}>
                <div style={customStyles.infoLabel}>
                  <i className="fas fa-info-circle"></i>
                  Trạng thái
                </div>
                <div style={customStyles.infoValue}>
                  {getStatusBadge(invoice.Status)}
                </div>
              </div>

              <div style={customStyles.infoItem}>
                <div style={customStyles.infoLabel}>
                  <i className="fas fa-boxes"></i>
                  Số sản phẩm
                </div>
                <div style={customStyles.infoValue}>
                  <span className="badge bg-light text-dark px-3 py-2">
                    {invoice.Items?.length || 0} sản phẩm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <h5 className="mb-3" style={{ color: '#212529', fontWeight: '600' }}>
              <i className="fas fa-list-ul me-2"></i>
              Chi tiết sản phẩm
            </h5>

            <div className="table-responsive" style={customStyles.table}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr style={customStyles.tableHeader}>
                    <th className="border-0 py-3 px-3" style={{ width: '60px' }}>
                      <i className="fas fa-hashtag me-1"></i>STT
                    </th>
                    <th className="border-0 py-3 px-3">
                      <i className="fas fa-utensils me-1"></i>Tên sản phẩm
                    </th>
                    <th className="border-0 py-3 px-3 text-center" style={{ width: '120px' }}>
                      <i className="fas fa-sort-numeric-up me-1"></i>Số lượng
                    </th>
                    <th className="border-0 py-3 px-3 text-end" style={{ width: '140px' }}>
                      <i className="fas fa-tag me-1"></i>Đơn giá
                    </th>
                    <th className="border-0 py-3 px-3 text-end" style={{ width: '140px' }}>
                      <i className="fas fa-calculator me-1"></i>Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.Items?.map((item, index) => (
                    <tr 
                      key={index} 
                      style={customStyles.tableRow}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={customStyles.tableCell}>
                        <div className="text-center">
                          <span className="badge bg-light text-dark">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td style={customStyles.tableCell}>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '35px', height: '35px' }}>
                            <i className="fas fa-utensils text-muted" style={{ fontSize: '0.8rem' }}></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', color: '#212529' }}>
                              {item.FoodName || item.ComboName || 'Sản phẩm'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...customStyles.tableCell, textAlign: 'center' }}>
                        <span className="badge bg-primary px-3 py-2">
                          {item.Quantity}
                        </span>
                      </td>
                      <td style={{ ...customStyles.tableCell, textAlign: 'right', fontWeight: '500' }}>
                        {item.UnitPrice?.toLocaleString('vi-VN')}₫
                      </td>
                      <td style={{ ...customStyles.tableCell, textAlign: 'right', fontWeight: '600', color: '#212529' }}>
                        {((item.UnitPrice || 0) * (item.Quantity || 0)).toLocaleString('vi-VN')}₫
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        <i className="fas fa-inbox fa-2x mb-2 d-block" style={{ opacity: 0.3 }}></i>
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div style={customStyles.totalSection}>
            <div className="d-flex align-items-center">
              <i className="fas fa-calculator me-3 fs-4"></i>
              <span style={customStyles.totalText}>Tổng thanh toán:</span>
            </div>
            <div className="d-flex align-items-center">
              <span style={{ ...customStyles.totalText, fontSize: '1.5rem' }}>
                {invoice.TotalAmount?.toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={customStyles.modalFooter}>
          <button
            style={customStyles.actionBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#343a40';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#212529';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="fas fa-times"></i>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;