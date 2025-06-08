import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListChecks, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function HomePage() {
  const lastProjects = [
    { id: 'proj1', name: 'Q4 Tech Sale Proposal', date: '2023-10-15' },
    { id: 'proj2', name: 'Spring Marketing Offer', date: '2023-09-28' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 font-headline text-primary">Welcome to OfferSheet</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your sales process with professional, easy-to-create offer sheets.
            Upload your logo, add products, set terms, and impress your clients.
          </p>
          <Link href="/offer-sheet/edit">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Offer Sheet
            </Button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center font-headline">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                   <Image src="https://placehold.co/48x48.png" alt="Logo Upload Icon" width={48} height={48} data-ai-hint="logo upload" />
                </div>
                <CardTitle className="font-headline">Custom Branding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Easily upload your company logo to personalize every offer sheet.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                  <Image src="https://placehold.co/48x48.png" alt="Product List Icon" width={48} height={48} data-ai-hint="product list"/>
                </div>
                <CardTitle className="font-headline">Dynamic Product Lists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Add multiple products with details, images, and pricing effortlessly.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-md inline-block mb-4">
                 <Image src="https://placehold.co/48x48.png" alt="Export Icon" width={48} height={48} data-ai-hint="export share" />
                </div>
                <CardTitle className="font-headline">Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Generate professional PDFs and share your offers with clients in moments.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center font-headline">Your Recent Offer Sheets</h2>
          {lastProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lastProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                    <CardDescription>Last updated: {project.date}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/offer-sheet/edit?id=${project.id}`}>
                        Open Project <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardHeader>
                <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="font-headline">No Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Start by creating a new offer sheet.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
