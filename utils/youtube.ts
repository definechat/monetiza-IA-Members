// src/utils/youtube.ts

/**
 * Converts various YouTube URL formats into a standardized embed URL.
 * Handles youtube.com/watch, youtu.be, youtube.com/embed, and youtube.com/shorts.
 * Appends parameters to disable related videos and specify the origin for security.
 * @param url The original YouTube URL.
 * @returns A standardized embed URL or the original URL if conversion fails.
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';

  let videoId = '';

  // Regex to handle various YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const regex of regexPatterns) {
    const match = url.match(regex);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  
  // Fallback if regex fails but it's a simple embed link
  if (!videoId && url.includes('youtube.com/embed/')) {
    const urlParts = url.split('embed/');
    videoId = urlParts[1].substring(0, 11);
  }

  if (!videoId) {
    console.warn("Could not extract a valid YouTube video ID from URL:", url);
    return url; // Return original if extraction fails
  }

  try {
    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    embedUrl.searchParams.set('rel', '0');
    embedUrl.searchParams.set('origin', window.location.origin);
    return embedUrl.toString();
  } catch (e) {
    console.error("Failed to construct embed URL", e);
    // Fallback for environments where `new URL` might fail
    return `https://www.youtube.com/embed/${videoId}?rel=0&origin=${encodeURIComponent(window.location.origin)}`;
  }
};
