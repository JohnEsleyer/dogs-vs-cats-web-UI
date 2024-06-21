from flask import Flask, request, jsonify
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io

app = Flask(__name__)

processor = AutoImageProcessor.from_pretrained("dima806/dogs_cats_image_detection")
model = AutoModelForImageClassification.from_pretrained("dima806/dogs_cats_image_detection")

@app.route('/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    try:
        image = Image.open(file.stream)
    except Exception as e:
        return jsonify({"error": "Invalid image file"}), 400

    # Preprocess the image
    inputs = processor(images=image, return_tensors="pt")

    # Perform the classification
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted label
    predictions = outputs.logits.argmax(-1)
    labels = model.config.id2label
    predicted_label = labels[predictions.item()]

    return jsonify({"classification": predicted_label})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
