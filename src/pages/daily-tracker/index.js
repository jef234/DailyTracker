import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getJiraEntries } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import JiraEntryForm from '../../components/JiraEntryForm';
import JiraEntryList from '../../components/JiraEntryList';

const DailyTracker = () => {
  const { user, signOut, deleteAccount } = useAuth();
  const router = useRouter();
  
  // Combine related state
  const [state, setState] = useState({
    entries: [],
    loading: true,
    error: '',
    showDropdown: false,
    showDeleteConfirm: false,
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchEntries();
  }, [user, router]);

  const fetchEntries = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: '' }));
      const { data, error } = await getJiraEntries(user.id);
      if (error) throw error;
      setState(prev => ({ ...prev, entries: data || [] }));
    } catch (err) {
      console.error('Error fetching entries:', err);
      setState(prev => ({ ...prev, error: 'Failed to fetch entries. Please try again.' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user?.id]);

  const handleEntryAdded = useCallback((newEntry) => {
    setState(prev => ({
      ...prev,
      entries: [newEntry, ...prev.entries]
    }));
  }, []);

  const handleEntryDeleted = useCallback((deletedId) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== deletedId)
    }));
  }, []);

  const handleEntryUpdated = useCallback((updatedEntry) => {
    setState(prev => ({
      ...prev,
      entries: prev.entries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    }));
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, router]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: '', loading: true }));
      await deleteAccount();
      router.push('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      setState(prev => ({ ...prev, error: 'Failed to delete account. Please try again.' }));
    } finally {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        showDeleteConfirm: false 
      }));
    }
  }, [deleteAccount, router]);

  const handleSwitchAccount = useCallback(() => {
    setState(prev => ({ ...prev, showDropdown: false }));
    router.push('/login');
  }, [router]);

  // Memoize filtered entries
  const filteredEntries = useMemo(() => {
    return state.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(state.dateRange.start);
      const endDate = new Date(state.dateRange.end);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }, [state.entries, state.dateRange]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Daily JIRA Tracker</h1>
            <div className="relative">
              <button
                onClick={() => setState(prev => ({ ...prev, showDropdown: !prev.showDropdown }))}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <span>{user.email}</span>
                <svg 
                  className={`w-4 h-4 transform transition-transform ${state.showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {state.showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="/reset-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setState(prev => ({ ...prev, showDropdown: false }))}
                  >
                    Change Password
                  </a>
                  <button
                    onClick={handleSwitchAccount}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => setState(prev => ({ 
                      ...prev, 
                      showDropdown: false,
                      showDeleteConfirm: true 
                    }))}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Account
                  </button>
                  <button
                    onClick={() => {
                      setState(prev => ({ ...prev, showDropdown: false }));
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{state.error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Log Jira</h2>
            <JiraEntryForm onEntryAdded={handleEntryAdded} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Jira Logs</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                    From:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={state.dateRange.start}
                    onChange={(e) => setState(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: e.target.value } 
                    }))}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                    To:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={state.dateRange.end}
                    onChange={(e) => setState(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: e.target.value } 
                    }))}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            {state.loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <JiraEntryList 
                entries={filteredEntries} 
                onEntryDeleted={handleEntryDeleted}
                onEntryUpdated={handleEntryUpdated}
              />
            )}
          </div>
        </div>
      </main>

      {state.showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setState(prev => ({ ...prev, showDeleteConfirm: false }))}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker; 