
import React from 'react';
import { Edit3, Trash2, Tag, Calendar } from 'lucide-react';
import { Video } from '../types/video';

interface VideoListProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos planned</h3>
        <p className="text-gray-500 mb-6">Start planning your content for this week!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {video.title}
            </h3>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(video)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit video"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(video.id, video.title)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete video"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">
            {video.description}
          </p>

          {video.tags && (
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                {video.tags.length > 50 ? `${video.tags.substring(0, 50)}...` : video.tags}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Week of {formatDate(video.weekStart)}
            </span>
            <span>
              Created {formatDate(video.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
