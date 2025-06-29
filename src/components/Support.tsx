import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Send, ExternalLink, Eye, Volume2, HelpCircle } from 'lucide-react';

const Support: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      setDescription('');
      alert('Support request submitted successfully!');
    }, 2000);
  };

  const faqs = [
    {
      question: 'How do I reset my device?',
      answer: 'Hold the reset button for 10 seconds while the device is powered on. The LED will flash to confirm reset.'
    },
    {
      question: 'Device not connecting to WiFi?',
      answer: 'Check password, ensure 2.4GHz network, restart device, and verify signal strength.'
    },
    {
      question: 'How to update firmware?',
      answer: 'Go to Device Management > Select device > Firmware Update. Follow on-screen instructions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentScreen('welcome')}
            className="text-slate-400 hover:text-white p-2"
            aria-label="Go back to welcome screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" role="heading" aria-level={1}>Support</h1>
            <p className="text-slate-400">Get help and support</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Help Resources</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Volume2 className="w-4 h-4" />
            <span>Screen Reader Ready</span>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <HelpCircle className="w-5 h-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-slate-200 hover:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-slate-200">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
                aria-label="Submit support request"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Links */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => window.open('#', '_blank')}
            >
              <span>User Manual</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-between border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => window.open('#', '_blank')}
            >
              <span>Video Tutorials</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-between border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => window.open('#', '_blank')}
            >
              <span>Community Forum</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;