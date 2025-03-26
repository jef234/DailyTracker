import { useState } from 'react';
import { deleteJiraEntry, updateJiraEntry } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

const JiraEntryList = ({ entries, onEntryDeleted, onEntryUpdated }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    log_message: '',
    jira_status: '',
    date: '',
    jira_number: '',
    jira_title: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!user || !user.id) {
      setError('Please log in to delete entries');
      return;
    }

    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      setError('');
      setLoading(true);
      const { error } = await deleteJiraEntry(id, user.id);
      if (error) throw error;
      onEntryDeleted(id);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({
      log_message: entry.log_message,
      jira_status: entry.jira_status,
      date: entry.date,
      jira_number: entry.jira_number,
      jira_title: entry.jira_title
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setError('Please log in to update entries');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Validate the form data
      if (!editForm.log_message.trim()) {
        setError('Log message is required');
        return;
      }

      if (!editForm.jira_status) {
        setError('JIRA status is required');
        return;
      }

      if (!editForm.date) {
        setError('Date is required');
        return;
      }

      const { data, error } = await updateJiraEntry(editingId, editForm, user.id);
      
      if (error) {
        setError(error);
        return;
      }

      if (!data || data.length === 0) {
        setError('Failed to update entry. No data returned.');
        return;
      }

      onEntryUpdated(data[0]);
      setEditingId(null);
      setEditForm({
        log_message: '',
        jira_status: '',
        date: '',
        jira_number: '',
        jira_title: ''
      });
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      log_message: '',
      jira_status: '',
      date: '',
      jira_number: '',
      jira_title: ''
    });
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No logs found for this date.</p>
      </div>
    );
  }

  // Filter out any invalid entries
  const validEntries = entries.filter(entry => 
    entry && 
    entry.id && 
    entry.jira_number && 
    entry.jira_title && 
    entry.log_message && 
    entry.jira_status && 
    entry.date
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {validEntries.map((entry) => (
        <div key={entry.id} className="bg-white shadow rounded-lg p-6">
          {editingId === entry.id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  JIRA Number
                </label>
                <input
                  type="text"
                  value={editForm.jira_number}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  JIRA Title
                </label>
                <input
                  type="text"
                  value={editForm.jira_title}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Log Message
                </label>
                <textarea
                  value={editForm.log_message}
                  onChange={(e) => setEditForm({ ...editForm, log_message: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  JIRA Status
                </label>
                <select
                  value={editForm.jira_status}
                  onChange={(e) => setEditForm({ ...editForm, jira_status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                  <option value="Blocked">Blocked</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {entry.jira_number} - {entry.jira_title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{entry.log_message}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  entry.jira_status === 'Done' ? 'bg-green-100 text-green-800' :
                  entry.jira_status === 'Blocked' ? 'bg-red-100 text-red-800' :
                  entry.jira_status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {entry.jira_status}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default JiraEntryList; 