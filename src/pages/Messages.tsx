import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useUserBlocks } from '@/hooks/useUserBlocks';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, ArrowLeft, Heart, Loader2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import BlockConfirmationModal from '@/components/BlockConfirmationModal';

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { conversations, loading: conversationsLoading, getUnreadCount } = useConversations(user);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const { blockUser } = useUserBlocks();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const { messages, loading: messagesLoading, sending, sendMessage } = useMessages(selectedConversationId, user);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || !user) return;

    const recipientId = selectedConversation.user1_id === user.id 
      ? selectedConversation.user2_id 
      : selectedConversation.user1_id;

    const success = await sendMessage(messageInput, recipientId);
    if (success) {
      setMessageInput('');
    }
  };

  const handleBlockUser = (userId: string) => {
    setBlockingUserId(userId);
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async (reason?: string) => {
    if (!blockingUserId) return;
    
    const success = await blockUser(blockingUserId, reason);
    if (success) {
      setSelectedConversationId(null); // Close conversation
      setShowBlockModal(false);
      setBlockingUserId(null);
    }
  };

  const getProfilePhoto = (photoUrls: string[] | null, avatarUrl: string | null) => {
    if (photoUrls && photoUrls.length > 0) {
      return photoUrls[0];
    }
    return avatarUrl;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold mb-4">Sign in to View Messages</h1>
            <p className="text-muted-foreground mb-6">
              Create an account to start messaging your matches!
            </p>
            <Button onClick={() => navigate('/auth')} size="lg">
              Sign In / Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 h-screen">
        <div className="h-full max-w-6xl mx-auto flex">
          {/* Conversations List */}
          <div className={`${selectedConversationId ? 'hidden md:block' : ''} w-full md:w-1/3 border-r border-border`}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-web3-red" />
                <h1 className="text-2xl font-bold">Messages</h1>
              </div>

              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-lg mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start liking profiles to begin conversations with your matches!
                    </p>
                    <Button onClick={() => navigate('/discover')}>
                      <Heart className="w-4 h-4 mr-2" />
                      Start Discovering
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-2">
                    {conversations.map((conversation) => {
                      const unreadCount = getUnreadCount(conversation);
                      const otherUser = conversation.other_user;
                      
                      if (!otherUser) return null;

                      return (
                        <Card 
                          key={conversation.id}
                          className={`cursor-pointer transition-colors hover:bg-accent ${
                            selectedConversationId === conversation.id ? 'bg-accent' : ''
                          }`}
                          onClick={() => setSelectedConversationId(conversation.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage 
                                  src={getProfilePhoto(otherUser.photo_urls, otherUser.avatar_url) || undefined} 
                                />
                                <AvatarFallback>
                                  {otherUser.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold truncate">
                                    {otherUser.full_name}
                                  </h3>
                                  {unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {unreadCount}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.last_message_preview || 'Start a conversation...'}
                                </p>
                                
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedConversationId ? '' : 'hidden md:flex'} flex-1 flex flex-col`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSelectedConversationId(null)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={getProfilePhoto(
                          selectedConversation.other_user?.photo_urls, 
                          selectedConversation.other_user?.avatar_url
                        ) || undefined} 
                      />
                      <AvatarFallback>
                        {selectedConversation.other_user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h2 className="font-semibold">
                        {selectedConversation.other_user?.full_name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Active now
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockUser(selectedConversation.other_user?.id || '')}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No messages yet. Say hello! 👋
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        const isMe = message.sender_id === user.id;
                        const showAvatar = !isMe && (
                          index === 0 || 
                          messages[index - 1]?.sender_id !== message.sender_id
                        );

                        return (
                          <div 
                            key={message.id} 
                            className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isMe && (
                              <Avatar className={`w-8 h-8 ${showAvatar ? '' : 'invisible'}`}>
                                <AvatarImage 
                                  src={getProfilePhoto(
                                    message.sender?.photo_urls, 
                                    message.sender?.avatar_url
                                  ) || undefined} 
                                />
                                <AvatarFallback>
                                  {message.sender?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isMe 
                                ? 'bg-web3-red text-white' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isMe ? 'text-white/70' : 'text-muted-foreground'
                              }`}>
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!messageInput.trim() || sending}
                      size="sm"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BlockConfirmationModal
        isOpen={showBlockModal}
        onClose={() => {
          setShowBlockModal(false);
          setBlockingUserId(null);
        }}
        onConfirm={handleConfirmBlock}
        userName={conversations.find(c => c.other_user?.id === blockingUserId)?.other_user?.full_name || 'this user'}
      />
    </div>
  );
};

export default Messages;