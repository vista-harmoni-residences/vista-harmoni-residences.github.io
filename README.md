# Vista Harmoni Residences: Treasure Hunting Adventures

The expedition logs of the Vista Harmoni treasure hunters, published at
**https://vista-harmoni-residences.github.io**.

The site is a [Jekyll](https://jekyllrb.com) blog that GitHub Pages builds
automatically. You never run a build yourself: **add or edit a file, push to
`main`, and the site updates within a minute or two.**

---

## Quick start: posting a new expedition

1. **Add your photos** to the `media/` folder.
2. **Create the entry.** Either run the helper:

   ```sh
   ./new-entry.sh "The Mystery of the Garden Gate"
   # → Created _posts/2026-10-20-the-mystery-of-the-garden-gate.md
   ```

   …or create a file in `_posts/` yourself, named `YYYY-MM-DD-some-title.md`.
3. **Write it** (see the format below).
4. **Publish:**

   ```sh
   git add .
   git commit -m "New expedition: The Mystery of the Garden Gate"
   git push
   ```

You can also do all of this in the GitHub web interface: upload photos into
`media/` with **Add file → Upload files**, then create a new file in `_posts/`.

---

## Anatomy of an entry

Every entry is a Markdown file in `_posts/`. The file name **must** start with
the date: `2026-10-20-the-mystery-of-the-garden-gate.md`. The part after the
date becomes the page's address.

```markdown
---
title: "The Mystery of the Garden Gate"
date: 2026-10-20
location: "Block C garden"
description: "A one-line teaser shown on the home page."
tags: [garden, keys]
cover: "gate-overview.jpg"
---

We set out at dawn with nothing but a torch and a hunch...

{% include media.html file="rusty-key.jpg" caption="The rusty key, half buried in soil" %}

## What we found next

More story here.
```

### The front matter (the block between the `---` lines)

| Field         | Required | What it does |
|---------------|----------|--------------|
| `title`       | yes      | The entry's headline. |
| `date`        | yes      | Should match the date in the file name. Controls ordering. |
| `location`    | no       | Shown with a 📍 next to the date. |
| `description` | no       | Teaser on the home page. Without it, the first paragraph is used. |
| `tags`        | no       | e.g. `[garden, keys]`. Tags show on the entry and are listed on the Treasure Map page. |
| `cover`       | no       | A photo from `media/` shown on the home page card and at the top of the entry. |
| `show_cover`  | no       | Set to `false` to keep the cover on the home page but hide it at the top of the entry. |
| `hunters`     | no       | Who went, e.g. `[Aisha, Ben]`. Shown with a 🧭 next to the date. |
| `gallery`     | no       | A list of photos with captions (see [Galleries](#galleries)). |
| `comments`    | no       | Set to `false` to hide comments on this entry. |

Entries are numbered automatically ("Expedition Log No. 001", "002", …) in
date order.

### Writing the body

The body is ordinary [Markdown](https://www.markdownguide.org/basic-syntax/):

```markdown
## A heading            (gets a little ✦ in front)
**bold**, *italic*, [a link](https://example.com)
> A quote, styled like a note in the margin.
---                     (a ✕ ✕ ✕ divider)
- bullet lists, 1. numbered lists, tables…
```

---

## Using media from `media/`

### A single photo, video or sound clip

```liquid
{% include media.html file="rusty-key.jpg" %}
{% include media.html file="rusty-key.jpg" caption="The rusty key" %}
{% include media.html file="map.jpg" caption="The full map" size="wide" %}
{% include media.html file="clue.jpg" size="small" %}
```

- `file` is the file name inside `media/`. **Spaces and brackets are fine**, so
  `"WhatsApp Image 2026-10-17 at 18.09.20 (1).jpeg"` works as-is.
- Subfolders work too: `file="2026-10-garden/key.jpg"` for `media/2026-10-garden/key.jpg`.
- `caption` (optional) appears under the photo. It can contain Markdown like `*italics*`.
- `alt` (optional) describes the photo for screen readers. It defaults to the caption.
- `size` (optional): `wide` makes it bleed past the text, `small` keeps it narrow.
- The file type is detected automatically:
  - **Images** (`.jpg .jpeg .png .gif .webp`) are shown as a pinned photo. Click it to enlarge.
  - **Video** (`.mp4 .webm .mov .m4v`) gets a video player.
  - **Audio** (`.mp3 .m4a .wav .ogg`) gets an audio player.
  - **PDF** is shown as a link.

### Galleries

**Quick version.** List file names separated by `|`. Line breaks are fine:

```liquid
{% include gallery.html files="
  key.jpg |
  coin.jpg |
  bottle.jpg
" %}
```

**With captions.** Put the list in the front matter:

```yaml
gallery:
  - file: key.jpg
    caption: The rusty key
  - file: coin.jpg
    caption: A 1987 coin
  - file: clip.mp4
```

…then put `{% include gallery.html %}` wherever you want it in the body. If
there's no `cover`, the first gallery photo is used as the cover.

### Plain Markdown images

Standard Markdown also works when the file name has **no spaces**:

```markdown
![A rusty key](/media/rusty-key.jpg)
```

For file names with spaces, use `media.html` instead, or replace each space
with `%20`.

> **Tip:** Phone photos are often several MB each. The WhatsApp exports here are
> fine (~100–200 KB), but if you add photos straight from a camera, consider
> shrinking them first so pages load quickly. On a Mac:
> `sips -Z 1600 media/*.jpg`

---

## Other pages

| File        | Page | Notes |
|-------------|------|-------|
| `index.html` | Home ("Expeditions") | The trail of all entries, newest first. Usually no need to edit. |
| `map.html`   | `/map/` ("Treasure Map") | Archive by year, plus every tag. Builds itself. |
| `crew.md`    | `/crew/` ("The Crew") | About page. **Edit this** to introduce yourselves. |
| `404.html`   | "Lost at Sea" | Shown for broken links. |

To add another page, create e.g. `rules.md`:

```markdown
---
title: Rules of the Hunt
permalink: /rules/
---
Your content here.
```

To put it in the top menu, add a link in `_includes/header.html`.

## Changing site-wide settings

Edit `_config.yml`:

- `title` and `subtitle`: the site name shown in the header.
- `tagline`: the text on the home page under the big title.
- `description`: used by search engines and link previews.

---

## Comments

Readers can leave notes under each entry. Anyone can read them, but to post,
a reader signs in with their email: they get a link, click it, and choose the
name to show. There are no passwords and no anonymous comments. Comments are
stored in a free [Supabase](https://supabase.com) project, since GitHub Pages
can't store anything itself.

Until the two values under `comments:` in `_config.yml` are filled in, the
comments section doesn't appear.

### One-time setup

1. **Create a project** at [supabase.com](https://supabase.com) (the free plan is plenty).
2. **Create the tables:** open **SQL Editor**, paste in all of
   `supabase/schema.sql`, and click **Run**.
3. **Allow the sign-in links to come back to the site:** under
   **Authentication → URL Configuration**, set **Site URL** to
   `https://vista-harmoni-residences.github.io` and add these **Redirect URLs**:
   - `https://vista-harmoni-residences.github.io/**`
   - `http://localhost:4000/**` (for local previews)
4. **Check the sign-in settings:** under **Authentication → Sign In / Providers**,
   **Email** should be enabled and **Allow new users to sign up** on.
   Leave **anonymous sign-ins** off.
5. **Set up email sending.** Supabase's built-in email only sends a few
   messages an hour and is meant for testing. For real use, connect an email
   provider under **Authentication → Emails → SMTP Settings**. Free tiers from
   providers like [Resend](https://resend.com) or [Brevo](https://www.brevo.com)
   are plenty. While you're there, you can reword the **Magic Link** email template.
6. **Connect the site:** under **Project Settings → API**, copy the
   **Project URL** and the **anon public** key into `_config.yml`:

   ```yaml
   comments:
     supabase_url: "https://abcdefgh.supabase.co"
     supabase_key: "eyJhbGciOi..."
   ```

   The anon key is meant to be public. The rules in `schema.sql` control
   what it can do. **Never** put the `service_role` key here.

### Moderating

- **Delete a comment:** in Supabase, open **Table Editor → comments** and delete
  the row. Readers can also delete their own comments.
- **Block someone:** under **Authentication → Users**, find their email and
  delete or ban them.
- **Hide comments on one entry:** add `comments: false` to its front matter.

Comments belong to the entry's address, not its file, so you can freely edit
an entry's text, photos, title, tags and other details. Its comments stop
showing only if its address changes, which happens when you:

- rename the entry's file,
- change its `date` (in the file name or the front matter), or
- add a `permalink:` or `slug:` line to its front matter.

The comments aren't deleted. To move them to the new address, run this in the SQL Editor:
`update comments set post = '/logs/new/address/' where post = '/logs/old/address/';`

---

## Search engines

The site already gives search engines what they need: page titles and
descriptions, a sitemap at `/sitemap.xml`, a `robots.txt`, and a cover-photo
preview when a link is shared on WhatsApp or Facebook. To get found:

1. **Tell Google the site exists.** Go to
   [Google Search Console](https://search.google.com/search-console), add a
   **URL prefix** property for `https://vista-harmoni-residences.github.io/`,
   and choose the **HTML tag** verification method. Copy just the code from
   `content="..."` into `_config.yml`:

   ```yaml
   webmaster_verifications:
     google: "abc123..."
   ```

   Push, wait for the site to rebuild, then click **Verify**. Then go to
   **Sitemaps**, enter `sitemap.xml`, and submit. (Optional: do the same at
   [Bing Webmaster Tools](https://www.bing.com/webmasters), which can import
   straight from Search Console.)
2. **Write a good `description` for every entry** and mention *Vista Harmoni
   Residences* naturally in the text. The description is what shows under
   the link in search results.
3. **Get linked.** Links from other sites are the biggest factor. Share
   entries in the residents' WhatsApp and Facebook groups, and ask anyone with
   a website or community page to link to the blog.
4. **Keep posting.** Sites that are updated regularly get checked more often.

New sites usually take a few days to a few weeks to show up. Check progress
in Search Console under **Pages** and **Performance**.

### Visitor statistics

Visits are counted with [Google Analytics](https://analytics.google.com)
(free). The Measurement ID is set in `_config.yml`:

```yaml
google_analytics: "G-7RW31SMP5J"
```

Set it to `""` to switch analytics off. Local previews are never counted,
only the live site. To see which Google searches bring people in, link
Analytics to Search Console under **Admin → Product links → Search Console links**.

---

## Drafts and hiding entries

- **Drafts:** put unfinished entries in a `_drafts/` folder (no date in the
  file name needed). They are never published. When it's ready, move it into
  `_posts/` with a dated file name.
- **Unpublish** an entry without deleting it by adding `published: false` to
  its front matter.

---

## Previewing locally (optional)

You don't need this; pushing to `main` is enough. To check things before
pushing, run this if you have [Docker](https://www.docker.com/):

```sh
docker run --rm -it -p 4000:4000 -v "$PWD":/srv/site -v vh-bundle:/usr/local/bundle \
  -w /srv/site ruby:3.3 sh -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

Then open http://localhost:4000. The first run takes several minutes to
install; later runs are quick. Entries update when you save, but changes to
`_config.yml` need a restart.

If you have Ruby 3 installed, use `bundle install && bundle exec jekyll serve`
instead.

---

## One-time GitHub setup

In the repository on GitHub, go to **Settings → Pages**, set **Source** to
**Deploy from a branch**, and choose **`main`** / **`/ (root)`**. After each
push, the **Actions** tab shows a "pages build and deployment" run. If it goes
red, click it to see which file has a problem.

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| New entry doesn't appear | The file name doesn't start with `YYYY-MM-DD-`, the file isn't in `_posts/`, or the front matter is broken (check that both `---` lines are there). |
| Photo shows as broken | The file name in `file="…"` doesn't exactly match the file in `media/`. Names are **case-sensitive** (`.JPG` ≠ `.jpg`). |
| Build fails after editing front matter | A value contains a `:`. Wrap it in quotes: `title: "Clue: the old well"`. |
| `{% include … %}` appears as text on the page | A typo in the tag, such as a missing `%` or a missing closing quote. |
| Changes not visible | Wait 1–2 minutes and hard-refresh (Cmd+Shift+R). |

## How it's put together

```
_config.yml          site settings
_posts/              ← your entries go here
media/               ← your photos & videos go here
_layouts/            page templates (default, page, post)
_includes/           header, footer, media.html, gallery.html, comments.html, compass
assets/css/site.css  all the styling (colours are at the top)
assets/js/lightbox.js click-to-enlarge photos
assets/js/comments.js comments under each entry
supabase/schema.sql  database setup for comments (run once in Supabase)
index.html, map.html, crew.md, 404.html
new-entry.sh         helper to start a new entry
```

The look adapts automatically: parchment in light mode and a lantern-lit
night map in dark mode. Colours are defined as variables at the top of
`assets/css/site.css`.
