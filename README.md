# AI Research Instructor (React + Vite)

## Run
```
npm install
npm run dev        # development  -> http://localhost:5173
npm run build      # production build -> dist/
```

## Images
Copy your two image files into the `public/` folder (same names):
- `brain_logo_top_row_third.png`
- `AI_Research_Dashboard_Mockup.png`

## Structure
```
src/
  App.jsx                 state, routing, popup + toast
  styles.css
  components/             PublicHeader, Logo, PasswordInput (eye icon), LimitedTextarea, Icons
  pages/                  Landing, Signup, Login, Reset, Dashboard, Instructor, Analysis, Workspace, FinalDoc
  utils/                  helpers.js (users, validation), docx.js (Word download)
```
