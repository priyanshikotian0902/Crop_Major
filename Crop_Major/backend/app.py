import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins='http://localhost:3000')

# Define columns for preprocessing
columns_to_impute = ['Temperature', 'Rainfall', 'pH']
columns_to_encode = ['Soil_color']


def train_model():
    # Load dataset from CSV file
    df_crop = pd.read_csv('../data/FINAL.csv')


    # Define the input features (X) and target variable (y)
    X = df_crop[['Temperature', 'Rainfall', 'Soil_color', 'pH']]
    y = df_crop['Crop']

    # Handle missing values in numerical columns
    imputer = SimpleImputer(strategy='mean')
    X.loc[:, columns_to_impute] = imputer.fit_transform(X.loc[:, columns_to_impute].copy())

    # Encode categorical variables (Soil_color)
    encoder = OneHotEncoder(drop='first')  # Drop first column to avoid multicollinearity
    X_encoded = pd.get_dummies(X, columns=columns_to_encode, drop_first=True)

    # Scale numerical features (Temperature, Rainfall, pH)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_encoded)

    # Split the preprocessed features and target variable into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Define the parameter grid to search over with new hyperparameters
    param_grid = {
        'n_estimators': [150, 250, 350],
        'max_depth': [None, 15, 25],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }

    # Create a RandomForestClassifier
    rf_classifier = RandomForestClassifier(random_state=42)

    # Instantiate GridSearchCV
    grid_search = GridSearchCV(estimator=rf_classifier, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1)

    # Fit the grid search to the data
    grid_search.fit(X_train, y_train)

    # Print the best hyperparameters
    print("Best Hyperparameters:", grid_search.best_params_)

    # Evaluate the model with best hyperparameters
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)

    return best_model, imputer, scaler, encoder, X_encoded.columns


# Train the model and preprocessors
model, imputer, scaler, encoder, columns = train_model()


@app.route('/predict', methods=['POST'])
def predict():
    # Receive input data as JSON
    input_data = request.json

    # Convert input data to DataFrame
    X = pd.DataFrame([input_data])

    # Preprocess input data
    X[columns_to_impute] = imputer.transform(X[columns_to_impute])
    X_encoded = pd.get_dummies(X, columns=columns_to_encode, drop_first=True)

    # Align columns with training data
    missing_cols = set(columns) - set(X_encoded.columns)
    for col in missing_cols:
        X_encoded[col] = 0
    X_encoded = X_encoded[columns]

    # Scale the data
    X_scaled = scaler.transform(X_encoded)

    # Make predictions
    prediction = model.predict(X_scaled)[0]  # Assuming single prediction

    # Return prediction as JSON response
    return jsonify({'prediction': prediction})
    # Return predictions as JSON response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
