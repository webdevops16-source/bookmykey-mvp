-- Matches the categories offered by the admin posting form. Already applied.
alter table public.listings drop constraint listings_category_check;
alter table public.listings add constraint listings_category_check check (category in (
  'apartment','villa','independent_house','builder_floor',
  'office_space','retail_shop','warehouse','plot','pg'
));
