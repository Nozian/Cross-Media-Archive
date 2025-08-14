import { ContentType } from './types';
import { Youtube, Twitter, Instagram, Link, FileText, Music } from 'lucide-react';

export const CONTENT_TYPE_CONFIG = {
  [ContentType.YOUTUBE]: { label: 'YouTube', icon: Youtube },
  [ContentType.SPOTIFY]: { label: 'Spotify', icon: Music },
  [ContentType.APPLE_MUSIC]: { label: 'Apple Music', icon: Music },
  [ContentType.TWITTER]: { label: 'X (Twitter)', icon: Twitter },
  [ContentType.INSTAGRAM]: { label: 'Instagram', icon: Instagram },
  [ContentType.LINK]: { label: 'Web Link', icon: Link },
  [ContentType.NOTE]: { label: 'Note', icon: FileText },
};