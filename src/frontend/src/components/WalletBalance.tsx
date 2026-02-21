import { Card, CardContent } from './ui/card';
import { useGetWalletBalance } from '../hooks/useQueries';
import { Wallet, Loader2 } from 'lucide-react';

export default function WalletBalance() {
  const { data: balance, isLoading } = useGetWalletBalance();

  return (
    <Card className="border-2 border-cricket-green-200 bg-gradient-to-br from-cricket-green-50 to-energy-orange-50 dark:from-cricket-green-900/20 dark:to-energy-orange-900/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <img src="/assets/generated/wallet-icon.dim_128x128.png" alt="Wallet" className="h-16 w-16" />
          <div className="flex-1">
            <div className="text-sm font-bold text-muted-foreground mb-1">Available Balance</div>
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
            ) : (
              <div className="text-4xl font-black text-cricket-green-700 dark:text-cricket-green-300">
                ₹{Number(balance || 0)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
