import React from 'react';
import { Search, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface IdNotFoundProps {
  id: string;
  onTryAgain?: () => void;
  onRegister?: () => void;
}

export const IdNotFound: React.FC<IdNotFoundProps> = ({
  id,
  onTryAgain,
  onRegister
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto text-center"
    >
      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 text-gray-400" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        ID Not Found
      </h2>

      {/* ID Display */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg mb-4">
        <span className="font-mono text-lg text-gray-700">{id}</span>
      </div>

      {/* Message */}
      <p className="text-gray-600 mb-8">
        This ID hasn't been registered yet or may be inactive.
        Would you like to purchase this ID?
      </p>

      {/* Actions */}
      <div className="space-y-3">
        {onRegister && (
          <button
            onClick={onRegister}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            Purchase This ID
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {onTryAgain && (
          <button
            onClick={onTryAgain}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Try Another ID
          </button>
        )}
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm text-blue-700">
              <strong>Want this ID?</strong> You can purchase any available 8-digit ID 
              and connect it to your website, product, or service.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};