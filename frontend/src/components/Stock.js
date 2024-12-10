import React from 'react';
import './Stock.css';

export default function Stock() {
  return (
    <div className="stock-content">
      <div className="stock-header">
        <h1>Stock List</h1>
        <div className="stock-actions">
        <button className="stock-add-button"><i className="icon fas fa-plus-circle"></i> Stock Entry (Bill)</button>
          
        </div>
      </div>

      <div className='stock-table-content'>
        <div className="stock-filters">
          <div className="stock-date-filter">
            <label>Start Date</label>
            <input type="date" />
          </div>
          <div className="stock-date-filter">
            <label>End Date</label>
            <input type="date" />
          </div>
          <button className="stock-search-button"><i className="fas fa-search"></i> Search</button>
          <div className="stock-entry-selector">
            <label htmlFor="stock-entries">Show:</label>
            <select id="stock-entries" name="stock-entries">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <table className="stock-table">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Stock ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>ST-{index + 1000}</td>
                <td>Item {index + 1}</td>
                <td>{(index + 1) * 10}</td>
                <td>2022-12-24</td>
                <td>${(index + 1) * 100.0}</td>
                <td>
                  <div className="stock-dropdown">
                    <button className="stock-action-button">⋮</button>
                    <div className="stock-dropdown-content">
                      <button>View details</button>
                      <button>Update</button>
                      <button>Delete</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="stock-pagination">
          <button><i className="fas fa-arrow-left"></i></button>
          <span>1</span>
          <button><i className="fas fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  );
}
