import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Settings, Send, ExternalLink, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const Support: React.FC = () => {
  const { setCurrentScreen } = useAppContext();
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqData = [
    {
      question: "Why is my device not connecting?",
      answer: "Check that Bluetooth is enabled on your phone and the device is in pairing mode. Ensure you're within 10 feet of the device. Try restarting both devices if the issue persists."
    },
    {
      question: "How do I reset my edge node?",
      answer: "Press and hold the reset button on the device for 10 seconds until the LED flashes red. The device will restart and return to factory settings."
    },
    {
      question: "What should I do if WiFi setup fails?",
      answer: "Verify your WiFi password is correct and the network is 2.4GHz. Some enterprise networks may not be compatible. Try using a mobile hotspot as an alternative."
    },
    {
      question: "How do I update device firmware?",
      answer: "Go to the Updates tab, select your device, and tap 'Install Update' if available. Ensure the device stays connected during the update process."
    },
    {
      question: "Can I manage multiple devices?",
      answer: "Yes, you can add and manage multiple edge nodes from the Device Management screen. Each device can be configured independently."
    }
  ];

  const helpLinks = [
    { title: "User Manual", url: "#", description: "Complete setup and usage guide" },
    { title: "Video Tutorials", url: "#", description: "Step-by-step video instructions" },
    { title: "Submit Support Ticket", url: "#", description: "Get help from our support team" },
    { title: "Community Forum", url: "#", description: "Connect with other users" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !description) {
      setShowErrorModal(true);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccessModal(true);
    setEmail('');
    setDescription('');
  };

  const isFormValid = email && description;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('welcome')}
          className="text-slate-400 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Support</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentScreen('settings')}
          className="text-slate-400 hover:text-white"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* FAQ Section */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger 
                    className="text-left hover:text-blue-400"
                    aria-label={`Expand FAQ: ${faq.question}`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-slate-800 border-slate-600 focus:border-blue-500"
                  required
                  aria-describedby="email-help"
                />
                <p id="email-help" className="text-xs text-slate-400">
                  We'll use this to respond to your request
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Issue Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="bg-slate-800 border-slate-600 focus:border-blue-500 min-h-[120px]"
                  required
                  aria-describedby="description-help"
                />
                <p id="description-help" className="text-xs text-slate-400">
                  Include device model, error messages, and steps you've tried
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attachment">Attachment (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attachment"
                    type="file"
                    className="bg-slate-800 border-slate-600 focus:border-blue-500"
                    accept=".jpg,.jpeg,.png,.pdf,.txt"
                    aria-describedby="attachment-help"
                  />
                  <Upload className="w-4 h-4 text-slate-400" />
                </div>
                <p id="attachment-help" className="text-xs text-slate-400">
                  Screenshots or logs can help us assist you better
                </p>
              </div>
              
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                aria-label="Submit support request"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Links */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {helpLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto bg-slate-800 hover:bg-slate-700"
                  onClick={() => window.open(link.url, '_blank')}
                  aria-label={`Open ${link.title} in new window`}
                >
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-sm text-slate-400">{link.description}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              Request Submitted
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            Your support request has been submitted successfully. We'll respond to your email within 24 hours.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Validation Error
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            Please fill in all required fields before submitting your request.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setShowErrorModal(false)}
              variant="outline"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;