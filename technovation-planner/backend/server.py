from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from bs4 import BeautifulSoup
import requests
import lxml
import re

def parse_time_to_minutes(time_str):
    # Match optional hours and minutes using regex
    match = re.search(r'(?:(\d+)\s*h)?\s*(?:(\d+)\s*min)?', time_str)
    
    if not match:
        return 0

    hours = int(match.group(1)) if match.group(1) else 0
    minutes = int(match.group(2)) if match.group(2) else 0

    return hours * 60 + minutes

def scrape(url):
    # Send a request to fetch the web page
    response = requests.get(url)
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        print("Successfully fetched the page!")
    else:
        print(f"Failed to fetch the page: {response.status_code}")

    # Parse the HTML content
    soup = BeautifulSoup(response.content, 'lxml')
    # View the parsed HTML structure (optional, for inspection)
    # print(soup.prettify())

    divs = soup.find_all('div', class_=['ld-lesson-section-heading', 'ld-item-title'])
    # print(divs)

    unit = 0
    lessons_per_unit = 0
    units = []
    prev_mod_text = ''
    for div in divs:
        if div['class'][0] == 'ld-lesson-section-heading':
            curr_unit = [unit] * lessons_per_unit
            units.extend(curr_unit)
            unit += 1
            lessons_per_unit = 0
        elif div['class'][0] == 'ld-item-title':
            curr_mod_text = div.get_text()
            if (curr_mod_text != prev_mod_text):
                lessons_per_unit += 1
                prev_mod_text = curr_mod_text

    last_unit = [unit] * lessons_per_unit
    units.extend(last_unit)

    lessons = soup.find_all('div', class_='ld-item-title')
    times = soup.find_all('div', class_='imm_duration')
    modules = [{'title':lesson.text.strip(), 'length':time.text.strip()} for lesson, time in zip(lessons, times)]

    df = pd.DataFrame(modules)
    df['length_int'] = df['length'].apply(parse_time_to_minutes)
    df['unit'] = units

    return df.to_dict(orient='records')

app = Flask(__name__)
CORS(app)

@app.route('/curriculum/<division>')
def get_curriculum(division):
    data = scrape(f'https://technovationchallenge.org/courses/{division}-division-curriculum/')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5050)

