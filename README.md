# Sautul Ummah Website

Static website for Sautul Ummah built with HTML, CSS, and JavaScript.

## Edit Content

Most public content is in:

- `data/site-content.json`

You can edit project information, gallery images, video links, stats, and member details from that file.

For graphical editing, open:

- `admin.html`

After editing, click `Download JSON`, then replace `data/site-content.json` with the downloaded file.

## Publish With GitHub Pages

1. Create a GitHub repository.
2. Upload or push all files from this folder.
3. Open repository `Settings`.
4. Go to `Pages`.
5. Select `Deploy from a branch`.
6. Choose `main` branch and `/root`.
7. Save.

Your website will be published from GitHub Pages.

## Member Sign Up

The current form saves requests in the visitor browser and downloads a JSON file. For live online collection, connect Firebase, Supabase, or a form backend.
