/**
 * SubmissionsHistory Component
 * 
 * Displays tables of content and social media submissions.
 * 
 * Styling:
 * - Uses white background with primary color accents
 * - Consistent spacing and typography
 * - Responsive table design
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Submission {
  id: string;
  content_type?: string;
  content_url?: string;
  platform?: string;
  post_url?: string;
  status: string;
  points_awarded: number | null;
}

interface SubmissionsHistoryProps {
  contentSubmissions: Submission[];
  socialSubmissions: Submission[];
}

export const SubmissionsHistory = ({ contentSubmissions, socialSubmissions }: SubmissionsHistoryProps) => {
  return (
    <section className="space-y-6">
      <Card className="bg-white shadow-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Content Submissions</CardTitle>
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

      <Card className="bg-white shadow-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Social Submissions</CardTitle>
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
  )
}
