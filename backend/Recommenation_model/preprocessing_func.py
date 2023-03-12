import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords 
from nltk.tokenize import WordPunctTokenizer
import csv
import string
import nltk
from nltk.corpus import stopwords
from tqdm import tqdm
import pickle

stop = []
for word in stopwords.words('english'):
    s = [char for char in word if char not in string.punctuation]
    stop.append(''.join(s))
def clean_text(mess):
    nopunc = [char for char in mess if char not in string.punctuation]
    nopunc = ''.join(nopunc)
    return ' '.join([word for word in nopunc.split() if word.lower() not in stop])

def matrix_factorization(R, P, Q, steps=25, gamma=0.001, lamda=0.02):
    for step in tqdm(range(steps)):
        for i in R.index:
            for j in R.columns:
                if R.loc[i, j] > 0:
                    eij = R.loc[i, j] - np.dot(P.loc[i], Q.loc[j])
                    P.loc[i] = P.loc[i] + gamma*(eij * Q.loc[j] - lamda*P.loc[i])
                    Q.loc[j] = Q.loc[j] + gamma*(eij * P.loc[i] - lamda*Q.loc[j])
        e = 0
        for i in R.index:
            for j in R.columns:
                if R.loc[i, j] > 0:
                    e = e + pow(R.loc[i, j] - np.dot(P.loc[i], Q.loc[j]), 2) + lamda * (pow(np.linalg.norm(P.loc[i]), 2)+ pow(np.linalg.norm(Q.loc[j]), 2))
        if e < 0.001:
            break
            
    return P, Q