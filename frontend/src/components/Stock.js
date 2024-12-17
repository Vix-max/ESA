import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Stock.css';

export default function Stock() {
  const [categories, setCategories] = useState([]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("all");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [selecteFilterdBrand, setSelectedFilterBrand] = useState("all");
  const [searchItem, setSearchItem] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemDetails, setItemDetails] = useState(null);  // New state for item details view
  const [variantDetails, setVariantDetails] = useState(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockDetails, setStockDetails] = useState([]); // Holds stock details



  const navigate = useNavigate();

  const fetchStockDetails = async (itemId, variantId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/items/${itemId}/variants/${variantId}/stocks`);
      const data = await response.json();
  
      if (data.success) {
       
        setStockDetails(data.stocks); // Add stock details to state
        
      } else {
        console.error('Failed to fetch stock details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }  finally {
      setIsLoading(false);
    }
  };
  
  // Call fetchStockDetails when the viewItemDetails function runs
  const viewItemDetails = (item) => {
    const variantId = item.attributes?.variant_id || "No Variant";
  
    const itemAttributes = item.attributes
      ? Object.entries(item.attributes)
          .filter(([key]) => key !== 'variant_id')
          .map(([key, value]) => value)
          .join(' ')
      : '';
  
    const itemNameWithAttributes = `${itemAttributes} ${item.name}`.trim();
    console.log("Stock data: ", variantId);
    setItemDetails({
      ...item,
      variantId,
      nameWithAttributes: itemNameWithAttributes,
    });
  
    // Fetch stock details for the selected item and variant
    fetchStockDetails(item.id, variantId);
  };
  
  


  useEffect(() => {
        // Fetch items from the server
        const fetchItems = async () => {
          try {
            setIsLoading(true); // Start loading
            const response = await fetch("http://localhost:8000/api/getallitems");
            const data = await response.json();
            setAllItems(data.items); 
            setDisplayedItems(data.items);
          } catch (error) {
            console.error("Error fetching items:", error);
          } finally {
            setIsLoading(false); // End loading
          }
          
        };
  
        fetchItems();
      }, []);

  useEffect(() => {
    const fetchCategories = () => {
      fetch('http://localhost:8000/api/getallcategories', {
          method: 'GET',
          credentials: 'include',
      })
          .then(response => response.json())
          .then(data => {
            if (Array.isArray(data.categories)) {
                setCategories(data.categories); 
            } else {
                console.error('Invalid categories data:', data.categories);
                setCategories([]); 
            }
        })
          .catch(error => {
              console.error('Error fetching categories:', error);
              setCategories([]); 
          });
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = allItems.flatMap((item) =>
      item.variants
        .filter((variant) => {
          const variantAttributes = Object.entries(variant.attributes || {})
            .filter(([key]) => key !== "variant_id")
            .map(([_, value]) => value)
            .join(' ')
            .toLowerCase();

          const itemName = item.name.toLowerCase();
          const searchQuery = searchItem.toLowerCase();

          const combinedAttributes = `${variantAttributes} ${itemName} `;
          const matchesSearch = searchItem === "" || combinedAttributes.includes(searchQuery);
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
          averageCost: variant.average_cost,
          stockAmount: variant.stock_amount,
        }))
    );

    setDisplayedItems(filtered);
  }, [searchItem, selectedFilterCategory, selecteFilterdBrand, allItems]);


  //Add specific stocks
  const handleItemStockSubmit = async (e) => {
    e.preventDefault();

    const stockData = {
        item_id: itemDetails.id,
        variant_id: itemDetails.variantId,
        stock_date	: e.target["add-item-stock-date"].value,
        seller: e.target["add-item-stock-seller"].value,
        buy_price: parseFloat(e.target["add-item-stock-price"].value),
        quantity: parseInt(e.target["add-item-stock-quantity"].value),
    };


    try {
        const response = await fetch("http://localhost:8000/api/additemstock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Include cookies automatically
            body: JSON.stringify(stockData),
        });

        if (response.ok) {
            const data = await response.json();
             toast.success('Stock added successfully!');
             fetchStockDetails(itemDetails.id, itemDetails.variantId);
            setIsAddingStock(false);
            // Update stock data here if needed
        } else {
           toast.error('Failed to add stock!');
        }
    } catch (error) {
        console.error("Error adding stock:", error);
    }
};


  

  return (
    <div className="stock-content">
      
      
      <div className="stock-inner-content">
        {
          // Seleced Item's Stock Details
        }
        {itemDetails ? (
           <div className="item-stock-details">
            {/*Add new Stock to Specific items*/}
            {isAddingStock ? (
              <div className="add-item-stock-form">
                <h2>Add New Stock</h2>
                <p>Stock \ Add New Item</p>
                <form onSubmit={handleItemStockSubmit}>
                  {/* Add your form fields here */}
                  <div className="stock-item-input-group">
                  <label htmlFor="add-item-stock-date">Stock Added Date:</label>
                  <input type="date" id="add-item-stock-date" name="add-item-stock-date" />
                  </div>

                  <div className="stock-item-input-group">
                  <label htmlFor="add-item-stock-seller">Stock Seller (Supplier):</label>
                  <input type="text" id="add-item-stock-seller" name="add-item-stock-seller" placeholder="Enter the Seller"/>
                  </div>

                  <div className="stock-item-input-group">
                  <label htmlFor="add-item-stock-price">Buy Price:</label>
                  <input type="number" id="add-item-stock-price" name="add-item-stock-price" placeholder="Enter Buy Price"/>
                  </div>

                  <div className="stock-item-input-group">
                  <label htmlFor="add-item-stock-quantity">Quantity:</label>
                  <input type="number" id="add-item-stock-quantity" name="add-item-stock-quantity" placeholder="Enter Quantity" />
                  </div>
                  <div className="add-item-stock-actions">
                  <button type="submit" className="add-item-stock-button">Submit</button>
                  <button type="button" className="cancel-item-stock-button" onClick={() => setIsAddingStock(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              // Existing stock details
              <div className="item-stock-details-table">
                <div className="item-details-header">
                  <h2>
                    {itemDetails.brand} {itemDetails.nameWithAttributes} Stock
                  </h2>
                  <button
                    className="item-stock-add-button"
                    onClick={() => setIsAddingStock(true)}
                  >
                    <i className="icon fas fa-plus-circle"></i>
                  </button>
                </div>
                <h3>
                  Total Available Stock: <strong>{itemDetails.variant?.stock_amount}</strong>
                </h3>
                {isLoading ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : (
                <table className="items-stock-details-table">
                  <thead>
                    <tr>
                      <th>Stock ID</th>
                      <th>Stock Added Date</th>
                      <th>Stock Seller</th>
                      <th>Stock Buy Price</th>
                      <th>Available Stock Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockDetails.map((stock) => (
                      <tr key={stock.id}>
                        <td>{stock.id}</td>
                        <td>{stock.stock_date}</td>
                        <td>{stock.seller || "N/A"}</td>
                        <td>Rs. {stock.buy_price}</td>
                        <td>{stock.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}

                <div className="stock-back-div">
                  <button
                    className="stock-item-back-button"
                    onClick={() => setItemDetails(null)}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Stock List
                  </button>
                </div>
              </div>

            )}
           
         </div>
         
        ) : (
          <div>

          <div className="stock-header">
                  <h1>Stock List</h1>
                  <div className="stock-actions">
                  
                  <button 
                    className="stock-add-button" 
                    onClick={() => navigate('/admin-dashboard/stock-bill-entry')}
                  >
                    <i className="icon fas fa-plus-circle"></i> Stock Entry (Bill)
                  </button>

                    
                  </div>
                </div>
          
          <div className="stock-table-content">
            {
          // All the Items Stock Details
        }
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

            {isLoading ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : (       
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Item Name</th>
                  <th>Average Cost</th>
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
                        .filter(([key, value]) => key !== 'variant_id')
                        .map(([key, value]) => value)
                        .join(' ')
                    : '';

                  const itemNameWithAttributes = `${itemAttributes} ${item.name}`.trim();

                  return (
                    <tr key={index}>
                      <td>{variantId}</td>
                      <td>{categories.find(category => category.id === item.category_id)?.name || 'Unknown'}</td>
                      <td>{item.brand}</td>
                      <td><strong>{itemNameWithAttributes}</strong></td>
                      <td><div className="stock-average-cost">Rs {item.averageCost}</div></td>
                      <td>
                        <div
                          className="stock-quantity-view"
                          style={{
                            backgroundColor:
                              item.stockAmount < 10
                                ? "#ffcccc"
                                : item.stockAmount < 50
                                ? "#ffffcc"
                                : "#ccffcc",
                            color:
                              item.stockAmount < 10
                                ? "#bc0000"
                                : item.stockAmount < 50
                                ? "#999900"
                                : "#006600",
                          }}
                        >
                          {item.stockAmount}
                        </div>
                      </td>
                      
                      <td>
                        <button className="stock-view-button" onClick={() => viewItemDetails(item)}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
                  )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
