# Eatup - Social Media for Food
**SJSU Capstone Project**
Main: https://github.com/billsasi/eatup

## Setup
Clone this repository.

***

### Recommendation Engine
1. Get the Recomendation_model from this link: https://drive.google.com/drive/folders/1xamB5ZXr5_GAFu30MKD_8GuAzEPznhhX?usp=sharing. 
2. Navigate to the `Recommendation_model` directory.
```
cd Recommendation_model
```
3. Add the Recommendation_model to the directory.
4. Install dependencies:
```
pip install -r requirements.txt
```
5. Download stopwords:
```
python3 -m nltk.downloader stopwords
```
6. Start the Flask server by running:
```
python3 server.py
```

***

### Server
1. Open a new terminal at the root of the project and navigate to `backend`.
```
cd backend
```
2. Install dependencies:
```
npm install
```
3. Generate Prisma client:
```
npx prisma generate --schema=src/prisma/schema.prisma
```
4. Create `.env` in `backend` directory. It must contain the URI for your MongoDB database. Also, set `CLIENT_ORIGIN`.
```
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=your_mongo_uri
```
5. Start the server:
```
npm run dev
```

***


### Client
1. Open a new terminal at the root of the project and navigate to `frontend`.
```
cd frontend
```
2. Install dependencies:
```
npm install
```
3. Generate Prisma client:
```
npx prisma generate --schema=src/prisma/schema.prisma
```
4. To set up environment variables, create `.env.local` in `frontend` directory: 
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=your_GOOGLE_CLIENT_SECRET
MONGODB_URI=your_mongo_uri
```
Enter a random string for `NEXTAUTH_SECRET`. Use the MONGODB_URI for your database. You can get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by creating a new project in [Google Cloud Console](https://console.cloud.google.com/).


5. Create a new OAuth 2.0 Client ID:  
    1. On the Google Cloud Project, go to APIs & Services > Credentials. Click 'Create Credentials > OAuth client ID'.
    2. Add `http://localhost:3000` to Authorized JavaScript origins.
    3. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs.
    4. Copy the client ID and client secret to `.env.local`.

6. Start the client:
```
npm run dev
```

***

**The app will run on `http://localhost:3000`.**

