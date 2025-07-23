import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = import.meta.env.VITE_SUPABASEURL || 'https://google.com';
const supabaseKey: string = import.meta.env.VITE_SUPABASE_KEY || '12345';



const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;