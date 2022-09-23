CREATE OR REPLACE FUNCTION public.user_full_name(user_row users)
RETURNS TEXT AS $$
    SELECT user_row.name || ' ' || user_row.surname
$$ LANGUAGE sql STABLE;
