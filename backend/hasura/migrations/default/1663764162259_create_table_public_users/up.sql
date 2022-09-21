CREATE TABLE "public"."users" ("id" serial NOT NULL, "email" text NOT NULL, "name" Text NOT NULL, "surname" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("email"));
