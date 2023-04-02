from flask import Flask
from flask import request
from flask import jsonify
from model_test import res_recommend
from load_model import load_model
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/recommend', methods=['POST'])
def recommendation():
    input_text = request.json['input_text']

    df = res_recommend(input_text, P, Q, userid_vectorizer)
    businessIds = df.index[0:5].tolist()
    
    response = {
        'businessIds': businessIds
    }
    
    return jsonify(response)


if __name__ == '__main__':
    P, Q, userid_vectorizer = load_model()
    app.run()
