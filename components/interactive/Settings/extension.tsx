import { Plus, Unlink, Wrench } from 'lucide-react';
import MarkdownBlock from '../Chat/Message/MarkdownBlock';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Single Extension component that handles both connected and disconnected states
export default function Extension({
  extension,
  connected,
  onDisconnect,
  onConnect,
  settings = {},
  setSettings,
  error,
  setSelectedExtension,
}) {
  return (
    <div className='flex flex-col gap-4 p-4 transition-colors border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center flex-1 min-w-0 gap-3.5'>
          <Wrench className='flex-shrink-0 w-5 h-5 text-muted-foreground' />
          <div>
            <h4 className='font-medium truncate'>{extension.extension_name}</h4>
            <p className='text-sm text-muted-foreground'>{connected ? 'Connected' : 'Not Connected'}</p>
          </div>
        </div>

        {connected ? (
          <Button variant='outline' size='sm' className='gap-2' onClick={() => onDisconnect(extension)}>
            <Unlink className='w-4 h-4' />
            Disconnect
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                onClick={() => {
                  setSelectedExtension(extension.extension_name);
                  setSettings(extension.settings.reduce((acc, setting) => ({ ...acc, [setting]: '' }), {}));
                }}
              >
                <Plus className='w-4 h-4' />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Configure {extension.extension_name}</DialogTitle>
                <DialogDescription>Enter the required credentials to enable this service.</DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                {extension.settings.map((setting) => (
                  <div key={setting} className='grid gap-2'>
                    <Label htmlFor={setting}>{setting}</Label>
                    <Input
                      id={setting}
                      type={
                        setting.toLowerCase().includes('key') || setting.toLowerCase().includes('password')
                          ? 'password'
                          : 'text'
                      }
                      value={settings[setting] || ''}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          [setting]: e.target.value,
                        }))
                      }
                      placeholder={`Enter ${setting.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button onClick={() => onConnect(extension.extension_name, settings)}>Connect Extension</Button>
              </DialogFooter>

              {error && (
                <Alert variant={error.type === 'success' ? 'default' : 'destructive'}>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className='text-sm text-muted-foreground'>
        <MarkdownBlock content={extension.description || 'No description available'} />
      </div>
    </div>
  );
}
