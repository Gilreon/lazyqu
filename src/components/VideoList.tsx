import React from 'react';
import { Edit3, Trash2, Tag, Calendar, Copy } from 'lucide-react';
import { Video } from '../types/video';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface VideoListProps {
  videos: Video[];
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
  selectedWeek: string;
}

const VideoList: React.FC<VideoListProps> = ({ videos, onEdit, onDelete, selectedWeek }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeekRange = (weekStart: string) => {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return `${startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })}`;
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${type} copied to clipboard:`, text);
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const copyTags = (tags: string[]) => {
    const tagsText = tags.join(', ');
    copyToClipboard(tagsText, 'Tags');
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
    <TooltipProvider>
      <div className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {video.title}
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-500 hover:text-gray-700"
                      onClick={() => copyToClipboard(video.title, 'Title')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy title</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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

            <div className="flex items-start gap-2 mb-3">
              <p className="text-gray-600 line-clamp-2 flex-1">
                {video.description}
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-gray-700 flex-shrink-0"
                    onClick={() => copyToClipboard(video.description, 'Description')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy description</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {video.tags && video.tags.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Tags:</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-gray-500 hover:text-gray-700"
                        onClick={() => copyTags(video.tags)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy tags</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
    </TooltipProvider>
  );
};

export default VideoList;
