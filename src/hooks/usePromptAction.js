import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const usePromptAction = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const copyPrompt = async (prompt) => {
    // Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return {
        success: false,
        error: 'unauthorized',
        message: 'Please login to copy prompts',
      };
    }

    setLoading(true);

    try {
      // Call deduct_credits RPC function
      const { data, error } = await supabase.rpc('deduct_credits', {
        prompt_id_param: prompt.id,
        amount: prompt.price || prompt.cost,
      });

      if (error) throw error;

      // Parse response if it's a string
      const result = typeof data === 'string' ? JSON.parse(data) : data;

      if (!result.success) {
        setLoading(false);
        return result;
      }

      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(prompt.prompt || prompt.prompt_text);
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        // Fallback: Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = prompt.prompt || prompt.prompt_text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Refresh user profile to update credits
      refreshProfile();

      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error in copyPrompt:', error);
      setLoading(false);
      return {
        success: false,
        error: 'unknown',
        message: error.message || 'An error occurred',
      };
    }
  };

  const earnCredits = async (amount = 50, type = 'ad_reward') => {
    if (!user) {
      return {
        success: false,
        error: 'unauthorized',
        message: 'Please login to earn credits',
      };
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('add_credits', {
        amount,
        reward_type: type,
      });

      if (error) throw error;

      const result = typeof data === 'string' ? JSON.parse(data) : data;

      // Refresh profile
      refreshProfile();

      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error in earnCredits:', error);
      setLoading(false);
      return {
        success: false,
        error: 'unknown',
        message: error.message || 'An error occurred',
      };
    }
  };

  return {
    copyPrompt,
    earnCredits,
    loading,
    credits: profile?.credits || 0,
    isAuthenticated: !!user,
  };
};

