import useOrderStore from "../../store/useOrderStore";

export default function OrderTypeToggle() {
  const orderType = useOrderStore((s) => s.orderType);
  const setOrderType = useOrderStore((s) => s.setOrderType);

  return (
    <div className="flex bg-gray-100 rounded-2xl p-1 w-fit">
      {["pickup", "delivery"].map((type) => (
        <button
          key={type}
          onClick={() => setOrderType(type)}
          className={`px-6 py-2 rounded-xl capitalize font-medium text-sm transition-all ${
            orderType === type
              ? "bg-white text-forest shadow-sm"
              : "text-gray-500 hover:text-forest"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
