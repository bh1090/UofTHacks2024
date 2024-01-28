import requests

def fetch_images(query, api_key, cx):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": api_key,
        "cx": cx,
        "searchType": "image",
        "q": query
    }
    response = requests.get(url, params=params)
    data = response.json()
    
    if 'items' in data:
        images = [item['link'] for item in data['items']]
        return images
    else:
        print("No images found.")
        return []

# Example usage
api_key = "AIzaSyDhy2e9DFFTxxwzCNhi4mO3rdNqsx2it0A"
cx = "33962100c6d324bd0"
query = "cats"

images = fetch_images(query, api_key, cx)
for image in images:
    print(image)
