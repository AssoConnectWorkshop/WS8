create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "Public read access"
  on events
  for select
  using (true);

insert into events (title, description, location, starts_at, ends_at) values
  ('Réunion d''équipe', 'Point hebdomadaire de La best team', 'Salle Jupiter', '2026-06-23 09:30:00+02', '2026-06-23 10:30:00+02'),
  ('Atelier AssoConnect', 'Découverte de l''API CRM', 'Open space', '2026-06-23 14:00:00+02', '2026-06-23 16:00:00+02'),
  ('Déjeuner partenaires', 'Avec les bénévoles de l''association', 'Restaurant Le Padawan', '2026-06-24 12:30:00+02', '2026-06-24 14:00:00+02'),
  ('Démo produit', 'Présentation de l''agenda aux utilisateurs', 'Salle Saturne', '2026-06-25 11:00:00+02', '2026-06-25 12:00:00+02'),
  ('Rétrospective de sprint', 'Bilan et améliorations', 'Salle Mars', '2026-06-26 16:00:00+02', '2026-06-26 17:30:00+02'),
  ('Formation Supabase', 'Bases de données et migrations', 'Salle Vénus', '2026-06-29 10:00:00+02', '2026-06-29 12:00:00+02'),
  ('Assemblée générale', 'Réunion annuelle de l''association', 'Grand auditorium', '2026-07-02 18:00:00+02', '2026-07-02 20:00:00+02'),
  ('Soirée bénévoles', 'Moment convivial de fin de mois', 'Terrasse', '2026-07-03 19:30:00+02', '2026-07-03 23:00:00+02');
