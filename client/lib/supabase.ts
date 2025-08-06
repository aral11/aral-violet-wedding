import { createClient } from '@supabase/supabase-js'

// Supabase configuration - you'll need to add your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface SupabaseGuest {
  id?: string
  name: string
  email: string
  phone: string
  attending: boolean
  guests: number
  side: 'groom' | 'bride'
  message?: string
  dietary_restrictions?: string
  needs_accommodation: boolean
  created_at?: string
  updated_at?: string
}

export interface SupabasePhoto {
  id?: string
  photo_data: string
  uploaded_by: string
  created_at?: string
}

export interface SupabaseWeddingFlow {
  id?: string
  time: string
  title: string
  description: string
  duration?: string
  type: 'ceremony' | 'reception' | 'entertainment' | 'meal' | 'special'
  created_at?: string
  updated_at?: string
}

export interface SupabaseInvitation {
  id?: number
  pdf_data: string
  filename?: string
  uploaded_at?: string
}
