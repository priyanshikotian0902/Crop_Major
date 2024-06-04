import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

columns_to_impute = ['temperature', 'rainfall', 'ph']
columns_to_encode = ['soil_color', 'crop']

def train_model():
    df = pd.read_csv('../data/FINAL.csv')
    df.dropna(inplace=True)
    df.columns = df.columns.str.lower()
    df['soil_color'] = df['soil_color'].str.strip().str.lower()
    df['crop'] = df['crop'].str.strip().str.lower()

    def removal_box_plot(df, column, threshold):
        removed_outliers = df[df[column] <= threshold]
        return removed_outliers

    def removal_box_plot_multiple(df, columns, threshold):
        for column in columns:
            df = df[df[column] <= threshold]
        return df

    df = removal_box_plot(df, 'rainfall', 1500)
    df = removal_box_plot(df, 'ph', 8.9)
    columns_to_remove_outliers = ['nitrogen', 'phosphorus', 'potassium']
    df = removal_box_plot_multiple(df, columns_to_remove_outliers, 100)

    def remove_outliers_iqr(df, column):
        Q1 = df[column].quantile(0.25)
        Q3 = df[column].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df_no_outliers = df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]
        return df_no_outliers

    df = remove_outliers_iqr(df, 'temperature')

    soil_color_encoder = LabelEncoder()
    df['soil_color'] = soil_color_encoder.fit_transform(df['soil_color'])
    crop_encoder = LabelEncoder()
    df['crop'] = crop_encoder.fit_transform(df['crop'])

    # Log encoder classes for debugging
    print("Soil Color Classes:", soil_color_encoder.classes_)
    print("Crop Classes:", crop_encoder.classes_)

    X = df[['temperature', 'rainfall', 'soil_color', 'ph', 'crop']]
    y = df[['nitrogen', 'phosphorus', 'potassium']]

    imputer = SimpleImputer(strategy='mean')
    X[columns_to_impute] = imputer.fit_transform(X[columns_to_impute])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(random_state=42)
    model.fit(X_train, y_train)

    y_test_pred = model.predict(X_test)

    test_mse_nitrogen = mean_squared_error(y_test['nitrogen'], y_test_pred[:, 0])
    test_mse_phosphorus = mean_squared_error(y_test['phosphorus'], y_test_pred[:, 1])
    test_mse_potassium = mean_squared_error(y_test['potassium'], y_test_pred[:, 2])

    print("Testing Mean Squared Error for Nitrogen:", test_mse_nitrogen)
    print("Testing Mean Squared Error for Phosphorus:", test_mse_phosphorus)
    print("Testing Mean Squared Error for Potassium:", test_mse_potassium)

    return model, imputer, scaler, soil_color_encoder, crop_encoder

model, imputer, scaler, soil_color_encoder, crop_encoder = train_model()

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.json

    if not all(key in input_data for key in columns_to_impute + columns_to_encode):
        return jsonify({'error': 'Invalid input data'}), 400

    # Lowercase and strip input values
    input_data['soil_color'] = input_data['soil_color'].strip().lower()
    input_data['crop'] = input_data['crop'].strip().lower()

    print("Received input data:", input_data)  # Debugging line

    X = pd.DataFrame([input_data])
    X[columns_to_impute] = imputer.transform(X[columns_to_impute])

    soil_color = input_data['soil_color']
    if soil_color in soil_color_encoder.classes_:
        X['soil_color'] = soil_color_encoder.transform([soil_color])[0]
    else:
        print(f"Unseen soil color label: {soil_color}")  # Debugging line
        return jsonify({'error': f"Unseen soil color label: {soil_color}"}), 400

    crop = input_data['crop']
    if crop in crop_encoder.classes_:
        X['crop'] = crop_encoder.transform([crop])[0]
    else:
        print(f"Unseen crop label: {crop}")  # Debugging line
        return jsonify({'error': f"Unseen crop label: {crop}"}), 400

    print("Transformed input data:", X)  # Debugging line

    X_scaled = scaler.transform(X)

    prediction = model.predict(X_scaled)[0]

    response = {
        'Nitrogen': prediction[0],
        'Phosphorus': prediction[1],
        'Potassium': prediction[2]
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
