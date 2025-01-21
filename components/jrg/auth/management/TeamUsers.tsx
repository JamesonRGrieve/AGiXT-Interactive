'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Mail, MoreHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCompany, useCompanies, useInvitations } from '@/components/interactive/hooks';

import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { DataTable } from '@/components/wais/data/data-table';
import { DataTableColumnHeader } from '@/components/wais/data/data-table-column-header';
import log from '../../next-log/log';

interface User {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  role: string;
  role_id: number;
}

const users_columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='First Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>{row.getValue('first_name')}</span>
        </div>
      );
    },
    meta: {
      headerName: 'First Name',
    },
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          <span>{row.getValue('last_name')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      headerName: 'Last Name',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='truncate'>{row.getValue('email')}</span>
        </div>
      );
    },
    meta: {
      headerName: 'Email',
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => {
      const role = row.getValue('role');
      return (
        <div className='flex items-center'>
          <Badge variant='outline' className='capitalize'>
            {role.replace('_', ' ')}
          </Badge>
        </div>
      );
    },
    meta: {
      headerName: 'Role',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => e.preventDefault()} className='p-0'>
              <Button variant='ghost' className='w-full justify-start'>
                Edit User
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/users/${row.original.id}`)}>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => e.preventDefault()} className='p-0'>
              <Button variant='ghost' className='w-full justify-start text-red-600 hover:text-red-600'>
                Delete User
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: true,
    enableSorting: false,
    meta: {
      headerName: 'Actions',
    },
  },
];
const ROLES = [
  { id: 2, name: 'Admin' },
  { id: 3, name: 'User' },
];

const AUTHORIZED_ROLES = [0, 1, 2];
interface Invitation {
  id: string;
  company_id: string;
  email: string;
  inviter_id: string;
  role_id: number;
  is_accepted: boolean;
  created_at: string;
  invitation_link: string;
}

export const invitations_columns: ColumnDef<Invitation>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => {
      return (
        <div className='flex items-center space-x-2'>
          <Mail className='h-4 w-4 text-muted-foreground' />
          <span className='font-medium'>{row.getValue('email')}</span>
        </div>
      );
    },
    meta: {
      headerName: 'Email',
    },
  },
  {
    accessorKey: 'role_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => {
      const roleMap = {
        1: 'Admin',
        2: 'Manager',
        3: 'User',
      };
      return (
        <div className='flex w-[100px] items-center'>
          <span>{roleMap[row.getValue('role_id') as keyof typeof roleMap]}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      headerName: 'Role',
    },
  },
  {
    accessorKey: 'is_accepted',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const isAccepted = row.getValue('is_accepted');
      return (
        <div className='flex w-[100px] items-center'>
          <Badge variant={isAccepted ? 'default' : 'secondary'}>
            {isAccepted ? <Check className='mr-1 h-3 w-3' /> : <X className='mr-1 h-3 w-3' />}
            {isAccepted ? 'Accepted' : 'Pending'}
          </Badge>
        </div>
      );
    },
    meta: {
      headerName: 'Status',
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sent Date' />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      return (
        <div className='flex items-center'>
          <span>{formattedDate}</span>
        </div>
      );
    },
    meta: {
      headerName: 'Sent Date',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter();

      const copyInviteLink = (link: string) => {
        navigator.clipboard.writeText(link);
        // You might want to add a toast notification here
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => copyInviteLink(row.original.invitation_link)}>
              Copy Invite Link
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push(`/invitation/${row.original.id}`)}>View Details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => {
                // Handle invitation cancellation
              }}
            >
              Cancel Invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    enableSorting: false,
    meta: {
      headerName: 'Actions',
    },
  },
];
export const Team = () => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('3');
  const [renaming, setRenaming] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newParent, setNewParent] = useState('');
  const [newName, setNewName] = useState('');
  const { data: invitationsData } = useInvitations();
  const { data: companyData } = useCompanies();
  const { data: activeCompany, mutate } = useCompany();
  const [responseMessage, setResponseMessage] = useState('');
  const handleConfirm = async () => {
    if (renaming) {
      try {
        const companyId = getCookie('agixt-company-id');
        await axios.put(
          `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/companies/${companyId}`,
          { name: newName },
          {
            headers: {
              Authorization: getCookie('jwt'),
              'Content-Type': 'application/json',
            },
          },
        );
        setRenaming(false);
        mutate();
        setResponseMessage('Company name updated successfully!');
      } catch (error) {
        setResponseMessage(error.response?.data?.detail || 'Failed to update company name');
      }
    } else {
      try {
        const newResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/companies`,
          { name: newName, agent_name: newName + ' Agent', ...(newParent ? { parent_company_id: newParent } : {}) },
          {
            headers: {
              Authorization: getCookie('jwt'),
              'Content-Type': 'application/json',
            },
          },
        );
        setCookie('agixt-company-id', newResponse.data.id, {
          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
        });
        mutate();
        setResponseMessage('Company created successfully!');
      } catch (error) {
        setResponseMessage(error.response?.data?.detail || 'Failed to create company');
      }
      setCreating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setResponseMessage('Please enter an email to invite.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AGIXT_SERVER}/v1/invitations`,
        {
          email: email,
          role_id: parseInt(roleId),
          company_id: getCookie('agixt-company-id'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getCookie('jwt'),
          },
        },
      );

      if (response.status === 200) {
        if (response.data?.id) {
          setResponseMessage(
            `Invitation sent successfully! The invite link is ${process.env.NEXT_PUBLIC_APP_URI}/?invitation_id=${response.data.id}&email=${email}`,
          );
        } else {
          setResponseMessage('Invitation sent successfully!');
        }
        setEmail('');
      }
    } catch (error) {
      setResponseMessage(error.response?.data?.detail || 'Failed to send invitation');
    }
  };
  log(['Invitations Data', invitationsData], { client: 3 });
  return (
    <div className='space-y-6'>
      <DataTable data={activeCompany?.users || []} columns={users_columns} />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address</Label>
          <Input
            id='email'
            type='email'
            placeholder='user@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='role'>Role</Label>
          <Select value={roleId} onValueChange={setRoleId}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a role' />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type='submit' className='w-full' disabled={!email}>
          Send Invitation
        </Button>
      </form>
      <DataTable data={invitationsData || []} columns={invitations_columns} />
    </div>
  );
};

export default Team;
