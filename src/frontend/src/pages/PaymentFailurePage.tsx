import { useNavigate } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <XCircle className="h-24 w-24 text-vibrant-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-vibrant-red-600 mb-4">Payment Failed</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your payment could not be processed. Please try again or contact support if the issue persists.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate({ to: '/wallet' })}
            className="bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
          >
            Try Again
          </Button>
          <Button
            onClick={() => navigate({ to: '/matches' })}
            variant="outline"
            className="font-bold"
          >
            Back to Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
