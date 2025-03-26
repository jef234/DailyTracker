-- Create jira_entries table
CREATE TABLE jira_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    jira_number TEXT NOT NULL,
    jira_title TEXT NOT NULL,
    log_message TEXT NOT NULL,
    jira_status TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(jira_number, jira_title, user_id, date)
);

-- Create index for faster queries
CREATE INDEX idx_jira_entries_user_date ON jira_entries(user_id, date); 