import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import useOrderStatusStore, { ORDER_STATUSES } from "../../store/useOrderStatusStore";

export default function OrderTracker({ orderNumber }) {
  const orderStatus = useOrderStatusStore((s) => s.getOrderStatus(orderNumber));

  if (!orderStatus) return null;

  const currentStatus = orderStatus.status;
  const statusInfo = ORDER_STATUSES[currentStatus];

  // Define the status flow
  const statusFlow = ["received", "preparing", "ready"];
  if (currentStatus === "out_for_delivery") {
    statusFlow.push("out_for_delivery");
  }
  statusFlow.push("completed");

  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-3xl">{statusInfo.icon}</div>
          <div>
            <h3 className="font-bold text-hilltop-charcoal text-lg">
              {statusInfo.label}
            </h3>
            <p className="text-sm text-hilltop-gray">{statusInfo.description}</p>
          </div>
        </div>
        {orderStatus.estimatedTime && currentStatus !== "completed" && (
          <div className="bg-hilltop-green/10 border border-hilltop-green/20 rounded-lg p-3 mt-3">
            <p className="text-sm text-hilltop-green font-medium">
              Estimated time: {orderStatus.estimatedTime} minutes
            </p>
          </div>
        )}
      </div>

      {/* Status Progress */}
      <div className="relative">
        {statusFlow.map((status, index) => {
          const info = ORDER_STATUSES[status];
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status} className="flex items-start gap-4 mb-6 last:mb-0">
              {/* Icon/Indicator */}
              <div className="relative flex-shrink-0">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-hilltop-green text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle size={20} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </motion.div>

                {/* Connecting Line */}
                {index < statusFlow.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-6 -ml-px ${
                      isActive ? "bg-hilltop-green" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 pt-1.5">
                <p
                  className={`font-semibold ${
                    isCurrent ? "text-hilltop-charcoal" : isActive ? "text-hilltop-gray" : "text-gray-400"
                  }`}
                >
                  {info.label}
                </p>
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-hilltop-gray mt-0.5"
                  >
                    {info.description}
                  </motion.p>
                )}
                {isActive && !isCurrent && (
                  <p className="text-xs text-hilltop-gray mt-0.5">
                    Completed
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-hilltop-gray">
          Last updated: {new Date(orderStatus.updatedAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
