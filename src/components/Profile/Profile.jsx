import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addresses: JSON.parse(localStorage.getItem('addresses')) || []
  });

  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    address: '',
    locality: '',
    cityDistrict: '',
    addressType: 'Home',
    weekends: {
      saturday: false,
      sunday: false
    },
    isDefault: false
  });

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(profileData.addresses));
  }, [profileData.addresses]);

  // Add remove address function
  const handleRemoveAddress = (index) => {
    const newAddresses = profileData.addresses.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'saturday' || name === 'sunday') {
        setNewAddress(prev => ({
          ...prev,
          weekends: {
            ...prev.weekends,
            [name]: checked
          }
        }));
      } else {
        setNewAddress(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setNewAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      addresses: [...prev.addresses, newAddress]
    }));
    setShowAddressForm(false);
    setNewAddress({
      name: '',
      mobile: '',
      pincode: '',
      state: '',
      address: '',
      locality: '',
      cityDistrict: '',
      addressType: 'Home',
      weekends: {
        saturday: false,
        sunday: false
      },
      isDefault: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
          
         

          {/* Addresses Section */}
          <div className="bg-white shadow rounded-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
              <button
                onClick={() => setShowAddressForm(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              >
                Add New Address
              </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
  {profileData.addresses.map((address, index) => (
    <div key={index} className="border rounded-lg p-4 flex flex-col justify-between">
      <div>
        <p className="font-semibold">{address.name}</p>
        <p>{address.address}</p>
        <p>{address.locality}, {address.cityDistrict}</p>
        <p>{address.state} - {address.pincode}</p>
        <p>Mobile: {address.mobile}</p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleRemoveAddress(index)}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  ))}
</div>

          </div>
      
          {/* Address Form Modal */}
          {showAddressForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name *"
                      value={newAddress.name}
                      onChange={handleAddressChange}
                      className="border p-2 rounded-md"
                      required
                    />
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile *"
                      value={newAddress.mobile}
                      onChange={handleAddressChange}
                      className="border p-2 rounded-md"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      className="border p-2 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={handleAddressChange}
                      className="border p-2 rounded-md"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Address (House No, Building, Street, Area) *"
                    value={newAddress.address}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full"
                    required
                  />

                  <input
                    type="text"
                    name="locality"
                    placeholder="Locality/Town *"
                    value={newAddress.locality}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full"
                    required
                  />

                  <input
                    type="text"
                    name="cityDistrict"
                    placeholder="City/District *"
                    value={newAddress.cityDistrict}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full"
                    required
                  />

                  <div className="space-y-3">
                    <p className="font-medium">Type of Address *</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressType"
                          value="Home"
                          checked={newAddress.addressType === 'Home'}
                          onChange={handleAddressChange}
                        />
                        Home
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressType"
                          value="Office"
                          checked={newAddress.addressType === 'Office'}
                          onChange={handleAddressChange}
                        />
                        Office
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p>Is your office open on weekends?</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="saturday"
                          checked={newAddress.weekends.saturday}
                          onChange={handleAddressChange}
                        />
                        Open on Saturday
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="sunday"
                          checked={newAddress.weekends.sunday}
                          onChange={handleAddressChange}
                        />
                        Open on Sunday
                      </label>
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressChange}
                    />
                    Make this as my default address
                  </label>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;