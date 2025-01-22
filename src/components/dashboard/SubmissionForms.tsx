/**
 * SubmissionForms Component
 * 
 * Handles content and social media submissions with form validation.
 * 
 * Props:
 * - address: User's wallet address
 * - onSubmitSuccess: Callback function to refresh data after successful submission
 * 
 * Features:
 * - Form validation using react-hook-form and zod
 * - Supabase integration for data storage
 * - Loading states and error handling
 * 
 * To modify:
 * - Update form validation rules in the schema objects
 * - Modify form fields by updating the FormField components
 * - Change submission logic in handleContentSubmit and handleSocialSubmit
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'

const contentSubmissionSchema = z.object({
  content_type: z.string().min(1, "Content type is required"),
  content_url: z.string().url("Please enter a valid URL"),
})

const socialSubmissionSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  post_url: z.string().url("Please enter a valid URL"),
})

interface SubmissionFormsProps {
  address: string;
  onSubmitSuccess: () => void;
}

export const SubmissionForms = ({ address, onSubmitSuccess }: SubmissionFormsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const contentForm = useForm<z.infer<typeof contentSubmissionSchema>>({
    resolver: zodResolver(contentSubmissionSchema),
    defaultValues: {
      content_type: "",
      content_url: "",
    },
  })

  const socialForm = useForm<z.infer<typeof socialSubmissionSchema>>({
    resolver: zodResolver(socialSubmissionSchema),
    defaultValues: {
      platform: "",
      post_url: "",
    },
  })

  const handleContentSubmit = async (values: z.infer<typeof contentSubmissionSchema>) => {
    try {
      setIsSubmitting(true)
      console.log('Submitting content for address:', address)

      const { error } = await supabase
        .from('content_submissions')
        .insert([{
          wallet_address: address,
          content_type: values.content_type,
          content_url: values.content_url,
        }])

      if (error) throw error

      toast({
        title: "Content submitted successfully",
        description: "Your submission is being reviewed.",
      })
      
      contentForm.reset()
      onSubmitSuccess()
    } catch (error: any) {
      console.error('Content submission error:', error)
      toast({
        variant: "destructive",
        title: "Error submitting content",
        description: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialSubmit = async (values: z.infer<typeof socialSubmissionSchema>) => {
    try {
      setIsSubmitting(true)
      console.log('Submitting social post for address:', address)

      const { error } = await supabase
        .from('social_submissions')
        .insert([{
          wallet_address: address,
          platform: values.platform,
          post_url: values.post_url,
        }])

      if (error) throw error

      toast({
        title: "Social post submitted successfully",
        description: "Your submission is being reviewed.",
      })
      
      socialForm.reset()
      onSubmitSuccess()
    } catch (error: any) {
      console.error('Social submission error:', error)
      toast({
        variant: "destructive",
        title: "Error submitting social post",
        description: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="bg-white shadow-lg border border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Submit Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...contentForm}>
            <form onSubmit={contentForm.handleSubmit(handleContentSubmit)} className="space-y-4">
              <FormField
                control={contentForm.control}
                name="content_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., article, video" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contentForm.control}
                name="content_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  'Submit Content'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-600">Submit Social Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...socialForm}>
            <form onSubmit={socialForm.handleSubmit(handleSocialSubmit)} className="space-y-4">
              <FormField
                control={socialForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Twitter, LinkedIn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={socialForm.control}
                name="post_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  'Submit Post'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}