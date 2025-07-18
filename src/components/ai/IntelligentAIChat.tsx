import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAIChat, AIMessage } from '@/hooks/useAIChat';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Send, 
  Plus, 
  MessageSquare, 
  Clock, 
  Trash2,
  Bot,
  User,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface IntelligentAIChatProps {
  initialConversationType?: string;
  className?: string;
}

export const IntelligentAIChat: React.FC<IntelligentAIChatProps> = ({
  initialConversationType = 'general',
  className = ''
}) => {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedType, setSelectedType] = useState(initialConversationType);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    conversations,
    currentConversation,
    loading,
    error,
    sendMessage,
    createConversation,
    deleteConversation,
    setActiveConversation,
    getConversationStats,
    clearError
  } = useAIChat();

  const conversationTypes = [
    { id: 'general', label: 'General', icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
    { id: 'dating', label: 'Dating', icon: MessageSquare, color: 'bg-pink-100 text-pink-800' },
    { id: 'networking', label: 'Networking', icon: MessageSquare, color: 'bg-green-100 text-green-800' },
    { id: 'crypto', label: 'Crypto', icon: MessageSquare, color: 'bg-orange-100 text-orange-800' },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const message = inputMessage.trim();
    setInputMessage('');

    const response = await sendMessage(message, selectedType);
    if (response) {
      toast.success('Message sent successfully');
    } else if (error) {
      toast.error('Failed to send message');
    }
  };

  const handleCreateNewConversation = async () => {
    const title = `New ${selectedType} conversation`;
    const conversationId = await createConversation(title, selectedType);
    if (conversationId) {
      toast.success('New conversation created');
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    await deleteConversation(convId);
    toast.success('Conversation deleted');
  };

  const stats = getConversationStats();

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTypeColor = (type: string) => {
    const typeConfig = conversationTypes.find(t => t.id === type);
    return typeConfig?.color || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Please sign in to use AI Chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Conversations Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Conversations
          </CardTitle>
          <Button 
            onClick={handleCreateNewConversation}
            className="w-full"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </CardHeader>
        <CardContent>
          {/* Conversation Type Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {conversationTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className="text-xs"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Conversations List */}
          <ScrollArea className="h-[400px]">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversation?.id === conv.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.title || 'Untitled Chat'}
                        </p>
                        <Badge className={`text-xs mt-1 ${getTypeColor(conv.conversation_type)}`}>
                          {conv.conversation_type}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="text-destructive hover:text-destructive ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Intelligent AI Assistant
            {currentConversation && (
              <Badge className={getTypeColor(currentConversation.conversation_type)}>
                {currentConversation.conversation_type}
              </Badge>
            )}
          </CardTitle>
          {currentConversation?.context_summary && (
            <p className="text-sm text-muted-foreground">
              Context: {currentConversation.context_summary}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <ScrollArea className="h-[500px] mb-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Start a conversation with the intelligent AI assistant
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    I remember context and provide personalized responses
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <div className="mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="ml-2"
              >
                Dismiss
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Chat Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.conversationCount}</p>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalMessages}</p>
              <p className="text-sm text-muted-foreground">Messages Exchanged</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold">{stats.userMessages}</p>
                <p className="text-xs text-muted-foreground">Your Messages</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">{stats.aiMessages}</p>
                <p className="text-xs text-muted-foreground">AI Responses</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold">{stats.totalTokens}</p>
              <p className="text-xs text-muted-foreground">Tokens Used</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Features</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-3 h-3 text-primary" />
                  <span>Context Awareness</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>Conversation Memory</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Personalized Responses</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MessageBubbleProps {
  message: AIMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 max-w-[80%]`}>
        <div className={`rounded-lg px-3 py-2 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.created_at)}
          </span>
          {message.tokens_used && (
            <Badge variant="outline" className="text-xs">
              {message.tokens_used} tokens
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

const formatMessageTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};