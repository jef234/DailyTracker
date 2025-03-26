import { supabase } from './supabase';

export const addJiraEntry = async ({ jira_number, jira_title, log_message, jira_status, date, user_id }) => {
  try {
    // First, check if an entry with the same jira_number, jira_title, and date exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('jira_entries')
      .select('*')
      .eq('jira_number', jira_number)
      .eq('jira_title', jira_title)
      .eq('user_id', user_id)
      .eq('date', date)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw checkError;
    }

    if (existingEntry) {
      // If entry exists with same date, return error
      return { 
        data: null, 
        error: 'A log entry for this JIRA and date already exists. Please use a different date or update the existing entry.' 
      };
    }

    // If no entry exists with same date, create new entry
    const { data, error } = await supabase
      .from('jira_entries')
      .insert([
        {
          jira_number,
          jira_title,
          log_message,
          jira_status,
          date,
          user_id
        }
      ])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding JIRA entry:', error);
    return { data: null, error: error.message };
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
    console.error('Error fetching JIRA entries:', error);
    return { data: null, error: error.message };
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
    console.error('Error fetching unique JIRA entries:', error);
    return { data: null, error: error.message };
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
    console.error('Error deleting JIRA entry:', error);
    return { error };
  }
};

export const updateJiraEntry = async (id, { log_message, jira_status, date }, userId) => {
  try {
    // Format the date to ensure it's in YYYY-MM-DD format
    const formattedDate = new Date(date).toISOString().split('T')[0];

    // First check if an entry with the same jira_number, jira_title, and date exists
    const { data: existingEntry, error: checkError } = await supabase
      .from('jira_entries')
      .select('jira_number, jira_title')
      .eq('id', id)
      .single();

    if (checkError) throw checkError;

    // Check for duplicate entry with same jira_number, jira_title, and date
    const { data: duplicateEntry, error: duplicateError } = await supabase
      .from('jira_entries')
      .select('id')
      .eq('jira_number', existingEntry.jira_number)
      .eq('jira_title', existingEntry.jira_title)
      .eq('date', formattedDate)
      .eq('user_id', userId)
      .neq('id', id)
      .single();

    if (duplicateError && duplicateError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw duplicateError;
    }

    if (duplicateEntry) {
      return {
        data: null,
        error: 'A log entry for this JIRA and date already exists. Please use a different date or update the existing entry.'
      };
    }

    // If no duplicate exists, proceed with update
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
    console.error('Error updating JIRA entry:', error);
    return { data: null, error: error.message };
  }
}; 