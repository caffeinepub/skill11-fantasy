import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Menu, Wallet, Trophy, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { SiCoffeescript } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cricket-green-50 to-energy-orange-50 dark:from-cricket-green-950 dark:to-energy-orange-950">
      <header className="sticky top-0 z-50 bg-cricket-green-600 dark:bg-cricket-green-800 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/generated/skill11-logo.dim_256x256.png" alt="Skill11" className="h-10 w-10" />
              <span className="text-2xl font-black text-white tracking-tight">SKILL11</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/matches"
                className="text-white hover:text-energy-orange-300 font-bold transition-colors"
              >
                Matches
              </Link>
              {isAuthenticated && (
                <Link
                  to="/wallet"
                  className="text-white hover:text-energy-orange-300 font-bold transition-colors flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
              )}
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={
                  isAuthenticated
                    ? 'bg-white text-cricket-green-700 hover:bg-energy-orange-100 font-bold border-2 border-white'
                    : 'bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold shadow-lg'
                }
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
              <Link
                to="/matches"
                className="text-white hover:text-energy-orange-300 font-bold transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Matches
              </Link>
              {isAuthenticated && (
                <Link
                  to="/wallet"
                  className="text-white hover:text-energy-orange-300 font-bold transition-colors flex items-center gap-2 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
              )}
              <Button
                onClick={() => {
                  handleAuth();
                  setMobileMenuOpen(false);
                }}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={
                  isAuthenticated
                    ? 'bg-white text-cricket-green-700 hover:bg-energy-orange-100 font-bold'
                    : 'bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold'
                }
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-cricket-green-700 dark:bg-cricket-green-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Skill11 Fantasy. Built with{' '}
            <SiCoffeescript className="inline h-4 w-4 text-energy-orange-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-energy-orange-300 hover:text-energy-orange-200 font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
