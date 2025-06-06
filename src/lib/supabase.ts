
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzampnmelaeqhwzzsvam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YW1wbm1lbGFlcWh3enpzdmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTMyNjcsImV4cCI6MjA2MzMyOTI2N30.x5KnK9mtIDf-ZNiGKSGlRqwjP57WMZ0Jx_ZdWWk3--8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
