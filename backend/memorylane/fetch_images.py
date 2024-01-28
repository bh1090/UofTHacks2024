import requests

def googleImageAPI(address):

    def fetch_images(query, api_key, cx, num=1):
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "key": api_key,
            "cx": cx,
            "searchType": "image",
            "q": query,
            "num" : num
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
    api_key = "AIzaSyDx7Obk-QIrQWTb0CmOlv0SbMVI20cCfF0"
    cx = "c7b5d072f73d642a3"
    query = address

    images = fetch_images(query, api_key, cx, num=1)
    for image in images:
        return image
