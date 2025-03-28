-- Create the jira_entries table
create table jira_entries (
  id bigint generated by default as identity primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  jira_number text not null,
  jira_title text not null,
  jira_status text not null,
  log_message text not null,
  user_id uuid references auth.users(id) not null
);

-- Create an index on the date column for faster queries
create index jira_entries_date_idx on jira_entries(date);

-- Create an index on user_id for faster queries
create index jira_entries_user_id_idx on jira_entries(user_id);

-- Create a unique constraint on jira_number and jira_title combination
create unique index jira_entries_unique_idx on jira_entries(jira_number, jira_title);

-- Enable Row Level Security (RLS)
alter table jira_entries enable row level security;

-- Create a policy that allows users to see only their own entries
create policy "Users can view their own entries"
  on jira_entries for select
  using (auth.uid() = user_id);

-- Create a policy that allows users to insert their own entries
create policy "Users can insert their own entries"
  on jira_entries for insert
  with check (auth.uid() = user_id);

-- Create a policy that allows users to update their own entries
create policy "Users can update their own entries"
  on jira_entries for update
  using (auth.uid() = user_id);

-- Create a policy that allows users to delete their own entries
create policy "Users can delete their own entries"
  on jira_entries for delete
  using (auth.uid() = user_id); 