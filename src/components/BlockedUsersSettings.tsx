import { useState } from 'react';
import { useUserBlocks } from '@/hooks/useUserBlocks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, UserX, Unlock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';

const BlockedUsersSettings = () => {
  const { blockedUsers, loading, unblockUser } = useUserBlocks();
  const [unblockingUserId, setUnblockingUserId] = useState<string | null>(null);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  const handleUnblockClick = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setShowUnblockDialog(true);
  };

  const handleConfirmUnblock = async () => {
    if (!selectedUser) return;
    
    setUnblockingUserId(selectedUser.id);
    const success = await unblockUser(selectedUser.id);
    
    if (success) {
      setShowUnblockDialog(false);
      setSelectedUser(null);
    }
    setUnblockingUserId(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Blocked Users
          </CardTitle>
          <CardDescription>Manage users you've blocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Blocked Users
          </CardTitle>
          <CardDescription>
            Manage users you've blocked. Blocked users can't contact you or see your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blockedUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No blocked users</h3>
              <p className="text-muted-foreground">
                You haven't blocked anyone yet. Blocked users will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((blockedUser, index) => (
                <div key={blockedUser.id}>
                  {index > 0 && <Separator />}
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={blockedUser.profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {blockedUser.profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {blockedUser.profile?.full_name || 'Unknown User'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Blocked {formatDistanceToNow(new Date(blockedUser.created_at), { addSuffix: true })}
                          </Badge>
                        </div>
                        {blockedUser.reason && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Reason: {blockedUser.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnblockClick(blockedUser.blocked_id, blockedUser.profile?.full_name || 'this user')}
                      disabled={unblockingUserId === blockedUser.blocked_id}
                      className="flex items-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      {unblockingUserId === blockedUser.blocked_id ? 'Unblocking...' : 'Unblock'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock {selectedUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will allow {selectedUser?.name} to contact you and see your profile again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unblockingUserId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmUnblock}
              disabled={unblockingUserId !== null}
            >
              {unblockingUserId ? "Unblocking..." : "Unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BlockedUsersSettings;