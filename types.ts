export enum ContentType {
  YOUTUBE = 'YOUTUBE',
  SPOTIFY = 'SPOTIFY',
  APPLE_MUSIC = 'APPLE_MUSIC',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  LINK = 'LINK',
  NOTE = 'NOTE',
}

export interface ContentItem {
  id: string;
  type: ContentType;
  url?: string;
  title?: string;
  description?: string;
  embedHtml?: string;
  text?: string;
}

export interface SummarizedContent {
    title: string;
    summary: string;
}