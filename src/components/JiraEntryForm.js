import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addJiraEntry, getUniqueJiraEntries } from '../lib/db';

const JiraEntryForm = ({ onEntryAdded }) => {
  const { user } = useAuth();
  
  // Combine form fields into a single state object
  const [formData, setFormData] = useState({
    jiraNumber: '',
    jiraTitle: '',
    logMessage: '',
    jiraStatus: 'In Progress',
    date: ''
  });

  // Separate UI state
  const [uiState, setUiState] = useState({
    loading: false,
    error: '',
    showNumberSuggestions: false,
    showTitleSuggestions: false,
    maxDate: ''
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Get current date from server
    fetch('https://worldtimeapi.org/api/ip')
      .then(response => response.json())
      .then(data => {
        const serverDate = new Date(data.datetime);
        const formattedDate = serverDate.toISOString().split('T')[0];
        setUiState(prev => ({ ...prev, maxDate: formattedDate }));
        setFormData(prev => ({ ...prev, date: formattedDate }));
      })
      .catch(error => {
        console.error('Error fetching server date:', error);
        const today = new Date().toISOString().split('T')[0];
        setUiState(prev => ({ ...prev, maxDate: today }));
        setFormData(prev => ({ ...prev, date: today }));
      });
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user?.id) return;
      const { data, error } = await getUniqueJiraEntries(user.id);
      if (!error && data) {
        setSuggestions(data);
      }
    };
    fetchSuggestions();
  }, [user?.id]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setUiState(prev => ({ ...prev, error: 'Please log in to add entries' }));
      return;
    }

    try {
      setUiState(prev => ({ ...prev, error: '', loading: true }));

      const { data, error } = await addJiraEntry({
        jira_number: formData.jiraNumber,
        jira_title: formData.jiraTitle,
        log_message: formData.logMessage,
        jira_status: formData.jiraStatus,
        date: formData.date,
        user_id: user.id
      });

      if (error) {
        setUiState(prev => ({ ...prev, error }));
        return;
      }

      // Refresh suggestions after successful entry
      const { data: newSuggestions, error: suggestionsError } = await getUniqueJiraEntries(user.id);
      if (!suggestionsError) {
        setSuggestions(newSuggestions || []);
      }

      onEntryAdded(data[0]);
      
      // Reset form
      setFormData({
        jiraNumber: '',
        jiraTitle: '',
        logMessage: '',
        jiraStatus: 'In Progress',
        date: uiState.maxDate
      });
    } catch (err) {
      console.error('Error adding JIRA entry:', err);
      setUiState(prev => ({ ...prev, error: 'Failed to add entry. Please try again.' }));
    } finally {
      setUiState(prev => ({ ...prev, loading: false }));
    }
  }, [formData, user?.id, uiState.maxDate, onEntryAdded]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSuggestionSelect = useCallback((suggestion) => {
    setFormData(prev => ({
      ...prev,
      jiraNumber: suggestion.jira_number,
      jiraTitle: suggestion.jira_title
    }));
    setUiState(prev => ({
      ...prev,
      showNumberSuggestions: false,
      showTitleSuggestions: false
    }));
  }, []);

  // Memoize filtered suggestions
  const filteredNumberSuggestions = useMemo(() => 
    suggestions.filter(suggestion =>
      suggestion.jira_number.toLowerCase().includes(formData.jiraNumber.toLowerCase())
    ),
    [suggestions, formData.jiraNumber]
  );

  const filteredTitleSuggestions = useMemo(() => 
    suggestions.filter(suggestion =>
      suggestion.jira_title.toLowerCase().includes(formData.jiraTitle.toLowerCase())
    ),
    [suggestions, formData.jiraTitle]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {uiState.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{uiState.error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="relative">
          <label htmlFor="jira-number" className="block text-sm font-medium text-gray-700">
            JIRA Number
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="jira-number"
              value={formData.jiraNumber}
              onChange={(e) => {
                handleInputChange('jiraNumber', e.target.value);
                setUiState(prev => ({ ...prev, showNumberSuggestions: true }));
              }}
              onFocus={() => setUiState(prev => ({ ...prev, showNumberSuggestions: true }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., JIRA-123"
              required
            />
            {uiState.showNumberSuggestions && filteredNumberSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                {filteredNumberSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.jira_number}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.jira_number} - {suggestion.jira_title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <label htmlFor="jira-title" className="block text-sm font-medium text-gray-700">
            JIRA Title
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="jira-title"
              value={formData.jiraTitle}
              onChange={(e) => {
                handleInputChange('jiraTitle', e.target.value);
                setUiState(prev => ({ ...prev, showTitleSuggestions: true }));
              }}
              onFocus={() => setUiState(prev => ({ ...prev, showTitleSuggestions: true }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Implement new feature"
              required
            />
            {uiState.showTitleSuggestions && filteredTitleSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                {filteredTitleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.jira_number}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.jira_number} - {suggestion.jira_title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="log-message" className="block text-sm font-medium text-gray-700">
            Log Message
          </label>
          <div className="mt-1">
            <textarea
              id="log-message"
              rows={3}
              value={formData.logMessage}
              onChange={(e) => handleInputChange('logMessage', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="What did you work on?"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="jira-status" className="block text-sm font-medium text-gray-700">
            JIRA Status
          </label>
          <select
            id="jira-status"
            value={formData.jiraStatus}
            onChange={(e) => handleInputChange('jiraStatus', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Blocked">Blocked</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            max={uiState.maxDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={uiState.loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {uiState.loading ? 'Logging...' : 'Log Jira'}
        </button>
      </div>
    </form>
  );
};

export default JiraEntryForm; 