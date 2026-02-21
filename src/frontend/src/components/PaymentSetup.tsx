import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function PaymentSetup() {
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN');

  const showSetup = !configLoading && !adminLoading && isAdmin && !isConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    try {
      const allowedCountries = countries
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length === 2);

      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries
      });
      toast.success('Stripe configured successfully!');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    }
  };

  if (!showSetup) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-cricket-green-700">Configure Stripe</DialogTitle>
          <DialogDescription>Set up payment processing to enable wallet recharges</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="secretKey" className="font-bold">
              Stripe Secret Key *
            </Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="countries" className="font-bold">
              Allowed Countries (comma-separated) *
            </Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="IN, US, GB"
              required
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Use 2-letter country codes (e.g., IN, US, GB)</p>
          </div>
          <Button
            type="submit"
            disabled={setConfig.isPending}
            className="w-full bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
          >
            {setConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
