import React, { useEffect, useMemo } from 'react';
import { type ContentItem, ContentType } from '../types';
import { Grab, Trash2 } from 'lucide-react';
import { CONTENT_TYPE_CONFIG } from '../constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentCardProps {
  item: ContentItem;
  onDelete: () => void;
}

const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const listId = urlObj.searchParams.get('list');

        if (listId) {
            // Handle playlist URLs
            return `https://www.youtube.com/embed/videoseries?list=${listId}`;
        }

        let videoId;
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }

        if (videoId) {
            // Handle single video URLs
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return null;
    } catch (e) {
        return null;
    }
};

const getSpotifyEmbedUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'open.spotify.com' && (urlObj.pathname.startsWith('/playlist/') || urlObj.pathname.startsWith('/album/') || urlObj.pathname.startsWith('/track/'))) {
            return `https://open.spotify.com/embed${urlObj.pathname}`;
        }
        return null;
    } catch(e) {
        return null;
    }
};

const getAppleMusicEmbedUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'music.apple.com' && urlObj.pathname.includes('/playlist/')) {
            return `https://embed.music.apple.com${urlObj.pathname}${urlObj.search}`;
        }
        return null;
    } catch (e) {
        return null;
    }
};


const getTwitterEmbedHtml = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const tweetId = pathParts[pathParts.length - 1];
        if (tweetId) {
            return `<blockquote class="twitter-tweet" data-theme="dark"><a href="${url}"></a></blockquote>`;
        }
        return null;
    } catch(e) {
        return null;
    }
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: item.id});
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    useEffect(() => {
        if (item.type === ContentType.TWITTER && window.twttr) {
            window.twttr.widgets.load(document.getElementById(`content-card-body-${item.id}`));
        }
    }, [item.id, item.type]);
    
    const renderContent = () => {
        switch (item.type) {
            case ContentType.YOUTUBE:
                const embedUrl = item.url ? getYoutubeEmbedUrl(item.url) : null;
                return embedUrl ? (
                    <div className="aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-md"
                        ></iframe>
                    </div>
                ) : <p className="text-red-400">Invalid YouTube URL</p>;
            case ContentType.SPOTIFY:
                const spotifyEmbedUrl = item.url ? getSpotifyEmbedUrl(item.url) : null;
                return spotifyEmbedUrl ? (
                    <iframe
                        style={{ borderRadius: '12px' }}
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify Embed"
                    ></iframe>
                ) : <p className="text-red-400">Invalid Spotify URL</p>;
            case ContentType.APPLE_MUSIC:
                const appleMusicEmbedUrl = item.url ? getAppleMusicEmbedUrl(item.url) : null;
                return appleMusicEmbedUrl ? (
                    <iframe
                        src={appleMusicEmbedUrl}
                        height="450"
                        style={{width:'100%', maxWidth:'660px', overflow:'hidden', background:'transparent', borderRadius: '12px'}}
                        frameBorder="0"
                        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write *"
                        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                        title="Apple Music Embed"
                    ></iframe>
                ) : <p className="text-red-400">Invalid Apple Music URL</p>;
            case ContentType.TWITTER:
                 const twitterHtml = item.url ? getTwitterEmbedHtml(item.url) : item.embedHtml;
                 return twitterHtml ? <div dangerouslySetInnerHTML={{ __html: twitterHtml }} /> : <p className="text-red-400">Invalid Twitter URL</p>;
            case ContentType.INSTAGRAM:
            case ContentType.LINK:
                return (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-700/50 p-4 rounded-md -m-4">
                        <h3 className="font-bold text-lg text-primary-400">{item.title || item.url}</h3>
                        <p className="text-gray-300 mt-1">{item.description}</p>
                    </a>
                );
            case ContentType.NOTE:
                return <p className="text-gray-200 whitespace-pre-wrap">{item.text}</p>;
            default:
                return null;
        }
    };

    const config = CONTENT_TYPE_CONFIG[item.type];
    const Icon = config.icon;

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-800 rounded-lg shadow-lg flex gap-4 transition-shadow hover:shadow-primary-500/20">
        <div {...attributes} {...listeners} className="flex-shrink-0 p-4 cursor-grab touch-none flex items-center justify-center text-gray-500 hover:text-white">
            <Grab size={24} />
        </div>
        <div className="flex-grow p-4 border-l border-gray-700/50">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon size={16} />
                    <span>{config.label}</span>
                </div>
                <button onClick={onDelete} className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
            <div id={`content-card-body-${item.id}`}>{renderContent()}</div>
        </div>
    </div>
  );
};

export default ContentCard;