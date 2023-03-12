import preprocessing_func as pf

restDF = pf.pd.read_csv('restaurant_CA.csv')
reviewDF = pf.pd.read_csv('review_CA.csv')
userDF = pf.pd.read_csv('user_CA.csv')

reviewDF= reviewDF.drop('Unnamed: 0', axis=1)
yelp_data = reviewDF[['business_id', 'user_id', 'stars', 'text']]



yelp_data['text'] = yelp_data['text'].apply(pf.clean_text)
userid_df = yelp_data[['user_id', 'text']]
businessid_df = yelp_data[['business_id', 'text']]

userid_df = userid_df.groupby('user_id').agg({'text': ' '.join})
businessid_df = businessid_df.groupby('business_id').agg({'text': ' '.join})

userid_vectorizer = pf.TfidfVectorizer(tokenizer = pf.WordPunctTokenizer().tokenize, max_features=5000)
userid_vectors = userid_vectorizer.fit_transform(userid_df['text'])

businessid_vectorizer = pf.TfidfVectorizer(tokenizer = pf.WordPunctTokenizer().tokenize, max_features=5000)
businessid_vectors = businessid_vectorizer.fit_transform(businessid_df['text'])

userid_rating_matrix = pf.pd.pivot_table(yelp_data, values='stars', index=['user_id'], columns=['business_id'])

Q = pf.pd.DataFrame(data=businessid_vectors.toarray(), index=businessid_df.index, columns=businessid_vectorizer.get_feature_names_out())
P = pf.pd.DataFrame(data=userid_vectors.toarray(), index=userid_df.index, columns=userid_vectorizer.get_feature_names_out())

P, Q = pf.matrix_factorization(userid_rating_matrix, P, Q, steps=25, gamma=0.001, lamda=0.02)

output = open('yelp_recommendation_model_8.pkl', 'wb')
pf.pickle.dump(P,output)
pf.pickle.dump(Q,output)
pf.pickle.dump(userid_vectorizer,output)
output.close()