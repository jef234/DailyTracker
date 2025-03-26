import { supabase } from './supabase';

// Helper function to handle database errors
const handleDbError = (error, operation) => {
  console.error(`Error ${operation}:`, error);
  return { data: null, error: error.message };
};

// Helper function to check for duplicate entries
const checkDuplicateEntry = async (jira_number, jira_title, date, user_id, excludeId = null) => {
  let query = supabase
    .from('jira_entries')
    .select('id')
    .eq('jira_number', jira_number)
    .eq('jira_title', jira_title)
    .eq('date', date)
    .eq('user_id', user_id);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw error;
  }

  return data;
};

export const addJiraEntry = async ({ jira_number, jira_title, log_message, jira_status, date, user_id }) => {
  try {
    // Check for duplicate entry
    const existingEntry = await checkDuplicateEntry(jira_number, jira_title, date, user_id);
    
    if (existingEntry) {
      return { 
        data: null, 
        error: 'A log entry for this JIRA and date already exists. Please use a different date or update the existing entry.' 
      };
    }

    // Create new entry
    const { data, error } = await supabase
      .from('jira_entries')
      .insert([{
        jira_number,
        jira_title,
        log_message,
        jira_status,
        date,
        user_id
      }])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return handleDbError(error, 'adding JIRA entry');
  }
};

export const getJiraEntries = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('jira_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return handleDbError(error, 'fetching JIRA entries');
  }
};

export const getUniqueJiraEntries = async (userId) => {
  try {
    // Get all entries ordered by date (most recent first)
    const { data: allEntries, error: fetchError } = await supabase
      .from('jira_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (fetchError) throw fetchError;

    // Create a map to store the most recent entry for each JIRA number and title combination
    const mostRecentEntries = new Map();

    // Process entries to get the most recent one for each JIRA
    allEntries.forEach(entry => {
      const key = `${entry.jira_number}-${entry.jira_title}`;
      if (!mostRecentEntries.has(key)) {
        mostRecentEntries.set(key, entry);
      }
    });

    // Convert map values to array and filter out entries with 'Done' status
    const uniqueEntries = Array.from(mostRecentEntries.values())
      .filter(entry => entry.jira_status !== 'Done')
      .map(entry => ({
        jira_number: entry.jira_number,
        jira_title: entry.jira_title,
        jira_status: entry.jira_status
      }));

    return { data: uniqueEntries, error: null };
  } catch (error) {
    return handleDbError(error, 'fetching unique JIRA entries');
  }
};

export const deleteJiraEntry = async (id, userId) => {
  try {
    const { error } = await supabase
      .from('jira_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return handleDbError(error, 'deleting JIRA entry');
  }
};

export const updateJiraEntry = async (id, { log_message, jira_status, date }, userId) => {
  try {
    // Format the date to ensure it's in YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // Get the existing entry to check for duplicates
    const { data: existingEntry, error: checkError } = await supabase
      .from('jira_entries')
      .select('jira_number, jira_title')
      .eq('id', id)
      .single();

    if (checkError) throw checkError;

    // Check for duplicate entry
    const duplicateEntry = await checkDuplicateEntry(
      existingEntry.jira_number,
      existingEntry.jira_title,
      formattedDate,
      userId,
      id
    );

    if (duplicateEntry) {
      return {
        data: null,
        error: 'A log entry for this JIRA and date already exists. Please use a different date or update the existing entry.'
      };
    }

    // Update the entry
    const { data, error } = await supabase
      .from('jira_entries')
      .update({
        log_message,
        jira_status,
        date: formattedDate
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return handleDbError(error, 'updating JIRA entry');
  }
}; 