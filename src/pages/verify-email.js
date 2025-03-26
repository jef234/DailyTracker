import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const VerifyEmail = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if we have a valid session first
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a valid session and no verification parameters, user is already verified
        if (session?.user?.email_confirmed_at && !router.query.token && !window.location.hash) {
          setMessage('Your email is already verified! Redirecting to daily tracker...');
          setTimeout(() => {
            router.push('/daily-tracker');
          }, 2000);
          setLoading(false);
          return;
        }

        // Try to get token from query parameters first
        let token = router.query.token;
        let type = router.query.type;

        // If not in query params, try hash parameters
        if (!token) {
          const hash = window.location.hash;
          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            token = params.get('token');
            type = params.get('type');
          }
        }

        // If no token and no session, this is a direct access
        if (!token && !session) {
          setError('Please check your email for the verification link.');
          setLoading(false);
          return;
        }

        if (!token || type !== 'signup') {
          throw new Error('Invalid verification link');
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });

        if (error) throw error;

        setMessage('Your account has been verified and activated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        console.error('Verification error:', err);
        if (err.message.includes('Token expired')) {
          setError('Verification link has expired. Please request a new one.');
        } else if (err.message.includes('Invalid verification link')) {
          setError('Invalid verification link. Please try again.');
        } else if (err.message.includes('No verification token found')) {
          setError('No verification token found. Please check your email for the correct link.');
        } else {
          setError(err.message || 'Failed to verify email. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      verifyEmail();
    }
  }, [router.isReady, router.query]);

  const handleResendVerification = async () => {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: router.query.email,
      });

      if (error) throw error;

      setMessage('Verification email resent! Please check your inbox.');
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we verify your email address
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
                <div className="mt-2">
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Resend verification email
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{message}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 