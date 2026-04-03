create table if not exists quiz_submissions (
  id bigserial primary key,
  name text not null,
  score integer not null,
  total_questions integer not null,
  percentage integer not null,
  answers jsonb not null,
  created_at timestamptz not null default now()
);
