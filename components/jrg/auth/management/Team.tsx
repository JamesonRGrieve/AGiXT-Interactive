'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { LuPencil, LuCheck, LuPlus } from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCompany, useCompanies } from '@/components/interactive/hooks';

const ROLES = [
  { id: 2, name: 'Admin' },
  { id: 3, name: 'User' },
];

const AUTHORIZED_ROLES = [0, 1, 2];

export const Team = () => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('3');
  const [renaming, setRenaming] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newParent, setNewParent] = useState('');
  const [newName, setNewName] = useState('');
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-start'>
        {renaming || creating ? (
          <>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className='w-64'
              placeholder='Enter new name'
            />
            {creating && (
              <Select value={newParent} onValueChange={(value) => setNewParent(value)}>
                <SelectTrigger className='w-64'>
                  <SelectValue placeholder='(Optional) Select a Parent Company' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Parent Company</SelectLabel>
                    <SelectItem value='-'>[NONE]</SelectItem>
                    {companyData?.map((child: any) => (
                      <SelectItem key={child.id} value={child.id}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </>
        ) : (
          <h3>{activeCompany.name}</h3>
        )}
        <Button
          onClick={() => {
            if (renaming) {
              handleConfirm();
            } else {
              setRenaming(true);
              setNewName(activeCompany.name);
            }
          }}
          disabled={creating}
          size='icon'
          variant='ghost'
        >
          {renaming ? <LuCheck className='h-4 w-4' /> : <LuPencil className='h-4 w-4' />}
        </Button>
        <Button
          onClick={() => {
            if (creating) {
              handleConfirm();
            } else {
              setCreating(true);
              setNewName('');
            }
          }}
          disabled={renaming}
          size='icon'
          variant='ghost'
        >
          {creating ? <LuCheck className='h-4 w-4' /> : <LuPlus className='h-4 w-4' />}
        </Button>
      </div>
    </div>
  );
};

export default Team;
