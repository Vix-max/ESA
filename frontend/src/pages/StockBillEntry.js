import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./StockBillEntry.css";

export default function StockBillEntry() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [stockEntries, setStockEntries] = useState([
    { category: "", brand: "", item: "", variant: "", quantity: "", buyPrice: "", seller: "" },
    // ... more entries
  ]);

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
  
              const formattedString = filteredAttributes.map(([key, value]) => value).join(' ');
  
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
    setStockEntries([
      ...stockEntries,
      { category: "", brand: "", item: "", variant: "", quantity: "", buyPrice: "", seller: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = stockEntries.filter((_, i) => i !== index);
    setStockEntries(updatedEntries);
  };

  const handleChange = (index, field, value) => {
    const updatedEntries = [...stockEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
  
    if (field === "category" || field === "brand") {
      // Reset items and variants if category or brand changes
      updatedEntries[index] = {
        ...updatedEntries[index],
        item: "",
        variant: "",
        items: [],
        variants: [],
      };
  
      // Fetch items for the selected category and brand
      if (updatedEntries[index].category && updatedEntries[index].brand) {
        fetch(`http://localhost:8000/api/items/${updatedEntries[index].category}/${updatedEntries[index].brand}`)
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data.items)) {
              const updatedRow = {
                ...updatedEntries[index],
                items: data.items,
              };
              updatedEntries[index] = updatedRow;
              setStockEntries([...updatedEntries]); // Ensure a new state reference
            }
          })
          .catch((error) => console.error("Error fetching items:", error));
      }
    }
  
    if (field === "item") {
      // Reset variants if item changes
      updatedEntries[index] = {
        ...updatedEntries[index],
        variant: "",
        variants: [],
      };
  
      // Fetch variants for the selected item
      if (value) {
        fetch(`http://localhost:8000/api/getvariantsbyitemID/${value}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.success && Array.isArray(data.variants)) {
              const formattedVariants = data.variants.map((variant) => ({
                ...variant,
                formattedAttributes: Object.entries(variant.attributes)
                  .filter(([key, value]) => key !== "variant_id" && value)
                  .map(([key, value]) => value)
                  .join(" "),
              }));
  
              const updatedRow = {
                ...updatedEntries[index],
                variants: formattedVariants,
              };
              updatedEntries[index] = updatedRow;
              setStockEntries([...updatedEntries]); // Ensure a new state reference
            }
          })
          .catch((error) => console.error("Error fetching variants:", error));
      }
    }
  
    setStockEntries([...updatedEntries]); // Update state with a new array reference
  };
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Prepare stock data for each entry
        const stockData = stockEntries.map((entry) => ({
            item_id: entry.item,
            variant_id: entry.variant,
            stock_date: new Date().toISOString().split('T')[0], // Use current date or fetch from form
            seller: entry.seller,
            buy_price: parseFloat(entry.buyPrice),
            quantity: parseInt(entry.quantity),
        }));

        // Send data to the API
        const response = await fetch("http://localhost:8000/api/addmultiplestock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies automatically
            body: JSON.stringify(stockData),
        });

        if (response.ok) {
            const data = await response.json();
            toast.success("Stock entries submitted successfully!");
            console.log(data); // Optionally log the response
        } else {
            const errorData = await response.json();
            console.error("Error:", errorData);
            toast.error("Failed to submit stock entries!");
        }
    } catch (error) {
        console.error("Error submitting stock entries:", error);
        toast.error("An unexpected error occurred!");
    }
};



  return (
    <div className="stock-bill-entry">
      <div className="stock-bill-header">
        <h1>Stock Entry (Bill)</h1>
        <p>Stock \ Stock Bill Entry</p>
      </div>
      <form onSubmit={handleSubmit} className="stock-bill-entry-form">
        <table className="stock-entry-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Brand</th>
              <th>Item</th>
              <th>Variant</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Seller</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stockEntries.map((entry, index) => (
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
                      <option key={category.id} value={category.id}>
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
                    onChange={(e) => handleChange(index, "item", e.target.value)}
                    required
                  >
                    <option value="">Select Item</option>
                    {entry.items?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={entry.variant}
                    onChange={(e) => handleChange(index, "variant", e.target.value)}
                    required
                  >
                    <option value="">Select Variant</option>
                    {entry.variants?.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.formattedAttributes}
                      </option>
                    ))}
                  </select>
                </td>


                <td>
                  <input
                    type="number"
                    value={entry.quantity}
                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                    placeholder="Enter quantity"
                    onTouchStart={(e) => e.preventDefault()}
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={entry.buyPrice}
                    onChange={(e) => handleChange(index, "buyPrice", e.target.value)}
                    placeholder="Enter buy price"
                    onTouchStart={(e) => e.preventDefault()}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={entry.seller}
                    onChange={(e) => handleChange(index, "seller", e.target.value)}
                    placeholder="Enter seller"
                    required
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="bill-remove-item-button"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bill-add-remove-items">
          <button type="button" onClick={handleAddRow} className="bill-add-item-button">
            Add
          </button>
        </div>
        <div className="bill-stock-actions">
          <button type="submit" className="bill-stock-submit">
            Submit Entries
          </button>
          <button type="button" className="bill-stock-back" onClick={() => navigate("/admin-dashboard/stock")}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
