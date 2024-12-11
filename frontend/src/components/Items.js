import React, { useState, useEffect } from "react";
import "./Items.css";
import { toast } from 'react-toastify';

export default function Items() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const [showBrandForm, setShowBrandForm] = useState(false); // State for brand form visibility
  const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category filter
  const [items, setItems] = useState([]); // State for items
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");

  useEffect(() => {
    fetchCategories();
    fetchBrands(); // Fetch brands as well
    //fetchItems();
}, []);

const fetchCategories = () => {
  fetch('http://localhost:8000/api/getallcategories', {
      method: 'GET',
      credentials: 'include', // Include cookies automatically
  })
      .then(response => response.json())
      .then(data => {
          if (Array.isArray(data.categories)) {
              setCategories(data.categories); // Set the data if it's an array
          } else {
              console.error('Invalid categories data:', data.categories);
              setCategories([]); // Set to empty array if data is invalid
          }
      })
      .catch(error => {
          console.error('Error fetching categories:', error);
          setCategories([]); // Ensure categories is still an array
      });
};


const fetchBrands = () => {
  fetch('http://localhost:8000/api/getallbrands', {
      method: 'GET',
      credentials: 'include', // Include cookies automatically
  })
      .then(response => response.json())
      .then(data => {
          if (Array.isArray(data.brands)) {
              setBrands(data.brands); // Set the data if it's an array
          } else {
              console.error('Invalid brands data:', data.brands);
              setBrands([]); // Set to empty array if data is invalid
          }
      })
      .catch(error => {
          console.error('Error fetching brands:', error);
          setBrands([]); // Ensure brands is still an array
      });
};


  /*const fetchItems = () => {
    fetch('http://localhost:8000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  };*/

  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
  };

  const handleAddBrandClick = () => {
    setShowBrandForm(true);
    setShowCategoryForm(false); // Ensure category form is hidden
  };

  const handleCancelCategoryClick = () => {setShowCategoryForm(false);};
  const handleCancelBrandClick = () => setShowBrandForm(false);

  // Add Category function
const handleAddCategory = () => {
  const categoryData = {
      name: document.getElementById('category-name').value,
      description: document.getElementById('category-description').value,
  };

  fetch('http://localhost:8000/api/addcategories', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies automatically
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

// Add Brand function
const handleAddBrand = () => {
  const brandData = {
      name: document.getElementById('brand-name').value,
      description: document.getElementById('brand-description').value,
  };

  fetch('http://localhost:8000/api/addbrand', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies automatically
      body: JSON.stringify(brandData),
  })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              toast.success('Brand added successfully!');
              fetchBrands();
          } else {
              toast.error('Failed to add brand!');
          }
      })
      .catch(error => {
          toast.error('An error occurred!');
          console.error('Error:', error);
      });
};

  
  

  const filteredItems = items.filter(item => {
  const categoryMatch =
    selectedCategory === "all" || item.category === selectedCategory;
  const brandMatch = selectedBrand === "all" || item.brand === selectedBrand;

  return categoryMatch && brandMatch;
});


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
      ) : showBrandForm ? (
        <div className="brand-form-content">
          <h2>Add New Brand</h2>
          <div className="brand-form">
            <form>
              <div className="brand-form-group">
                <label htmlFor="brand-name">Brand Name</label>
                <input
                  type="text"
                  id="brand-name"
                  placeholder="Enter brand name"
                  className="brand-input"
                />
              </div>
              <div className="brand-form-group">
                <label htmlFor="brand-description">Brand Description</label>
                <textarea
                  id="brand-description"
                  placeholder="Enter brand description"
                  className="brand-description-input"
                  rows="4"
                ></textarea>
              </div>
              <div className="brand-form-actions">
                <button
                  type="button"
                  className="add-brand-button"
                  onClick={handleAddBrand}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="cancel-brand-button"
                  onClick={handleCancelBrandClick}
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

              <button
                className="items-brand-button"
                onClick={handleAddBrandClick}
              >
               <i className="fas fa-tag"></i> Add Brand

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
                  {Array.isArray(categories) &&
                      categories.map((category, index) => (
                          <option key={index} value={category.name}>
                              {category.name}
                          </option>
                      ))}
              </select>
          </div>


          <div className="items-brand-filter">
          <label htmlFor="brand-filter">Filter by Brand:</label>
          <select
              id="brand-filter"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
          >
              <option value="all">All</option>
              {Array.isArray(brands) &&
                  brands.map((brand, index) => (
                      <option key={index} value={brand.name}>
                          {brand.name}
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
