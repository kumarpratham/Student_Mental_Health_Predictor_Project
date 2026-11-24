# 🧠 Student Mental Health Predictor

An end-to-end Machine Learning web application that predicts a student's **Mental Health Score** based on daily social media habits, smartphone usage patterns, study hours, sleep duration, physical activity, stress levels, and demographic information.

The project integrates a Scikit-learn machine learning pipeline with a FastAPI backend and a React frontend to deliver predictions through an interactive web application.

## 🌐 Live Deployments

- **Frontend (React + Vite):** [Open Web Application](https://student-mental-health-predictor-6dvm.onrender.com/)
- **Backend API (FastAPI):** [Open Backend API](https://student-mental-health-predictor-project.onrender.com/)
- **Interactive API Docs (Swagger UI):** [Explore API Documentation](https://student-mental-health-predictor-project.onrender.com/docs)

> **⚡ Note:** Both services are hosted on Render's free tier. Due to inactivity, the services may enter a sleep state. The first request after inactivity may take approximately **30–50 seconds** to wake up. Please wait for the services to initialize before retrying.

---

## ✨ Features

- **Mental Health Prediction:** Predicts student mental health scores using behavioral, lifestyle, and demographic factors.
- **Machine Learning Pipeline:** Uses a trained Random Forest Regressor with integrated preprocessing.
- **Data Preprocessing:** Handles numerical, ordinal, and categorical features using Scikit-learn.
- **REST API:** FastAPI backend provides prediction endpoints.
- **Interactive Frontend:** React-based user interface built with Vite.
- **Model Serialization:** Uses Joblib to save and load the complete ML pipeline.
- **Full-Stack Integration:** Connects the frontend, backend API, and trained machine learning model.
- **Cloud Deployment:** Frontend deployed on Vercel and backend inference service deployed on Render.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Programming Language | Python |
| Data Processing | Pandas, NumPy |
| Machine Learning | Scikit-learn |
| Model Serialization | Joblib |
| Backend | FastAPI, Uvicorn |
| Frontend | React.js, Vite |
| Deployment | Vercel, Render |

---

## 🏗️ Project Architecture

The application follows a frontend-backend-machine learning architecture.

```text
          React + Vite Frontend
              (Vercel)
                  |
                  | POST /predict
                  | Student Features (JSON)
                  ▼
             FastAPI Backend
                (Render)
                  |
                  ▼
        Mental_Health_Model.pkl
                  |
                  ▼
          ColumnTransformer
             Preprocessing
                  |
                  ▼
       Random Forest Regressor
                  |
                  ▼
        Predicted Mental Health
                 Score
                  |
                  ▼
          JSON API Response
                  |
                  ▼
          React Frontend UI
```

---

## 🤖 Machine Learning Implementation

### 1. Dataset

- **Dataset:** Student Social Media And Mental Health Impact.csv
- **Total Records:** 5,000
- **Records After Deduplication:** 4,998
- **Raw Features:** 13

The dataset contains information about students' social media usage, smartphone habits, academic activities, sleep patterns, physical activity, stress levels, and demographic characteristics.

### 2. Data Preprocessing

The following preprocessing techniques were implemented:

| Feature Type | Preprocessing Technique |
|---|---|
| Skewed Numerical (`Study_Hours`) | Log Transformation (`log1p`) + StandardScaler |
| Standard Numerical Features | StandardScaler |
| Ordinal Feature (`Stress_Level`) | OrdinalEncoder |
| Nominal Categorical Features | OneHotEncoder |

**Additional Data Cleaning:**

- Removed duplicate records.
- Clipped invalid negative physical activity values to zero.
- Grouped countries into the top 9 countries and an `Other` category.
- Used `ColumnTransformer` to combine multiple preprocessing techniques into a single pipeline.
- Configured `OneHotEncoder` with `handle_unknown="ignore"` to handle unseen categories.

### 3. Model Training & Evaluation

The dataset was divided into training and testing sets using a **70:30 train-test split**.

Three model configurations were evaluated:

| Model | Test R² Score | Test MAE |
|---|---:|---:|
| Linear Regression (Baseline) | 0.740 | 0.536 |
| Tuned Random Forest (5-Fold CV) | 0.865 | 0.369 |
| **Production Random Forest Regressor** | **0.878** | **0.347** |

### 4. Hyperparameter Tuning

Random Forest hyperparameters were optimized using `RandomizedSearchCV` with 5-fold cross-validation.

The tuned configuration includes:

- `n_estimators = 200`
- `max_depth = 15`
- `min_samples_leaf = 2`

The final production model achieved an **R² score of 0.878** and an **MAE of 0.347** on the test set.

**Top Feature:** `Avg_Daily_Usage_Hours`

---

## 📂 Repository Structure

```text
Student_Mental_Health_Predictor_Project/
│
├── digital-rhythm-frontend/
│   └── React + Vite Frontend
│
├── SMHISMP.ipynb
│   └── EDA, Preprocessing, Model Training
│       and Hyperparameter Tuning
│
├── Student Social Media And Mental
│   Health Impact.csv
│   └── Training Dataset
│
├── Mental_Health_Model.pkl
│   └── Serialized ML Pipeline
│
├── main.py
│   └── FastAPI Backend
│
├── requirements.txt
│   └── Python Dependencies
│
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Python 3.9+
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kumarpratham/Student_Mental_Health_Predictor_Project.git

cd Student_Mental_Health_Predictor_Project
```

### 2. Set Up the Backend

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Access interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd digital-rhythm-frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local frontend URL displayed in your terminal.

---

## 📊 Model Performance

The production Random Forest Regressor achieved the following results:

| Evaluation Metric | Result |
|---|---:|
| R² Score | 0.878 |
| Mean Absolute Error | 0.347 |
| Training Records | 3,498 |
| Testing Records | 1,500 |

The model uses a complete preprocessing and prediction pipeline, ensuring that input data receives the same transformations during inference as during training.

---

## ⚠️ Disclaimer

This project is developed for **educational and research purposes only**.

The predicted Mental Health Score is a machine learning estimate based on patterns in the training dataset. It is not a clinical assessment, medical diagnosis, or substitute for professional mental health evaluation.

The predictions should not be used to make medical or psychological decisions.

---

## 👨‍💻 Author

**Pratham Kumar**

- **GitHub:** [@kumarpratham](https://github.com/kumarpratham)
- **Project Repository:** [Student Mental Health Predictor](https://github.com/kumarpratham/Student_Mental_Health_Predictor_Project)
- **Live Application:** [Try the Project](https://student-mental-health-predictor-6dvm.onrender.com/)

---
| :--- | :--- |

⭐ If you find this project interesting, consider giving the repository a star!
