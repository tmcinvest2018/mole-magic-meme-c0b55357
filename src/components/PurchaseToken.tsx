import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { buyWithEth, buyWithUSDT } from '@/config/contracts';

export const PurchaseToken = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleBuyWithBNB = async () => {
    if (!amount) return;

    try {
      await buyWithEth(amount);
      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased MORO tokens with BNB',
      });
    } catch (error) {
      console.error('Error buying with BNB:', error);
      toast({
        title: 'Purchase Failed',
        description: 'Failed to purchase tokens. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBuyWithUSDT = async () => {
    if (!amount) return;

    try {
      await buyWithUSDT(amount);
      toast({
        title: 'Purchase Successful',
        description: 'You have successfully purchased MORO tokens with USDT',
      });
    } catch (error) {
      console.error('Error buying with USDT:', error);
      toast({
        title: 'Purchase Failed',
        description: 'Failed to purchase tokens. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="space-x-4">
        <Button onClick={handleBuyWithBNB}>Buy with BNB</Button>
        <Button onClick={handleBuyWithUSDT}>Buy with USDT</Button>
      </div>
    </div>
  );
};
