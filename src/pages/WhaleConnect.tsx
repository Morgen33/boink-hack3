import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Fish, Shield, Crown, Coins, Users, MessageSquare } from 'lucide-react';

const formSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  holdingsPercentage: z.string().optional(),
  contactMethod: z.string().min(1, 'Preferred contact method is required'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const interestOptions = [
  { id: 'whale-advisory', label: 'Whale Advisory Circle', icon: Crown },
  { id: 'nft-access', label: 'NFT Access / Pre-Mints', icon: Shield },
  { id: 'revenue-share', label: 'Revenue Share / Vesting Deals', icon: Coins },
  { id: 'lockups-lp', label: 'Lockups / LP Incentives', icon: Users },
  { id: 'collaboration', label: 'General Collaboration', icon: MessageSquare },
];

const WhaleConnect = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: '',
      holdingsPercentage: '',
      contactMethod: '',
      interests: [],
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('whale_applications')
        .insert({
          wallet_address: data.walletAddress,
          holdings_percentage: data.holdingsPercentage || null,
          contact_method: data.contactMethod,
          interests: data.interests,
          message: data.message || null,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted Successfully! 🐋",
        description: "Thank you for your interest. Our team will review your application and be in touch soon.",
      });

      form.reset();
    } catch (error: any) {
      console.error('Error submitting whale application:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-web3-red/10 via-background to-web3-magenta/10">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-r from-web3-red to-web3-magenta rounded-full">
                <Fish className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-web3-red to-web3-magenta bg-clip-text text-transparent">
              Whale Connect Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              If you hold 1% or more of the $BOINK supply, we want to connect. We're offering exclusive perlks including 
              NFT access, governance roles, revenue opportunities, and more. All submissions are private.
            </p>
          </div>

          {/* Benefits Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-web3-red/20 hover:border-web3-red/40 transition-colors">
              <CardHeader className="text-center">
                <Crown className="w-8 h-8 mx-auto text-web3-red mb-2" />
                <CardTitle className="text-lg">Exclusive Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Join the Whale Advisory Circle and get early access to major decisions
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-web3-magenta/20 hover:border-web3-magenta/40 transition-colors">
              <CardHeader className="text-center">
                <Coins className="w-8 h-8 mx-auto text-web3-magenta mb-2" />
                <CardTitle className="text-lg">Revenue Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Participate in revenue sharing and vesting deals
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-web3-orange/20 hover:border-web3-orange/40 transition-colors">
              <CardHeader className="text-center">
                <Shield className="w-8 h-8 mx-auto text-web3-orange mb-2" />
                <CardTitle className="text-lg">Premium NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Priority access to NFT drops and pre-mint opportunities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="shadow-2xl border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Fish className="w-6 h-6 text-web3-red" />
                Whale Application Form
              </CardTitle>
              <CardDescription>
                Complete the form below to apply for our exclusive whale program. All information is kept strictly confidential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Wallet Address */}
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Wallet Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the wallet address holding $BOINK"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          Please enter the wallet address holding $BOINK.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Holdings Percentage */}
                  <FormField
                    control={form.control}
                    name="holdingsPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Approximate Holdings (%)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 2.5%"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          Roughly what % of $BOINK supply do you hold?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Method */}
                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Preferred Contact Method *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Twitter @ / Telegram @ / Email"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          How would you prefer we reach out to you?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Interests */}
                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base font-semibold">
                            What Are You Interested In? *
                          </FormLabel>
                          <FormDescription>
                            Select all opportunities that interest you.
                          </FormDescription>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {interestOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="interests"
                              render={({ field }) => {
                                const IconComponent = option.icon;
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex items-center space-x-2">
                                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                                      <FormLabel className="font-normal cursor-pointer">
                                        {option.label}
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Message (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Anything else you'd like to share?"
                            className="min-h-[120px] resize-vertical"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Tell us more about your goals or any specific ideas you have.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-web3-red to-web3-magenta hover:from-web3-red/90 hover:to-web3-magenta/90 text-white px-12 py-4 text-lg font-semibold"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              🔒 All submissions are completely private and confidential. We will never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhaleConnect;