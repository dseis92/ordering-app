import useOrderStore from "../../store/useOrderStore";
import { formatPhone } from "../../lib/formatters";

export default function CustomerForm() {
  const customerInfo = useOrderStore((s) => s.customerInfo);
  const setCustomerInfo = useOrderStore((s) => s.setCustomerInfo);

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Full Name"
        value={customerInfo.name}
        onChange={(e) => setCustomerInfo({ name: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={customerInfo.phone}
        onChange={(e) => setCustomerInfo({ phone: formatPhone(e.target.value) })}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={customerInfo.email}
        onChange={(e) => setCustomerInfo({ email: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-forest text-sm bg-white"
      />
    </div>
  );
}
