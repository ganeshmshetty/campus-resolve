import { createClient } from '@supabase/supabase-js';

const url = 'https://qynnpqoowjnjapjucjwq.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5bm5wcW9vd2puamFwanVjandxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA4Njk4MywiZXhwIjoyMDkyNjYyOTgzfQ.aI9ntLUXLNUDWd1UF-2Q3fs06ILTcSdmIhLvmhbHDXo';

const client = createClient(url, key);

async function run() {
  const { data, error } = await client.auth.admin.createUser({
    email: 'test405@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { name: 'test405', role: 'user' }
  });
  console.log('Data:', data);
  console.log('Error:', error);
}
run();
