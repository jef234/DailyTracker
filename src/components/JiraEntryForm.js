import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addJiraEntry, getUniqueJiraEntries } from '../lib/db';

const JiraEntryForm = ({ onEntryAdded }) => {
  const { user } = useAuth();
  const [jiraNumber, setJiraNumber] = useState('');
  const [jiraTitle, setJiraTitle] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [jiraStatus, setJiraStatus] = useState('In Progress');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showNumberSuggestions, setShowNumberSuggestions] = useState(false);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    // Get current date from server
    fetch('https://worldtimeapi.org/api/ip')
      .then(response => response.json())
      .then(data => {
        const serverDate = new Date(data.datetime);
        setMaxDate(serverDate.toISOString().split('T')[0]);
        setDate(serverDate.toISOString().split('T')[0]);
      })
      .catch(error => {
        console.error('Error fetching server date:', error);
        setMaxDate(new Date().toISOString().split('T')[0]);
        setDate(new Date().toISOString().split('T')[0]);
      });
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user || !user.id) return;
      const { data, error } = await getUniqueJiraEntries(user.id);
      if (!error && data) {
        setSuggestions(data);
      }
    };
    fetchSuggestions();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      setError('Please log in to add entries');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const { data, error } = await addJiraEntry({
        jira_number: jiraNumber,
        jira_title: jiraTitle,
        log_message: logMessage,
        jira_status: jiraStatus,
        date: date,
        user_id: user.id
      });

      if (error) {
        setError(error);
        return;
      }

      // Refresh suggestions after successful entry
      const { data: newSuggestions, error: suggestionsError } = await getUniqueJiraEntries(user.id);
      if (!suggestionsError) {
        setSuggestions(newSuggestions || []);
      }

      onEntryAdded(data[0]);
      setJiraNumber('');
      setJiraTitle('');
      setLogMessage('');
      setJiraStatus('In Progress');
      setDate(maxDate);
    } catch (err) {
      console.error('Error adding JIRA entry:', err);
      setError('Failed to add entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredNumberSuggestions = suggestions.filter(suggestion =>
    suggestion.jira_number.toLowerCase().includes(jiraNumber.toLowerCase())
  );

  const filteredTitleSuggestions = suggestions.filter(suggestion =>
    suggestion.jira_title.toLowerCase().includes(jiraTitle.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
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
              value={jiraNumber}
              onChange={(e) => {
                setJiraNumber(e.target.value);
                setShowNumberSuggestions(true);
              }}
              onFocus={() => setShowNumberSuggestions(true)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., JIRA-123"
              required
            />
            {showNumberSuggestions && filteredNumberSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                {filteredNumberSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.jira_number}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setJiraNumber(suggestion.jira_number);
                      setJiraTitle(suggestion.jira_title);
                      setShowNumberSuggestions(false);
                    }}
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
              value={jiraTitle}
              onChange={(e) => {
                setJiraTitle(e.target.value);
                setShowTitleSuggestions(true);
              }}
              onFocus={() => setShowTitleSuggestions(true)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Implement new feature"
              required
            />
            {showTitleSuggestions && filteredTitleSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                {filteredTitleSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.jira_number}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setJiraNumber(suggestion.jira_number);
                      setJiraTitle(suggestion.jira_title);
                      setShowTitleSuggestions(false);
                    }}
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
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
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
            value={jiraStatus}
            onChange={(e) => setJiraStatus(e.target.value)}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Logging...' : 'Log Jira'}
        </button>
      </div>
    </form>
  );
};

export default JiraEntryForm; 