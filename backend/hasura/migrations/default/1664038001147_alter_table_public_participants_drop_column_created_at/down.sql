alter table "public"."participants" alter column "created_at" set default now();
alter table "public"."participants" alter column "created_at" drop not null;
alter table "public"."participants" add column "created_at" timestamptz;
