export type MediaType = 'image' | 'video' | 'text';

export interface Profile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  media_url: string | null;
  media_type: MediaType;
  cost: number;
  category: string;
  model: string;
  author: string;
  sales: number;
  rating: number;
  variables: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  prompt_id: string | null;
  amount: number;
  type: 'debit' | 'credit' | 'bonus' | 'ad_reward';
  description: string | null;
  created_at: string;
}

export interface DeductCreditsResponse {
  success: boolean;
  error?: string;
  message: string;
  current_credits?: number;
  required_credits?: number;
  credits_remaining?: number;
}

export interface AddCreditsResponse {
  success: boolean;
  error?: string;
  message: string;
  credits_total?: number;
}

