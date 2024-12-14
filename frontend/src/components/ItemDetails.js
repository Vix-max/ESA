import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ItemDetails() {
    const { itemId, variantId } = useParams(); // Get itemId and variantId from the URL
    const [itemDetails, setItemDetails] = useState(null);
    const [variantDetails, setVariantDetails] = useState(null);
    
    useEffect(() => {
      const fetchItemDetails = async () => {
        try {
          // Fetch the item details from the API endpoint with itemId and variantId
          const response = await fetch(`http://localhost:8000/api/getitemdetails/${itemId}/${variantId}`);
          const data = await response.json();
    
          // Set the item and variant details
          setItemDetails(data.item);
          setVariantDetails(data.variant);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };
    
      fetchItemDetails();
    }, [itemId, variantId]);
    

  if (!itemDetails) return <div>Loading...</div>;

  return (
    <div className="item-details">
        <h1>Item Details</h1>
      <h1>{itemDetails.name}</h1>
      <p>Brand: {itemDetails.brand}</p>
      <p>Category: {itemDetails.category}</p>
      <p>Price: {itemDetails.sellPrice}</p>
      <p>Stock: {itemDetails.stockAmount}</p>
      {/* Render other details as needed */}
    </div>
  );
}
