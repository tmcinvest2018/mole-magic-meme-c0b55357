/**
 * Dashboard Page Component
 * 
 * Main dashboard page that combines all dashboard components.
 * 
 * Features:
 * - Wallet connection check
 * - Data fetching with React Query
 * - Loading states
 * - Error handling with toast notifications
 * 
 * To modify:
 * - Update the layout by adjusting the container classes
 * - Modify the background gradient via from-orange-50 to-white classes
 * - Change spacing with space-y-8 and other utility classes
 */

import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'
import { WalletOverview } from '@/components/dashboard/WalletOverview'
import { XPOverview } from '@/components/dashboard/XPOverview'
import { SubmissionForms } from '@/components/dashboard/SubmissionForms'
import { ReferralSection } from '@/components/dashboard/ReferralSection'
import { SubmissionsHistory } from '@/components/dashboard/SubmissionsHistory'

const Dashboard = () => {
  const { address } = useAccount()
  const { toast } = useToast()

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
        throw error
      }

      return data || []
    },
    enabled: !!address,
  })

  // Fetch submissions
  const { data: contentSubmissions, isLoading: isLoadingContent } = useQuery({
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

  const { data: socialSubmissions, isLoading: isLoadingSocial } = useQuery({
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

  // Fetch referral link
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

  const handleRefetchAll = () => {
    refetchXP()
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
      
      {/* Wallet Overview */}
      <section className="mb-12">
        <WalletOverview address={address as `0x${string}`} hideViewDashboardButton={true} />
      </section>

      {/* XP Overview */}
      <XPOverview xpPoints={xpPoints} />

      {/* Submission Forms */}
      <SubmissionForms 
        address={address} 
        onSubmitSuccess={handleRefetchAll}
      />

      {/* Referral Section */}
      <ReferralSection
        address={address}
        referralLink={referralLink}
        onGenerate={handleRefetchAll}
      />

      {/* Submissions History */}
      <SubmissionsHistory
        contentSubmissions={contentSubmissions}
        socialSubmissions={socialSubmissions}
      />
    </div>
  )
}

export default Dashboard