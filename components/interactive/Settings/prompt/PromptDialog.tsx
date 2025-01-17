'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInteractiveConfig } from '@/components/interactive/InteractiveConfigContext';
import { usePromptCategories } from '@/components/interactive/hooks';

export default function NewPromptDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const context = useInteractiveConfig();
  const { data: categoryData } = usePromptCategories();

  const [newPromptName, setNewPromptName] = useState('');
  const [promptCategory, setPromptCategory] = useState('Default');
  const [toggleNewPromptCategory, setToggleNewPromptCategory] = useState(false);
  const [promptBody, setPromptBody] = useState('');

  const handleNewPrompt = async () => {
    await context.agixt.addPrompt(newPromptName, promptBody, promptCategory);
    setOpen(false);
    router.push(`/prompt?category=${promptCategory}&prompt=${newPromptName}`);
  };

  const handleImportPrompt = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      const fileContent = await file.text();
      if (newPromptName === '') {
        const fileName = file.name.replace('.json', '');
        setNewPromptName(fileName);
      }
      await context.agixt.addPrompt(newPromptName, fileContent, promptCategory);
      setOpen(false);
      router.push(`/settings/prompts?category=${promptCategory}&prompt=${newPromptName}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Prompt Template</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-center space-x-2'>
            <Switch id='new-category' checked={toggleNewPromptCategory} onCheckedChange={setToggleNewPromptCategory} />
            <Label htmlFor='new-category'>New Category</Label>
          </div>
          {toggleNewPromptCategory ? (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='new-category-name' className='text-right'>
                New Prompt Category
              </Label>
              <Input
                id='new-category-name'
                value={promptCategory}
                onChange={(e) => setPromptCategory(e.target.value)}
                className='col-span-3'
              />
            </div>
          ) : (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='prompt-category' className='text-right'>
                Select a Prompt Category
              </Label>
              <Select value={promptCategory} onValueChange={setPromptCategory}>
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {categoryData &&
                    (categoryData as string[]).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='prompt-name' className='text-right'>
              New Prompt Name
            </Label>
            <Input
              id='prompt-name'
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='prompt-content' className='text-right'>
              New Prompt Content
            </Label>
            <Textarea
              id='prompt-content'
              value={promptBody}
              onChange={(e) => setPromptBody(e.target.value)}
              className='col-span-3'
              rows={4}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='import-prompts' className='text-right'>
              Import Prompts
            </Label>
            <Input id='import-prompts' type='file' onChange={handleImportPrompt} className='col-span-3' />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleNewPrompt}>Create Prompt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
