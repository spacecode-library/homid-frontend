import React, { useState } from 'react';
import { 
  Globe, 
  Link2, 
  Image as ImageIcon, 
  Calendar, 
  DollarSign, 
  Shield,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { idsService } from '../../services/ids';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useNotifications } from '../../contexts/NotificationContext';
import { ManualMetadataForm } from './ManualMetadataForm';

interface IdConfigurationFormProps {
  id: string;
  homId: string;
  existingData?: any;
  onSave: () => void;
  onCancel: () => void;
}

const socialPlatforms = [
  { id: 'youtube', name: 'YouTube', icon: '🎥' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'facebook', name: 'Facebook', icon: '👍' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' }
];

export const IdConfigurationForm: React.FC<IdConfigurationFormProps> = ({
  id,
  homId,
  existingData,
  onSave,
  onCancel
}) => {
  const { handleError } = useErrorHandler();
  const { showSuccess } = useNotifications();
  
  const [loading, setLoading] = useState(false);
  const [readingUrl, setReadingUrl] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [formData, setFormData] = useState({
    targetUrl: existingData?.targetUrl || '',
    productName: existingData?.productName || '',
    description: existingData?.description || '',
    websiteInfo: existingData?.websiteInfo || {},
    isAdultContent: existingData?.isAdultContent || false,
    websiteType: existingData?.websiteType || 'PRODUCT',
    isOwnerVerified: existingData?.isOwnerVerified || false,
    startDate: existingData?.startDate || '',
    stopDate: existingData?.stopDate || '',
    socialPlatforms: existingData?.socialPlatforms || [],
    affiliateUrl: existingData?.affiliateUrl || '',
    isPaidPromotion: existingData?.isPaidPromotion || false,
    totalEarnings: existingData?.totalEarnings || 0,
    tags: existingData?.tags || [],
    memo: existingData?.memo || '',
    termsAccepted: false
  });

  const handleReadUrl = async () => {
    if (!formData.targetUrl) return;

    setReadingUrl(true);
    try {
      const response = await idsService.readUrl(id, formData.targetUrl);
      
      if (response.data) {
        const websiteInfo = response.data;
        setFormData(prev => ({
          ...prev,
          productName: websiteInfo.title || prev.productName,
          description: websiteInfo.description || prev.description,
          websiteInfo: {
            ...prev.websiteInfo,
            ...websiteInfo
          }
        }));
        showSuccess('Website information extracted successfully');
      }
    } catch (error: any) {
      if (error.response?.status === 403 || error.message.includes('bot')) {
        setShowManualInput(true);
      } else {
        handleError(error, {
          customTitle: 'Failed to read URL',
          customMessage: 'Unable to extract website information. Please enter details manually.'
        });
      }
    } finally {
      setReadingUrl(false);
    }
  };

  const handleSave = async () => {
    if (!formData.termsAccepted) {
      handleError(new Error('Please accept the terms and conditions'));
      return;
    }

    setLoading(true);
    try {
      await idsService.updateMapping(id, {
        primaryUrl: formData.targetUrl,
        productName: formData.productName,
        websiteInfo: formData.websiteInfo,
        isAdultContent: formData.isAdultContent,
        websiteType: formData.websiteType,
        isOwnerVerified: formData.isOwnerVerified,
        startDate: formData.startDate || undefined,
        endDate: formData.stopDate || undefined,
        socialPlatforms: formData.socialPlatforms,
        affiliateUrl: formData.affiliateUrl || undefined,
        isPaidPromotion: formData.isPaidPromotion,
        totalEarnings: formData.totalEarnings,
        tags: formData.tags,
        memo: formData.memo
      });

      showSuccess('ID configuration saved successfully');
      onSave();
    } catch (error) {
      handleError(error, {
        customTitle: 'Failed to save configuration',
        customMessage: 'Please check your input and try again'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSocialPlatform = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.includes(platformId)
        ? prev.socialPlatforms.filter((p: any) => p !== platformId)
        : [...prev.socialPlatforms, platformId]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Configure ID</h2>
                <p className="text-sm text-gray-600 mt-1">ID: {homId}</p>
              </div>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Website URL Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gray-600" />
                Website URL
              </h3>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  placeholder="https://example.com/product"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleReadUrl}
                  disabled={!formData.targetUrl || readingUrl || loading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {readingUrl ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reading...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      Read URL
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Manual Input Form */}
            <AnimatePresence>
              {showManualInput && (
                <ManualMetadataForm
                  onSubmit={(metadata) => {
                    setFormData(prev => ({
                      ...prev,
                      productName: metadata.title,
                      description: metadata.description || prev.description,
                      websiteInfo: {
                        ...prev.websiteInfo,
                        title: metadata.title,
                        description: metadata.description,
                        image: metadata.imageUrl
                      }
                    }));
                    setShowManualInput(false);
                  }}
                  onCancel={() => setShowManualInput(false)}
                />
              )}
            </AnimatePresence>

            {/* Website Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-600" />
                Website Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website Type
                  </label>
                  <select
                    value={formData.websiteType}
                    onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="PRODUCT">Product</option>
                    <option value="SERVICE">Service</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Screenshot Preview */}
            {formData.websiteInfo?.screenshot && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  Website Screen Capture
                </h3>
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={formData.websiteInfo.screenshot}
                    alt="Website preview"
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Auto-Captured
                  </span>
                </div>
              </div>
            )}

            {/* Content Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-600" />
                Content Questions
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAdultContent}
                    onChange={(e) => setFormData({ ...formData, isAdultContent: e.target.checked })}
                    className="w-4 h-4 text-blue-500 rounded"
                    disabled={loading}
                  />
                  <span className="text-gray-700">This is an adult or gambling website</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOwnerVerified}
                    onChange={(e) => setFormData({ ...formData, isOwnerVerified: e.target.checked })}
                    className="w-4 h-4 text-blue-500 rounded"
                    disabled={loading}
                  />
                  <span className="text-gray-700">I am the owner or administrator of this website</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPaidPromotion}
                    onChange={(e) => setFormData({ ...formData, isPaidPromotion: e.target.checked })}
                    className="w-4 h-4 text-blue-500 rounded"
                    disabled={loading}
                  />
                  <span className="text-gray-700">This is a paid promotion</span>
                </label>
              </div>
            </div>

            {/* Configuration Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stop Date
                  </label>
                  <input
                    type="date"
                    value={formData.stopDate}
                    onChange={(e) => setFormData({ ...formData, stopDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Social Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posted Social Medias
                </label>
                <div className="flex flex-wrap gap-2">
                  {socialPlatforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => toggleSocialPlatform(platform.id)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        formData.socialPlatforms.includes(platform.id)
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={loading}
                    >
                      <span className="mr-1">{platform.icon}</span>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Earnings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Earnings
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.totalEarnings}
                    onChange={(e) => setFormData({ ...formData, totalEarnings: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Memo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memo
                </label>
                <textarea
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Terms & Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="w-4 h-4 text-blue-500 rounded mt-0.5"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700">
                  I agree to the Terms & Conditions and understand that this ID will be subject to moderation
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!formData.termsAccepted || loading}
                  className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};