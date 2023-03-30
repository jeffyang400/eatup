import preprocessing_func as pf
import model as m

restDF = pf.pd.read_csv('restaurant_CA.csv')
reviewDF = pf.pd.read_csv('review_CA.csv')
userDF = pf.pd.read_csv('user_CA.csv')

reviewDF= reviewDF.drop('Unnamed: 0', axis=1)

with open('yelp_recommendation_model_8.pkl', 'rb') as file:
    P = pf.pickle.load(file)
    Q = pf.pickle.load(file)
    userid_vectorizer = pf.pickle.load(file)

words = "A restaurant with a nice view of the bay"
test_df= pf.pd.DataFrame([words], columns=['text'])
test_df['text'] = test_df['text'].apply(pf.clean_text)
test_vectors = userid_vectorizer.transform(test_df['text'])
test_v_df = pf.pd.DataFrame(test_vectors.toarray(), index=test_df.index, columns=userid_vectorizer.get_feature_names_out())

predictItemRating = pf.pd.DataFrame(np.dot(test_v_df.loc[0],Q.T),index=Q.index,columns=['Rating'])
topRecommendations = pf.pd.DataFrame.sort_values(predictItemRating,['Rating'],ascending=[0])[:5]

for i in topRecommendations.index:
    if i in restDF['business_id'].values:
      name = restDF[restDF['business_id'] == i]['name'].iloc[0]
      categories = restDF[restDF['business_id'] == i]['categories'].iloc[0]
      stars = str(restDF[restDF['business_id']==i]['stars'].iloc[0])
      rating = topRecommendations.loc[i, 'Rating']
      
      print(f'Name: {name}\nCategories: {categories}\nStars: {stars}\nRecommendation rating: {rating}\n')
      print('')