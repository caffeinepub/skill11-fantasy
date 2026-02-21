import { useNavigate } from '@tanstack/react-router';
import WalletBalance from '../components/WalletBalance';
import WalletRecharge from '../components/WalletRecharge';
import TransactionHistory from '../components/TransactionHistory';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/matches' })}
        className="mb-4 font-bold"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Matches
      </Button>

      <h1 className="text-3xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-6">
        My Wallet
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <WalletBalance />
        <WalletRecharge />
      </div>

      <TransactionHistory />
    </div>
  );
}
