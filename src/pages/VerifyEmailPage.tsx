import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      // Prevent double verification (React Strict Mode calls useEffect twice)
      if (hasVerified.current) {
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      hasVerified.current = true;

      try {
        const successMessage = await verifyEmail(token);
        setStatus('success');
        setMessage(successMessage);

        // start a 3-second countdown (shown as a number)
        setSecondsLeft(3);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Email verification failed');
      }
    };

    verify();
  }, [token, navigate]);

  // Countdown effect: decrement every second and navigate when it reaches 0
  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      // navigate immediately when countdown reaches zero
      navigate('/auth');
      setSecondsLeft(null);
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft(s => (s !== null ? s - 1 : s));
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="mb-4">
                <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                  <svg
                    className="h-12 w-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                {message || 'Your email has been verified. You can now log in to your account.'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Redirecting to login page in {secondsLeft} seconds...
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Go to Login
              </Button>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="mb-4">
                <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                  <svg
                    className="h-12 w-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-red-600 mb-6">
                {message || 'Email verification failed. The link may be invalid or expired.'}
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/resend-verification">Request New Verification Link</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth">Back to Login</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
