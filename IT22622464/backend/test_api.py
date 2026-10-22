import io
import unittest
from PIL import Image
from fastapi.testclient import TestClient
from backend.app import app, MAX_BYTES

class InferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client_context = TestClient(app)
        cls.client = cls.client_context.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client_context.__exit__(None, None, None)

    def test_health(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['labelsConfigured'])

    def test_real_model_inference(self):
        image = io.BytesIO()
        Image.new('RGB', (300, 180), (50, 125, 45)).save(image, format='PNG')
        response = self.client.post('/api/predict', content=image.getvalue(), headers={'Content-Type': 'image/png'})
        self.assertEqual(response.status_code, 200, response.text)
        results = response.json()['predictions']
        self.assertEqual(len(results), 6)
        self.assertAlmostEqual(sum(item['score'] for item in results), 1, places=5)
        self.assertEqual({r['index']: r['label'] for r in results}, {0:'Bacterial Spot',1:'Cercospora Leaf Spot',2:'Curl Virus',3:'Healthy Leaf',4:'Nutrition Deficiency',5:'White spot'})
        self.assertEqual([r['score'] for r in results], sorted([r['score'] for r in results], reverse=True))

    def test_invalid_image(self):
        self.assertEqual(self.client.post('/api/predict', content=b'not an image').status_code, 400)

    def test_empty_image(self):
        self.assertEqual(self.client.post('/api/predict', content=b'').status_code, 400)

    def test_upload_limit(self):
        self.assertEqual(self.client.post('/api/predict', content=b'x' * (MAX_BYTES+1)).status_code, 413)
