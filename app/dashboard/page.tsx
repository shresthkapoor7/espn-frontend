'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Video {
  name: string;
  id: string;
  created_at: string;
  metadata?: {
    size?: number;
  };
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const companyName = searchParams.get('company') || 'Your Company';
  const isProcessing = searchParams.get('processing') === 'true';
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [lastVideoCount, setLastVideoCount] = useState(0);
  const [showNewContentAlert, setShowNewContentAlert] = useState(false);
  const [newVideoCount, setNewVideoCount] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [processingFailed, setProcessingFailed] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  // Trigger the backend API when processing param is true
  useEffect(() => {
    if (isProcessing && !processingComplete) {
      triggerBackendProcessing();
    }
  }, [isProcessing]);

  const triggerBackendProcessing = async () => {
    try {
      const response = await fetch('https://web-production-155f4.up.railway.app/auto-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Video processing started successfully');
        setProcessingComplete(true);
      } else {
        console.warn(`Backend returned status: ${response.status}`);
        setProcessingFailed(true);
      }
    } catch (error) {
      console.error('Error triggering auto-process:', error);
      setProcessingFailed(true);
    }
  };

  const fetchVideos = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('videos')
        .list('reels', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      if (data) {
        // Filter out placeholder files, hidden files, and non-video files
        const filteredVideos = data.filter(file => {
          const name = file.name.toLowerCase();
          return (
            !name.startsWith('.') && // No hidden files
            !name.includes('placeholder') && // No placeholder files
            !name.includes('empty') && // No empty markers
            (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm')) // Only video files
          );
        });
        
        // Check if new content was added
        if (isManualRefresh && filteredVideos.length > lastVideoCount && lastVideoCount > 0) {
          const newCount = filteredVideos.length - lastVideoCount;
          setNewVideoCount(newCount);
          setShowNewContentAlert(true);
          setTimeout(() => setShowNewContentAlert(false), 5000);
        }
        
        setLastVideoCount(filteredVideos.length);
        setVideos(filteredVideos);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getVideoUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('videos')
      .getPublicUrl(`reels/${fileName}`);
    return data.publicUrl;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">GameReel Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">{companyName}</p>
          </div>
          <button
            onClick={() => fetchVideos(true)}
            disabled={isRefreshing || (isProcessing && !processingComplete)}
            className={`px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRefreshing ? 'animate-pulse' : ''
            }`}
          >
            <span className={isRefreshing ? 'animate-spin inline-block' : ''}>↻</span>
            {isRefreshing ? 'Checking...' : 'Check for New Reels'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">

        {/* New Content Alert */}
        {showNewContentAlert && (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <p className="text-white font-semibold">
                New reels loaded! {newVideoCount} fresh video{newVideoCount !== 1 ? 's' : ''} added.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Total Reels</p>
            <p className="text-4xl font-bold text-white">{videos.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Latest Upload</p>
            <p className="text-2xl font-semibold text-white">
              {videos.length > 0 ? formatDate(videos[0].created_at) : 'N/A'}
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Storage</p>
            <p className="text-2xl font-semibold text-white">
              {formatFileSize(videos.reduce((acc, v) => acc + (v.metadata?.size || 0), 0))}
            </p>
          </div>
        </div>

        {/* Videos Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Super Bowl Reels</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all">
                Grid
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all">
                List
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-white/60 mt-4">Loading your reels...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <p className="text-white/60 text-lg mb-4">No reels found yet</p>
              <p className="text-white/40 text-sm">Your generated reels will appear here</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all cursor-pointer group"
                  onClick={() => setSelectedVideo(video.name)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                    <video
                      src={getVideoUrl(video.name)}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <span className="text-2xl">▶</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold mb-2 truncate">{video.name}</h3>
                    <div className="flex justify-between text-sm text-white/50">
                      <span>{formatDate(video.created_at)}</span>
                      <span>{formatFileSize(video.metadata?.size)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getVideoUrl(video.name), '_blank');
                      }}
                      className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-[#1a1a1a] border border-white/20 rounded-2xl overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-white font-semibold">{selectedVideo}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-white/60 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <video
                src={getVideoUrl(selectedVideo)}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
