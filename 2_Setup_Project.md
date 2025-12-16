# AI Image Studio – Local Setup Guide (VS Code)

## 1. Prerequisites

- **VS Code** installed on your device (download from https://code.visualstudio.com)
- Any modern browser (Chrome, Edge, Firefox, Safari)
- Optional: DeepAI account for better image captions

## 2. Get the Source Code

You need these four files in the same folder:

- `index.html`
- `style.css`
- `script.js`
- `api.js`

### Folder Structure

```
ai-image-studio/
  index.html
  style.css
  script.js
  api.js
```

## 3. Set Up in VS Code

### Step 1: Open the Project Folder

1. Open VS Code
2. Click **File** → **Open Folder**
3. Select (or create) your `ai-image-studio` folder
4. Click **Select Folder**

### Step 2: Add Your Files

1. In the VS Code explorer (left panel), you should see your folder
2. Add the four files:
   - Drag and drop them into the VS Code window, OR
   - Create new files: Right-click in explorer → **New File**
3. Paste your code into each file

### Step 3: Install Live Server Extension (Recommended)

This allows you to run a local server directly from VS Code with auto-reload.

1. Click the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search for **"Live Server"** by Ritwick Dey
3. Click **Install**
4. Once installed, you'll see a "Go Live" button at the bottom right of VS Code

## 4. Run the Project

### Using Live Server (Easiest)

1. Right-click on `index.html` in the explorer
2. Select **"Open with Live Server"**
3. Your browser opens automatically at `http://localhost:5500`
4. The page auto-reloads when you save changes

### Using VS Code Terminal (Alternative)

1. Open terminal in VS Code: **View** → **Terminal** (or press `` Ctrl+` ``)
2. Navigate to your project folder:
   ```bash
   cd ai-image-studio
   ```
3. Start a Python server:
   ```bash
   python -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`

## 5. Configure APIs (Optional but Recommended)

### DeepAI (for Better Image Captions)

1. Go to https://deepai.org and create an account
2. Get your API key from the dashboard
3. Open `api.js` in VS Code
4. Find this line:
   ```javascript
   const DEEP_AI_API_KEY = '';
   ```
5. Add your API key:
   ```javascript
   const DEEP_AI_API_KEY = 'YOUR_DEEPAI_API_KEY_HERE';
   ```
6. Save the file (Ctrl+S / Cmd+S)

**Note:** Pollinations doesn't require an API key—it's already configured.

## 6. Using the App

### Generate Images

1. Click the **"🎨 Generate Images"** tab
2. Choose a style from the dropdown
3. Enter a prompt
4. Click **"⚡ Enhance Prompt"** (waits for Pollinations API)
5. Click **"🖼️ Generate Image"** (generates your image)
6. View the result in the "Generated Image" section

### Generate Variations

1. Click the **"🔄 Generate Variations"** tab
2. Upload an image
3. Optionally add a description and choose a style
4. Click **"🔄 Generate 4 Variations"**
5. Wait 30-90 seconds for all 4 variations to appear

## 7. Troubleshooting

| Problem | Solution |
|---------|----------|
| Live Server not found | Install the "Live Server" extension from VS Code marketplace |
| Page won't load | Make sure all four files are in the same folder |
| Images load very slowly | Pollinations API takes 30-90 seconds; be patient |
| Generic captions on variations | Add your DeepAI API key to `api.js` |
| Terminal won't start | Open terminal with `` Ctrl+` `` or **View → Terminal** |

## Quick Checklist

- [ ] VS Code installed
- [ ] Four files in one folder
- [ ] Live Server extension installed
- [ ] `index.html` opened with Live Server ("Go Live" button clicked)
- [ ] Browser shows your app at `http://localhost:5500`
- [ ] Ready to generate images!

## VS Code Tips

- **Save files:** `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)
- **Open terminal:** `` Ctrl+` `` (backtick key)
- **Format code:** `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
- **Auto-reload:** Live Server reloads automatically when you save