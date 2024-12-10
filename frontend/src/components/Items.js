import React, { useState } from "react";
import "./Items.css";

export default function Items() {
  // State to manage whether to show category form or item list
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Toggle between category form and item list
  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
  };

  const handleCancelCategoryClick = () => {
    setShowCategoryForm(false);
  };

  const handleAddCategory = () => {
    // Add category logic here
    console.log("Category added!");
    setShowCategoryForm(false);
  };

  return (
    <div className="items-content">
      

      {/* Conditionally render the category form or the item list */}
      {showCategoryForm ? (
        <div className="category-form-content">
          <h2>Add New Category</h2>
       <div className="category-form">
       
       <form>
         <div className="category-form-group">
           <label htmlFor="category-name">Category Name</label>
           <input
             type="text"
             id="category-name"
             placeholder="Enter category name"
             className="category-input"
           />
         </div>
         <div className="category-form-group">
          <label htmlFor="category-description">Category Description</label>
          <textarea
            id="category-description"
            placeholder="Enter category description"
            className="category-description-input"
            rows="4"
          ></textarea>
        </div>

         <div className="category-form-actions">
           <button type="button" className="add-category-button" onClick={handleAddCategory}>
             Add
           </button>
           <button type="button" className="cancel-category-button" onClick={handleCancelCategoryClick}>
             Cancel
           </button>
         </div>
       </form>
     </div>
     </div>
     
     
      
      ) : (
        <div><div className="items-header">
        <h1>Items</h1>
        <div className="items-actions">
          <button className="items-category-button" onClick={handleAddCategoryClick}>
            <i className="fas fa-folder-plus"></i> Add Category
          </button>
          <button className="items-add-button">
            <i className="fas fa-plus-circle"></i> Add Item
          </button>
        </div>
      </div>
        <div className="items-table-content">
          <div className="items-filters">
            <div className="items-search-filter">
              <label htmlFor="search-item">Search Item</label>
              <input type="text" id="search-item" placeholder="Enter item name" />
            </div>
            <div className="items-entry-selector">
              <label htmlFor="items-entries">Show:</label>
              <select id="items-entries" name="items-entries">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          <table className="items-table">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock Quantity</th>
                <th>Unit Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>IT-{index + 1000}</td>
                  <td>Item {index + 1}</td>
                  <td>Category {Math.ceil((index + 1) / 3)}</td>
                  <td>{(index + 1) * 15}</td>
                  <td>${(index + 1) * 25.0}</td>
                  <td>
                    <div className="items-actions-dropdown">
                      <button className="items-action-button">⋮</button>
                      <div className="items-dropdown-content">
                        <button>Edit</button>
                        <button>Update</button>
                        <button>Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="items-pagination">
            <button>
              <i className="fas fa-arrow-left"></i>
            </button>
            <span>1</span>
            <button>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
