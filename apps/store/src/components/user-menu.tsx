import { Session, User } from '@repo/db/schema';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '~/clients/auth-client';

interface UserMenuProps {
  user: User | null;
  session: Session | null;
}

export function UserMenu({ user, session }: UserMenuProps) {
  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      toast.promise(
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              window.location.href = '/';
            },
          },
        }),
        {
          loading: 'Signing out...',
          success: 'Signed out successfully!',
          error: 'Failed to sign out. Please try again.',
        }
      );
    } catch (error) {
      toast.error('An unexpected error occurred during sign out.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={user.name} src={user.image || undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <UserIcon className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Session ID</span>
            <span className="font-mono text-xs">
              {session?.id.slice(0, 8)}...
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
