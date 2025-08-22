import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, BarChart3, Crown, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface PricingPlan {
  name: string;
  price: number;
  annual: number;
  period: string;
  includedIds: number;
  redirects: number;
  features: string[];
  color: string;
  icon: any;
  popular?: boolean;
}

interface SelectedId {
  prefix: string;
  suffix: string;
  id: string;
}

export const Billing = () => {
  const { showInfo, showSuccess } = useNotifications();
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO');
  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  const [currentStep, setCurrentStep] = useState<'plan' | 'ids' | 'checkout'>('plan');
  const [selectedPrefix, setSelectedPrefix] = useState('700');

  const plans: PricingPlan[] = [
    {
      name: 'SINGLE',
      price: 2.08,
      annual: 25,
      period: 'month per .ID',
      includedIds: 1,
      redirects: 50000,
      features: [
        'Advanced Analytics',
        'Plan Not Upgradeable'
      ],
      color: 'gray',
      icon: Zap
    },
    {
      name: 'PRO',
      price: 1.24,
      annual: 149,
      period: 'month per .ID',
      includedIds: 10,
      redirects: 50000,
      features: [
        'Advanced Analytics',
        'Plan Upgradeable'
      ],
      color: 'blue',
      icon: Shield,
      popular: true
    },
    {
      name: 'GOLD',
      price: 0.66,
      annual: 199,
      period: 'month per .ID',
      includedIds: 25,
      redirects: 50000,
      features: [
        'Advanced Analytics',
        'Plan Upgradeable'
      ],
      color: 'yellow',
      icon: Crown
    },
    {
      name: 'ELITE',
      price: 0.50,
      annual: 299,
      period: 'month per .ID',
      includedIds: 50,
      redirects: 50000,
      features: [
        'Advanced Analytics',
        'Priority Support'
      ],
      color: 'purple',
      icon: BarChart3
    }
  ];

  const prefixOptions = [
    { value: '100', available: true },
    { value: '200', available: true },
    { value: '300', available: true },
    { value: '400', available: true },
    { value: '500', available: true },
    { value: '600', available: true },
    { value: '700', available: true },
    { value: '800', available: true },
    { value: '900', available: true },
  ];

  const suffixOptions = [
    { prefix: '700', options: ['700', '710', '720', '730', '740', '750', '760', '770', '780', '790'] },
    { prefix: '731', options: ['731', '732', '733', '734', '735', '736', '737', '738', '739'] },
  ];

  const availableIds = [
    { id: '733-0001', added: false },
    { id: '733-1001', added: true },
    { id: '733-0001', added: true },
    { id: '733-0011', available: true },
    { id: '733-0901', available: true },
    { id: '733-1009', available: true },
    { id: '733-(Search available .ID)', search: true },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    setCurrentStep('ids');
  };

  const handleAddId = (id: string) => {
    const [prefix, suffix] = id.split('-');
    const newId = { prefix, suffix, id };
    
    if (selectedIds.find(sid => sid.id === id)) {
      setSelectedIds(selectedIds.filter(sid => sid.id !== id));
      showInfo('ID Removed', `${id} has been removed from your cart`);
    } else {
      setSelectedIds([...selectedIds, newId]);
      showSuccess('ID Added', `${id} has been added to your cart`);
    }
  };

  const handleCheckout = () => {
    if (selectedIds.length === 0) {
      showInfo('No IDs Selected', 'Please select at least one ID to continue');
      return;
    }
    setCurrentStep('checkout');
  };

  const getColorClasses = (color: string, type: 'border' | 'bg' | 'text' = 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-600'
      },
      yellow: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-600'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-100',
        text: 'text-purple-600'
      },
      gray: {
        border: 'border-gray-300',
        bg: 'bg-gray-100',
        text: 'text-gray-600'
      }
    };
    return colorMap[color]?.[type] || colorMap.gray[type];
  };

  const getButtonColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const selectedPlanData = plans.find(p => p.name === selectedPlan);
  const annualPayment = selectedPlanData ? selectedPlanData.annual : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex items-center gap-2 ${currentStep === 'plan' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'plan' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="font-medium">Plan Selection</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center gap-2 ${currentStep === 'ids' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'ids' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="font-medium">ID Selection</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className={`flex items-center gap-2 ${currentStep === 'checkout' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep === 'checkout' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="font-medium">Checkout</span>
          </div>
        </div>
      </div>

      {/* Plan Selection Step */}
      {currentStep === 'plan' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Pricing</h1>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-gray-500">Links to Category Menus</span>
              <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                Business Plans
              </button>
              <span className="text-gray-600 text-sm">Coming soon</span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => {
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                    selectedPlan === plan.name ? getColorClasses(plan.color) : 'border-gray-200'
                  } hover:shadow-xl transition-all cursor-pointer`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-600">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 ml-2 text-sm">
                          /{plan.period}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        ${plan.annual}/year
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Included .ID</span>
                        <span className="font-bold text-2xl text-gray-900">{plan.includedIds}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Redirects</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{plan.redirects.toLocaleString()}</span>
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs">?</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlan(plan.name);
                      }}
                      className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                        getButtonColorClasses(plan.color)
                      }`}
                    >
                      Select Prefix to Start
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ID Selection Step */}
      {currentStep === 'ids' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Choose the Prefix Number</h2>
          </div>

          {/* Prefix Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-600">Start Here</span>
              <div className="flex gap-2">
                {prefixOptions.map((prefix) => (
                  <button
                    key={prefix.value}
                    onClick={() => setSelectedPrefix(prefix.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPrefix === prefix.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {prefix.value}
                  </button>
                ))}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Suffix Options */}
            {selectedPrefix === '700' && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {suffixOptions[0].options.map((suffix) => (
                    <button
                      key={suffix}
                      className={`px-4 py-2 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-all ${
                        suffix === '730' ? 'bg-red-50 text-red-600' : ''
                      }`}
                    >
                      {suffix}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  {suffixOptions[1].options.map((suffix) => (
                    <button
                      key={suffix}
                      className={`px-4 py-2 rounded-lg font-medium border-2 ${
                        suffix === '731' || suffix === '733' || suffix === '736' || suffix === '737' || suffix === '738'
                          ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      } transition-all`}
                    >
                      {suffix}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Available IDs */}
            <div className="mt-8 space-y-3">
              {availableIds.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    item.added ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <span className={`font-mono font-medium ${
                    item.added ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {item.id}
                  </span>
                  {item.added && (
                    <span className="text-green-600 text-sm">Added To Cart</span>
                  )}
                  {item.available && (
                    <button
                      onClick={() => handleAddId(item.id)}
                      className="w-8 h-8 bg-white border-2 border-gray-300 rounded hover:border-blue-600 transition-colors flex items-center justify-center"
                    >
                      {selectedIds.find(sid => sid.id === item.id) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  )}
                  {item.search && (
                    <button className="w-8 h-8 bg-white border-2 border-gray-300 rounded hover:border-blue-600 transition-colors flex items-center justify-center">
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="mt-6 mx-auto block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Regenerate
            </button>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold">My Cart</h3>
              <span className="ml-auto text-sm text-gray-600">
                {selectedIds.length} of 10 Selected
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[100px]">
              {selectedIds.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-mono text-sm cursor-pointer hover:bg-blue-200"
                      onClick={() => handleAddId(id.id)}
                    >
                      {id.id} ×
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No IDs selected yet</p>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Applied</span>
                <span className="font-semibold">{selectedPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">No. of .ID Added</span>
                <span className="font-semibold">{selectedIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per .ID</span>
                <span className="font-semibold">${selectedPlanData?.price.toFixed(2)}/month per .ID</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Annual Payment</span>
                <span>${annualPayment}/year</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Checkout
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              ● Add or Remove .ID - Subscription Plan will auto apply per Qty of .ID added to Cart<br />
              .ID are auto generated and randomly added to the Car - Feel Free to Edit(Add or Remove)
            </p>
          </div>

          <button
            onClick={() => setCurrentStep('plan')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mx-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Plans
          </button>
        </motion.div>
      )}

      {/* Checkout Step */}
      {currentStep === 'checkout' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected IDs</span>
                    <span className="font-medium">{selectedIds.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${annualPayment}/year</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Payment processing is currently in development. 
                  This is a preview of the checkout process.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep('ids')}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  showInfo('Coming Soon', 'Payment processing will be available soon!');
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};