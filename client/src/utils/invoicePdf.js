import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatMoney = (amount = 0) => {
  return `${Number(amount || 0).toLocaleString()} BDT`;
};

const getOrderProducts = (order) => {
  return order?.items || order?.products || order?.cartItems || [];
};

export const downloadInvoicePDF = (order, user = {}) => {
  if (!order) {
    alert("Order not found");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  const orderId = order._id || order.id || order.orderId || "N/A";
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  const customerName =
    order.customerName ||
    order.fullName ||
    user.fullName ||
    user.name ||
    "Customer";

  const customerEmail = order.email || user.email || "N/A";
  const customerPhone = order.phone || user.phone || "N/A";

  const shippingAddress =
    order.shippingAddress || order.address || order.deliveryAddress || "N/A";

  const paymentMethod = order.paymentMethod || "Cash On Delivery";
  const orderStatus = order.status || order.orderStatus || "Pending";

  const products = getOrderProducts(order);

  const subTotal =
    order.subTotal ||
    products.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);

  const deliveryCost = Number(order.deliveryCost || order.shippingCost || 0);
  const discount = Number(order.discount || 0);
  const total =
    Number(order.totalAmount || order.total || subTotal + deliveryCost) -
    discount;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SHOP EASE", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Professional E-commerce Invoice", 14, 25);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 14, 18, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${orderId}`, pageWidth - 14, 25, { align: "right" });
  doc.text(`Date: ${orderDate}`, pageWidth - 14, 31, { align: "right" });

  // Line
  doc.setLineWidth(0.3);
  doc.line(14, 36, pageWidth - 14, 36);

  // Customer info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 14, 46);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${customerName}`, 14, 53);
  doc.text(`Email: ${customerEmail}`, 14, 59);
  doc.text(`Phone: ${customerPhone}`, 14, 65);

  const addressLines = doc.splitTextToSize(`Address: ${shippingAddress}`, 85);
  doc.text(addressLines, 14, 71);

  // Order info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Details", pageWidth - 75, 46);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${orderId}`, pageWidth - 75, 53);
  doc.text(`Payment: ${paymentMethod}`, pageWidth - 75, 59);
  doc.text(`Status: ${orderStatus}`, pageWidth - 75, 65);

  // Product table
  const tableRows = products.map((item, index) => {
    const title = item.title || item.name || item.productName || "Product";
    const quantity = Number(item.quantity || item.qty || 1);
    const price = Number(item.price || 0);
    const itemTotal = price * quantity;

    return [
      index + 1,
      title,
      quantity,
      formatMoney(price),
      formatMoney(itemTotal),
    ];
  });

  autoTable(doc, {
    startY: 90,
    head: [["#", "Product", "Qty", "Price", "Total"]],
    body:
      tableRows.length > 0
        ? tableRows
        : [["1", "No product found", "0", "0 BDT", "0 BDT"]],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [255, 102, 0],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 75 },
      2: { cellWidth: 18, halign: "center" },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: 35, halign: "right" },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Summary
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("Sub Total:", pageWidth - 70, finalY);
  doc.text(formatMoney(subTotal), pageWidth - 14, finalY, { align: "right" });

  doc.text("Delivery Cost:", pageWidth - 70, finalY + 7);
  doc.text(formatMoney(deliveryCost), pageWidth - 14, finalY + 7, {
    align: "right",
  });

  doc.text("Discount:", pageWidth - 70, finalY + 14);
  doc.text(formatMoney(discount), pageWidth - 14, finalY + 14, {
    align: "right",
  });

  doc.setLineWidth(0.2);
  doc.line(pageWidth - 70, finalY + 19, pageWidth - 14, finalY + 19);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total:", pageWidth - 70, finalY + 27);
  doc.text(formatMoney(total), pageWidth - 14, finalY + 27, {
    align: "right",
  });

  // Footer
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for shopping with Shop Ease.", pageWidth / 2, 285, {
    align: "center",
  });

  doc.save(`invoice-${orderId}.pdf`);
};
