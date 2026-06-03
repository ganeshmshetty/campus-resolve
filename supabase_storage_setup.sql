-- ============================================================
-- STORAGE BUCKET MIGRATION
-- Run this in the Supabase SQL Editor if image uploads are failing.
-- ============================================================

-- 1. Create the bucket (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do update set public = true;

-- 2. Allow public read access to the bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'report-images' );

-- 3. Allow authenticated users to upload images
create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'report-images' 
    and auth.role() = 'authenticated'
  );

-- 4. Allow users to update their own images
create policy "Users can update own images"
  on storage.objects for update
  using (
    bucket_id = 'report-images' 
    and auth.uid() = owner
  );

-- 5. Allow users to delete their own images
create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'report-images' 
    and auth.uid() = owner
  );
