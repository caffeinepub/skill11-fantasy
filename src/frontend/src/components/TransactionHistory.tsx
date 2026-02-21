import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useGetWalletTransactions } from '../hooks/useQueries';
import { Loader2, ArrowUpCircle, ArrowDownCircle, Trophy } from 'lucide-react';

export default function TransactionHistory() {
  const { data: transactions, isLoading } = useGetWalletTransactions();

  const getTransactionIcon = (type: string) => {
    if (type === 'deposit') return <ArrowUpCircle className="h-5 w-5 text-cricket-green-500" />;
    if (type === 'entry_fee') return <ArrowDownCircle className="h-5 w-5 text-vibrant-red-500" />;
    if (type === 'winnings') return <Trophy className="h-5 w-5 text-trophy-gold-500" />;
    return null;
  };

  const getTransactionLabel = (type: string) => {
    if (type === 'deposit') return 'Deposit';
    if (type === 'entry_fee') return 'Contest Entry';
    if (type === 'winnings') return 'Winnings';
    return type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-cricket-green-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-cricket-green-700">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-cricket-green-700">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const date = new Date(Number(transaction.timestamp) / 1000000);
            const isCredit = transaction.transactionType === 'deposit' || transaction.transactionType === 'winnings';
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.transactionType)}
                  <div>
                    <div className="font-bold text-sm">{getTransactionLabel(transaction.transactionType)}</div>
                    <div className="text-xs text-muted-foreground">
                      {date.toLocaleDateString()} {date.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-lg font-black ${
                    isCredit ? 'text-cricket-green-600' : 'text-vibrant-red-600'
                  }`}
                >
                  {isCredit ? '+' : '-'}₹{Number(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
