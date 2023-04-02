import pickle as pkl

def load_model():

  pickle_path = '../eatUp_full_set_recommendation.pkl'
      
  with open(pickle_path, 'rb') as file:
      P = pkl.load(file)
      Q = pkl.load(file)
      userid_vectorizer = pkl.load(file)

  return [P, Q, userid_vectorizer]