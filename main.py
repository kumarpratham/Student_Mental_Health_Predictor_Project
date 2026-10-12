import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
import pandas as pd
from typing import Literal


model = joblib.load('Mental_Health_Model.pkl')

app = FastAPI()

# A first Pydantic model
class StudentData(BaseModel):
    age                     : int = Field(...,ge=10, le=100)
    gender                  : Literal['Male','Female']
    country                 : str
    academic_level          : Literal['Undergradute','Graduate','High School']
    most_used_platform      : str
    purpose_of_use          : str
    avg_Daily_Usage_Hours   : float
    daily_Unlocks           : int
    study_Hours             : float
    physical_Activity_Hours : float
    sleep_Hours_Per_Night   : float
    stress_level            : str


@app.get('/')
def greet():
    return {'Hello World'}


top_countries = ['Other','India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico','Turkey', 'France']


@app.post('/predict')
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

    return prediction