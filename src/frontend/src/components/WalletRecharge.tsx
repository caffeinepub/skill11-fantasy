import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function WalletRecharge() {
  const [amount, setAmount] = useState('');
  const createCheckout = useCreateCheckoutSession();

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);

    if (isNaN(amountNum) || amountNum < 10 || amountNum > 10000) {
      toast.error('Amount must be between ₹10 and ₹10,000');
      return;
    }

    try {
      const session = await createCheckout.mutateAsync([
        {
          currency: 'INR',
          productName: 'Wallet Recharge',
          productDescription: `Add ₹${amountNum} to wallet`,
          priceInCents: BigInt(amountNum * 100),
          quantity: BigInt(1)
        }
      ]);

      const parsedSession = JSON.parse(session);
      if (!parsedSession?.url) {
        throw new Error('Stripe session missing url');
      }
      window.location.href = parsedSession.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
    }
  };

  return (
    <Card className="border-2 border-energy-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cricket-green-700">
          <img src="/assets/generated/wallet-icon.dim_128x128.png" alt="Wallet" className="h-6 w-6" />
          Add Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRecharge} className="space-y-4">
          <div>
            <Label htmlFor="amount" className="font-bold">
              Amount (₹10 - ₹10,000)
            </Label>
            <Input
              id="amount"
              type="number"
              min="10"
              max="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={createCheckout.isPending}
            className="w-full bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
          >
            {createCheckout.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Add Funds'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
