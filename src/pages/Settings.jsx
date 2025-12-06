import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  Loader, 
  ArrowLeft, 
  User, 
  Lock, 
  Mail, 
  Save, 
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Shield,
  CreditCard,
  Bell
} from 'lucide-react';

const Settings = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Active menu tab
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    creditEarned: true,
    promptUnlocked: true,
    emailNotifications: true,
    weeklyDigest: false,
  });
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Menu items
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal info' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & authentication' },
    { id: 'billing', label: 'Credits & Billing', icon: CreditCard, description: 'View your credits' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email preferences' },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/settings' } });
    }
  }, [user, authLoading, navigate]);

  // Populate form with current data
  useEffect(() => {
    if (user && profile) {
      setUsername(profile.username || user.user_metadata?.username || user.email?.split('@')[0] || '');
      setEmail(user.email || '');
      
      // Load notification preferences from profile
      if (profile.notification_preferences) {
        setNotifications({
          creditEarned: profile.notification_preferences.creditEarned ?? true,
          promptUnlocked: profile.notification_preferences.promptUnlocked ?? true,
          emailNotifications: profile.notification_preferences.emailNotifications ?? true,
          weeklyDigest: profile.notification_preferences.weeklyDigest ?? false,
        });
      }
    }
  }, [user, profile]);

  // Handle Notification Toggle
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle Save Notification Preferences
  const handleSaveNotifications = async () => {
    setNotifLoading(true);
    setNotifSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: notifications })
        .eq('id', user.id);

      if (error) throw error;

      refreshProfile();
      setNotifSuccess(true);
      toast.success('Notification preferences saved!');
      
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (error) {
      console.error('Notification save error:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setNotifLoading(false);
    }
  };

  // Handle Profile Update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setProfileLoading(true);
    setProfileSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data in context
      refreshProfile();
      
      setProfileSuccess(true);
      toast.success('Profile updated successfully!');
      
      // Reset success indicator after 3 seconds
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change with old password verification
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setPasswordLoading(true);

    try {
      // Step 1: Verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        setPasswordLoading(false);
        return;
      }

      // Step 2: Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5E6D3' }}>
        <Loader className="w-8 h-8 text-purple-700 animate-spin" />
      </div>
    );
  }

  // Not logged in (will redirect)
  if (!user) {
    return null;
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Profile Information</h2>
              <p className="text-purple-600">Update your personal details</p>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-purple-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Username (Editable) */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-lg text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                type="submit"
                disabled={profileLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  profileSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-lg hover:shadow-purple-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {profileLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : profileSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Updated!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Security Settings</h2>
              <p className="text-purple-600">Manage your password and account security</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-lg text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="Enter your current password"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-purple-200 pt-4">
                <p className="text-sm text-purple-600 mb-4">Enter your new password below</p>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-lg text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-purple-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-purple-200 rounded-lg text-purple-900 placeholder-purple-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Password Match Indicator */}
              {newPassword && confirmPassword && (
                <div className={`flex items-center gap-2 text-sm ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Passwords do not match
                    </>
                  )}
                </div>
              )}

              {/* Change Password Button */}
              <button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {passwordLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying & Changing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Credits & Billing</h2>
              <p className="text-purple-600">View your credit balance and purchase history</p>
            </div>

            {/* Credit Balance Card */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
              <p className="text-purple-200 text-sm mb-1">Available Credits</p>
              <p className="text-4xl font-bold">{profile?.credits || 0}</p>
              <p className="text-purple-200 text-sm mt-2">Use credits to unlock premium prompts</p>
            </div>

            {/* Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-purple-800 text-sm">
                💡 <strong>Tip:</strong> Watch ads or refer friends to earn more credits!
              </p>
            </div>

            {/* Account Info */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-600">Account Type</span>
                <span className="text-purple-900 font-medium capitalize">{profile?.role || 'User'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-purple-100">
                <span className="text-purple-600">Member Since</span>
                <span className="text-purple-900 font-medium">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-2">Notification Preferences</h2>
              <p className="text-purple-600">Choose what notifications you want to receive</p>
            </div>

            {/* Notification Options */}
            <div className="space-y-4">
              {/* Credit Earned */}
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Credit Earned</p>
                    <p className="text-sm text-purple-600">Get notified when you earn credits</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('creditEarned')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.creditEarned ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications.creditEarned ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Prompt Unlocked */}
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔓</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Prompt Unlocked</p>
                    <p className="text-sm text-purple-600">Get notified when you unlock a prompt</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('promptUnlocked')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.promptUnlocked ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications.promptUnlocked ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Email Notifications</p>
                    <p className="text-sm text-purple-600">Receive notifications via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('emailNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications.emailNotifications ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📬</span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Weekly Digest</p>
                    <p className="text-sm text-purple-600">Get a weekly summary of new prompts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('weeklyDigest')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.weeklyDigest ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications.weeklyDigest ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveNotifications}
              disabled={notifLoading}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                notifSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-lg hover:shadow-purple-500/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {notifLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : notifSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Preferences
                </>
              )}
            </button>

            {/* Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-purple-800 text-sm">
                💡 <strong>Note:</strong> You can change these preferences anytime. We'll respect your choices.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Account Settings</h1>
            <p className="text-purple-700">Manage your account preferences</p>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Menu */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 overflow-hidden shadow-lg">
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                      <div>
                        <p className={`font-medium ${isActive ? 'text-white' : 'text-purple-900'}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-purple-200' : 'text-purple-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 lg:p-8 shadow-lg min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
