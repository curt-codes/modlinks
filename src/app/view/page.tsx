"use client";

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'
import { Recursive } from 'next/font/google'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'

const recursive = Recursive({ subsets: ['latin'] })

interface Submission {
  mods?: Mod[];
  color?: string;
  yearMakeModel?: string;
  websites?: Website[];
  socials?: Social[];
  profilePicture?: string;
}
interface Mod {
  name?: string;
}
interface Website {
  name?: string;
  url?: string;
}

interface Social {
  name?: string;
  url?: string;
} 

interface LinkData {
  randomString?: string;
  submission?: Submission;
}

export default function View() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const link = searchParams.get('link');

  useEffect(() => {
    const fetchData = async () => {
      if (!link) return;
      
      console.log("Fetching data for link:", link);
      setIsLoading(true);      
      try {
        const response = await fetch(`http://localhost:3000/${link}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: LinkData = await response.json();
console.log("Link Data: ", data)
console.log("Mods: ", data.submission?.mods)
        setSubmission({
          mods: data.submission?.mods,
          color: data.submission?.color,
          yearMakeModel: data.submission?.yearMakeModel,
          websites: data.submission?.websites,
          socials: data.submission?.socials,
          profilePicture: data.submission?.profilePicture
        });
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [link]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!submission) return <div>No data found</div>;

  return (
    <main className={recursive.className}>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center relative">
            <div className="w-32 h-32 relative">
              <Image
                src={submission.profilePicture || ""}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>
          
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Year/Make/Model</h2>
              <p className="text-gray-600">{submission.yearMakeModel}</p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Color</h2>
              <p className="text-gray-600">{submission.color}</p>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Mods</h2>
              <ul className="list-disc pl-5">
                {submission.mods?.map((mod, index) => (
                  <li key={index} className="text-gray-600">{mod.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Websites</h2>
              <ul className="space-y-2">
                {submission.websites.map((site, index) => (
                  <li key={index} className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {site.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Social Media</h2>
              <ul className="space-y-2">
                {submission.socials.map((social, index) => (
                  <li key={index} className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </main>
  );
}
