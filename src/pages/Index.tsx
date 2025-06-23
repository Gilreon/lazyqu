import React, { useState, useEffect } from 'react';
import { Calendar, Video, Edit3, Trash2, Plus, Trash } from 'lucide-react';
import VideoForm from '../components/VideoForm';
import VideoList from '../components/VideoList';
import { Video as VideoType } from '../types/video';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CREATOR_TIPS = [
  "Consistency is key - post regularly to build audience trust",
  "Engage with your audience in comments to build community",
  "Use trending sounds and hashtags to increase discoverability",
  "Keep your intros short and attention-grabbing",
  "Plan your content ahead to maintain consistency",
  "Quality over quantity - focus on creating valuable content",
  "Use captions to make your content accessible to everyone",
  "Collaborate with other creators to reach new audiences",
  "Study your analytics to understand what works best",
  "Stay true to your niche and brand voice",
  "Create a content calendar to stay organized",
  "Respond to comments within the first hour for better engagement",
  "Use trending topics to create relevant content",
  "Keep your videos concise and to the point",
  "Use high-quality lighting for better video quality",
  "Create a unique style that sets you apart",
  "Use storytelling to make your content more engaging",
  "Experiment with different video formats",
  "Share behind-the-scenes content to build connection",
  "Use music that matches your brand's vibe",
  "Create content that solves problems for your audience",
  "Use transitions to keep viewers engaged",
  "Share your journey to build authenticity",
  "Use call-to-actions to encourage engagement",
  "Create content that educates and entertains",
  "Use trending challenges to increase visibility",
  "Keep your branding consistent across all videos",
  "Use text overlays to emphasize key points",
  "Create content that sparks conversation",
  "Use trending filters to stay relevant",
  "Share your expertise in your niche",
  "Use trending effects to stand out",
  "Create content that inspires action",
  "Use trending sounds to increase reach",
  "Share your unique perspective",
  "Use trending hashtags strategically",
  "Create content that builds community",
  "Use trending topics to stay relevant",
  "Share your authentic self",
  "Use trending challenges to engage",
  "Create content that adds value",
  "Use trending effects creatively",
  "Share your knowledge generously",
  "Use trending sounds effectively",
  "Create content that resonates",
  "Use trending hashtags wisely",
  "Share your passion genuinely",
  "Use trending topics thoughtfully",
  "Create content that connects",
  "Use trending challenges smartly"
];

const Index = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);
  const [randomTip, setRandomTip] = useState('');
  const [isTipVisible, setIsTipVisible] = useState(true);

  useEffect(() => {
    // Load videos from localStorage on component mount
    const savedVideos = localStorage.getItem('creatorVideos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }

    // Set current week as default
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    setSelectedWeek(startOfWeek.toISOString().split('T')[0]);

    // Set initial random tip
    setRandomTip(CREATOR_TIPS[Math.floor(Math.random() * CREATOR_TIPS.length)]);

    // Set up tip rotation
    const tipInterval = setInterval(() => {
      // Fade out
      setIsTipVisible(false);
      
      // After fade out, change tip and fade in
      setTimeout(() => {
        const currentIndex = CREATOR_TIPS.indexOf(randomTip);
        const nextIndex = (currentIndex + 1) % CREATOR_TIPS.length;
        setRandomTip(CREATOR_TIPS[nextIndex]);
        setIsTipVisible(true);
      }, 500); // Half a second for fade out
    }, 10000); // 10 seconds between tips

    return () => clearInterval(tipInterval);
  }, [randomTip]);

  useEffect(() => {
    // Save videos to localStorage whenever videos array changes
    localStorage.setItem('creatorVideos', JSON.stringify(videos));
  }, [videos]);

  const addVideo = (video: Omit<VideoType, 'id'>) => {
    const newVideo: VideoType = {
      ...video,
      id: Date.now().toString(),
    };
    setVideos([...videos, newVideo]);
  };

  const updateVideo = (updatedVideo: VideoType | Omit<VideoType, 'id'>) => {
    if ('id' in updatedVideo) {
      setVideos(videos.map(video => 
        video.id === updatedVideo.id ? updatedVideo : video
      ));
      setEditingVideo(null);
    }
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
  };

  const clearWeek = () => {
    setVideos(videos.filter(video => video.weekStart !== selectedWeek));
  };

  const filteredVideos = videos.filter(video => video.weekStart === selectedWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                LazyQu
              </h1>
              <p className="text-gray-600 text-sm">Plan your weekly video uploads</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
             
                <a
                  href="https://buymeacoffee.com/gil880c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.5 9.5c.83 0 1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5H19v6h-2v-6h-3v6h-2v-6H8v6H6v-6H4.5c-.83 0-1.5-.67-1.5-1.5v-1c0-.83.67-1.5 1.5-1.5H6V7c0-2.76 2.24-5 5-5s5 2.24 5 5v2.5h4.5zM8 9.5V7c0-1.66 1.34-3 3-3s3 1.34 3 3v2.5H8z"/>
                  </svg>
                  Buy me a coffee
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Week Selector */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Select Upload Week</h2>
                </div>
                {selectedWeek && filteredVideos.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash className="h-4 w-4" />
                        <span>Clear Week</span>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Week</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete all videos for this week? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearWeek}>Delete All</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              >
                <option value="">Select a week...</option>
                {Array.from({ length: 9 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - date.getDay() + (i * 7));
                  const weekStart = date.toISOString().split('T')[0];
                  const endDate = new Date(date);
                  endDate.setDate(endDate.getDate() + 6);
                  
                  return (
                    <option key={weekStart} value={weekStart}>
                      {date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {endDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Video Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingVideo ? 'Edit Video' : 'Plan New Video'}
                </h2>
              </div>
              
              <VideoForm
                selectedWeek={selectedWeek}
                onSelectedWeekChange={setSelectedWeek}
                onSubmit={editingVideo ? updateVideo : addVideo}
                editingVideo={editingVideo}
                onCancelEdit={() => setEditingVideo(null)}
              />
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Videos
                </h2>
                <span className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full">
                  {filteredVideos.length} planned
                </span>
              </div>

              <VideoList
                videos={filteredVideos}
                onEdit={setEditingVideo}
                onDelete={deleteVideo}
                selectedWeek={selectedWeek}
              />
            </div>

            {/* Creator Tip Section */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <p 
                  className={`text-gray-700 italic transition-opacity duration-500 ${
                    isTipVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {randomTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Videos</h3>
            <p className="text-3xl font-bold">{videos.length}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">This Week</h3>
            <p className="text-3xl font-bold">{filteredVideos.length}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
