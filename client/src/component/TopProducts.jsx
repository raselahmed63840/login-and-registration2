const TopProducts = ({ products }) => (
  <div className="bg-white p-4 rounded shadow mb-6">
    <h3 className="font-bold mb-2">Top Selling Products</h3>
    {products.slice(0, 3).map((p) => (
      <div key={p._id} className="flex justify-between items-center border-b py-2">
        <span>{p.title}</span>
        <span>${p.price}</span>
      </div>
    ))}
  </div>
);

export default TopProducts;
