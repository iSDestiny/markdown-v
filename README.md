# MarkdownV - [Live](https://markdown-v.vercel.app)

I usually take all my notes using the code editor, Visual Studio Code, and store it all on github.
The biggest reason why I take my notes this way is because of vscode's vim plugin. I prefer to do
all of my writing with vim keybindings if it is possible and vscode's vim plugin makes that possible.
I was looking for a project to work on in order to improve my skills and thought about the way that
I took notes. I thought that it would be interesting to make a full stack web app of how I currently take
notes so here I am.

I looked at several applications as references for MarkdownV. Specifically, I took vscode's material ui
palenight theme and tried my best to replicate it with MarkdownV. I also used [Notable](https://notable.app/), another markdown
notetaking application, and [Evernote](https://evernote.com/), a rich text note taking application, as references for the design
of my UI.

## Features

### Markdown-based

Github flavored markdown is the format that notes are written in. You can also write math with Katex expressions.
### Vim and VSCode Keybindings

MarkdownV has two editor modes, Vim and VSCode. Please note that there are some restrictions since MarkdownV is web-based and not actually a full fledged code editor like the real vim and vscode. MarkdownV is using Ace Editor under the hood

### Cloud-based

All notes will be stored on the cloud. MarkdownV uses a mongodb database that is hosted with MongoDB Atlas

### Fuzzy Searching

MarkdownV uses fuzzy search for it's searching algorithm. You can search while respecting current filters or globally just like in vscode by using Ctrl-P to bring up the global search menu. When you are searching the text in the results will be highlighted appropriately to reflect the current query
### Preview Screen

MarkdownV lets you preview your markdown while you are writing it with the use of a split window that is adjustable

### Sorting

MarkdownV allows you to sort your notes ascending or descending by title, date created, and date updated

### Tagging and Favorites

MarkdownV allows you to organize your notes with the use of case insensitive tags. You can also star your favorite notes in order for it to appear in the favorites tab

### Full Screen Mode

You can hide the side menus by utilizing full screen mode. During this mode only your editor, top menu, and preview screen (if enabled) will be shown. To navigate to other notes in fullscreen mode, the global search functionality (Ctrl+P) will be very useful here

## Tech Stack

### Frontend

- Typescript
- React (Next.js)
- Sass Modules
- [MaterialUI](https://material-ui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://react-query.tanstack.com/)
- [react hook form](https://react-hook-form.com/)
- [react-ace (built-in editor)](https://github.com/securingsincity/react-ace)
- [react-markdown (markdown parser)](https://github.com/remarkjs/react-markdown)
- [fuzzysort (fuzzy search library)](https://github.com/farzher/fuzzysort)

### Backend

- Typescript
- JSON Web Tokens (Authentication)
- Node.js
- Next.js api routes
- Mongoose (ODM)
- MongoDB
- Passport.js (Google and Github OAuth 2.0)
- [email templates (styled emails)](https://www.npmjs.com/package/email-templates#cache-pug-templates)
