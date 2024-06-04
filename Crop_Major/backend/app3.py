import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import xgboost as xgb
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your dataset into a pandas DataFrame
df = pd.read_csv('../data/FINAL.csv')  # Ensure the CSV path is correct

# Convert categorical labels to numerical labels using LabelEncoder
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df['Fertilizer'])

# Define the input features (X)
X = df[['Temperature', 'Rainfall', 'Soil_color', 'pH', 'Crop', 'Nitrogen', 'Potassium', 'Phosphorus']]

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define preprocessing steps for numerical features
numeric_features = X.select_dtypes(include=['float64', 'int64']).columns
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])

# Define preprocessing steps for categorical features
categorical_features = X.select_dtypes(include=['object']).columns
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine preprocessing steps using ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Define the XGBoost classifier model
xgb_classifier = xgb.XGBClassifier()

# Create a pipeline for preprocessing and model training
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', xgb_classifier)
])

# Fit the pipeline on the training data
pipeline.fit(X_train, y_train)

# Predict on the testing data
y_pred = pipeline.predict(X_test)

# Evaluate the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)


# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    # Receive input data as JSON
    input_data = request.json

    # Convert input data to DataFrame
    X_new = pd.DataFrame([input_data])

    # Preprocess the input data and make predictions
    prediction = pipeline.predict(X_new)

    # Convert numerical prediction back to categorical label
    predicted_label = label_encoder.inverse_transform(prediction)[0]

    # Return prediction as JSON response
    return jsonify({'prediction': predicted_label})


if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5002)