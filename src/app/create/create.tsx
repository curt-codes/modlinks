"use client";

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Edit2, Trash2, Upload } from 'lucide-react'
import { Recursive } from 'next/font/google'
import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const recursive = Recursive({ subsets: ['latin'] })

interface Submission {
  mods: string[];
  color: string;
  yearMakeModel: string;
  websites: { name: string; url: string; }[];
  socials: { name: string; url: string; }[];
  profilePicture: string;
}

export default function Create() {
  const [yearMakeModel, setYearMakeModel] = useState("2023 Toyota Supra");
  const [color, setColor] = useState("Nitro Yellow");
  const [mods, setMods] = useState([
    "Aftermarket exhaust system",
    "Lowering springs",
    "19\" forged wheels",
    "Ceramic coating"
  ]);
  const [editingCard, setEditingCard] = useState("");
  const [newMod, setNewMod] = useState("");
  const [websites, setWebsites] = useState([
    { name: "ECS Tuning", url: "https://www.ecstuning.com" },
    { name: "FT Speed", url: "https://www.ftspeed.com" },
    { name: "RockAuto", url: "https://www.rockauto.com" }
  ]);
  const [socials, setSocials] = useState([
    { name: "Instagram", url: "https://www.instagram.com/yourusername" },
    { name: "Twitter", url: "https://www.twitter.com/yourusername" },
    { name: "YouTube", url: "https://www.youtube.com/yourchannel" }
  ]);
  const [newWebsite, setNewWebsite] = useState({ name: "", url: "" });
  const [newSocial, setNewSocial] = useState({ name: "", url: "" });
  const [profilePicture, setProfilePicture] = useState("/images/pic.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (cardName: string) => {
    setEditingCard(cardName);
  };

  const handleSave = () => {
    setEditingCard("");
    setNewMod("");
    setNewWebsite({ name: "", url: "" });
    setNewSocial({ name: "", url: "" });
  };

  const addMod = () => {
    if (newMod.trim()) {
      setMods([...mods, newMod.trim()]);
      setNewMod("");
    }
  };

  const removeMod = (index: number) => {
    setMods(mods.filter((_, i) => i !== index));
  };

  const addWebsite = () => {
    if (newWebsite.name.trim() && newWebsite.url.trim()) {
      setWebsites([...websites, newWebsite]);
      setNewWebsite({ name: "", url: "" });
    }
  };

  const removeWebsite = (index: number) => {
    setWebsites(websites.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    if (newSocial.name.trim() && newSocial.url.trim()) {
      setSocials([...socials, newSocial]);
      setNewSocial({ name: "", url: "" });
    }
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting to API...");

    const mySubmission: Submission = {
      mods: mods,
      color: color,
      yearMakeModel: yearMakeModel,
      websites: websites,
      socials: socials,
      profilePicture: profilePicture || "no image",
    }

    console.log(mySubmission);

    try {
      const queryParams = new URLSearchParams(mySubmission as any);
      const response = await fetch(`http://localhost:3000/generateUrl?${queryParams}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Submission successful:', data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <main className={recursive.className}>
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center relative">
            <div className="w-32 h-32 relative">
              <Image
                src={profilePicture}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-white shadow-lg cursor-pointer"
                onClick={handleProfilePictureClick}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-0 right-0 bg-white rounded-full p-2"
              onClick={handleProfilePictureClick}
            >
              <Upload className="w-4 h-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Year/Make/Model</h2>
                <Button variant="ghost" size="sm" onClick={() => handleEdit("yearMakeModel")}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              {editingCard === "yearMakeModel" ? (
                <div className="flex items-center">
                  <Input
                    value={yearMakeModel}
                    onChange={(e) => setYearMakeModel(e.target.value)}
                    className="mr-2"
                  />
                  <Button onClick={handleSave}>Save</Button>
                </div>
              ) : (
                <p className="text-gray-600">{yearMakeModel}</p>
              )}
            </CardContent>
          </Card>

          
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Color</h2>
              <Button variant="ghost" size="sm" onClick={() => handleEdit("color")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {editingCard === "color" ? (
              <div className="flex items-center">
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <p className="text-gray-600">{color}</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Mods</h2>
              <Button variant="ghost" size="sm" onClick={() => handleEdit("mods")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {editingCard === "mods" ? (
              <div>
                <ul className="space-y-2 mb-2">
                  {mods.map((mod, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{mod}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeMod(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center mb-2">
                  <Input
                    value={newMod}
                    onChange={(e) => setNewMod(e.target.value)}
                    placeholder="Add new mod"
                    className="mr-2"
                  />
                  <Button onClick={addMod}>Add</Button>
                </div>
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {mods.map((mod, index) => (
                  <li key={index}>{mod}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">My Socials</h2>
              <Button variant="ghost" size="sm" onClick={() => handleEdit("socials")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {editingCard === "socials" ? (
              <div>
                <ul className="space-y-2 mb-2">
                  {socials.map((social, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                        {social.name}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => removeSocial(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center mb-2">
                  <Input
                    value={newSocial.name}
                    onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                    placeholder="Social media name"
                    className="mr-2"
                  />
                  <Input
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    placeholder="Social media URL"
                    className="mr-2"
                  />
                  <Button onClick={addSocial}>Add</Button>
                </div>
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {socials.map((social, index) => (
                  <li key={index}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                      {social.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Websites I shop at</h2>
              <Button variant="ghost" size="sm" onClick={() => handleEdit("websites")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {editingCard === "websites" ? (
              <div>
                <ul className="space-y-2 mb-2">
                  {websites.map((site, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                        {site.name}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => removeWebsite(index)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center mb-2">
                  <Input
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                    placeholder="Website name"
                    className="mr-2"
                  />
                  <Input
                    value={newWebsite.url}
                    onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                    placeholder="Website URL"
                    className="mr-2"
                  />
                  <Button onClick={addWebsite}>Add</Button>
                </div>
                <Button onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <ul className="space-y-2">
                {websites.map((site, index) => (
                  <li key={index}>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                      {site.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
          
          <Button onClick={handleSubmit} className="w-full mt-4">Submit</Button>
        </div>
      </div>
    </main>
  );
}
