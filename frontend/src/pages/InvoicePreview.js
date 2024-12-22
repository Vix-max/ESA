import React, { useEffect, useState } from "react";
import "./InvoicePreview.css";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Explicitly import the plugin


export default function InvoicePreview() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (window.previewData) {
      setPreviewData(window.previewData);
      console.log("Preview Data: ", window.previewData);
    }
  }, []);

  if (!previewData) {
    return <div className="invoice-preview">Loading...</div>;
  }

  const { customerName, invoiceDate, invoiceEntries } = previewData;

  // Calculate totals
  const totalAmount = invoiceEntries.reduce(
    (acc, entry) => acc + entry.sellPrice * entry.quantity,
    0
  );

  const totalSaved = invoiceEntries.reduce(
    (acc, entry) =>
      acc + (entry.marketPrice - entry.sellPrice) * entry.quantity,
    0
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFont("Nunito", "bold");
    doc.setFontSize(18);
    doc.setTextColor("#456efe");
    doc.text("Invoice", 20, 20);
  
    // Customer Details
    doc.setFont("Nunito", "normal");
    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text(`Customer Name: ${customerName}`, 20, 30);
    doc.text(`Invoice Date: ${invoiceDate}`, 20, 40);
  
    // Table
    doc.autoTable({
      startY: 50,
      headStyles: {
        fillColor: "#456efe",
        textColor: "#ffffff",
        fontSize: 12,
        font: "Nunito",
      },
      bodyStyles: {
        fontSize: 10,
        font: "Nunito",
      },
      head: [["Item", "Quantity", "Market Price", "Sell Price", "Buy Price", "Saved"]],
      body: invoiceEntries.map((entry) => {
        const selectedVariant =
          entry.variants.find((variant) => variant.id === entry.variantId) ||
          entry.variants[0];
  
        const marketPrice = parseFloat(entry.marketPrice) || 0;
        const sellPrice = parseFloat(entry.sellPrice) || 0;
        const buyPrice = parseFloat(entry.buyPrice) || 0;
  
        const saved = (marketPrice - sellPrice) * entry.quantity;
  
        return [
          selectedVariant.item_name,
          entry.quantity,
          marketPrice.toFixed(2),
          sellPrice.toFixed(2),
          buyPrice.toFixed(2),
          saved.toFixed(2),
        ];
      }),
    });
  
    // Footer Totals
    const lastY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor("#333");
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 20, lastY);
    doc.text(`Total Saved: ${totalSaved.toFixed(2)}`, 20, lastY + 10);
  
    // Save the PDF
    doc.save("invoice.pdf");
  };
  

  return (
    <div className="invoice-preview">
      <div className="invoice-header">
        <h1>Invoice</h1>
      </div>
      <div className="invoice-more-info">
        <p><strong>Customer Name:</strong> {customerName}</p>
        <p><strong>Invoice Date:</strong> {invoiceDate}</p>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Market Price</th>
            <th>Sell Price</th>
            <th>Buy Price</th>
            <th>Saved</th>
          </tr>
        </thead>
        <tbody>
  {invoiceEntries.map((entry, index) => {
    const selectedVariant =
      entry.variants.find((variant) => variant.id === entry.variantId) ||
      entry.variants[0];

    const marketPrice = parseFloat(entry.marketPrice) || 0;
    const sellPrice = parseFloat(entry.sellPrice) || 0;
    const buyPrice = parseFloat(entry.buyPrice) || 0;

    return (
      <tr key={index}>
        <td>{selectedVariant ? selectedVariant.item_name : "N/A"}</td>
        <td>{entry.quantity}</td>
        <td>{marketPrice.toFixed(2)}</td>
        <td>{sellPrice.toFixed(2)}</td>
        <td>{buyPrice.toFixed(2)}</td>
        <td>{((marketPrice - sellPrice) * entry.quantity).toFixed(2)}</td>
      </tr>
    );
  })}
</tbody>

      </table>
      <div className="invoice-footer">
        <p>Total Amount: {totalAmount.toFixed(2)}</p>
        <p>Total Saved: {totalSaved.toFixed(2)}</p>
      </div>
      <button onClick={downloadPDF} className="download-btn">
        Download Invoice as PDF
      </button>
    </div>
  );
}
