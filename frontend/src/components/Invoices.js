import React from 'react';
import './Invoices.css';

export default function Invoices() {
  return (
    <div className="invoices-content">
      <div className="header">
        <h1>Invoice List</h1>
        <div className="actions">
          <button className="export-button"><i class="fas fa-file-export"></i> Export</button>
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
        <button className="search-button"><i class="fas fa-search"></i> Search</button>
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
            <th>Sl</th>
            <th>Invoice No</th>
            <th>Purchase Id</th>
            <th>Manufacturer Name</th>
            <th>Date</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>27456546</td>
              <td>8984086567</td>
              <td>Beximco</td>
              <td>2022-12-24</td>
              <td>$7,300.00</td>
              <td>
                <div className="dropdown">
                  <button className="action-button">⋮</button>
                  <div className="dropdown-content">
                    <button>View data</button>
                    <button>Download data</button>
                    <button>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button><i class="fas fa-arrow-left"></i></button>
        <span>1</span>
        <button><i class="fas fa-arrow-right"></i></button>
      </div>
      </div>
    </div>

  );
}
