const StatsCards = ({ products, orders }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white p-4 rounded shadow">Total Visitors: 45,987 ↑12.87%</div>
    <div className="bg-white p-4 rounded shadow">Total Products: {products.length}</div>
    <div className="bg-white p-4 rounded shadow">Total Views: 25,987 ↑90.89%</div>
    <div className="bg-white p-4 rounded shadow">Average Orders: {orders.length}</div>
  </div>
);

export default StatsCards;
