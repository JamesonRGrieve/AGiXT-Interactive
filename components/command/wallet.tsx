'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useToast } from '@/hooks/useToast';
import { CommandGroup, CommandItem, CommandShortcut } from '@/components/ui/command';
import { Wallet, Copy, SwitchCamera, LogOut } from 'lucide-react';
import { CommandItemComponent } from './index';

interface WalletCommandsProps {
  onSelect: () => void;
}

export function WalletCommands({ onSelect }: WalletCommandsProps) {
  const { connected, disconnect, connect, wallet, publicKey } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal();
  const { toast } = useToast();

  const buttonState = (() => {
    if (connected) return 'connected';
    if (wallet) return 'has-wallet';
    return 'no-wallet';
  })();

  const getMainWalletItem = () => {
    let label, description;

    switch (buttonState) {
      case 'connected':
        label = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : '';
        description = 'View connected wallet';
        break;
      case 'has-wallet':
        label = 'Connect';
        description = 'Connect selected wallet';
        break;
      default:
        label = 'Select Wallet';
        description = 'Choose a wallet provider';
    }

    return {
      icon: Wallet,
      label,
      description,
    };
  };

  const handleMainWalletAction = async () => {
    switch (buttonState) {
      case 'no-wallet':
        setModalVisible(true);
        break;
      case 'has-wallet':
        try {
          await connect();
        } catch (error) {
          console.error('Failed to connect:', error);
        }
        break;
      case 'connected':
        break;
    }
    onSelect();
  };

  return (
    <CommandGroup heading='Wallet'>
      <CommandItemComponent item={getMainWalletItem()} onSelect={handleMainWalletAction} />
      {connected && (
        <>
          <CommandItemComponent
            item={{
              icon: Copy,
              label: 'Copy Address',
              description: 'Copy wallet address to clipboard',
            }}
            onSelect={async () => {
              if (publicKey) {
                await navigator.clipboard.writeText(publicKey.toBase58());
                toast({
                  title: 'Address Copied',
                  description: 'Wallet address copied to clipboard',
                  duration: 3000,
                });
              }
              onSelect();
            }}
          />
          <CommandItemComponent
            item={{
              icon: SwitchCamera,
              label: 'Change Wallet',
              description: 'Switch to a different wallet',
            }}
            onSelect={() => {
              setModalVisible(true);
              onSelect();
            }}
          />
          <CommandItemComponent
            item={{
              icon: LogOut,
              label: 'Disconnect',
              description: 'Disconnect current wallet',
            }}
            onSelect={() => {
              disconnect();
              onSelect();
            }}
          />
        </>
      )}
    </CommandGroup>
  );
}
