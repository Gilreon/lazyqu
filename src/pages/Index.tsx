import React, { useState, useEffect } from 'react';
import { Calendar, Video, Edit3, Trash2, Plus } from 'lucide-react';
import VideoForm from '../components/VideoForm';
import VideoList from '../components/VideoList';
import { Video as VideoType } from '../types/video';

const Index = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);

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
  }, []);

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

  const updateVideo = (updatedVideo: VideoType) => {
    setVideos(videos.map(video => 
      video.id === updatedVideo.id ? updatedVideo : video
    ));
    setEditingVideo(null);
  };

  const deleteVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id));
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Form */}
          <div className="space-y-6">
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
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedWeek ? (
                    <>
                      Week of {new Date(selectedWeek).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })} - {new Date(new Date(selectedWeek).setDate(new Date(selectedWeek).getDate() + 6)).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </>
                  ) : (
                    "Select a Week"
                  )}
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
