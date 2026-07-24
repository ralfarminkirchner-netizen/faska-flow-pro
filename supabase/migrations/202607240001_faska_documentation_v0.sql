-- FASKA Dokumentation v0
--
-- Production-oriented schema blueprint for a protected team prototype.
-- This migration is intentionally not wired to the public local alpha yet.
-- It keeps source, interpretation, curriculum proposals, human review,
-- effects, assets and AI/model runs as distinct record families.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Identity, organizations and roles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}$'),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'reviewer', 'educator', 'observer')),
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create or replace function public.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create or replace function public.has_org_role(target_organization_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.has_org_role(uuid, text[]) from public;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;

create or replace function public.bootstrap_organization_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_memberships (
    organization_id,
    user_id,
    role,
    status,
    created_by
  ) values (
    new.id,
    new.created_by,
    'admin',
    'active',
    new.created_by
  );
  return new;
end;
$$;

create trigger organizations_bootstrap_owner
  after insert on public.organizations
  for each row execute function public.bootstrap_organization_owner();

-- ---------------------------------------------------------------------------
-- Minimal learner anchors and immutable source records
-- ---------------------------------------------------------------------------

create table public.learner_anchors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  display_label text not null,
  external_reference_hash text,
  purpose_scope text not null default 'pedagogical_documentation',
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (organization_id, external_reference_hash)
);

comment on table public.learner_anchors is
  'Minimal pseudonymous anchor. This is not a personality or diagnostic profile.';

create table public.source_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  learner_anchor_id uuid references public.learner_anchors(id) on delete restrict,
  source_type text not null check (source_type in (
    'observation', 'child_self_report', 'adult_report', 'image', 'audio',
    'video', 'drawing', 'artifact', 'document', 'effect_observation'
  )),
  occurred_at timestamptz,
  recorded_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb,
  storage_object_path text,
  sensitivity text not null default 'confidential' check (sensitivity in (
    'internal', 'confidential', 'highly_confidential'
  )),
  purpose text not null,
  content_hash text,
  created_by uuid not null references auth.users(id),
  supersedes_source_record_id uuid references public.source_records(id) on delete restrict,
  created_at timestamptz not null default now()
);

comment on table public.source_records is
  'Append-only source family. Corrections create a new record and supersession reference.';

-- ---------------------------------------------------------------------------
-- Episodes, versions, statements and status assignments
-- ---------------------------------------------------------------------------

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  learner_anchor_id uuid references public.learner_anchors(id) on delete restrict,
  opened_by uuid not null references auth.users(id),
  opened_at timestamptz not null default now()
);

create table public.episode_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  episode_id uuid not null references public.episodes(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  primary_source_record_id uuid not null references public.source_records(id) on delete restrict,
  title text,
  occurred_at timestamptz,
  context jsonb not null default '{}'::jsonb,
  scope jsonb not null default '{}'::jsonb,
  created_by uuid not null references auth.users(id),
  supersedes_episode_version_id uuid references public.episode_versions(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (episode_id, version_number)
);

create table public.episode_statements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  episode_version_id uuid not null references public.episode_versions(id) on delete restrict,
  statement_type text not null check (statement_type in (
    'direct_observation', 'reported_quote', 'pattern_candidate',
    'functional_hypothesis', 'alternative_explanation', 'open_question',
    'boundary', 'child_contestation', 'adult_contestation'
  )),
  body text not null,
  epistemic_status text not null check (epistemic_status in (
    'observed', 'reported', 'candidate', 'hypothesis', 'contested', 'reviewed'
  )),
  claim_ceiling text not null default 'episode_only' check (claim_ceiling in (
    'episode_only', 'cross_episode_candidate', 'local_practice_hypothesis'
  )),
  evidence_refs jsonb not null default '[]'::jsonb,
  uncertainty_note text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.episode_status_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  episode_id uuid not null references public.episodes(id) on delete restrict,
  episode_version_id uuid references public.episode_versions(id) on delete restrict,
  status text not null check (status in (
    'draft', 'reviewed', 'contested', 'revised', 'archived', 'sealed'
  )),
  reason text not null,
  scope jsonb not null default '{}'::jsonb,
  assigned_by uuid not null references auth.users(id),
  supersedes_assignment_id uuid references public.episode_status_assignments(id) on delete restrict,
  assigned_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Versioned curriculum registry and human-reviewed links
-- ---------------------------------------------------------------------------

create table public.curriculum_sources (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null default 'Baden-Württemberg',
  school_type text not null default 'Grundschule',
  subject text not null,
  version_label text not null,
  published_at date,
  effective_from date,
  effective_to date,
  source_url text not null,
  source_hash text,
  verification_status text not null default 'metadata_only' check (verification_status in (
    'metadata_only', 'retrieved', 'hash_verified', 'superseded'
  )),
  created_at timestamptz not null default now(),
  unique (jurisdiction, school_type, subject, version_label)
);

create table public.curriculum_nodes (
  id uuid primary key default gen_random_uuid(),
  curriculum_source_id uuid not null references public.curriculum_sources(id) on delete restrict,
  node_code text not null,
  title text not null,
  body text,
  parent_node_id uuid references public.curriculum_nodes(id) on delete restrict,
  source_url text not null,
  created_at timestamptz not null default now(),
  unique (curriculum_source_id, node_code)
);

create table public.curriculum_link_candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  episode_version_id uuid not null references public.episode_versions(id) on delete restrict,
  curriculum_node_id uuid not null references public.curriculum_nodes(id) on delete restrict,
  support_level text not null check (support_level in ('direct', 'related', 'speculative')),
  evidence_excerpt text not null,
  reasoning_note text,
  scope jsonb not null default '{}'::jsonb,
  proposed_by_type text not null check (proposed_by_type in ('human', 'rule', 'model')),
  proposed_by_user_id uuid references auth.users(id),
  model_run_id uuid,
  created_at timestamptz not null default now(),
  unique (episode_version_id, curriculum_node_id)
);

create table public.curriculum_link_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  candidate_id uuid not null references public.curriculum_link_candidates(id) on delete restrict,
  disposition text not null check (disposition in (
    'accepted', 'rejected', 'contested', 'needs_source_review', 'left_open'
  )),
  reason text,
  reviewed_by uuid not null references auth.users(id),
  supersedes_review_id uuid references public.curriculum_link_reviews(id) on delete restrict,
  reviewed_at timestamptz not null default now()
);

-- Metadata-only source records. Full node import must be separately licensed,
-- retrieved, hashed and reviewed before production use.
insert into public.curriculum_sources (
  subject, version_label, published_at, source_url, verification_status
) values
  ('Deutsch', 'BP2016.V2', date '2024-02-29', 'https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/D.V2', 'metadata_only'),
  ('Mathematik', 'BP2016.V2', date '2024-02-29', 'https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/M.V2', 'metadata_only'),
  ('Sachunterricht', 'BP2016', null, 'https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/GS/SU', 'metadata_only')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Activities, optional offers and effect observations
-- ---------------------------------------------------------------------------

create table public.learning_activity_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  activity_key text not null,
  title text not null,
  source_repository text,
  source_ref text,
  manifest jsonb not null,
  audit_status text not null default 'candidate' check (audit_status in (
    'candidate', 'runtime_test_required', 'reviewed', 'accepted', 'archived'
  )),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique nulls not distinct (organization_id, activity_key, source_ref)
);

create table public.learning_offers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  learner_anchor_id uuid references public.learner_anchors(id) on delete restrict,
  source_episode_version_id uuid not null references public.episode_versions(id) on delete restrict,
  activity_catalog_id uuid references public.learning_activity_catalog(id) on delete restrict,
  offer_kind text not null,
  title text not null,
  prepared_environment text not null,
  observation_question text not null,
  inference_boundary text not null,
  personalization_scope jsonb not null default '{}'::jsonb,
  status text not null default 'proposal' check (status = 'proposal'),
  created_by_type text not null check (created_by_type in ('human', 'rule', 'model')),
  created_by_user_id uuid references auth.users(id),
  model_run_id uuid,
  created_at timestamptz not null default now()
);

create table public.learning_offer_dispositions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  offer_id uuid not null references public.learning_offers(id) on delete restrict,
  disposition text not null check (disposition in (
    'accepted', 'adapted', 'declined', 'postponed', 'withdrawn', 'completed'
  )),
  note text,
  decided_by uuid not null references auth.users(id),
  supersedes_disposition_id uuid references public.learning_offer_dispositions(id) on delete restrict,
  decided_at timestamptz not null default now()
);

create table public.effect_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  offer_id uuid references public.learning_offers(id) on delete restrict,
  source_record_id uuid not null references public.source_records(id) on delete restrict,
  body text not null,
  epistemic_status text not null default 'observed' check (epistemic_status in (
    'observed', 'reported', 'hypothesis', 'contested', 'reviewed'
  )),
  causal_claim_prohibited boolean not null default true check (causal_claim_prohibited),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Visual assets: source, variant, machine pre-audit, human review and rights
-- ---------------------------------------------------------------------------

create table public.asset_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  asset_key text not null,
  title text not null,
  creator_label text not null,
  original_storage_path text not null,
  content_hash text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique nulls not distinct (organization_id, asset_key)
);

create table public.asset_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  asset_source_id uuid not null references public.asset_sources(id) on delete restrict,
  variant_type text not null check (variant_type in ('original', 'cutout', 'retouched', 'derived')),
  version_number integer not null check (version_number > 0),
  storage_path text not null,
  mime_type text not null,
  width_px integer check (width_px > 0),
  height_px integer check (height_px > 0),
  content_hash text,
  supersedes_variant_id uuid references public.asset_variants(id) on delete restrict,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (asset_source_id, variant_type, version_number)
);

create table public.asset_automatic_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  asset_variant_id uuid not null references public.asset_variants(id) on delete restrict,
  audit_version text not null,
  indicators jsonb not null,
  recommendation text not null check (recommendation in ('candidate', 'rework', 'unavailable')),
  automatic_acceptance boolean not null default false check (not automatic_acceptance),
  created_at timestamptz not null default now()
);

create table public.asset_visual_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  asset_variant_id uuid not null references public.asset_variants(id) on delete restrict,
  disposition text not null check (disposition in ('accepted', 'rework', 'rejected')),
  note text,
  reviewed_by uuid not null references auth.users(id),
  supersedes_review_id uuid references public.asset_visual_reviews(id) on delete restrict,
  reviewed_at timestamptz not null default now()
);

create table public.asset_rights_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete restrict,
  asset_source_id uuid not null references public.asset_sources(id) on delete restrict,
  rights_scope text not null,
  permitted_uses text[] not null default '{}',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  revoked_at timestamptz,
  granted_by uuid not null references auth.users(id),
  evidence_note text not null,
  supersedes_grant_id uuid references public.asset_rights_grants(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Model runs and append-only transition ledger
-- ---------------------------------------------------------------------------

create table public.model_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  operation_type text not null,
  provider text not null,
  model_name text not null,
  prompt_version text not null,
  schema_version text not null,
  input_refs jsonb not null default '[]'::jsonb,
  output_payload jsonb,
  output_hash text,
  run_status text not null check (run_status in (
    'proposed', 'refused', 'incomplete', 'error', 'human_reviewed'
  )),
  created_by uuid not null references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.model_runs is
  'Model output is always a proposal. This record cannot authorize curriculum links, reports or learner claims.';

alter table public.curriculum_link_candidates
  add constraint curriculum_link_candidates_model_run_fk
  foreign key (model_run_id) references public.model_runs(id) on delete restrict;

alter table public.learning_offers
  add constraint learning_offers_model_run_fk
  foreign key (model_run_id) references public.model_runs(id) on delete restrict;

create table public.transition_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  case_id uuid not null,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  actor_type text not null check (actor_type in ('human', 'model', 'rule', 'system')),
  actor_user_id uuid references auth.users(id),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index transition_events_case_time_idx
  on public.transition_events (organization_id, case_id, created_at);
create index episode_versions_episode_idx
  on public.episode_versions (episode_id, version_number desc);
create index episode_statements_version_idx
  on public.episode_statements (episode_version_id, statement_type);
create index curriculum_candidates_episode_idx
  on public.curriculum_link_candidates (episode_version_id);
create index learning_offers_episode_idx
  on public.learning_offers (source_episode_version_id);

create or replace function public.reject_append_only_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'This table is append-only; create a successor or status assignment instead.';
end;
$$;

create trigger source_records_append_only
  before update or delete on public.source_records
  for each row execute function public.reject_append_only_mutation();
create trigger episode_versions_append_only
  before update or delete on public.episode_versions
  for each row execute function public.reject_append_only_mutation();
create trigger episode_statements_append_only
  before update or delete on public.episode_statements
  for each row execute function public.reject_append_only_mutation();
create trigger transition_events_append_only
  before update or delete on public.transition_events
  for each row execute function public.reject_append_only_mutation();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.learner_anchors enable row level security;
alter table public.source_records enable row level security;
alter table public.episodes enable row level security;
alter table public.episode_versions enable row level security;
alter table public.episode_statements enable row level security;
alter table public.episode_status_assignments enable row level security;
alter table public.curriculum_sources enable row level security;
alter table public.curriculum_nodes enable row level security;
alter table public.curriculum_link_candidates enable row level security;
alter table public.curriculum_link_reviews enable row level security;
alter table public.learning_activity_catalog enable row level security;
alter table public.learning_offers enable row level security;
alter table public.learning_offer_dispositions enable row level security;
alter table public.effect_observations enable row level security;
alter table public.asset_sources enable row level security;
alter table public.asset_variants enable row level security;
alter table public.asset_automatic_audits enable row level security;
alter table public.asset_visual_reviews enable row level security;
alter table public.asset_rights_grants enable row level security;
alter table public.model_runs enable row level security;
alter table public.transition_events enable row level security;

create policy profiles_self_select on public.profiles
  for select to authenticated using (id = auth.uid());
create policy profiles_self_insert on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy profiles_self_update on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy organizations_member_select on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy organizations_create on public.organizations
  for insert to authenticated with check (created_by = auth.uid());
create policy organizations_admin_update on public.organizations
  for update to authenticated using (public.has_org_role(id, array['admin']))
  with check (public.has_org_role(id, array['admin']));

create policy memberships_member_select on public.organization_memberships
  for select to authenticated using (public.is_org_member(organization_id));
create policy memberships_admin_insert on public.organization_memberships
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin']) and created_by = auth.uid()
  );
create policy memberships_admin_update on public.organization_memberships
  for update to authenticated using (public.has_org_role(organization_id, array['admin']))
  with check (public.has_org_role(organization_id, array['admin']));

-- Helper macro expressed as explicit policies for auditability.
create policy learner_anchors_select on public.learner_anchors
  for select to authenticated using (public.is_org_member(organization_id));
create policy learner_anchors_insert on public.learner_anchors
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy source_records_select on public.source_records
  for select to authenticated using (public.is_org_member(organization_id));
create policy source_records_insert on public.source_records
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy episodes_select on public.episodes
  for select to authenticated using (public.is_org_member(organization_id));
create policy episodes_insert on public.episodes
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and opened_by = auth.uid()
  );

create policy episode_versions_select on public.episode_versions
  for select to authenticated using (public.is_org_member(organization_id));
create policy episode_versions_insert on public.episode_versions
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy episode_statements_select on public.episode_statements
  for select to authenticated using (public.is_org_member(organization_id));
create policy episode_statements_insert on public.episode_statements
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy episode_status_select on public.episode_status_assignments
  for select to authenticated using (public.is_org_member(organization_id));
create policy episode_status_insert on public.episode_status_assignments
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer'])
    and assigned_by = auth.uid()
  );

create policy curriculum_sources_authenticated_select on public.curriculum_sources
  for select to authenticated using (true);
create policy curriculum_nodes_authenticated_select on public.curriculum_nodes
  for select to authenticated using (true);

create policy curriculum_candidates_select on public.curriculum_link_candidates
  for select to authenticated using (public.is_org_member(organization_id));
create policy curriculum_candidates_insert on public.curriculum_link_candidates
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and (proposed_by_user_id is null or proposed_by_user_id = auth.uid())
  );
create policy curriculum_reviews_select on public.curriculum_link_reviews
  for select to authenticated using (public.is_org_member(organization_id));
create policy curriculum_reviews_insert on public.curriculum_link_reviews
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer'])
    and reviewed_by = auth.uid()
  );

create policy activities_select on public.learning_activity_catalog
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy activities_insert on public.learning_activity_catalog
  for insert to authenticated with check (
    organization_id is not null
    and public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy offers_select on public.learning_offers
  for select to authenticated using (public.is_org_member(organization_id));
create policy offers_insert on public.learning_offers
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and (created_by_user_id is null or created_by_user_id = auth.uid())
  );
create policy offer_dispositions_select on public.learning_offer_dispositions
  for select to authenticated using (public.is_org_member(organization_id));
create policy offer_dispositions_insert on public.learning_offer_dispositions
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and decided_by = auth.uid()
  );
create policy effects_select on public.effect_observations
  for select to authenticated using (public.is_org_member(organization_id));
create policy effects_insert on public.effect_observations
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy asset_sources_select on public.asset_sources
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy asset_sources_insert on public.asset_sources
  for insert to authenticated with check (
    organization_id is not null
    and public.has_org_role(organization_id, array['admin','reviewer'])
    and created_by = auth.uid()
  );
create policy asset_variants_select on public.asset_variants
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy asset_variants_insert on public.asset_variants
  for insert to authenticated with check (
    organization_id is not null
    and public.has_org_role(organization_id, array['admin','reviewer'])
    and created_by = auth.uid()
  );
create policy asset_audits_select on public.asset_automatic_audits
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy asset_visual_reviews_select on public.asset_visual_reviews
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy asset_visual_reviews_insert on public.asset_visual_reviews
  for insert to authenticated with check (
    organization_id is not null
    and public.has_org_role(organization_id, array['admin','reviewer'])
    and reviewed_by = auth.uid()
  );
create policy asset_rights_select on public.asset_rights_grants
  for select to authenticated using (
    organization_id is null or public.is_org_member(organization_id)
  );
create policy asset_rights_insert on public.asset_rights_grants
  for insert to authenticated with check (
    organization_id is not null
    and public.has_org_role(organization_id, array['admin'])
    and granted_by = auth.uid()
  );

create policy model_runs_select on public.model_runs
  for select to authenticated using (public.is_org_member(organization_id));
create policy model_runs_insert on public.model_runs
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and created_by = auth.uid()
  );

create policy transition_events_select on public.transition_events
  for select to authenticated using (public.is_org_member(organization_id));
create policy transition_events_insert on public.transition_events
  for insert to authenticated with check (
    public.has_org_role(organization_id, array['admin','reviewer','educator'])
    and (actor_user_id is null or actor_user_id = auth.uid())
  );

-- Deliberately no client delete policies on pedagogical, model, review or ledger
-- records. Erasure/redaction workflows must be implemented as privileged,
-- explicitly authorized procedures that preserve only the minimum necessary
-- referential accountability.
