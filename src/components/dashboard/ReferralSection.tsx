/**
 * ReferralSection Component
 * 
 * Handles referral code generation and display.
 * 
 * Props:
 * - address: User's wallet address
 * - onGenerate: Callback function to refresh data after generating a code
 * 
 * Features:
 * - Generates unique referral codes
 * - Displays existing referral code
 * - Loading states and error handling
 * 
 * To modify:
 * - Update the card styling via bg-white and border-orange-200 classes
 * - Change the button appearance by modifying the Button component props
 * - Adjust the layout using space-y-4 and other spacing classes
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'

interface ReferralSectionProps {
  address: string;
  referralLink: { referral_code: string } | null;
  onGenerate: () => void;
}

export const ReferralSection = ({ address, referralLink, onGenerate }: ReferralSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const generateReferralLink = async () => {
    try {
      setIsSubmitting(true)
      console.log('Generating referral link for address:', address)

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
      
      onGenerate()
    } catch (error: any) {
      console.error('Error generating referral link:', error)
      toast({
        variant: "destructive",
        title: "Error generating referral link",
        description: error.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
  )
}