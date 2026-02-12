import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EmployerPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Post a Job</CardTitle>
                        <CardDescription>This feature is coming soon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>We are working on a dedicated portal for employers to post jobs directly on our platform.</p>
                        <p className="mt-4">In the meantime, please check back later or <Link href="/policy" className="text-primary underline">contact us</Link> for more information.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
