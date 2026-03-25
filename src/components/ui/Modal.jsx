import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, children, title }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 top-4 bottom-20 md:bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-3xl z-50 overflow-y-auto shadow-2xl flex flex-col"
          >
            <div className="p-6 flex-1 overflow-y-auto">
              {title && (
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 -mt-6 pt-6 z-10">
                  <h2 className="text-xl font-bold text-forest">{title}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    &times;
                  </button>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
