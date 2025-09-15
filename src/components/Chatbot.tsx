import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User,
  TrendingUp,
  Building2,
  BarChart3,
  Zap,
  Target,
  HelpCircle
} from 'lucide-react';
import { ChatService } from '../services/ChatService';
import type { Company } from '../App';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  company: Company | null;
  allCompanies: Company[];
}

export const Chatbot: React.FC<ChatbotProps> = ({ company, allCompanies }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Force render - this WILL show up
  console.log('🤖 CHATBOT FORCE RENDER - COMPANY:', company?.name || 'NO COMPANY');

  // Don't return null - always show something when there's a company
  if (!company) {
    console.log('❌ No company - not rendering chatbot');
    return null;
  }

  console.log('✅ RENDERING CHATBOT FOR:', company.name);

  const chatService = new ChatService(company, allCompanies);

  useEffect(() => {
    if (messages.length === 0 && company) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'bot',
        content: `Hi! I'm your Carbon Credit Assistant 🌱\n\nI can help you with:\n• Comparing your emissions with other ${company.sector} companies\n• Understanding your BEE ratings and targets\n• Explaining sustainability metrics\n• Navigating the platform\n\nWhat would you like to know?`,
        timestamp: new Date(),
        suggestions: [
          "Compare my emissions with sector peers",
          "Explain my BEE rating",
          "How to improve carbon efficiency?",
          "Show top performers in my sector"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [company]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await chatService.processMessage(messageText);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
          suggestions: response.suggestions
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const quickActions = [
    { icon: TrendingUp, label: "Compare Emissions", query: "Compare my emissions with sector peers" },
    { icon: Target, label: "BEE Rating Help", query: "Explain my BEE rating and how to improve" },
    { icon: BarChart3, label: "Sector Leaders", query: "Show top performers in my sector" },
    { icon: HelpCircle, label: "Platform Guide", query: "How do I navigate this platform?" }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {/* FORCE VISIBLE - RED TEST BUTTON */}
      <div 
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '0px',
          background: 'red',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 10000
        }}
        onClick={() => {
          console.log('🔴 RED TEST BUTTON CLICKED!');
          alert('CHATBOT IS WORKING! This proves the component is rendering.');
        }}
      >
        CHATBOT TEST - CLICK ME!
      </div>

      {/* Floating Chat Icon - GUARANTEED VISIBLE */}
      {!isOpen && (
        <button
          onClick={() => {
            console.log('🤖 CHATBOT BUTTON CLICKED!');
            setIsOpen(true);
          }}
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: company.primaryColor || '#1e40af',
            border: '4px solid white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Bot size={32} color="white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0px',
            width: '384px',
            height: '500px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: 'none'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '16px',
              backgroundColor: company.primaryColor || '#1e40af',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <span style={{ fontWeight: '500' }}>Carbon Assistant</span>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1, 
            padding: '16px', 
            overflowY: 'auto', 
            backgroundColor: '#f9fafb' 
          }}>
            {messages.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                marginTop: '32px' 
              }}>
                <Bot size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                <p>Start a conversation!</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {message.type === 'bot' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: company.primaryColor || '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bot size={16} color="white" />
                    </div>
                  )}
                  
                  <div style={{
                    maxWidth: '280px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: message.type === 'user' ? '#3b82f6' : 'white',
                    color: message.type === 'user' ? 'white' : 'black',
                    border: message.type === 'bot' ? '1px solid #e5e7eb' : 'none',
                    borderBottomRightRadius: message.type === 'user' ? '4px' : '12px',
                    borderBottomLeftRadius: message.type === 'bot' ? '4px' : '12px'
                  }}>
                    <div style={{ fontSize: '14px' }}>
                      {formatMessageContent(message.content)}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={16} color="white" />
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {message.type === 'bot' && message.suggestions && (
                  <div style={{ marginTop: '8px', marginLeft: '40px' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(suggestion)}
                        style={{
                          fontSize: '12px',
                          height: '28px',
                          padding: '0 8px',
                          marginRight: '8px',
                          marginBottom: '4px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          color: '#374151'
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: company.primaryColor || '#1e40af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                  maxWidth: '280px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#9ca3af', 
                      borderRadius: '50%', 
                      animation: 'bounce 1.4s infinite ease-in-out'
                    }}></div>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#9ca3af', 
                      borderRadius: '50%', 
                      animation: 'bounce 1.4s infinite ease-in-out 0.16s'
                    }}></div>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      backgroundColor: '#9ca3af', 
                      borderRadius: '50%', 
                      animation: 'bounce 1.4s infinite ease-in-out 0.32s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid #e5e7eb', 
            backgroundColor: 'white' 
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                style={{ flex: 1 }}
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                style={{ backgroundColor: company.primaryColor || '#1e40af' }}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};