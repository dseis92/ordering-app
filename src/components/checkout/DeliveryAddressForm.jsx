import useOrderStore from "../../store/useOrderStore";

export default function DeliveryAddressForm() {
  const deliveryAddress = useOrderStore((s) => s.deliveryAddress);
  const setDeliveryAddress = useOrderStore((s) => s.setDeliveryAddress);

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Street Address"
        value={deliveryAddress.street}
        onChange={(e) => setDeliveryAddress({ street: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
      />
      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="City"
          value={deliveryAddress.city}
          onChange={(e) => setDeliveryAddress({ city: e.target.value })}
          className="col-span-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
        />
        <input
          type="text"
          placeholder="State"
          value={deliveryAddress.state}
          onChange={(e) => setDeliveryAddress({ state: e.target.value })}
          className="col-span-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
        />
        <input
          type="text"
          placeholder="ZIP"
          value={deliveryAddress.zip}
          onChange={(e) => setDeliveryAddress({ zip: e.target.value })}
          className="col-span-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
        />
      </div>
    </div>
  );
}
