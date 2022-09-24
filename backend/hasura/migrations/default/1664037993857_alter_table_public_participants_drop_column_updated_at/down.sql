alter table "public"."participants" alter column "updated_at" set default now();
alter table "public"."participants" alter column "updated_at" drop not null;
alter table "public"."participants" add column "updated_at" timestamptz;
