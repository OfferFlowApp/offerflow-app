
"use client";

import React, { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, X } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';
import { LoadingSpinner } from '../ui/loading-spinner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface QnaPair {
  id: string;
  question: { en: string; el: string };
  answer: { en: string; el: string };
}

const qnaPairs: QnaPair[] = [
  {
    id: 'q1',
    question: { en: "How do I create a new offer?", el: "Πώς δημιουργώ μια νέα προσφορά;" },
    answer: {
      en: "You can create a new offer by clicking the 'Create New Offer Sheet' button on the homepage or the 'Create Offer' link in the header.",
      el: "Μπορείτε να δημιουργήσετε μια νέα προσφορά κάνοντας κλικ στο κουμπί 'Δημιουργία Νέου Δελτίου Προσφοράς' στην αρχική σελίδα ή στον σύνδεσμο 'Δημιουργία' στην κεφαλίδα."
    }
  },
  {
    id: 'q2',
    question: { en: "How can I export to PDF?", el: "Πώς μπορώ να εξάγω σε PDF;" },
    answer: {
      en: "On the offer sheet form, click the 'Export' button and then select 'Export as PDF' from the dropdown menu.",
      el: "Στη φόρμα του δελτίου προσφοράς, κάντε κλικ στο κουμπί 'Εξαγωγή' και στη συνέχεια επιλέξτε 'Εξαγωγή ως PDF' από το μενού."
    }
  },
  {
    id: 'q3',
    question: { en: "Where do I change my logo?", el: "Πού αλλάζω το λογότυπό μου;" },
    answer: {
      en: "You can set a default logo for all new offers by going to Settings > Branding & Seller Defaults. You can also upload a logo for a specific offer directly on the offer sheet form. Note that custom branding is a Pro/Business feature.",
      el: "Μπορείτε να ορίσετε ένα προεπιλεγμένο λογότυπο για όλες τις νέες προσφορές πηγαίνοντας στις Ρυθμίσεις > Προεπιλογές Επωνυμίας & Πωλητή. Μπορείτε επίσης να ανεβάσετε ένα λογότυπο για μια συγκεκριμένη προσφορά απευθείας στη φόρμα. Σημειώστε ότι η προσαρμοσμένη επωνυμία είναι λειτουργία Pro/Business."
    }
  },
  {
    id: 'q4',
    question: { en: "How are my offers saved?", el: "Πώς αποθηκεύονται οι προσφορές μου;" },
    answer: {
      en: "Offers are saved to your browser's local storage when you click 'Save Offer Sheet'. This means they are available on the same browser you used to create them. For signed-in users, we plan to add cloud sync in the future!",
      el: "Οι προσφορές αποθηκεύονται στην τοπική αποθήκευση του προγράμματος περιήγησής σας όταν κάνετε κλικ στην 'Αποθήκευση Δελτίου Προσφοράς'. Για τους συνδεδεμένους χρήστες, σχεδιάζουμε να προσθέσουμε συγχρονισμό στο cloud στο μέλλον!"
    }
  },
  {
    id: 'q5',
    question: { en: "Why use this instead of Microsoft Word?", el: "Γιατί να το χρησιμοποιήσω αντί για το Microsoft Word;" },
    answer: {
      en: "That's a key question! While you can create offers in a word processor, OfferFlow automates the entire process. It handles all price calculations (subtotals, VAT, grand totals) instantly, saving you from manual math errors. You can save and reuse product details and customer info, ensuring consistency. Plus, exporting to a clean, professional PDF is just one click away. It's all about saving time, reducing errors, and making you look more professional.",
      el: "Πολύ καλή ερώτηση! Ενώ μπορείτε να δημιουργήσετε προσφορές σε έναν επεξεργαστή κειμένου, το OfferFlow αυτοματοποιεί όλη τη διαδικασία. Διαχειρίζεται αυτόματα όλους τους υπολογισμούς τιμών (μερικά σύνολα, ΦΠΑ, γενικά σύνολα), γλιτώνοντάς σας από χειροκίνητα λάθη. Μπορείτε να αποθηκεύσετε και να επαναχρησιμοποιήσετε στοιχεία προϊόντων και πελατών, διασφαλίζοντας συνέπεια. Επιπλέον, η εξαγωγή σε ένα καθαρό, επαγγελματικό PDF γίνεται με ένα μόνο κλικ. Ο στόχος είναι η εξοικονόμηση χρόνου, η μείωση των σφαλμάτων και η επαγγελματικότερη παρουσίασή σας."
    }
  },
  {
    id: 'q6',
    question: { en: "Do I need a subscription to use this?", el: "Χρειάζομαι συνδρομή για να το χρησιμοποιήσω;" },
    answer: {
      en: "You can create your first offer sheet for free! If you need more, you can choose one of our affordable subscription plans. Creating an account automatically starts a 30-day free trial of our Pro features.",
      el: "Μπορείτε να δημιουργήσετε το πρώτο σας δελτίο προσφοράς δωρεάν! Εάν χρειάζεστε περισσότερα, μπορείτε να επιλέξετε ένα από τα οικονομικά συνδρομητικά μας πλάνα. Η δημιουργία λογαριασμού ξεκινά αυτόματα μια δωρεάν δοκιμή 30 ημερών των Pro χαρακτηριστικών μας."
    }
  },
  {
    id: 'q7',
    question: { en: "Is my data safe?", el: "Είναι τα δεδομένα μου ασφαλή;" },
    answer: {
      en: "Yes. When you're not logged in, all your offer data is saved locally in your browser. For logged-in users, we use Firebase, a secure platform from Google, to manage accounts and subscription data. We take your privacy seriously.",
      el: "Ναι. Όταν δεν είστε συνδεδεμένοι, όλα τα δεδομένα της προσφοράς σας αποθηκεύονται τοπικά στο πρόγραμμα περιήγησής σας. Για τους συνδεδεμένους χρήστες, χρησιμοποιούμε το Firebase, μια ασφαλή πλατφόρμα από την Google, για τη διαχείριση λογαριασμών και δεδομένων συνδρομής. Λαμβάνουμε σοβαρά υπόψη το απόρρητό σας."
    }
  }
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLocalization();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleQuestionClick = (qna: QnaPair) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: t(qna.question),
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: t(qna.answer),
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsAnswering(false);
    }, 300); // Simulate bot thinking
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: 'welcome', text: t({ en: "Hi! How can I help? Click a question below.", el: "Γεια σας! Πώς μπορώ να βοηθήσω; Κάντε κλικ σε μια ερώτηση." }), sender: 'bot' }
      ]);
      setIsAnswering(false);
    }
  }, [isOpen, t]);

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label={t({ en: "Open support chat", el: "Άνοιγμα συνομιλίας υποστήριξης" })}
        >
          <Bot className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[32rem] sm:h-[36rem] shadow-xl z-[100] flex flex-col rounded-lg border bg-card">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <span className="font-bold"><span className="text-primary">Offer</span><span className="text-accent">Flow</span></span>
              <span className='ml-1.5 font-medium text-primary'>{t({ en: 'Support', el: 'Υποστήριξη' })}</span>
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
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {msg.text.split('\n').map((line, index, arr) => (
                        <React.Fragment key={index}>
                          {line}
                          {index < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                {isAnswering && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground flex items-center shadow-sm">
                      <LoadingSpinner className="h-4 w-4 mr-2" />
                      {t({ en: "Typing...", el: "Πληκτρολογεί..." })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-background/95">
            <div className="w-full space-y-2">
              <p className="text-xs text-center text-muted-foreground">{t({en: "Frequent Questions", el: "Συχνές Ερωτήσεις"})}</p>
              {qnaPairs.map(qna => (
                <Button
                  key={qna.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => handleQuestionClick(qna)}
                  disabled={isAnswering}
                >
                  {t(qna.question)}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
