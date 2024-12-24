import React, { useEffect, useState } from 'react';
import './Invoices.css';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  
  // Fetch invoices from the API when the component mounts
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/getallinvoices'); // API endpoint to get invoices
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices); // Assuming the response has an 'invoices' field
        } else {
          console.error("Error fetching invoices");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    
    fetchInvoices();
  }, []);

  return (
    <div className="invoices-content">
      <div className="header">
        <h1>Invoice List</h1>
        <div className="actions">
          <button className="export-button"><i className="fas fa-file-export"></i> Export</button>
          <button 
            className="add-button" 
            onClick={() => window.open('/addinvoice', '_blank')}
          >
            <i className="fas fa-file-invoice"></i> Add Invoice
          </button>
        </div>
      </div>

      <div className='invoice-table-content'>
        <div className="filters">
          <div className="date-filter">
            <label>Start Date</label>
            <input type="date" />
          </div>
          <div className="date-filter">
            <label>End Date</label>
            <input type="date" />
          </div>
          <button className="search-button"><i className="fas fa-search"></i> Search</button>
          <div className="entry-selector">
            <label htmlFor="entries">Show:</label>
            <select id="entries" name="entries">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <table className="purchase-table">
          <thead>
            <tr>
              <th>Invoice Id</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer_name}</td>
                  <td>{invoice.invoice_date}</td>
                  <td><strong>Rs {invoice.total_amount}</strong></td>
                  <td>
                  <button
                  onClick={() => window.open(`/updateinvoice/${invoice.id}`, '_blank')}
                  className="invoice-view-button"
                >
                  View
                </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button><i className="fas fa-arrow-left"></i></button>
          <span>1</span>
          <button><i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  );
}
