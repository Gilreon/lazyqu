import React, { useState, useEffect } from 'react';
import { Calendar, Save, X } from 'lucide-react';
import { Video } from '../types/video';

interface VideoFormProps {
  selectedWeek: string;
  onSelectedWeekChange: (week: string) => void;
  onSubmit: (video: Video | Omit<Video, 'id'>) => void;
  editingVideo?: Video | null;
  onCancelEdit: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({
  selectedWeek,
  onSelectedWeekChange,
  onSubmit,
  editingVideo,
  onCancelEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title);
      setDescription(editingVideo.description);
      setTags(editingVideo.tags);
      setCurrentTag('');
      onSelectedWeekChange(editingVideo.weekStart);
    } else {
      resetForm();
    }
  }, [editingVideo, onSelectedWeekChange]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTags([]);
    setCurrentTag('');
    setErrors({});
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Video title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Video description is required';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (description.length > 5000) {
      newErrors.description = 'Description must not exceed 5000 characters';
    }

    const totalTagsLength = tags.join('').length + currentTag.length;
    if (totalTagsLength > 500) {
      newErrors.tags = 'Total tags content must not exceed 500 characters';
    }

    if (!selectedWeek) {
      newErrors.weekStart = 'Please select a week';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const videoData = {
      title: title.trim(),
      description: description.trim(),
      tags: tags,
      weekStart: selectedWeek,
      createdAt: new Date().toISOString(),
    };

    if (editingVideo) {
      onSubmit({ ...videoData, id: editingVideo.id });
    } else {
      onSubmit(videoData);
      resetForm();
    }
  };

  const getWeekOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = -2; i <= 8; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + (i * 7) - date.getDay());
      const weekStart = date.toISOString().split('T')[0];
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      
      const label = `${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} - ${endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })}`;
      
      options.push({ value: weekStart, label });
    }
    
    return options;
  };

  const totalTagsLength = tags.join('').length + currentTag.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Video Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Video Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className={`w-full px-4 py-3 border rounded-xl transition-colors ${
            errors.title 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Enter your video title..."
        />
        <div className="mt-1 flex justify-between items-center">
          <span className={`text-sm ${title.length > 90 ? 'text-red-600' : 'text-gray-500'}`}>
            {title.length}/100 characters
          </span>
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>
      </div>

      {/* Video Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Video Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
          rows={4}
          className={`w-full px-4 py-3 border rounded-xl transition-colors resize-none ${
            errors.description 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Describe your video content..."
        />
        <div className="mt-1 flex justify-between items-center">
          <span className={`text-sm ${description.length > 4500 ? 'text-red-600' : 'text-gray-500'}`}>
            {description.length}/5000 characters
          </span>
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Video Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Video Tags
        </label>
        
        {/* Display existing tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          id="tags"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyPress={handleTagKeyPress}
          className={`w-full px-4 py-3 border rounded-xl transition-colors ${
            errors.tags 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
          } focus:outline-none focus:ring-2`}
          placeholder="Type a tag and press Enter to add..."
        />
        
        <div className="mt-1 flex justify-between items-center">
          <span className={`text-sm ${totalTagsLength > 450 ? 'text-red-600' : 'text-gray-500'}`}>
            {totalTagsLength}/500 characters
          </span>
          {errors.tags && (
            <p className="text-sm text-red-600">{errors.tags}</p>
          )}
        </div>
      </div>

      {/* Week Selector */}
      <div>
        <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Upload Week *
        </label>
        <select
          id="week"
          value={selectedWeek}
          onChange={(e) => onSelectedWeekChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl transition-colors ${
            errors.weekStart 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
          } focus:outline-none focus:ring-2`}
        >
          <option value="">Select a week...</option>
          {getWeekOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.weekStart && (
          <p className="mt-1 text-sm text-red-600">{errors.weekStart}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Save className="h-4 w-4" />
          {editingVideo ? 'Update Video' : 'Save Video'}
        </button>
        
        {editingVideo && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default VideoForm;
