# Movie Search App — Development Notes

## 1. What this is
A movie search app built with **Vite + React + TypeScript**, structured with
the **MVVM pattern** (Model / ViewModel / View per screen), using the
**OMDb API** for movie data. Users can search movies, see an initial random
selection on the home screen, and save/remove favourites (stored in the
browser via `localStorage`).

This mirrors the architecture from the reference project shared for this
assignment (`ishak-dev/Internship-React-Session`), which used the same
MVVM structure and OMDb API, but added Firebase Auth + Realtime Database
so favourites were saved per logged-in user. I built a simplified version
without login, where favourites save locally in the browser instead —
same architecture and API integration, without needing a separate
Firebase project set up for a first assignment.

## 2. Prompts used during development

1. **"Scaffold a Vite + React + TypeScript app. Use functional components
   only, no UI library, and no movie functionality yet — just a clean
   starting point."**
   → Got the base project via `npm create vite@latest -- --template react-ts`.

2. **"I want to follow an MVVM pattern like this reference project: a
   Model file with pure business logic (no React), a custom hook as the
   ViewModel managing state, and a View component that only renders UI.
   Set up this empty MVVM folder structure for a Home screen and a
   Favourites screen."**
   → Got the `HomeModel.ts` / `useHomeViewModel.ts` / `HomeView.tsx` and
   the equivalent Favourites trio as placeholder files.

3. **"Create an OMDb service file with a `searchMovies(query)` function
   that reads the API key from an environment variable, calls the OMDb
   API, and throws a readable error if the request fails or OMDb returns
   no results. No React, no hooks, just the API call."**
   → Got `omdbMovieService.ts`.

4. **"Implement HomeModel: a `getMovies(query)` function that validates
   the query has at least 2 characters and calls the OMDb service, plus
   an `initialMovies()` function that fetches movies from a handful of
   random seed keywords in parallel, merges the results, removes
   duplicates by imdbID, shuffles, and returns 20 movies."**
   → Got the seed-keyword random home-screen logic in `HomeModel.ts`.

5. **"Implement `useHomeViewModel` as a hook managing movies/loading/error
   state, with a `handleSearch` and a way to reload the initial random
   list. Keep all rendering out of this file."**
   → Got `useHomeViewModel.ts`.

6. **"Build the Home view — search results should come from the Header's
   search bar via the URL query, not a duplicate input inside Home
   itself. Use React Router's `useSearchParams` to read the query and
   trigger a search when it changes, otherwise show the initial random
   list."**
   → This was a deliberate deviation from having the search input live
   inside HomeView (which the reference project initially did before
   moving search into the Header too) — I asked the AI to connect Home
   directly to the Header's search via the URL instead of prop-drilling
   or duplicating a second input.

7. **"Create a reusable MovieCard component showing poster, title, year,
   type, and either a Favourite button or a Remove button, so it works on
   both the Home and Favourites screens without being two separate
   components."**
   → Got `MovieCard.tsx` with an optional `onRemove` prop that swaps the
   button between "Favourite" and "Remove" modes.

8. **"Instead of Firebase, write a favouritesService using localStorage
   with the same function shapes — addFavourite, removeFavourite,
   getFavourites — so the rest of the app (Model/ViewModel layers) don't
   need to know or care that it's not Firebase underneath."**
   → Got `favouritesService.ts`. This was the main architectural decision
   I made differently from the reference video: keeping the exact same
   function signatures the Firebase version would have used, so the app
   is structured to swap in real Firebase persistence later without
   touching the Model or ViewModel layers.

9. **"Add a Header component with Home/Favourites nav links and a search
   form using React Router, that navigates to `/?q=<query>` on submit."**
   → Got `Header.tsx` + `Header.css`.

10. **"Wire up React Router in App.tsx with `/` and `/favourites` routes,
    both rendering under a shared Header."**
    → Got the final `App.tsx`.

11. **"Review the whole app for TypeScript errors and structural issues
    before I run it — check that every service function, hook, and
    component prop type lines up."**
    → Caught and fixed a stale double-fetch: `useHomeViewModel` originally
    called `initialMovies()` in its own `useEffect` on mount, which would
    have run a second time alongside `HomeView`'s effect reacting to the
    URL query — see manual fix #1 below.

## 3. How AI assisted throughout the build

- **Translating an unfamiliar pattern into working code.** I hadn't
  built anything with the MVVM pattern before (Model/ViewModel/View as
  separate files). The AI helped me understand *why* each layer exists —
  the Model has zero React so it's testable and reusable on its own, the
  ViewModel hook owns state and side effects, and the View only renders —
  by generating each layer with that constraint explicitly stated in the
  prompt, then explaining what would break if I mixed them.
- **Adapting the reference architecture rather than copying it.** Since
  I didn't want the Firebase Auth complexity for a first submission, I
  asked the AI to keep the favourites service's function signatures
  identical to what a Firebase version would use, so the Model/ViewModel
  layers are agnostic to the storage backend. That was a deliberate
  choice on my part, not something the AI suggested unprompted.
- **Catching structural bugs before runtime.** Running a full TypeScript
  review after assembling the pieces caught a double-fetch bug (see
  below) that would have been easy to miss just eyeballing the code.
- **Explaining React Router patterns I hadn't used.** `useSearchParams`
  was new to me — I asked the AI to explain how it keeps the search
  query in the URL (so a search is shareable/bookmarkable) instead of
  just component state.
- **Diagnosing a runtime issue after first launch.** When I first ran the
  app locally, Home just showed "No movies to show" with no error at
  all. Rather than guess at the React code, I tested the OMDb endpoint
  directly in the browser (`https://www.omdbapi.com/?apikey=...&s=batman`),
  which returned `{"Response":"False","Error":"Invalid API key!"}`. That
  isolated the problem to the key itself, not the app — turned out I'd
  never clicked the activation link in OMDb's confirmation email. This
  direct-endpoint-test approach (bypass the app, hit the API in isolation)
  is a debugging habit I'll keep using going forward.

## 4. Manual improvements made after reviewing AI-generated code

1. **Removed a duplicate data-fetch on page load.** The AI's first draft
   of `useHomeViewModel` called `initialMovies()` inside its own
   `useEffect` on mount. When I added the URL-query-driven search in
   `HomeView`, that component *also* ran an effect on mount to decide
   between search results and the initial list. Together they would have
   fired two API calls back to back on first load. I removed the
   `useEffect` from `useHomeViewModel` entirely and made `HomeView` the
   single place responsible for deciding when to fetch, since that's
   where the routing/URL logic already lives.

2. **Split the Favourite/Remove button logic into one shared component
   instead of two.** AI's first pass created two near-identical card
   components — one for Home, one for Favourites — that only differed by
   which button they rendered. I merged these back into a single
   `MovieCard` with an optional `onRemove` prop, since the poster/title/
   year/type layout was otherwise 100% duplicated.

3. **Fixed a fallback poster edge case.** OMDb returns the string
   `"N/A"` (not `null` or an empty string) when a movie has no poster.
   The first draft rendered that literal string as the `<img>` `src`,
   which shows a broken image icon. I added the `FALLBACK_POSTER` check
   in `MovieCard.tsx` after noticing this while reading through OMDb's
   API docs.

4. **Guarded `favouritesService` against duplicate adds.** The initial
   `addFavourite` implementation appended blindly, so clicking Favourite
   twice on the same movie (e.g. a slow double-click) would store it
   twice and break the "already favourited" star state. I added an
   `imdbID` existence check before appending.

5. **Renamed `handleFavouriteClick` to `handleFavourite`** in the view
   model to match the naming convention already used for `handleSearch`
   and `handleHome`, so all viewmodel action names read as verbs
   describing what happens, not how they're triggered.

6. **Found and diagnosed a silent-failure bug via manual testing.**
   After activating my OMDb key, everything worked — but the bug that
   caused the confusing "No movies to show" (with zero error message)
   is still present in the code and worth calling out. `initialMovies()`
   in `HomeModel.ts` fetches five random seed keywords in parallel and
   swallows any individual failure with `.catch(() => [])`, so a
   *partial* keyword failure fails gracefully — but if every keyword
   request fails (e.g. an invalid API key), the merged result is just an
   empty array with no error ever thrown. That's why the UI showed the
   generic empty state instead of a helpful error message. I didn't fix
   this yet, but the fix would be: if all keyword requests reject, throw
   an explicit error from `initialMovies()` instead of returning `[]`, so
   `useHomeViewModel` can catch it and show a real error message (e.g.
   "Couldn't load movies — check your connection or API key") instead of
   the ambiguous "No movies to show."

## 5. Tech stack
- React 19 + TypeScript
- Vite (build tool / dev server)
- React Router (`react-router-dom`) for navigation and URL-based search
- OMDb API for movie data
- Browser `localStorage` for favourites persistence (no backend/auth)

## 6. Running the app

1. Get a free OMDb API key: https://www.omdbapi.com/apikey.aspx — **make
   sure to click the activation link in the confirmation email**, or the
   key will return "Invalid API key!" even though it looks correct. (This
   tripped me up during my own testing — see section 3/4 above.)
2. Copy `.env.example` to `.env` and paste your key:
   ```
   VITE_OMDB_API_KEY=your_key_here
   ```
3. Install and run:
   ```
   npm install
   npm run dev
   ```

## 7. Possible next steps
- Fix the silent-failure bug in `initialMovies()` described in manual
  improvement #6 above, so a fully broken API key shows a real error
  instead of "No movies to show."
- Swap `favouritesService.ts` for a Firebase-backed implementation with
  the same function signatures, then add Firebase Auth + protected
  routes to match the reference project exactly.
- Add debounced search-as-you-type instead of submit-to-search.
- Add a loading skeleton instead of a plain "Loading…" message.