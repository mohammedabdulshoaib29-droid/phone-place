import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../utils/api';

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface UserProfile {
  phone: string;
  email: string;
  name: string;
  addresses: Address[];
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
  };
  loyaltyPoints: number;
  totalSpent: number;
  referralCode: string;
}

export default function UserProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'preferences'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [addressFormData, setAddressFormData] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
  });

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/auth/me');
        setProfile(data.user);
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
        });
        setPreferences(data.user.preferences);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Update profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const { data } = await api.put('/auth/profile', {
        name: formData.name,
        email: formData.email,
      });
      setProfile(data.user);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  // Update preferences
  const handleUpdatePreferences = async () => {
    try {
      setError('');
      const { data } = await api.put('/auth/profile', { preferences });
      setProfile(data.user);
      setSuccess('Preferences updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update preferences');
    }
  };

  // Add address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const { data } = await api.post('/auth/address', addressFormData);
      setProfile(data.user);
      setAddressFormData({
        label: 'Home',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        isDefault: false,
      });
      setShowAddressForm(false);
      setSuccess('Address added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add address');
    }
  };

  // Update address
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddressId || !profile) return;

    try {
      setError('');
      const { data } = await api.put(`/auth/address/${editingAddressId}`, addressFormData);
      setProfile(data.user);
      setAddressFormData({
        label: 'Home',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        isDefault: false,
      });
      setEditingAddressId(null);
      setShowAddressForm(false);
      setSuccess('Address updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update address');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setError('');
      const { data } = await api.delete(`/auth/address/${addressId}`);
      setProfile(data.user);
      setSuccess('Address deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete address');
    }
  };

  // Edit address
  const handleEditAddress = (address: Address) => {
    setAddressFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal pt-32 pb-20 px-8">
        <Breadcrumbs />
        <div className="flex justify-center items-center py-20">
          <div className="text-silver">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-charcoal pt-32 pb-20 px-8">
        <Breadcrumbs />
        <div className="flex justify-center items-center py-20">
          <div className="text-gold">Please log in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal pt-32 pb-20 px-8">
      <Breadcrumbs />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-display text-ivory mb-2">My Account</h1>
        <p className="text-silver mb-12">Manage your profile, addresses, and preferences</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-6 sticky top-32">
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-lg text-left font-body transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gold/20 text-gold'
                      : 'text-silver hover:bg-gold/10'
                  }`}
                >
                  📋 Personal Info
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`px-4 py-2 rounded-lg text-left font-body transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-gold/20 text-gold'
                      : 'text-silver hover:bg-gold/10'
                  }`}
                >
                  📍 Addresses
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-4 py-2 rounded-lg text-left font-body transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-gold/20 text-gold'
                      : 'text-silver hover:bg-gold/10'
                  }`}
                >
                  ⚙️ Preferences
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display text-ivory">Personal Information</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-body text-silver mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body text-silver mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body text-silver mb-2">Phone (Read-only)</label>
                      <input
                        type="text"
                        value={`+91 ${profile.phone}`}
                        disabled
                        className="w-full bg-charcoal/30 border border-gold/10 rounded-lg px-4 py-2 text-silver/50 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gold/20 text-gold hover:bg-gold/30 px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: profile.name || '',
                            email: profile.email || '',
                          });
                        }}
                        className="flex-1 bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-4">
                        <div className="text-xs text-silver/70 mb-2">Name</div>
                        <div className="text-lg text-ivory font-semibold">{profile.name || 'Not set'}</div>
                      </div>
                      <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-4">
                        <div className="text-xs text-silver/70 mb-2">Email</div>
                        <div className="text-lg text-ivory font-semibold">{profile.email || 'Not set'}</div>
                      </div>
                      <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-4">
                        <div className="text-xs text-silver/70 mb-2">Phone</div>
                        <div className="text-lg text-ivory font-semibold">+91 {profile.phone}</div>
                      </div>
                      <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-4">
                        <div className="text-xs text-silver/70 mb-2">Referral Code</div>
                        <div className="text-lg text-gold font-semibold">{profile.referralCode}</div>
                      </div>
                    </div>

                    {/* Loyalty & Spending */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gold/10">
                      <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-lg p-6">
                        <div className="text-sm text-silver mb-2">Loyalty Points</div>
                        <div className="text-3xl font-display text-gold">{profile.loyaltyPoints.toLocaleString()}</div>
                        <div className="text-xs text-silver/70 mt-2">Earn 1 point per ₹10 spent</div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-lg p-6">
                        <div className="text-sm text-silver mb-2">Total Spent</div>
                        <div className="text-3xl font-display text-emerald-400">
                          ₹{profile.totalSpent.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-silver/70 mt-2">Lifetime purchases</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display text-ivory">Saved Addresses</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddressId(null);
                        setAddressFormData({
                          label: 'Home',
                          street: '',
                          city: '',
                          state: '',
                          postalCode: '',
                          phone: '',
                          isDefault: false,
                        });
                      }}
                      className="px-4 py-2 bg-gold/20 text-gold hover:bg-gold/30 rounded-lg transition-all"
                    >
                      + Add Address
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form
                    onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress}
                    className="space-y-6 bg-charcoal/40 border border-gold/10 rounded-lg p-6 mb-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-body text-silver mb-2">Label</label>
                        <select
                          value={addressFormData.label}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, label: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                        >
                          <option>Home</option>
                          <option>Work</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-body text-silver mb-2">Phone</label>
                        <input
                          type="tel"
                          value={addressFormData.phone}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, phone: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-body text-silver mb-2">Street Address</label>
                        <input
                          type="text"
                          value={addressFormData.street}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, street: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-silver mb-2">City</label>
                        <input
                          type="text"
                          value={addressFormData.city}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, city: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-silver mb-2">State</label>
                        <input
                          type="text"
                          value={addressFormData.state}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, state: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-silver mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={addressFormData.postalCode}
                          onChange={(e) =>
                            setAddressFormData({ ...addressFormData, postalCode: e.target.value })
                          }
                          className="w-full bg-charcoal border border-gold/30 rounded-lg px-4 py-2 text-ivory focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addressFormData.isDefault}
                        onChange={(e) =>
                          setAddressFormData({ ...addressFormData, isDefault: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-gold/30"
                      />
                      <span className="text-sm text-silver">Set as default address</span>
                    </label>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gold/20 text-gold hover:bg-gold/30 px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        {editingAddressId ? 'Update Address' : 'Add Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                        }}
                        className="flex-1 bg-gray-600/20 text-gray-400 hover:bg-gray-600/30 px-6 py-2 rounded-lg transition-all font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : null}

                {profile.addresses.length === 0 ? (
                  <div className="text-center py-12 text-silver/50">
                    No addresses saved yet. Add one to get started!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border rounded-lg p-6 transition-all ${
                          address.isDefault
                            ? 'bg-gold/5 border-gold/40'
                            : 'bg-charcoal/40 border-gold/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gold">{address.label}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-gold/70 hover:text-gold text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-400/70 hover:text-red-400 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-silver/80 space-y-1">
                          <div>{address.street}</div>
                          <div>
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div className="text-silver/60 mt-2">📱 {address.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-8">
                <h2 className="text-2xl font-display text-ivory mb-8">Communication Preferences</h2>

                <div className="space-y-6">
                  <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-ivory">Email Notifications</h3>
                        <p className="text-sm text-silver/70 mt-1">
                          Receive order updates and promotions via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded border-gold/30 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-ivory">SMS Notifications</h3>
                        <p className="text-sm text-silver/70 mt-1">
                          Receive quick order updates via SMS
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.smsNotifications}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            smsNotifications: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded border-gold/30 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-charcoal/40 border border-gold/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-ivory">Order Updates</h3>
                        <p className="text-sm text-silver/70 mt-1">
                          Get notified about shipping, delivery, and returns
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.orderUpdates}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            orderUpdates: e.target.checked,
                          })
                        }
                        className="w-6 h-6 rounded border-gold/30 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpdatePreferences}
                    className="w-full bg-gold/20 text-gold hover:bg-gold/30 px-6 py-3 rounded-lg transition-all font-semibold mt-8"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
