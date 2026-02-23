const types = ["All", "Shirt", "Pant", "Jeans", "Winter", "T-Shirt"];

const ProductTabs = ({ selected, onSelect }) => (
  <div className="flex space-x-4 mb-6">
    {types.map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-4 py-2 rounded ${
          selected === type ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

export default ProductTabs;
