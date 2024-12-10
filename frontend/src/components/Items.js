import React, { useState, useEffect } from "react";
import "./Items.css";
import { toast } from 'react-toastify';

export default function Items() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category filter
  const [items, setItems] = useState([]); // State for items

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = () => {
    fetch('http://localhost:8000/api/getallcategories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const fetchItems = () => {
    fetch('http://localhost:8000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  };

  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
  };

  const handleCancelCategoryClick = () => {
    setShowCategoryForm(false);
  };

  const handleAddCategory = () => {
    const categoryData = {
      name: document.getElementById('category-name').value,
      description: document.getElementById('category-description').value,
    };

    fetch('http://localhost:8000/api/addcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          toast.success('Category added successfully!');
          fetchCategories();
        } else {
          toast.error('Failed to add category!');
        }
        console.log(data);
      })
      .catch(error => {
        toast.error('An error occurred!');
        console.error('Error:', error);
      });
  };

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="items-content">
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
                <button
                  type="button"
                  className="add-category-button"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="cancel-category-button"
                  onClick={handleCancelCategoryClick}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="items-header">
            <h1>Items</h1>
            <div className="items-actions">
              <button
                className="items-category-button"
                onClick={handleAddCategoryClick}
              >
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
                <input
                  type="text"
                  id="search-item"
                  placeholder="Enter item name"
                />
              </div>
              <div className="items-category-filter">
                <label htmlFor="category-filter">Filter by Category:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.stockQuantity}</td>
                    <td>${item.unitPrice}</td>
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
