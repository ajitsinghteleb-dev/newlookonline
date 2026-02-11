'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buildResume, BuildResumeOutput } from '@/ai/flows/build-resume';
import { Loader2, Sparkles, Wand2, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';


export default function ResumeBuilderPage() {
  const [experience, setExperience] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState<BuildResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!experience.trim() || !role.trim()) {
      setError('Please enter your experience and target role.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiResponse = await buildResume({ experience, targetRole: role });
      setResult(aiResponse);
    } catch (e) {
      console.error(e);
      setError('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (resultsRef.current) {
        const opt = {
            margin:       0.5,
            filename:     'lookonline-ai-resume.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(resultsRef.current).set(opt).save();
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-foreground">AI Resume Builder</h1>
          <p className="text-muted-foreground mt-2">
            Transform your raw experience into professional, polished resume content.
          </p>
        </div>

        <Card className="bg-card/50 border-dashed">
          <CardHeader>
            <CardTitle>Your Experience</CardTitle>
            <CardDescription>
              Paste your job description, daily tasks, or accomplishments below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Input
              placeholder="Target Role (e.g., Software Engineer)"
              className="bg-background"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Textarea
              placeholder="e.g., Managed a team of 5 engineers, responsible for the company's main product..."
              className="min-h-[200px] text-base bg-background"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} size="lg">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing for ATS...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Optimize with AI</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {error && (
            <div className="mt-8 text-center text-red-500">{error}</div>
        )}

        {result && (
          <div className="mt-12 space-y-10">
             <div ref={resultsRef}>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Polished Bullet Points</CardTitle>
                    <CardDescription>Action-oriented points using the STAR method, ready for your resume.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-3 text-foreground/90">
                      {result.polishedPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="mt-10">
                  <CardHeader>
                    <CardTitle>Suggested Keywords for 2026</CardTitle>
                    <CardDescription>Include these trending keywords to pass through ATS scans.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {result.suggestedKeywords.map((keyword, index) => (
                        <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

            <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download as PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
