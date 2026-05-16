const Topbar = ({ balance }) => (
  <div className="flex justify-between items-center mb-6">
    <input type="text" placeholder="Search..." className="border p-2 rounded w-1/3 hidden sm:block" />
    <div className="font-bold">Your Balance: ${balance}</div>
    <div className="flex items-center gap-2">
      <img src="/avatar.png" alt="Admin" className="w-8 h-8 rounded-full" />
      <span>Khandaker Rasel</span>
    </div>
  </div>
);

export default Topbar;
