import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

type ReturnReason = 'damaged' | 'defective' | 'wrong-item' | 'not-as-described' | 'changed-mind' | 'expired' | 'other';

interface ReturnRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  onSuccess: () => void;
}

export default function ReturnRequestModal({
  isOpen,
  onClose,
  orderId,
  productId,
  productName,
  quantity,
  price,
  onSuccess,
}: ReturnRequestModalProps) {
  const { token } = useAuth();
  const [reason, setReason] = useState<ReturnReason>('damaged');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const reasons: { value: ReturnReason; label: string }[] = [
    { value: 'damaged', label: 'Damaged or Defective' },
    { value: 'defective', label: 'Manufacturing Defect' },
    { value: 'wrong-item', label: 'Wrong Item Sent' },
    { value: 'not-as-described', label: 'Not as Described' },
    { value: 'changed-mind', label: 'Changed Mind' },
    { value: 'expired', label: 'Expired Product' },
    { value: 'other', label: 'Other' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages].slice(0, 3)); // Max 3 images
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!description.trim()) {
      setError('Please provide a description of the issue');
      return;
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/returns',
        {
          orderId,
          productId,
          quantity,
          reason,
          description,
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setReason('damaged');
          setDescription('');
          setImages([]);
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to submit return request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-carbon rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-carbon border-b border-gold/20 p-6 flex items-center justify-between">
          <h2 className="text-gold font-semibold text-xl">Request Return</h2>
          <button
            onClick={onClose}
            className="text-silver hover:text-gold transition-colors text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-slate-800/50 border border-gold/10 rounded-lg p-4">
            <p className="text-silver text-sm mb-1">Product</p>
            <h3 className="text-ivory font-semibold">{productName}</h3>
            <p className="text-gold text-sm">
              Qty: {quantity} × ₹{price.toLocaleString('en-IN')} = ₹{(quantity * price).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-4 text-emerald-300">
              ✓ Return request submitted successfully! You'll receive an email confirmation shortly.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-silver font-medium text-sm mb-3">
              Reason for Return *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-silver font-medium text-sm mb-3">
              Describe the Issue * (min 20 characters)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about the issue..."
              className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              rows={5}
            />
            <p className="text-slate-400 text-xs mt-2">
              {description.length}/500 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-silver font-medium text-sm mb-3">
              Upload Photos (Optional - Max 3)
            </label>
            <div className="border-2 border-dashed border-emerald-500/30 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={images.length >= 3}
                className="hidden"
                id="image-input"
              />
              <label
                htmlFor="image-input"
                className={`cursor-pointer flex flex-col items-center ${
                  images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="text-3xl mb-2">📸</span>
                <p className="text-silver text-sm">
                  {images.length >= 3
                    ? 'Maximum 3 images uploaded'
                    : 'Click to upload photos or drag and drop'}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  PNG, JPG, GIF (Max 5MB each)
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-24 object-cover rounded border border-gold/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gold/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gold/30 text-silver hover:bg-gold/5 rounded font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
