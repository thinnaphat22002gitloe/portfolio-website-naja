import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Clock, Loader2, Copy, Check } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/context/SiteContentContext';
import { ApiError, submitContact } from '@/lib/api';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function Contact() {
  const { contact } = useSiteContent();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Email address has been copied.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      service: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await submitContact(values);
      toast({
        title: "Message Sent Successfully",
        description: response.message,
      });
      form.reset();
    } catch (error) {
      const description = error instanceof ApiError
        ? error.message
        : "Unable to send your message. Please try again.";
      toast({
        title: "Submission Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: 'Email Us', value: contact.info.email, action: () => copyToClipboard(contact.info.email) },
    { icon: Phone, label: 'Call Us', value: contact.info.phone, href: `tel:${contact.info.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Office', value: contact.info.address },
    { icon: Clock, label: 'Working Hours', value: contact.info.workingHours },
  ];

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="mb-20"
        >
          <div className="text-secondary font-mono text-sm mb-6 tracking-[0.4em] uppercase font-bold">{contact.sectionLabel}</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8">{contact.title}</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16"
        >
          <div className="space-y-10">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-extrabold text-foreground mb-6">Contact Information</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                {contact.description}
              </p>
            </motion.div>

            <div className="space-y-8">
              {contactItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center gap-4 sm:gap-5 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-lg">
                    <item.icon size={22} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] mb-2">{item.label}</p>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center gap-3"
                      >
                        {item.value}
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                    ) : item.href ? (
                      <a href={item.href} className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-base sm:text-lg font-bold text-foreground">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-bold text-sm">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="สมชาย" {...field} className="bg-muted/50 border-border focus:border-primary rounded-lg h-12 px-4" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-bold text-sm">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="รักดี" {...field} className="bg-muted/50 border-border focus:border-primary rounded-lg h-12 px-4" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold text-sm">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="somchai@company.com" {...field} className="bg-muted/50 border-border focus:border-primary rounded-lg h-12 px-4" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold text-sm">Interested Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/50 border-border focus:border-primary rounded-lg h-12 px-4">
                            <SelectValue placeholder="เลือกบริการที่สนใจ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="iot">IoT & Digital Twin</SelectItem>
                          <SelectItem value="automation">Business Automation</SelectItem>
                          <SelectItem value="other">Other Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-bold text-sm">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="บอกเราเกี่ยวกับโปรเจกต์ของคุณ..."
                          className="bg-muted/50 border-border focus:border-primary rounded-xl min-h-[120px] p-4 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" /> Sending...
                    </span>
                  ) : (
                    "ส่งข้อความหาเรา"
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
