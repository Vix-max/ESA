import React, { useEffect, useState } from "react";
import "./InvoicePreview.css";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Explicitly import the plugin
import logo from "../media/Logo_NOBG - Copy.png"; // Adjust the path to your image
import { nunitoFontBase64, nunitoBoldFontBase64 } from "../fonts/fonts";



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

    // Add Fonts
    doc.addFileToVFS("Nunito-Regular.ttf", nunitoFontBase64);
    doc.addFont("Nunito-Regular.ttf", "Nunito", "normal");

    doc.addFileToVFS("Nunito-Bold.ttf", nunitoBoldFontBase64);
    doc.addFont("Nunito-Bold.ttf", "Nunito", "bold");

    // Add Logo
    const logoImg = new Image();
    logoImg.src = logo;
    doc.addImage(logoImg, "PNG", 175, 7, 23, 23);

    // Title
    doc.setFont("Nunito", "bold");
    doc.setFontSize(20);
    doc.setTextColor("#333");
    doc.text("Invoice #24_001", 10, 20);

    // Customer Details (Left aligned, partial bold for labels)
    doc.setFont("Nunito", "bold");
    doc.setFontSize(11);
    doc.setTextColor("#333");
    doc.text("Customer Name:", 10, 35);

    doc.setFont("Nunito", "normal");
    doc.text(customerName, 41, 35);

    doc.setFont("Nunito", "bold");
    doc.text("Invoice Date:", 10, 42);

    doc.setFont("Nunito", "normal");
    doc.text(invoiceDate, 35, 42);

    // Company Details (Right aligned, normal font)
    const pageWidth = doc.internal.pageSize.width;
    const companyX = pageWidth - 10; // Position on the right side
    doc.setFont("Nunito", "normal");
    doc.text("ESA Enterprises", companyX, 35, { align: "right" });
    doc.text("No.128/B/1, Ramahera Road, Hewagama, Kaduwela", companyX, 40, { align: "right" });
    doc.text("075 138 6968", companyX, 45, { align: "right" });

    // Table
    doc.autoTable({
        startY: 55, // Adjust start Y position after company details
        tableWidth: 'auto', // Increase table width dynamically
        margin: { left: 10, right: 10 }, // Ensure space on the sides
        headStyles: {
            fillColor: "#2d2d2d",
            textColor: "#ffffff",
            fontSize: 10,
            font: "Nunito",
        },
        bodyStyles: {
            fontSize: 10,
            font: "Nunito",
            cellPadding: 4,
        },
        alternateRowStyles: {
            fillColor: "#f7f9fc",
        },
        head: [
            ["Item", "Quantity", "Market Rate", "Price", "Saved", "Total"],
        ],
        body: [
            ...invoiceEntries.map((entry) => {
                const selectedVariant =
                    entry.variants.find((variant) => variant.id === entry.variantId) ||
                    entry.variants[0];

                const marketPrice = parseFloat(entry.marketPrice) || 0;
                const sellPrice = parseFloat(entry.sellPrice) || 0;
                const total = sellPrice * entry.quantity;
                const saved = (marketPrice - sellPrice) * entry.quantity;

                return [
                    selectedVariant.item_name,
                    entry.quantity,
                    `Rs ${marketPrice.toFixed(2)}`,
                    `Rs ${sellPrice.toFixed(2)}`,
                    `Rs ${saved.toFixed(2)}`,
                    `Rs ${total.toFixed(2)}`,
                ];
            }),
            // Add totals row at the end
            [{ content: "", colSpan: 3 }, 
              { content: "Total", colSpan: 1, styles: { fontStyle: 'bold' } },
              { content: `Rs ${totalSaved.toFixed(2)}`, styles: { fontStyle: 'bold' } },
              { content: `Rs ${totalAmount.toFixed(2)}`, styles: { fontStyle: 'bold' } }],
        ],
        drawCell: function (data) {
            const { cell, row, column } = data;

            // Draw horizontal lines
            if (row.index >= 0 || row.raw === null) {
                doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
            }

            // Draw vertical lines only for first and last columns
            if (column.index === 0 || column.index === data.table.columns.length - 1) {
                doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
            }
        },
    });

    // Save the PDF
    doc.save("invoice.pdf");
};



  
  
  

  return (
    <div className="invoice-preview">
      <div className="invoice-header">
        <h1>Invoice #24_001</h1>
        <img src={logo} alt="Logo" className="invoice-preview-logo" />
      </div>
      <div className="invoice-more-info">
        <div className="invoice-invoice-info">
          <p>
            <strong>Customer Name:</strong> {customerName}
          </p>
          <p>
            <strong>Invoice Date:</strong> {invoiceDate}
          </p>
        </div>

        <div className="invoice-comapny-info">
          <p>ESA Enterprises</p>
          <p>No.128/B/1, Ramahera Road, Hewagama, Kaduwela</p>
          <p>075 138 6968 </p>
        </div>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Market Rate</th>
            <th>Price</th>
            <th>Saved</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceEntries.map((entry, index) => {
            const selectedVariant =
              entry.variants.find((variant) => variant.id === entry.variantId) ||
              entry.variants[0];

            const marketPrice = parseFloat(entry.marketPrice) || 0;
            const sellPrice = parseFloat(entry.sellPrice) || 0;
            const total = sellPrice * entry.quantity;

            return (
              <tr key={index}>
                <td>{selectedVariant ? selectedVariant.item_name : "N/A"}</td>
                <td>{entry.quantity}</td>
                <td>Rs {marketPrice.toFixed(2)}</td>
                <td>Rs {sellPrice.toFixed(2)}</td>
                <td>Rs {((marketPrice - sellPrice) * entry.quantity).toFixed(2)}</td>
                <td>Rs {total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: "right" }}>Total:</td>
            <td>Rs {totalSaved.toFixed(2)}</td>
            <td>Rs {totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <button onClick={downloadPDF} className="download-btn">
        Download Invoice as PDF
      </button>
    </div>
  );
}
