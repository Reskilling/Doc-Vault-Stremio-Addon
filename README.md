# Doc Vault

Doc Vault is a Stremio catalog addon for the best documentaries ever made,
series and films alike, listed best-loved first. This README is for whoever
maintains the addon: it explains how the catalogs work, how to edit the title
list, and how to deploy a new version.

## Install the addon

After the first deploy (see [Deploy a new version](#deploy-a-new-version)),
paste the following URL into the Stremio addon search box:

```
https://2f680d7c8e22-doc-vault.baby-beamup.club/manifest.json
```

The URL assumes you named the BeamUp project `doc-vault`; the `logo` URL in
[`manifest.js`](manifest.js) assumes the same. Use the full
`https://` URL ending in `/manifest.json`; the bare domain returns a web page,
and Stremio reports that the addon failed to fetch.

## How the catalogs work

The addon adds three rows to the Stremio home screen:

- **Doc Vault Series**
- **True Crime Series**
- **Doc Vault Films**

The Series and Films rows also have filters, which Stremio shows as a dropdown
in **Discover**. Filters come in two kinds:

Era filters
: Ranges such as **2010s** or **Before 2000**. Each title belongs to exactly
  one era: a film by its release year, a series by its first full year on air.

Topic filters
: Topics such as **Nature & Wildlife** or **Sports**. A title matches when it
  carries any of the filter's tags.

Each type only offers filters with roughly 10 or more titles, because a filter
that opens on two posters feels broken. Series currently have fewer topics
than films for that reason.

Every row and filter lists titles best-loved first, by each title's
`featuredRank`, then by year, then alphabetically.

All of this is configured in [`catalogs.js`](catalogs.js), and
[`catalog-query.js`](catalog-query.js) decides which titles each request
returns.

## Run the addon locally

1. Install dependencies:

   ```
   npm install
   ```

1. Start the server:

   ```
   npm start
   ```

   The server listens on port 7001 unless the `PORT` environment variable says
   otherwise.

1. Confirm that the manifest loads at `http://127.0.0.1:7001/manifest.json`.
   To try the local addon in Stremio, install it from that URL.

## Edit the title list

Series live in [`shows.json`](shows.json) and films in
[`movies.json`](movies.json). Both are lists of records like this one:

```json
{
  "id": "tt5491994",
  "name": "Planet Earth II",
  "startYear": 2016,
  "endYear": 2016,
  "type": "series",
  "tags": ["nature"],
  "enabled": true,
  "featuredRank": 100
}
```

The following fields are required:

| Field | Meaning |
|---|---|
| `id` | The IMDb ID, from the title's IMDb URL (`imdb.com/title/tt5491994/`). Stremio uses it to find posters and streams. |
| `name` | The title as IMDb lists it. |
| `startYear` | The year the title premiered or was released. |
| `endYear` | For a series, the last year it aired (the same as `startYear` for a single season), or `null` if it's still running. For a film, `null`. |
| `type` | `series` in `shows.json`, `movie` in `movies.json`. |
| `tags` | Topics the title covers. Use only tags listed in `KNOWN_TAGS` in [`catalogs.js`](catalogs.js). A title can have no tags; it still appears in its type's main row. |
| `enabled` | `true` to show the title; `false` to hide it without deleting it. |
| `featuredRank` | How strongly to feature the title; see [Choose a rank](#choose-a-rank). |

Records can also have `displayName` (a friendlier name to show in Stremio),
`alternateTitles`, and `notes`. Keep each file in alphabetical order so diffs
stay readable.

### Where the starter list came from

The first version of the list was drafted from Cinemeta, Stremio's metadata
service. It kept documentaries rated 7.0 or higher on IMDb and left out
reality TV, stand-up specials, concert recordings, and reunion specials. Tags
came from IMDb genres and keywords in each description, and ranks came from
a mix of IMDb rating and popularity. Treat it as a draft: trim titles you
don't want and fix tags that look wrong.

### Choose a rank

`featuredRank` decides where a title appears in its rows:

| Rank | Use for | Examples |
|---|---|---|
| 95–100 | Landmark documentaries that open the rows | Planet Earth II, Cosmos, Making a Murderer |
| 85–94 | Widely acclaimed | Blackfish, Searching for Sugar Man, Man on Wire |
| 75–84 | Strong picks | The Imposter, Super Size Me, Catfish |
| 60–74 | Niche or divisive | Titles for dedicated fans of a topic |

Titles released in the last year or so are capped at 90, so new releases
don't outrank established classics on early buzz alone. Raise them once
they've held up.

### Add a filter or row

To add a filter, add an entry to `SERIES_FILTERS` or `MOVIE_FILTERS` in
[`catalogs.js`](catalogs.js); add a topic to a type once it has about 10
titles there. To add a home-screen row, add an entry to `catalogs`. Each new
row adds to the home screen for every user, so prefer a filter unless the
category deserves a row of its own.

### Validate your changes

Before you commit, run the validator:

```
npm run validate
```

It checks for duplicate or malformed IMDb IDs, unknown tags, clashing titles,
and filters or rows that match nothing, then prints how many titles each row
and filter contains.

## Deploy a new version

The addon is hosted on BeamUp. The `beamup` command deploys your latest
**commit**, not uncommitted files.

### Before you begin

- Install the BeamUp CLI: `npm install -g beamup-cli`.
- Add your SSH key to your GitHub account (GitHub username `Reskilling`).

### Deploy for the first time

1. Run `npm run validate` and confirm that it passes.
1. Commit your changes.
1. In PowerShell, run `beamup`. Don't use Git Bash: it sets `HOME`, so
   `beamup` can't find its saved settings in `%APPDATA%`.
1. When it asks for **Project Name**, enter `doc-vault`, all lowercase.
   BeamUp rejects capital letters, but the CLI saves them anyway and only
   fails at the push. If that happens, fix `projectName` in `beamup.json` and
   run `git remote set-url beamup dokku@a.baby-beamup.club:2f680d7c8e22/doc-vault`.
   If it asks for the
   host and GitHub username, enter `a.baby-beamup.club` and `Reskilling`.
1. When it asks for the passphrase for your SSH key, enter it. Nothing
   appears as you type.
1. Commit the new `beamup.json` file and push it:

   ```
   git add beamup.json
   git commit -m "Record BeamUp deploy"
   git push
   ```

The first deploy creates `beamup.json` and the `beamup` git remote. Later
deploys use both.

### Deploy an update

1. Run `npm run validate` and confirm that it passes.
1. If you changed what users see, increase `version` in
   [`package.json`](package.json). The manifest reads its version from there.
1. Commit your changes and push them to GitHub:

   ```
   git add -A
   git commit -m "DESCRIPTION"
   git push
   ```

   Replace `DESCRIPTION` with a summary of the change.

1. Optional: To enter your SSH passphrase once per session instead of on
   every deploy, run `ssh-add` and enter it there.
1. In PowerShell, run `beamup`.
   - If it asks whether to create a new commit because the commit history
     didn't change, enter `n`. This happens when a previous deploy failed
     after recording the commit as deployed.
   - When it asks for the passphrase for your SSH key, enter it.
1. Commit the updated `beamup.json`, which records the deployed commit.

### Verify the deploy

Title lists update as soon as the deploy finishes. The manifest, which holds
row names and filter options, is cached for up to 4 hours. After that:

1. Open the manifest URL and confirm that `version` matches
   [`package.json`](package.json).
1. In Stremio, uninstall the addon and install it again from the manifest URL.

To see build output from the server, run `beamup logs`.
