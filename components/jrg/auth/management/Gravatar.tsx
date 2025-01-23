import React from 'react';
import md5 from 'md5';
import { UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This component should be deleted
const Gravatar = ({ email, size = 40, ...props }: any) => {
  const hash = md5(email.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;

  return (
    <Avatar>
      <AvatarImage src={gravatarUrl} alt={email} {...props} />
      <AvatarFallback>
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
};

export default Gravatar;
