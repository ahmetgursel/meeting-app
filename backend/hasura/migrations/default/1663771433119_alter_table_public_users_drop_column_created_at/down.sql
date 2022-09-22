alter table "public"."users" alter column "created_at" set default now();
alter table "public"."users" alter column "created_at" drop not null;
alter table "public"."users" add column "created_at" timestamptz;
