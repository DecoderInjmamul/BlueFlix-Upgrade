// Copy this file to config.js before connecting external services.
// Never put a Supabase secret/service_role key in browser-side code.
window.BLUEFLIX_CONFIG = {
  // Optional: TMDB API Read Access Token for movie metadata.
  // Get it from your TMDB account settings. Keep in mind this browser-based
  // demo exposes any value placed here to visitors. For production, proxy API
  // calls through a server/edge function instead.
  tmdbReadToken: "",

  // Supabase project URL and publishable key are intended for client apps,
  // but database tables must have appropriate Row Level Security policies.
  supabaseUrl: "",
  supabasePublishableKey: ""
};
