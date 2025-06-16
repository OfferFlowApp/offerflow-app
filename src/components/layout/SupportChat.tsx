
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { askAppSupport, type AppSupportInput, type AppSupportOutput } from '@/ai/flows/app-support-flow';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response: AppSupportOutput = await askAppSupport({ question: userMessage.text });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling support flow:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t({ en: 'Sorry, I encountered an error. Please try again.', el: 'Συγγνώμη, παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.' }),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      // A more reliable way to get the scrollable viewport within ScrollArea
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);
  
  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 'welcome', text: t({ en: "Hi! How can I help you with OfferFlow today?", el: "Γεια σας! Πώς μπορώ να σας βοηθήσω με το OfferFlow σήμερα;"}), sender: 'bot'}
      ]);
    }
  }, [isOpen, messages.length, t]);


  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label={t({en: "Open support chat", el: "Άνοιγμα συνομιλίας υποστήριξης"})}
        >
          <Bot className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[28rem] sm:h-[32rem] shadow-xl z-[100] flex flex-col rounded-lg border bg-card">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg font-semibold text-primary flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              {t({ en: 'OfferFlow Support', el: 'Υποστήριξη OfferFlow' })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {/* Handle potential multi-line responses from AI */}
                      {msg.text.split('\n').map((line, index, arr) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground flex items-center shadow-sm">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t({en: "Thinking...", el: "Σκέφτομαι..."})}
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-background/95">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t({ en: 'Ask a question...', el: 'Ρωτήστε κάτι...' })}
                className="flex-grow text-sm"
                disabled={isLoading}
                autoFocus
              />
              <Button type="submit" size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !inputValue.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
