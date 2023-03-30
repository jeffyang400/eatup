import preprocessing_func as pf
import pickle as pkl

'''
This is a test file for the recommendation model
Remember to change the path to the pickle file if you want to run this file
Change the input to whatever you want to test
'''

input = "A restaurant with a nice view of the bay"

def res_recommend(input):
    '''
    Input:  A string input that describes the user's preference
    Output: A dataframe of top 5 recommendations
    To ultilize the output, you need to use the index of the dataframe to get the business_id Example: topRecommendations.index
    '''
    
    pickle_path = 'eatUp_full_set_recommendation.pkl'
    
    with open(pickle_path, 'rb') as file:
        P = pkl.load(file)
        Q = pkl.load(file)
        userid_vectorizer = pkl.load(file)

    test_df= pf.pd.DataFrame([input], columns=['text'])
    test_df['text'] = test_df['text'].apply(pf.clean_text)
    test_vectors = userid_vectorizer.transform(test_df['text'])
    test_v_df = pf.pd.DataFrame(test_vectors.toarray(), index=test_df.index, columns=userid_vectorizer.get_feature_names_out())

    predictItemRating = pf.pd.DataFrame(pf.np.dot(test_v_df.loc[0],Q.T),index=Q.index,columns=['Rating'])
    topRecommendations = pf.pd.DataFrame.sort_values(predictItemRating,['Rating'],ascending=[0])[:5]
    '''
    This part is to print out the top 5 recommendations
    If you want to print out the top 5 recommendations, uncomment this part
    Please include restDF as an argument in the function to use this part
    
    
    for i in topRecommendations.index:
        if i in restDF['business_id'].values:
            name = restDF[restDF['business_id'] == i]['name'].iloc[0]
            categories = restDF[restDF['business_id'] == i]['categories'].iloc[0]
            stars = str(restDF[restDF['business_id']==i]['stars'].iloc[0])
            rating = topRecommendations.loc[i, 'Rating']
            
            print(f'Name: {name}\nCategories: {categories}\nStars: {stars}\nRecommendation rating: {rating}\n')
            print('')
    '''
    return topRecommendations

