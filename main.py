import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
import pandas as pd
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware


model = joblib.load('Mental_Health_Model.pkl')
top_countries = ['Other','India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico','Turkey', 'France']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# A first Pydantic model
class StudentData(BaseModel):
    age                     : int = Field(...,ge=10, le=100)
    gender                  : Literal['Male','Female']
    country                 : str
    academic_level          : Literal['Undergradute','Graduate','High School']
    most_used_platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp', 'WeChat']
    purpose_of_use          : Literal['Networking', 'Education', 'Entertainment', 'News'] 
    avg_Daily_Usage_Hours   : float = Field(..., ge=0, le=24)
    daily_Unlocks           : int =   Field(..., ge=0)
    study_Hours             : float = Field(..., ge=0, le=24)
    physical_Activity_Hours : float = Field(..., ge=0, le=24)
    sleep_Hours_Per_Night   : float = Field(..., ge=0, le=24)
    stress_level            : Literal['Low','Medium','High','Very High']


# Describe what we send back (Response Body)
class PredictionResponse(BaseModel) :
    predicted_mental_health_score:float


@app.get('/')
def greet():
    return {'Hello World'}


@app.post('/predict', response_model = PredictionResponse)
def predict(data: StudentData):

    country_group = data.country if data.country in top_countries else "Other"
    input_row = pd.DataFrame([{
        'Age'                       : data.age,
        'Gender'                    : data.gender,
        'Country'                   : data.country,
        'Academic_Level'            : data.academic_level,
        'Most_Used_Platform'        : data.most_used_platform,
        'Purpose_Of_Use'            : data.purpose_of_use,
        'Avg_Daily_Usage_Hours'     : data.avg_Daily_Usage_Hours,
        'Daily_Unlocks'             : data.daily_Unlocks,
        'Study_Hours'               : data.study_Hours,
        'Physical_Activity_Hours'   : data.physical_Activity_Hours,
        'Sleep_Hours_Per_Night'     : data.sleep_Hours_Per_Night,
        'Stress_Level'              : data.stress_level,
        'Grouped_country'           : country_group
    }])
    
    prediction = model.predict(input_row)[0]

    return PredictionResponse(predicted_mental_health_score =round(float(prediction),2))