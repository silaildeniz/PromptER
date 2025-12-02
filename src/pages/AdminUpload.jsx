import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { 
  Upload, 
  Loader, 
  Image as ImageIcon, 
  Video, 
  FileText,
  CheckCircle,
  X
} from 'lucide-react';

const AdminUpload = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    model: 'midjourney',
    media_type: 'image',
    category: 'Corporate',
    cost: 5,
    prompt_text: '',
    author: 'Admin'
  });
  
  // File Upload State
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  // Process File (for both drag-drop and input)
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload an image or video.');
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Remove Selected File
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.prompt_text.trim()) {
      toast.error('Prompt text is required');
      return;
    }

    if (!file) {
      toast.error('Please upload a media file');
      return;
    }

    setUploading(true);

    try {
      // Step 1: Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${formData.media_type}s/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prompt-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Step 2: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prompt-assets')
        .getPublicUrl(filePath);

      // Step 3: Insert prompt into database
      const { data: promptData, error: insertError } = await supabase
        .from('prompts')
        .insert([
          {
            title: formData.title.trim(),
            description: formData.description.trim() || `Premium ${formData.model} prompt for ${formData.category.toLowerCase()} content`,
            prompt_text: formData.prompt_text.trim(),
            media_url: publicUrl,
            media_type: formData.media_type,
            cost: parseInt(formData.cost),
            category: formData.category,
            model: formData.model,
            author: formData.author || 'Admin',
            sales: 0,
            rating: 5.0,
            variables: []
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Success
      toast.success('Prompt uploaded successfully! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        model: 'midjourney',
        media_type: 'image',
        category: 'Corporate',
        cost: 5,
        prompt_text: '',
        author: 'Admin'
      });
      setFile(null);
      setFilePreview(null);

    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload prompt');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Upload new prompts to the marketplace
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Container */}
          <div className="bg-[#151925] rounded-2xl border border-gray-800 p-8">
            
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Ultra-realistic Portrait Photography"
                className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>

            {/* Description (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the prompt (auto-generated if left empty)"
                className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Row 1: Model, Media Type, Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Model (AI Tool) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AI Model *
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="midjourney">Midjourney</option>
                  <option value="chatgpt">ChatGPT</option>
                  <option value="veo3">Veo3</option>
                  <option value="sora">Sora</option>
                  <option value="leonardo">Leonardo</option>
                  <option value="dalle">DALL-E</option>
                  <option value="stable-diffusion">Stable Diffusion</option>
                </select>
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Media Type *
                </label>
                <select
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Writing">Writing</option>
                </select>
              </div>
            </div>

            {/* Row 2: Cost, Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Cost (Credits) *
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="e.g., PromptER Team"
                  className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Prompt Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt Text * (The product being sold)
              </label>
              <textarea
                name="prompt_text"
                value={formData.prompt_text}
                onChange={handleInputChange}
                placeholder="Enter the full prompt that users will receive..."
                rows={6}
                className="w-full px-4 py-3 bg-navy-900/50 border border-gray-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                required
              />
            </div>

            {/* Media Upload - Drag & Drop Zone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Media Upload *
              </label>
              
              {!file ? (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/5'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium mb-1">
                    Drag & drop your file here
                  </p>
                  <p className="text-slate-500 text-sm mb-4">
                    or click to browse
                  </p>
                  <p className="text-xs text-slate-600">
                    Supports: JPG, PNG, WEBP, GIF, MP4, WEBM (Max 50MB)
                  </p>
                </div>
              ) : (
                <div className="relative border border-gray-700 rounded-lg p-6 bg-navy-900/30">
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>

                  {/* File Preview */}
                  <div className="flex items-start gap-4">
                    {/* Preview Image/Video */}
                    <div className="w-32 h-32 flex-shrink-0 bg-navy-900 rounded-lg overflow-hidden">
                      {formData.media_type === 'video' || file.type.startsWith('video/') ? (
                        <video
                          src={filePreview}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-5 h-5 text-blue-400" />
                        ) : file.type.startsWith('video/') ? (
                          <Video className="w-5 h-5 text-purple-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="text-white font-medium">{file.name}</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">File ready to upload</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpload;

