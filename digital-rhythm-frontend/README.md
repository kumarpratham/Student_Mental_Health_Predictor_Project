# Digital Rhythm — Student Wellbeing Lab (frontend)

React + Vite + Tailwind. It calls your existing FastAPI service directly at `POST /predict`.
There is no Express layer, database or extra ML service, and your backend and model are untouched.

## Run it (Windows PowerShell)

1. Start your FastAPI app from its own folder (replace `main` if your file is named differently):

   ```powershell
   uvicorn main:app --reload --port 8000
   ```

2. Start the frontend:

   ```powershell
   cd digital-rhythm-frontend
   npm install
   npm run dev
   ```

   Open http://localhost:5173.

## Configuration (`.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_SCORE_MIN=3.6
VITE_SCORE_MAX=9.4
```

Restart `npm run dev` after editing `.env`.

## CORS

Your FastAPI app already has `CORSMiddleware` with `allow_origins=["*"]`, which permits `http://localhost:5173`, so nothing needs to change.
If you later restrict it, the allowed origins must include `http://localhost:5173`:

```python
allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
```

A CORS block, a stopped server and a wrong `VITE_API_URL` all look the same to the browser (no response),
so the UI shows one "Can't reach the prediction service" message for all three. Check the browser console's Network tab to tell them apart.

## Test the API on its own

```powershell
$body = @{
  age = 22; gender = "Male"; country = "India"; academic_level = "Undergradute"
  most_used_platform = "Instagram"; purpose_of_use = "Entertainment"
  avg_Daily_Usage_Hours = 5.5; daily_Unlocks = 85; study_Hours = 4.0
  physical_Activity_Hours = 1.5; sleep_Hours_Per_Night = 7.5; stress_level = "Medium"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/predict -ContentType "application/json" -Body $body
```

## Notes

- The payload uses your exact 12 field names. `age` and `daily_Unlocks` are sent as integers, and `Undergradute` is sent with your spelling
  (the dropdown shows "Undergraduate").
- Client validation mirrors your Pydantic constraints. FastAPI 422 errors are listed field by field in the results panel.
- Score range: `RandomForestRegressor` predictions can't leave its training targets' span, which is 3.6 to 9.4 for your model.
  The gauge shows the real number even if it's ever outside the range, and only pins the marker to the nearest end.
- Nothing is submitted until you click "Predict score". No predictions are hardcoded.
