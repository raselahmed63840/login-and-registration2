const categories = ["All", "Men", "Women", "Electronics", "Jewelry"];

const CategorySidebar = ({ selected, onSelect }) => (
  <div className="space-y-4">
    {categories.map((cat) => (
      <button
        key={cat}
        onClick={() => onSelect(cat)}
        className={`block w-full text-left px-4 py-2 rounded ${
          selected === cat ? "bg-green-600 text-white" : "bg-gray-100"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
);
export default CategorySidebar;
