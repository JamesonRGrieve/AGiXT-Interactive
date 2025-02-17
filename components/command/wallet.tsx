'use client';

import { useWallet, type Wallet } from '@solana/wallet-adapter-react';
import { Wallet as WalletIcon, Copy, SwitchCamera, LogOut } from 'lucide-react';
import { useState } from 'react';
import { CommandGroup } from '@/components/ui/command';
import { useToast } from '@/hooks/useToast';
import { CommandItemComponent } from './index';

interface WalletCommandsProps {
  closeCommand: () => void;
}

export function WalletCommands({ closeCommand }: WalletCommandsProps) {
  const { connected } = useWallet();
  const [showWalletList, setShowWalletList] = useState(false);

  return (
    <CommandGroup heading='Wallet'>
      {showWalletList || !connected ? (
        <WalletList />
      ) : (
        <WalletConnected closeCommand={closeCommand} onChangeWallet={() => setShowWalletList(true)} />
      )}
    </CommandGroup>
  );
}

function WalletList() {
  const { wallets, select, connect } = useWallet();

  const handleSelectWallet = async (selectedWallet: Wallet) => {
    try {
      await select(selectedWallet.adapter.name);
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <>
      {wallets.map((wallet) => (
        <CommandItemComponent
          key={wallet.adapter.name}
          item={{
            icon: WalletIcon,
            label: wallet.adapter.name,
            description: 'Select this wallet',
            keywords: ['wallet', 'select', 'connect', wallet.adapter.name],
          }}
          onSelect={() => handleSelectWallet(wallet)}
        />
      ))}
    </>
  );
}

function WalletConnected({ onChangeWallet, closeCommand }: { onChangeWallet: () => void; closeCommand: () => void }) {
  const { publicKey, disconnect } = useWallet();
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <CommandItemComponent
        item={{
          icon: Copy,
          label: 'Copy Address',
          description: 'Copy wallet address to clipboard',
          keywords: ['wallet', 'copy', 'address'],
        }}
        onSelect={handleCopyAddress}
      />
      <CommandItemComponent
        item={{
          icon: SwitchCamera,
          label: 'Change Wallet',
          description: 'Switch to a different wallet',
          keywords: ['wallet', 'change', 'switch'],
        }}
        onSelect={onChangeWallet}
      />
      <CommandItemComponent
        item={{
          icon: LogOut,
          label: 'Disconnect',
          description: 'Disconnect current wallet',
          keywords: ['wallet', 'disconnect', 'logout'],
        }}
        onSelect={() => {
          disconnect();
          closeCommand();
        }}
      />
    </>
  );
}
