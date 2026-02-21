import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-cricket-green-700">Welcome to Skill11!</DialogTitle>
          <DialogDescription>Please complete your profile to get started</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name" className="font-bold">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="font-bold">
              Email (optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="font-bold">
              Phone Number (optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full bg-energy-orange-500 hover:bg-energy-orange-600 text-white font-bold"
          >
            {saveProfile.isPending ? 'Creating Profile...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
