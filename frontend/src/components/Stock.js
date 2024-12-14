import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Stock.css';

export default function Stock() {
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("all"); // State for selected category filter
  const [searchCategory, setSearchCategory] = useState(""); // State for category search
  const [searchBrand, setSearchBrand] = useState(""); // State for brand search
  const [brands, setBrands] = useState([]);
  const [selecteFilterdBrand, setSelectedFilterBrand] = useState("all");
  const [searchItem, setSearchItem] = useState(""); // State for item search
  const [allItems, setAllItems] = useState([]); // All items fetched from the server
  const [displayedItems, setDisplayedItems] = useState([]); // Filtered items for

  const navigate = useNavigate();

  const viewItemDetails = (item) => {
    const variantId = item.attributes && item.attributes.variant_id
                    ? item.attributes.variant_id
                    : "No Variant";
    
    // Navigate to the item-details route with itemId and variantId
    navigate(`/item-details/${item.id}/${variantId}`, { state: { item } });
    
    console.log("Item ID:", item.id);
    console.log("Variant ID:", variantId);
};

  

  useEffect(() => {
        // Fetch items from the server
        const fetchItems = async () => {
          try {
            const response = await fetch("http://localhost:8000/api/getallitems");
            const data = await response.json();
            setAllItems(data.items); // Assuming `data.items` contains the list of items with variants
            setDisplayedItems(data.items); // Initially display all items
            
          } catch (error) {
            console.error("Error fetching items:", error);
          }
        };
  
        fetchItems();
      }, []);

      useEffect(() => {
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
      
        fetchCategories();
      }, []);
      

       useEffect(() => {
          const filtered = allItems.flatMap((item) =>
            item.variants
              .filter((variant) => {
                // Exclude the `variant_id` from the attributes when combining them into a string
                const variantAttributes = Object.entries(variant.attributes || {})
                  .filter(([key]) => key !== "variant_id") // Ignore the `variant_id`
                  .map(([_, value]) => value)
                  .join(' ')
                  .toLowerCase();
                
                // Convert item name and search query to lowercase for case-insensitive comparison
                const itemName = item.name.toLowerCase();
                const searchQuery = searchItem.toLowerCase();
        
        
                // Concatenate item name and variant attributes for comparison
                const combinedAttributes = `${variantAttributes} ${itemName} `;
        
                // Check if the search query matches the combined string
                const matchesSearch =
                  searchItem === "" || combinedAttributes.includes(searchQuery);
        
                // Ensure the variant matches the selected category and brand
                const matchesCategory =
                  selectedFilterCategory === "all" ||
                  categories.find((category) => category.id === item.category_id)?.name === selectedFilterCategory;
        
                const matchesBrand =
                  selecteFilterdBrand === "all" || item.brand === selecteFilterdBrand;


        
                return matchesSearch && matchesCategory && matchesBrand;
              })
              .map((variant, index) => ({
                ...item,
                variantIndex: index + 1,
                attributes: variant.attributes,
                sellPrice: variant.sell_price,
                marketPrice: variant.market_price,
                stockAmount: variant.stock_amount,
              }))
          );
        
          setDisplayedItems(filtered);
        }, [searchItem, selectedFilterCategory, selecteFilterdBrand, allItems]);

        
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
                <div className="stock-search-filter">
                  <label htmlFor="search-item">Search Item</label>
                  <input
                    type="text"
                    id="search-item"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="stock-category-filter">
                  <label htmlFor="category-filter">Filter by Category:</label>
                  <select
                    id="category-filter"
                    value={selectedFilterCategory}
                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
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
                <div className="stock-brand-filter">
                  <label htmlFor="brand-filter">Filter by Brand:</label>
                  <select
                    id="brand-filter"
                    value={selecteFilterdBrand}
                    onChange={(e) => setSelectedFilterBrand(e.target.value)}
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
                    <th>Item ID</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Item Name</th>
                    <th>Total Stock Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item, index) => {
                    const variantId = item.attributes && item.attributes.variant_id
                    ? item.attributes.variant_id
                    : "No Variant";
                    
                    const itemAttributes = item.attributes
                    ? Object.entries(item.attributes)
                        .filter(([key, value]) => key !== 'variant_id') // Exclude 'variant_id' from the attributes
                        .map(([key, value]) => value) // Get only the values
                        .join(' ') // Combine attribute values with space
                    : '';

          
                    const itemNameWithAttributes = `${itemAttributes} ${item.name}`.trim(); // Combine and trim any extra spaces
          
                    return (
                      
                      <tr key={index}>
                        <td>{variantId}</td>
                        <td>{categories.find(category => category.id === item.category_id)?.name || 'Unknown'}</td>
                        <td>{item.brand}</td>
                        <td><strong>{itemNameWithAttributes}</strong></td> {/* Display combined name */}
                        
                        <td>
                          <div
                            className="stock-quantity-view"
                            style={{
                              backgroundColor:
                                item.stockAmount < 10
                                  ? "#ffcccc" // Red for low stock
                                  : item.stockAmount < 50
                                  ? "#ffffcc" // Yellow for medium stock
                                  : "#ccffcc", // Green for high stock
                              color:
                                item.stockAmount < 10
                                  ? "#bc0000" // Red for low stock
                                  : item.stockAmount < 50
                                  ? "#999900" // Dark yellow for medium stock
                                  : "#006600", // Dark green for high stock
                            }}
                          >
                            {item.stockAmount}
                          </div>
                        </td>

                       
                        <td><button className="stock-view-button" onClick={() => viewItemDetails(item)}>View</button></td>

                      </tr>
                    );
                  })}
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
