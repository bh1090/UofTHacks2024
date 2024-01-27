from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from streetview import search_panoramas
from streetview import get_streetview
import os

def conform_coordinates(latitude, longitude):
    try:
        # Convert the string to a float with 4 decimal points
        return '{:.4f}'.format(float(latitude)), '{:.4f}'.format(float(longitude))
    except ValueError:
        # Handle the case where the input string is not a valid number
        assert False

def get_location_view(request):
    # Retrieve latitude and longitude parameters from the request
    latitude = request.GET.get('lat')
    longitude = request.GET.get('lon')

    # Generate image URL based on latitude and longitude
    image_urls = generate_image_urls(conform_coordinates(latitude, longitude))

    # Create JSON response containing the image URL
    response_data = {
        'image_urls': image_urls
    }

    return JsonResponse(response_data)


def generate_image_urls(coordinate):
    panos = search_panoramas(lat=coordinate[0], lon=coordinate[1])
    pano_ids = {x.pano_id: x.date for x in panos if x.date}
    results = []
    for id in pano_ids.keys():
        name = f"{coordinate[0]},{coordinate[1]}|{pano_ids[id]}.jpg"
        if not os.path.isfile(f"./memorylane/images/{name}"):
            image = get_streetview(pano_id=id, api_key="AIzaSyDpgOD3J5ZEeh8CWPTexxKqPY8kgxyZwB4")
            image.save(f"./memorylane/images/{name}", "jpeg")
        results.append(name)
    return results

