import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    toast.success('Payment successful! Your wallet has been credited.');
  }, [queryClient]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-24 w-24 text-cricket-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-cricket-green-700 dark:text-cricket-green-300 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your wallet has been credited successfully. You can now join contests!
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate({ to: '/wallet' })}
            className="bg-cricket-green-600 hover:bg-cricket-green-700 text-white font-bold"
          >
            View Wallet
          </Button>
          <Button
            onClick={() => navigate({ to: '/matches' })}
            variant="outline"
            className="font-bold"
          >
            Browse Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
