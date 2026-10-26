# BlueFlix — Movie Discovery Website

A responsive dark-blue movie-discovery front end built with HTML, CSS, and JavaScript.
The existing demo includes search, genre filters, movie cards, and links to archive pages.

## Run locally
1. Open this folder in VS Code.
2. Open `index.html` with Live Server.

## Included files
- `index.html` — page structure
- `style.css` — responsive design
- `script.js` — demo movie catalogue, search, and filters
- `config.example.js` — safe template for future API configuration
- `supabase-schema.sql` — starter database table and a public read-only RLS policy

## Supabase setup (optional, not connected automatically)
1. In Supabase, open SQL Editor and review `supabase-schema.sql`.
2. Run it only after you understand the table and policy.
3. Copy `config.example.js` to `config.js` and enter the project URL and publishable key.
4. Do not put a Supabase secret/service_role key or database password in front-end files.
5. The SQL intentionally provides public read access only to published movies. It does not grant public write access or implement admin login; those require a separate authenticated admin policy.

## Automatic metadata
Movie metadata can be fetched from TMDB after configuring an API token. A token placed in browser JavaScript is visible to visitors, so for a public production site, use a server/Edge Function to keep credentials private. TMDB metadata does not grant rights to stream or download a movie.

## Copyright
Only link to films and media you have permission to distribute or embed. Public-domain status varies by country and by film version; check the rights details on each archive page.
