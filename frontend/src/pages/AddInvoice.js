import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddInvoice.css";

export default function AddInvoice() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [items, setItems] = useState([]);
    const [variants, setVariants] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState([]);
    const [customerName, setCustomerName] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // To track the search input
    const [filteredItems, setFilteredItems] = useState([]); // To store items filtered by the search
    const [filteredVariants, setFilteredVariants] = useState([]); // To store variants filtered by the search
    const searchContainerRef = useRef(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [invoiceEntries, setInvoiceEntries] = useState([
      { category: "", brand: "", item: "", variant: "", quantity: "", buyPrice: "", seller: "" },
      // ... more entries
    ]);







    const handleSearchInput = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
          if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target)
          ) {
            // Hide dropdown if click is outside the container
            setFilteredItems([]);
          }
        };
    
        document.addEventListener("click", handleOutsideClick);
    
        return () => {
          document.removeEventListener("click", handleOutsideClick);
        };
      }, []);
    

    // Fetch filtered items based on search query
useEffect(() => {
    if (searchQuery) {
      fetch(`http://localhost:8000/api/searchitems/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data.items)) {
              
            setFilteredItems(data.items);
            
          } else {
            setFilteredItems([]);
          }
        })
        .catch((error) => console.error("Error fetching filtered items:", error));
    } else {
      setFilteredItems([]);
    }
  }, [searchQuery]);
  

  
  const handleAddItem = (item, variant) => {
    const newRow = {
      category: item.category_name || "",
      brand: item.brand || "",
      item: item.id || "",
      items: [item], // Ensure items are set for the dropdown
      variants: item.variants || [], // Ensure variants are available for selection
      variantId: variant.id || "",
      variant: variant.formattedAttributes || "",
      marketPrice: variant.market_price || "",
      buyPrice: variant.average_cost || "",
      sellPrice: variant.sell_price || "",
      stockAmount: variant.stock_amount || "",
      quantity: 1,
      seller: "",
    };


    setSelectedItem(item.id); // Update selected item ID
    setInvoiceEntries((prevEntries) => [...prevEntries, newRow]);
    setSearchQuery("");
    setFilteredItems([]);
  };
  
  



  const handleVariantSelection = (index, variantId) => {
    const selectedVariant = invoiceEntries[index].variants.find((v) => v.id === parseInt(variantId));
    if (selectedVariant) {
      // Dynamically format attributes
      const formattedAttributes = Object.entries(selectedVariant.attributes || {})
      .filter(([key, value]) => key !== 'variant_id' && value !== undefined && value !== ''); 

      const formattedString = formattedAttributes.map(([key, value]) => value).join(" ");
        



        
  
      // Update the invoice entry with selected variant data
      const updatedEntries = [...invoiceEntries];
      updatedEntries[index] = {
        ...updatedEntries[index],
        variantId, // Update the variantId
        variant_attribute: formattedString, // Set formatted attributes
        marketPrice: selectedVariant.market_price,
        buyPrice: selectedVariant.average_cost,
        sellPrice: selectedVariant.sell_price,
        stockAmount: selectedVariant.stock_amount,
        quantity: 1,
      };
  
      setInvoiceEntries(updatedEntries);
      
    }
  };
  
  

  
  
  
  
  
  






  
    // Fetch categories
    useEffect(() => {
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
    }, []);
  
    // Fetch brands
    useEffect(() => {
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
    }, []);
  
    // Fetch items based on category and brand
    useEffect(() => {
      if (selectedCategory && selectedBrand) {
        fetch(`http://localhost:8000/api/items/${selectedCategory}/${selectedBrand}`)
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data.items)) {
              setItems(data.items); 
            } else {
              console.error("Invalid items data:", data.items);
              setItems([]); // Reset items if the response is invalid
            }
          })
          .catch((error) => {
            console.error("Error fetching items:", error);
            setItems([]); // Reset items in case of an error
          });
      } else {
        setItems([]); // Reset items if category or brand is not selected
      }
    }, [selectedCategory, selectedBrand]);
  
  
    // Fetch variants based on selectedItem
    useEffect(() => {
      if (selectedItem) {
        fetch(`http://localhost:8000/api/getvariantsbyitemID/${selectedItem}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success && Array.isArray(data.variants)) {
                
              const formattedVariants = data.variants.map((variant) => {
                const filteredAttributes = Object.entries(variant.attributes)
                  .filter(([key, value]) => key !== 'variant_id' && value !== undefined && value !== ''); 
    
                const formattedString = filteredAttributes.map(([key, value]) => value).join(" ");
                
                
                
    
                return {
                  ...variant,
                  formattedAttributes: formattedString,
                };
              });
    
              setVariants(formattedVariants);
            } else {
              console.error("Invalid variants data:", data);
              setVariants([]); 
            }
          })
          .catch((error) => {
            console.error("Error fetching variants:", error);
            setVariants([]); 
          });
      } else {
        setVariants([]); 
      }
    }, [selectedItem]);
    
    
  
    const handleAddRow = () => {
      setInvoiceEntries([
        ...invoiceEntries,
        { category: "", brand: "", item: "", variant: "", quantity: "", buyPrice: "", seller: "" },
      ]);
    };
  
    const handleRemoveRow = (index) => {
      const updatedEntries = invoiceEntries.filter((_, i) => i !== index);
      setInvoiceEntries(updatedEntries);
    };
  
    const handleChange = (index, field, value) => {
      const updatedEntries = [...invoiceEntries];
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };

      if (field === "category" || field === "brand") {
          updatedEntries[index].item = "";
          updatedEntries[index].variant = "";
          updatedEntries[index].variants = []; // Clear variants
          updatedEntries[index].items = []; // Clear items
          if (updatedEntries[index].category && updatedEntries[index].brand) {
              fetch(`http://localhost:8000/api/items/${updatedEntries[index].category}/${updatedEntries[index].brand}`)
                  .then((response) => response.json())
                  .then((data) => {
                      updatedEntries[index].items = data.items || [];
                      setInvoiceEntries(updatedEntries);
                  })
                  .catch((error) => console.error("Error fetching items:", error));
          }
      } else if (field === "item") {
          updatedEntries[index].variant = "";
          updatedEntries[index].variants = []; // Clear variants
          if(value){ // check if value has something before fetching
              fetch(`http://localhost:8000/api/getvariantsbyitemID/${value}`)
                  .then((response) => response.json())
                  .then((data) => {
                      updatedEntries[index].variants = data.variants || [];
                      setInvoiceEntries(updatedEntries);
                  })
                  .catch((error) => console.error("Error fetching variants:", error));
          }
      }

      setInvoiceEntries(updatedEntries);
  };

  const handleGenerateInvoice = async () => {
    if (!customerName || !invoiceDate || invoiceEntries.length === 0) {
        toast.error("Please fill all the details and add at least one item.");
        return;
    }

    // Calculate total amount for the invoice
    const totalAmount = invoiceEntries.reduce((total, entry) => {
        return total + (parseFloat(entry.quantity) * parseFloat(entry.sellPrice));
    }, 0);

    const invoiceData = {
      customerName,
      invoiceDate,
      invoiceEntries: invoiceEntries.map(entry => ({
          category: entry.category,
          brand: entry.brand,
          item: entry.item.toString(), // Ensure item is a string if necessary
          variant: entry.variantId.toString(),
          quantity: parseInt(entry.quantity), // Convert quantity to an integer
          buyPrice: parseFloat(entry.buyPrice), // Convert buyPrice to a number
          sellPrice: parseFloat(entry.sellPrice), // Convert sellPrice to a number
      })),
      totalAmount,  // Include the total amount in the request
    };

    console.log("Invoice data: ", invoiceData);

    try {
        const response = await fetch('http://localhost:8000/api/addinvoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies automatically
            body: JSON.stringify(invoiceData),
        });

        if (response.ok) {
            const data = await response.json();
            toast.success(data.message || "Invoice saved successfully!");

            // Pass data to the new tab for preview
            const previewData = {
                customerName,
                invoiceDate,
                invoiceEntries,
                totalAmount,  // Pass totalAmount to preview
            };

            const previewWindow = window.open(
                "/invoice-preview",
                "_blank" // Open in a new tab
            );

            if (previewWindow) {
                previewWindow.previewData = previewData; // Share data with the new tab
            } else {
                toast.error("Unable to open the preview. Please check your popup settings.");
            }
        } else {
            const errorData = await response.json();
            console.error("Error:", errorData);
            toast.error("Failed to save invoice.");
        }
    } catch (error) {
        console.error("Error saving invoice:", error);
        toast.error("An error occurred while saving the invoice.");
    }
};


      

  
  
    
    
    
  
  return (
    <div>
      <div className="add-invoice-entry">
      
      <div className="add-invoice-header">
        <h1>Generate Invoice</h1>
        <p>Invoices \ Add Invoice</p>
      </div>
      

      <form className="add-invoice-entry-form">
      <div ref={searchContainerRef} className="invoice-add-header">
      <div className="invoice-item-variant-search">
            <label>Search Items</label>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="Search Item or Variant"
                className="search-input"
            />
            {filteredItems.length > 0 && (
                <div className="invoice-search-dropdown">
                {filteredItems.map((item) => (
    <div key={item.id} className="invoice-search-dropdown-item">
        {item.variants.map((variant) => (
            <div
                key={variant.id}
                className="invoice-search-dropdown-variant"
                onClick={() => handleAddItem(item, variant)}
            >
                {`${variant.item_name}`}
            </div>
        ))}
    </div>
))}

                </div>
            )}
            </div>

            <div className="invoice-add-customer-info">
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter Customer Name"
              className="customer-name-input"
            />
            </div>
            <div className="invoice-add-date-info">
            <label>Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="invoice-date-input"
            />
          </div>

            </div>

            <table className="add-invoice-entry-table">
  <thead>
    <tr>
      <th>Category</th>
      <th>Brand</th>
      <th>Item</th>
      <th>Variant</th>
      <th>Market Price</th>
      <th>Average Cost</th>
      <th>Sell Price</th>
      <th>Available</th>
      <th>Quantity</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {invoiceEntries.map((entry, index) => (
      <tr key={index}>
        <td>
          <select
            value={entry.category}
            onChange={(e) => {
              setSelectedCategory(e.target.value); // Update selected category
              handleChange(index, "category", e.target.value);
            }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            value={entry.brand}
            onChange={(e) => {
              setSelectedBrand(e.target.value); // Update selected brand
              handleChange(index, "brand", e.target.value);
            }}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.name} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <select
            value={entry.item}
            onChange={(e) => {
                setSelectedItem(e.target.value); // Update selected brand
                handleChange(index, "item", e.target.value)
            }}
            required
          >
            <option value="">Select Item</option>
            {(entry.items || []).map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name} {/* Display the item name in the dropdown */}
                </option>
              );
            })}
          </select>
        </td>
        <td>
        <select
  value={entry.variantId || ""}
  onChange={(e) => handleVariantSelection(index, e.target.value)}
>
  <option value="">Select Variant</option>
  {(entry.variants || []).map((variant) => {
    // Dynamically generate variant_attribute
    const variantAttribute = Object.entries(variant.attributes || {})
      .filter(([key, value]) => key !== 'variant_id' && value) // Exclude 'variant_id' and falsy values
      .map(([key, value]) => value)
      .join(" ");

    return (
      <option key={variant.id} value={variant.id}>
        {variantAttribute || "No Attribute"}
      </option>
    );
  })}
</select>









        </td>
        <td>
          <input
            type="number"
            value={entry.marketPrice}
            onChange={(e) => handleChange(index, "marketPrice", e.target.value)}
            placeholder="Market price"
            onTouchStart={(e) => e.preventDefault()}
            required
             style={{
              maxWidth: "150px",
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={entry.buyPrice}
            onChange={(e) => handleChange(index, "buyPrice", e.target.value)}
            placeholder="Cost"
            onTouchStart={(e) => e.preventDefault()}
            required
            style={{
              maxWidth: "150px",
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={entry.sellPrice}
            onChange={(e) => handleChange(index, "sellPrice", e.target.value)}
            placeholder="Sell Price"
            required
            style={{
              maxWidth: "150px",
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={entry.stockAmount || 0}
            readOnly
            style={{
              color: entry.stockAmount > 10
                ? "green"
                : entry.stockAmount > 0
                ? "orange"
                : "red",
              fontWeight: "bold",
              maxWidth: "80px",
              backgroundColor: "transparent", // Optional for cleaner design
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={entry.quantity}
            onChange={(e) => handleChange(index, "quantity", e.target.value)}
            placeholder="Enter quantity"
            onTouchStart={(e) => e.preventDefault()}
            style={{
              maxWidth: "150px",
            }}
            required
          />
        </td>
        
        <td>
          <button
            type="button"
            onClick={() => handleRemoveRow(index)}
            className="invoice-remove-item-button"
          >
            Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
    <tfoot>
      <tr>
        <td colSpan="11">
          <div className="invoice-add-table-line"></div>
        </td>
      </tr>
    
    <tr>
      <td colSpan="8" style={{ textAlign: "right", fontWeight: "bold" }}>
        Total Savings for Customer:
      </td>
      <td colSpan="2">
         
        <input
          type="number"
          className="add-invoice-save"
          value={
            isNaN(
              invoiceEntries.reduce(
                (total, entry) =>
                  total + entry.quantity * (entry.marketPrice - entry.sellPrice),
                0
              )
            )
              ? "0.00"
              : invoiceEntries
                  .reduce(
                    (total, entry) =>
                      total + entry.quantity * (entry.marketPrice - entry.sellPrice),
                    0
                  )
                  .toFixed(2)
          }
          readOnly
          style={{
            fontWeight: "bold",
            border: "none",
            backgroundColor: "transparent",
            textAlign: "right",
          }}
        />
      </td>
    </tr>

    <tr>
      <td colSpan="8" style={{ textAlign: "right", fontWeight: "bold" }}>
        Total Profit:
      </td>
      <td colSpan="2">
        <input
          type="number"
          className="add-invoice-profit"
          value={
            isNaN(
              invoiceEntries.reduce(
                (total, entry) =>
                  total + entry.quantity * (entry.sellPrice - entry.buyPrice),
                0
              )
            )
              ? "0.00"
              : invoiceEntries
                  .reduce(
                    (total, entry) =>
                      total + entry.quantity * (entry.sellPrice - entry.buyPrice),
                    0
                  )
                  .toFixed(2)
          }
          readOnly
          style={{
            fontWeight: "bold",
            border: "none",
            backgroundColor: "transparent",
            textAlign: "right",
          }}
        />
      </td>
    </tr>

    <tr>
      <td colSpan="8" style={{ textAlign: "right", fontWeight: "bold" }}>
        Total Amount:
      </td>
      <td colSpan="2">
        <input
          type="number"
          className="add-invoice-total"
          value={
            isNaN(
              invoiceEntries.reduce(
                (total, entry) => total + entry.quantity * entry.sellPrice,
                0
              )
            )
              ? "0.00"
              : invoiceEntries
                  .reduce((total, entry) => total + entry.quantity * entry.sellPrice, 0)
                  .toFixed(2)
          }
          readOnly
          style={{
            fontWeight: "bold",
            border: "none",
            backgroundColor: "transparent",
            textAlign: "right",
          }}
        />
      </td>
    </tr>
  </tfoot>

</table>

        <div className="invoice-add-remove-items">
          <button type="button" onClick={handleAddRow} className="invoice-add-item-button">
            Add
          </button>
        </div>
        <div className="add-invoice-actions">
        <button 
          type="button" 
          className="add-invoice-submit"
          onClick={handleGenerateInvoice}
        >
          Generate Invoice
        </button>;
          <button type="button" className="add-invoice-back" onClick={() => navigate("/admin-dashboard/invoices")}>
            Back
          </button>
        </div>
      </form>
      

    </div>
    </div>
  )
}
