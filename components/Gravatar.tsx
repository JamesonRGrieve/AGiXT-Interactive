import React from 'react';
import { Avatar } from '@mui/material';
import md5 from 'md5';

const Gravatar = ({ email, size = 40, ...props }) => {
  const hash = md5(email.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;

  return <Avatar src={gravatarUrl} {...props} />;
};

export default Gravatar;
