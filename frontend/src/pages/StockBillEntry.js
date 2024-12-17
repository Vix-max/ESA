import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Correct import
import { toast } from "react-toastify";
import "./StockBillEntry.css";

export default function StockBillEntry() {
    const navigate = useNavigate();
  const [stockEntries, setStockEntries] = useState([
    { itemName: "", quantity: "", buyPrice: "", seller: "" },
  ]);
  

  const handleAddRow = () => {
    setStockEntries([
      ...stockEntries,
      { itemName: "", quantity: "", buyPrice: "", seller: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = stockEntries.filter((_, i) => i !== index);
    setStockEntries(updatedEntries);
  };

  const handleChange = (index, field, value) => {
    const updatedEntries = [...stockEntries];
    updatedEntries[index][field] = value;
    setStockEntries(updatedEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/addbillstock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stocks: stockEntries }),
      });

      if (response.ok) {
        toast.success("Stock entries added successfully!");
        setStockEntries([{ itemName: "", quantity: "", buyPrice: "", seller: "" }]);
      } else {
        toast.error("Failed to add stock entries.");
      }
    } catch (error) {
      console.error("Error adding stock entries:", error);
      toast.error("Error occurred while submitting.");
    }
  };

  return (
    <div className="stock-bill-entry">
        <div className="stock-bill-header">
      <h1>Stock Entry (Bill)</h1>
      <p>Stock \ Stock Bill Entry</p>
      </div>
      <div>
      <form onSubmit={handleSubmit} className="stock-bill-entry-form">
        <table className="stock-entry-table">
          <thead>
            <tr>
              <th>Item Name</th>
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
                  <input
                    type="text"
                    value={entry.itemName}
                    onChange={(e) => handleChange(index, "itemName", e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={entry.quantity}
                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                    placeholder="Enter quantity"
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={entry.buyPrice}
                    onChange={(e) => handleChange(index, "buyPrice", e.target.value)}
                    placeholder="Enter buy price"
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
                <button type="button" onClick={() => handleRemoveRow(index)} class="bill-remove-item-button">Remove x</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        

        <div class="bill-add-remove-items">
            <button type="button" onClick={handleAddRow} class="bill-add-item-button">Add +</button>
        </div>
        <div className="bill-stock-actions">
        <button type="submit" className="bill-stock-submit">Submit Entries</button>
        <button className="bill-stock-back" onClick={() => navigate("/admin-dashboard/stock")}>Back</button>
        </div>
      </form>
      </div>
    </div>
  );
}
