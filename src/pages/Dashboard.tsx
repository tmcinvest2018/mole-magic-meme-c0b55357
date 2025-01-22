import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Loader2, Award, FileText, Link, MessageSquare } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Dashboard as WalletDashboard } from '@/components/Dashboard'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Form validation schemas
const contentSubmissionSchema = z.object({
  content_type: z.string().min(1, "Content type is required"),
  content_url: z.string().url("Please enter a valid URL"),
})

const socialSubmissionSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  post_url: z.string().url("Please enter a valid URL"),
})

type ContentSubmission = {
  content_type: string;
  content_url: string;
  wallet_address: string;
}

type SocialSubmission = {
  platform: string;
  post_url: string;
  wallet_address: string;
}

const Dashboard = () => {
  const { address } = useAccount()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Forms
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

  // Fetch XP points
  const { data: xpPoints, isLoading: isLoadingXP, refetch: refetchXP } = useQuery({
    queryKey: ['xp-points', address],
    queryFn: async () => {
      console.log('Fetching XP points for address:', address)
      if (!address) throw new Error('Wallet address is required')

      const { data, error } = await supabase
        .from('xp_points')
        .select('*')
        .eq('wallet_address', address)

      if (error) {
        console.error('Error fetching XP points:', error)
        toast({
          variant: "destructive",
          title: "Error fetching XP points",
          description: error.message
        })
        throw error
      }

      return data || []
    },
    enabled: !!address,
  })

  // Fetch submissions
  const { data: contentSubmissions, isLoading: isLoadingContent, refetch: refetchContent } = useQuery({
    queryKey: ['content-submissions', address],
    queryFn: async () => {
      if (!address) throw new Error('Wallet address is required')

      const { data, error } = await supabase
        .from('content_submissions')
        .select('*')
        .eq('wallet_address', address)

      if (error) throw error
      return data || []
    },
    enabled: !!address,
  })

  const { data: socialSubmissions, isLoading: isLoadingSocial, refetch: refetchSocial } = useQuery({
    queryKey: ['social-submissions', address],
    queryFn: async () => {
      if (!address) throw new Error('Wallet address is required')

      const { data, error } = await supabase
        .from('social_submissions')
        .select('*')
        .eq('wallet_address', address)

      if (error) throw error
      return data || []
    },
    enabled: !!address,
  })

  const { data: referralLink, isLoading: isLoadingReferral } = useQuery({
    queryKey: ['referral-link', address],
    queryFn: async () => {
      console.log('Fetching referral link for address:', address)
      if (!address) throw new Error('Wallet address is required')

      const { data, error } = await supabase
        .from('referral_links')
        .select('*')
        .eq('wallet_address', address)
        .maybeSingle()

      if (error) {
        console.error('Error fetching referral link:', error)
        throw error
      }
      return data
    },
    enabled: !!address,
  })

  // Submit handlers
  const handleContentSubmit = async (values: z.infer<typeof contentSubmissionSchema>) => {
    try {
      setIsSubmitting(true)
      if (!address) throw new Error('Wallet address is required')

      const submission: ContentSubmission = {
        wallet_address: address,
        content_type: values.content_type,
        content_url: values.content_url,
      }

      const { error } = await supabase
        .from('content_submissions')
        .insert([submission])

      if (error) throw error

      toast({
        title: "Content submitted successfully",
        description: "Your submission is being reviewed.",
      })
      
      contentForm.reset()
      refetchContent()
      refetchXP()
    } catch (error: any) {
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
      if (!address) throw new Error('Wallet address is required')

      console.log('Submitting social post for address:', address)
      const submission: SocialSubmission = {
        wallet_address: address,
        platform: values.platform,
        post_url: values.post_url,
      }

      const { error } = await supabase
        .from('social_submissions')
        .insert([submission])

      if (error) {
        console.error('Error submitting social post:', error)
        throw error
      }

      toast({
        title: "Social post submitted successfully",
        description: "Your submission is being reviewed.",
      })
      
      socialForm.reset()
      await refetchSocial()
      await refetchXP()
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

  const generateReferralLink = async () => {
    try {
      setIsSubmitting(true)
      if (!address) throw new Error('Wallet address is required')

      const { data: referralCode, error: functionError } = await supabase
        .rpc('generate_referral_code', {
          wallet: address
        })

      if (functionError) throw functionError

      const { error: insertError } = await supabase
        .from('referral_links')
        .insert([
          {
            wallet_address: address,
            referral_code: referralCode
          }
        ])

      if (insertError) throw insertError

      toast({
        title: "Referral link generated",
        description: "Your unique referral code has been created.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating referral link",
        description: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!address) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <p className="text-lg text-gray-600">Please connect your wallet to view your dashboard</p>
      </div>
    )
  }

  const isLoading = isLoadingXP || isLoadingContent || isLoadingSocial || isLoadingReferral

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-orange-50 to-white space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-orange-600">Your Dashboard</h1>
      
      {/* Wallet Dashboard Section */}
      <section className="mb-12">
        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Wallet Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletDashboard hideViewDashboardButton={true} />
          </CardContent>
        </Card>
      </section>

      {/* XP Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content XP</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xpPoints?.find(xp => xp.category === 'content')?.points || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social XP</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xpPoints?.find(xp => xp.category === 'social')?.points || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral XP</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {xpPoints?.find(xp => xp.category === 'referral')?.points || 0}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Submission Forms Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Content Submission Form */}
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

        {/* Social Submission Form */}
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

      {/* Referral Section */}
      <section className="mb-8">
        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Referral Program</CardTitle>
          </CardHeader>
          <CardContent>
            {referralLink ? (
              <div className="space-y-4">
                <div>
                  <Label>Your Referral Code</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                    {referralLink.referral_code}
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={generateReferralLink}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  'Generate Referral Link'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Submissions History */}
      <section className="space-y-6">
        {/* Content Submissions */}
        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Content Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {contentSubmissions && contentSubmissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.content_type}</TableCell>
                      <TableCell className="max-w-xs truncate">{submission.content_url}</TableCell>
                      <TableCell>{submission.status}</TableCell>
                      <TableCell>{submission.points_awarded || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No content submissions yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Social Submissions */}
        <Card className="bg-white shadow-lg border border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600">Social Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {socialSubmissions && socialSubmissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.platform}</TableCell>
                      <TableCell className="max-w-xs truncate">{submission.post_url}</TableCell>
                      <TableCell>{submission.status}</TableCell>
                      <TableCell>{submission.points_awarded || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No social submissions yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Dashboard
