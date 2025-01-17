'use client';

import { createContext } from 'react';
import { AuthenticationConfig } from './Router';

// Create the context
export const AuthenticationContext = createContext<AuthenticationConfig | undefined>(undefined);
