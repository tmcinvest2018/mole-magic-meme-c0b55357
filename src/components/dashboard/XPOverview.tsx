/**
 * XPOverview Component
 * 
 * Displays user's XP points across different categories in a grid of cards.
 * 
 * Props:
 * - xpPoints: Array of XP point records from the database
 * 
 * Styling:
 * - Grid layout with responsive columns
 * - White background cards with orange border
 * - Icon and text styling for clear hierarchy
 * 
 * To modify:
 * - Adjust grid columns by updating grid-cols-* classes
 * - Change card styling via bg-white and border-orange-200 classes
 * - Modify spacing with gap-6 class
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
      <Card className="bg-white shadow-lg border border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content XP</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getXPByCategory('content')}
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
            {getXPByCategory('social')}
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
            {getXPByCategory('referral')}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}