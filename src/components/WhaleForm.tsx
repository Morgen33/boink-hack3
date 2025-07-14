import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  holdingsPercentage: z.string().optional(),
  contactMethod: z.string().min(1, 'Preferred contact method is required'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const interestOptions = [
  'Whale Advisory Circle',
  'NFT Access / Pre-Mints',
  'Revenue Share / Vesting Deals',
  'Lockups / LP Incentives',
  'General Collaboration',
];

export const WhaleForm: React.FC = () => {
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
      // Here you would typically send the data to your backend
      console.log('Whale form submission:', data);
      
      toast({
        title: "Form Submitted",
        description: "Thank you for your interest! We'll be in touch soon.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-lg text-foreground font-medium mb-2">
            If you hold 1% or more of the $BOINK supply, we want to connect. We're offering exclusive perks.
          </p>
          <p className="text-sm text-muted-foreground">
            All submissions are private.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Whale Group Registration
            </CardTitle>
            <p className="text-muted-foreground text-center">
              Join our exclusive whale community for $BOINK holders
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Whale group Wallet Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please enter the wallet address holding $BOINK."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="holdingsPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate Holdings (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Roughly what % of $BOINK supply do you hold?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter @ / Telegram @ / Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>What Are You Interested In? *</FormLabel>
                      <div className="space-y-3">
                        {interestOptions.map((option) => (
                          <FormField
                            key={option}
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Anything else you'd like to share?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit Application
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};