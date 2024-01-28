from concurrent.futures import ThreadPoolExecutor
from django.http import JsonResponse
from streetview import search_panoramas, get_streetview
import os
import requests
import re
import cohere
import random
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from . import fetch_images

cred = credentials.Certificate('./memorylane-412506-8c9829f4fd27.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()


def get_location_view(request):
    latitude = request.GET.get('lat')
    longitude = request.GET.get('lon')

    # Generate image URL based on latitude and longitude in a separate thread
    executor = ThreadPoolExecutor()
    image_urls_future = executor.submit(get_image_urls, latitude, longitude)

    coordinates = conform_coordinates(latitude, longitude)
    posts_future = executor.submit(get_posts, coordinates[0], coordinates[1])

    # Retrieve address corresponding to the coordinates from Nominatim
    address = get_address(latitude, longitude)

    # Generate summary of the location with Cohere in a separate thread
    cards_future = executor.submit(get_cards, address)

    # Wait for both tasks to complete
    image_urls = image_urls_future.result()

    if image_urls == {}:
        url = fetch_images.googleImageAPI(address)
        image_urls = {'Online image': url}

    cards = cards_future.result()
    posts = posts_future.result()

    # Create JSON response containing the image URL
    response_data = {
        'image_urls': image_urls,
        'address': address,
        'summary': cards[0],
        'card1': cards[1],
        'card2': cards[2],
        'posts': posts
    }

    return JsonResponse(response_data)


def get_image_urls(latitude, longitude):
    coordinate = conform_coordinates(latitude, longitude)
    panos = search_panoramas(lat=float(coordinate[0]), lon=float(coordinate[1]))
    pano_ids = {x.pano_id: x.date for x in panos if x.date}
    results = {}
    directory = f"images/{coordinate[0]},{coordinate[1]}/"
    if not os.path.isdir(f"./{directory}"):
        os.mkdir(f"./{directory}")
    for pano_id, date in pano_ids.items():
        name = f"{directory}{date}.jpg"
        if not os.path.exists(f"./{name}"):
            image = get_streetview(pano_id=pano_id, api_key="AIzaSyDx7Obk-QIrQWTb0CmOlv0SbMVI20cCfF0")
            image.save(f"{name}", "jpeg")
        results[date] = 'http://localhost:8000/' + name
    return results


def conform_coordinates(latitude, longitude):
    try:
        return '{:.4f}'.format(float(latitude)), '{:.4f}'.format(float(longitude))
    except ValueError:
        assert False


def get_address(latitude, longitude):
    response = requests.get('https://nominatim.openstreetmap.org/reverse', params={
        'format': 'json',
        'lat': latitude,
        'lon': longitude
    }).json()
    print(response)
    address = ','.join(response['display_name'].split(',')[0:5])
    return re.sub(r'[^\x00-\x7F]+', '', address)


def get_cards(address):
    documents = []
    lst = []

    summary_prompt = [
        "Describe the location/general landmarks around " + address + ". No filler sentences needed.",
        "Generate 1 brief facts about the local traditions followed in this area" + address + "No filler sentences needed.  Do not say that you can assist/help etc.",
        "Generate some information about the historical significance of following area:" + address
    ]
    summary_titles = ['History', 'Culture', 'traditions']

    results = []
    with ThreadPoolExecutor() as executor:
        for i in range(3):
            results.append(executor.submit(get_response, summary_prompt[i], 0.750))

        for i in range(3):
            documents.append({'title': summary_titles[i], 'snippet': results[i].result()})

    co = cohere.Client("oWJBkj0RzAtbkrYOLaNqzjfynkL5hMlsm54ueefa")

    joinedString = json.dumps(documents)

    response = co.summarize( 
    text=joinedString,
    length='short',
    format='bullets',
    model='command-light',
    additional_command='Formal Writing. No questions should be asked or posed. No need to say that you can assist or help in any further questions.',
    temperature=0.3,
    ) 
    lst.append(response.summary)

    prompts = [
        "Generate a short poem relating to " + address + ". Do not offer help.",
        "Generate a short story relating to the " + address,
        "Generate a haiku relating to the " + address + ". Do not offer help.",
        "Generate a short story of a person's experience on or near " + address + ".   Do not offer help.",
        "Generate a movie quote/ related to this location: " + address + "List the year that movie was released.",
        "Generate 1 trivia question relating to this area near this area/ country: " + address + ".   Do not offer help.",
        "Generate a fact about this country in " + address + "'s national language.  Do not offer help."
    ]

    temperatures = [3, 3, 3.5, 2, 2, 1.5, 1.0]

    results = []
    with ThreadPoolExecutor() as executor:
        for _ in range(2):
            random_index = random.randrange(len(prompts))
            prompt = prompts[random_index]
            temperature = temperatures[random_index]
            results.append(executor.submit(get_response, prompt, temperature))

        for result in results:
            lst.append(result.result())

    assert len(lst) == 3

    return lst


def get_response(prompt, temperature):
    co = cohere.Client("oWJBkj0RzAtbkrYOLaNqzjfynkL5hMlsm54ueefa")
    response = co.generate(
        model='command-nightly',
        prompt=prompt,
        max_tokens=200,
        temperature=temperature
    )
    return response.generations[0].text


def get_posts(lat, lon):
    doc_ref = db.collection('posts').document(f'{lat},{lon}')
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()['posts']


def save_post(request):
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    post = request.GET.get('post')
    coordinate = conform_coordinates(lat, lon)
    doc_name = f'{coordinate[0]},{coordinate[1]}'
    doc_ref = db.collection('posts').document(doc_name)
    doc = doc_ref.get()
    if doc.exists:
        doc = doc.to_dict()
        doc['posts'].append(post)
        db.collection('posts').document(doc_name).set(doc)
    else:
        db.collection('posts').document(doc_name).set({'posts': [post]})

    response_data = {'success': True}
    return JsonResponse(response_data)
