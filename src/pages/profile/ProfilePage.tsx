import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../utils/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', mobile: '', membershipDate: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center mb-8 gap-4">
        <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center text-4xl font-bold text-teal-600 shadow-md">
          {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{profile.name || 'Profile'}</h1>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-teal-700 flex items-center gap-2">
              <span>Personal Information</span>
              <span className="inline-block w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">{profile.mobile || <span className='italic text-gray-400'>Not provided</span>}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Membership Date</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">{profile.membershipDate ? new Date(profile.membershipDate).toLocaleDateString() : <span className='italic text-gray-400'>N/A</span>}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Account Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Account Type</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">Standard</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Member Since</label>
                <p className="mt-1 text-gray-900 font-medium text-lg">May 1, 2025</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;