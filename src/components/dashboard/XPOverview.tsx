/**
 * XPOverview Component
 * 
 * Displays user's XP points across different categories.
 * 
 * Styling:
 * - Clean card design with primary color accents
 * - Consistent typography and spacing
 * - Responsive grid layout
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Link } from "lucide-react"

interface XPPoint {
  category: string;
  points: number;
}

interface XPOverviewProps {
  xpPoints: XPPoint[];
}

export const XPOverview = ({ xpPoints }: XPOverviewProps) => {
  const getXPByCategory = (category: string) => 
    xpPoints?.find(xp => xp.category === category)?.points || 0

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white shadow-lg border border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content XP</CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {getXPByCategory('content')}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social XP</CardTitle>
          <MessageSquare className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {getXPByCategory('social')}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Referral XP</CardTitle>
          <Link className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {getXPByCategory('referral')}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
