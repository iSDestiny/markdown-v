# MarkdownV (in-progress, mvp not available)

I usually take all my notes using the code editor, Visual Studio Code, and store it all on github.
The biggest reason why I take my notes this way is because of vscode's vim plugin. I prefer to do
all of my writing with vim keybindings if it is possible and vscode's vim plugin makes that possible.
I was looking for a project to work on in order to improve my skills and thought about the way that
I took notes. I thought that it would be interesting to make a full stack web app of how I currently take
notes so here I am.

I looked at several applications as references for MarkdownV. Specifically, I took vscode's material ui
palenight theme and tried my best to replicate it with MarkdownV. I also used Notable, another markdown
notetaking application, and Evernote, a rich text note taking application, as references for the design
of my UI.

## Features

### Markdown-based

Notes are written in markdown format with proper support for code blocks with syntax highlighting

### Vim-support

The markdown editor uses vim keybindings by default with the option to change to vscode keybindings

### Cloud-based

All notes will be stored on the cloud. MarkdownV uses a mongodb database that is hosted with MongoDB Atlas

### Preview Screen

A preview screen is available as a split screen to check how your notes will look like while editing

## Tech Stack

### Frontend

- React (Next.js)
- Sass Modules
- MaterialUI
- [react-ace (built-in editor)](https://github.com/securingsincity/react-ace)
- [react-markdown (markdown parser)](https://github.com/remarkjs/react-markdown)

### Backend

- Next.js api endpoints (Node.js w/ Express)
- Mongoose (ODM)
- MongoDB
