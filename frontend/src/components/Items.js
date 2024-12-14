import React, { useState, useEffect } from "react";
import "./Items.css";
import { toast } from 'react-toastify';

export default function Items() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categories, setCategories] = useState([]); // State for categories
  const [showBrandForm, setShowBrandForm] = useState(false); // State for brand form visibility
  const [showItemForm, setShowItemForm] = useState(false); // State for brand form visibility
  const [selectedCategory, setSelectedCategory] = useState("all"); // State for selected category filter
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("all"); // State for selected category filter
  const [items, setItems] = useState([]); // State for items
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selecteFilterdBrand, setSelectedFilterBrand] = useState("all");
  const [attributes, setAttributes] = useState([]);
  const [itemAttributes, setItemAttributes] = useState([]);
  const [viewMode, setViewMode] = useState("items"); // Default to "items"
  const [searchItem, setSearchItem] = useState(""); // State for item search
  const [searchCategory, setSearchCategory] = useState(""); // State for category search
  const [searchBrand, setSearchBrand] = useState(""); // State for brand search
  const [variants, setVariants] = useState([]);
  const [itemName, setItemName] = useState("");
  const [allItems, setAllItems] = useState([]); // All items fetched from the server
  const [displayedItems, setDisplayedItems] = useState([]); // Filtered items for 



  useEffect(() => {
    fetchCategories();
    fetchBrands(); // Fetch brands as well
    //fetchItems();
}, []);

const addVariant = () => {
  const newVariant = {
    attributes: {},
    sellPrice: "",
    marketPrice: "",
  };
  setVariants([...variants, newVariant]);
};

const removeVariant = () => {
  if (variants.length > 0) {
    setVariants(variants.slice(0, variants.length - 1));
  }
};
const handlePriceChange = (e, index, type) => {
  const updatedVariants = [...variants];
  if (type === "sellPrice") {
    updatedVariants[index].sellPrice = e.target.value;
  } else if (type === "marketPrice") {
    updatedVariants[index].marketPrice = e.target.value;
  }
  setVariants(updatedVariants);
};

    //Display items 
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


  

  const handleAddItemClick = () => {
    setShowCategoryForm(false);
    setShowBrandForm(false);
    setShowItemForm(true); // Ensure category form is hidden
  };


  const handleAddCategoryClick = () => {
    setShowCategoryForm(true);
    setShowBrandForm(false);
    setShowItemForm(false); // Ensure category form is hidden
  };

  const handleAddBrandClick = () => {
    setShowBrandForm(true);
    setShowCategoryForm(false);
    setShowItemForm(false); // Ensure category form is hidden
  };

  const handleCancelCategoryClick = () => {setShowCategoryForm(false);};
  const handleCancelBrandClick = () => setShowBrandForm(false);
  const handleCancelItemClick = () => setShowItemForm(false);

  // Add Category function
  const handleAddCategory = () => {
      const categoryData = {
        name: document.getElementById("category-name").value,
        description: document.getElementById("category-description").value,
        attributes, // Include the attributes state here
      };
    
      fetch("http://localhost:8000/api/addcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies automatically
        body: JSON.stringify(categoryData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast.success("Category added successfully!");
            fetchCategories();
          } else {
            toast.error("Failed to add category!");
          }
        })
        .catch((error) => {
          toast.error("An error occurred!");
          console.error("Error:", error);
        });
    };
    

//Attributes

    const handleAddAttribute = () => {
      setAttributes([...attributes, ""]);
    };

    const handleAttributeChange = (e, variantIndex, attributeName) => {
      const updatedVariants = [...variants];  // Create a copy of variants to avoid direct mutation
      updatedVariants[variantIndex].attributes = {
        ...updatedVariants[variantIndex].attributes,  // Preserve other attributes
        [attributeName]: e.target.value,  // Update the specific attribute
      };
      setVariants(updatedVariants);  // Update the state with the new value
    };

    const handleRemoveAttribute = (index) => {
      const updatedAttributes = attributes.filter((_, i) => i !== index);
      setAttributes(updatedAttributes);
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

  //Add items
  const handleSaveItem = async () => {
    const itemData = {
      name: itemName,
      category_id: selectedCategory,
      brand: selectedBrand,
      variants: variants.map(variant => ({
        attributes: variant.attributes,
        sell_price: variant.sellPrice,
        market_price: variant.marketPrice,
      })),
    };



    try {
      const response = await fetch('http://localhost:8000/api/additems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies automatically
        body: JSON.stringify(itemData),
      });
      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Validation Error: ${errorData.message}`);
        console.error('Validation Errors:', errorData.errors);
        return;
      }
      

      if (data.success) {
        toast.success('Item added successfully!');
      } else {
        toast.error('Failed to add item!');
      }
    } catch (error) {
      toast.error('An error occurred while adding the item!');
      console.error('Error saving item:', error);
    }
  };

  

// Filter items based on search, category, and brand
    useEffect(() => {
      const filtered = allItems.filter((item) => {
        // Ensure you're comparing category IDs or a specific property
        const matchesCategory =
          selectedFilterCategory === "all" || categories.find(category => category.id === item.category_id)?.name === selectedFilterCategory;
          

        const matchesBrand =
        selecteFilterdBrand === "all" || item.brand === selecteFilterdBrand;

        const matchesSearch =
        searchItem === "" || 
        item.variants.some(variant => {
          // Combine variant attributes into a searchable string
          const variantAttributes = Object.values(variant.attributes || {}).join(' ');
          const searchableString = `${variantAttributes} ${item.name}`;
          return searchableString.toLowerCase().includes(searchItem.toLowerCase());
        });
        



        return matchesCategory && matchesBrand && matchesSearch;
      });

      // Flatten variants into separate rows
      const itemsWithVariants = filtered.flatMap((item) =>
        item.variants.map((variant, index) => ({
          ...item,
          variantIndex: index + 1,
          attributes: variant.attributes,
          sellPrice: variant.sell_price,
          marketPrice: variant.market_price,
          stockAmount: variant.stock_amount,
        }))
      );

      setDisplayedItems(itemsWithVariants);
    }, [searchItem, selectedFilterCategory, selecteFilterdBrand, allItems]);


  
  


const filteredCategories = categories.filter(category =>
  category.name.toLowerCase().includes(searchCategory.toLowerCase())
);

const filteredBrands = brands.filter(brand =>
  brand.name.toLowerCase().includes(searchBrand.toLowerCase())
);

  return (
    <div className="items-content">
      {showCategoryForm ? (
        <div className="category-form-content">
          <h2>Add New Category</h2>
          <p>Items \ Add New Category</p>
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
              <div className="category-form-group">
              <label htmlFor="category-attributes">Attributes</label>
              <div id="category-attributes" className="attributes-section">
                {attributes.map((attribute, index) => (
                  <div key={index} className="attribute-row">
                    <input
                      type="text"
                      placeholder="Attribute name"
                      value={attribute}
                      onChange={(e) => handleAttributeChange(e, index)}
                      className="category-attribute-input"
                    />
                    <button
                    type="button"
                    className="remove-attribute-button"
                    onClick={() => handleRemoveAttribute(index)}
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-attribute-button"
                  onClick={handleAddAttribute}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
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
          <p>Items \ Add New Brand</p>
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
      ) : showItemForm ? (
        <div className="item-form-content">
          <h2>Add New Item</h2>
          <p>Items \ Add New Item</p>
          <div className="item-form">
            <form>
              {/* Item Name */}
              <div className="item-form-group">
                <label htmlFor="item-name">Item Name</label>
                <input
                  type="text"
                  id="item-name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)} // Update state using setItemName
                  placeholder="Enter item name"
                  className="item-input"
                />
              </div>

              {/* Category Dropdown */}
              <div className="item-form-group-category">
                <label htmlFor="category-dropdown">Category</label>
                <select
                  id="category-dropdown"
                  value={selectedCategory}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedCategoryObj = categories.find(
                      (category) => category.id.toString() === selectedId
                    );
                    setSelectedCategory(selectedId);
                    setItemAttributes(selectedCategoryObj?.attributes || []);
                  }}
                  className="item-dropdown"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Dropdown */}
              <div className="item-form-group-brand">
                <label htmlFor="brand-dropdown">Brand</label>
                <select
                  id="brand-dropdown"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="item-dropdown"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand, index) => (
                    <option key={index} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Attributes */}
        {itemAttributes.length > 0 && (
          <div className="variants-section">
            <h3>Variants</h3>

            {/* Variants List */}
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="variant-item">
                {/* Attribute Inputs for the Variant */}
                <div className="variant-attributes">
                  {itemAttributes.map((attribute, index) => (
                    <div key={index} className="item-attribute-row">
                      <label>{attribute.name}</label>
                      <input
                        type="text"
                        value={variant.attributes[attribute.name] || ""}
                        onChange={(e) => handleAttributeChange(e, variantIndex, attribute.name)}
                        placeholder={`Enter ${attribute.name}`}
                        className="item-attribute-input"
                      />
                    </div>
                  ))}
                  <div className="variant-price-group">
                    <label htmlFor={`variant-sell-price-${variantIndex}`}>
                      Sell Price (Rs.)
                    </label>
                    <input
                      type="number"
                      id={`variant-sell-price-${variantIndex}`}
                      value={variant.sellPrice || ""}
                      onChange={(e) => handlePriceChange(e, variantIndex, "sellPrice")}
                      className="item-input"
                      onWheel={(e) => e.target.blur()} // Prevent scrolling
                      placeholder="Enter sell price"
                    />
                  </div>

                  <div className="variant-price-group">
                    <label htmlFor={`variant-market-price-${variantIndex}`}>
                      Market Price (Rs.)
                    </label>
                    <input
                      type="number"
                      id={`variant-market-price-${variantIndex}`}
                      value={variant.marketPrice || ""}
                      onChange={(e) => handlePriceChange(e, variantIndex, "marketPrice")}
                      className="item-input"
                      onWheel={(e) => e.target.blur()} // Prevent scrolling
                      placeholder="Enter market price"
                    />
                  </div>
                </div>

                {/* Price Inputs for the Variant */}
                <div className="variant-prices">
                  
                </div>
              </div>
            ))}
            {/* Add/Remove Variant Buttons */}
            <div className="add-remove-variant-buttons">
              <button
                type="button"
                onClick={() => addVariant()}
                className="add-variant-button"
              >
                Add +
              </button>
              <button
                type="button"
                onClick={() => removeVariant()}
                className="remove-variant-button"
              >
                Remove x
              </button>
            </div>
          </div>
        )}


              {/* Actions */}
              <div className="item-form-actions">
                <button
                  type="button"
                  className="add-item-button"
                  onClick={handleSaveItem}
                >
                  Add Item
                </button>
                <button
                  type="button"
                  className="cancel-item-button"
                  onClick={handleCancelItemClick}
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


              <button 
              className="items-add-button"
              onClick={handleAddItemClick}
              >
                <i className="fas fa-plus-circle"></i> Add Item
              </button>
            </div>
          </div>
          <div className="view-switch">
            <button onClick={() => setViewMode("items")} className={viewMode === "items" ? "active" : ""}>
                Items
            </button>
            <button onClick={() => setViewMode("categories")} className={viewMode === "categories" ? "active" : ""}>
                Categories
            </button>
            <button onClick={() => setViewMode("brands")} className={viewMode === "brands" ? "active" : ""}>
                Brands
            </button>
        </div>

        {viewMode === "items" && (
            <div className="items-view">
            <div className="items-table-content">
              <div className="items-filters">
                <div className="items-search-filter">
                  <label htmlFor="search-item">Search Item</label>
                  <input
                    type="text"
                    id="search-item"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="items-category-filter">
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
                <div className="items-brand-filter">
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
                    <th>Item Count</th>
                    <th>Item ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Stock Quantity</th>
                    <th>Sell Price</th>
                    <th>Market Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map((item, index) => {
                    // Combine the attributes with the item name dynamically
                    const itemAttributes = item.attributes
                      ? Object.values(item.attributes).join(' ') // Combine attribute values with space
                      : '';
          
                    const itemNameWithAttributes = `${itemAttributes} ${item.name}`.trim(); // Combine and trim any extra spaces
          
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.variantId}</td>
                        <td><strong>{itemNameWithAttributes}</strong></td> {/* Display combined name */}
                        <td>{categories.find(category => category.id === item.category_id)?.name || 'Unknown'}</td>
                        <td>{item.brand}</td>
                        <td>{item.stockAmount}</td>
                        <td><div className="sell-price-view">Rs.{item.sellPrice}</div></td>
                        <td><div className="market-price-view">Rs.{item.marketPrice}</div></td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          
          )}

          {viewMode === "categories" && (
            <div className="categories-view">
              <div className="categories-table-content">
                <div className="categories-header">
                  <div className="items-search-filter">
                    <label htmlFor="search-category">Search Category</label>
                    <input
                      type="text"
                      id="search-category"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      placeholder="Enter category name"
                    />
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
                      <th>ID</th>
                      <th>Name</th>
                      <th>Attributes</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.attributes?.map(attribute => attribute.name).join(", ")}</td> {/* Correct way to access attributes */}
                        <td>{category.description}</td>
                        <td>...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === "brands" && (
            <div className="brands-view">
              <div className="brands-table-content">
                <div className="brands-header">
                  <div className="items-search-filter">
                    <label htmlFor="search-brand">Search Brand</label>
                    <input
                      type="text"
                      id="search-brand"
                      value={searchBrand}
                      onChange={(e) => setSearchBrand(e.target.value)}
                      placeholder="Enter brand name"
                    />
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
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.map((brand) => (
                      <tr key={brand.id}>
                        <td>{brand.id}</td>
                        <td>{brand.name}</td>
                        <td>{brand.description}</td>
                        <td>...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        

          
        </div>
      )}
    </div>
  );
}
