from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from streetview import search_panoramas
from streetview import get_streetview
import os
import requests
import regex as re


def get_location_view(request):
    # Retrieve latitude and longitude parameters from the request
    latitude = request.GET.get('lat')
    longitude = request.GET.get('lon')

    # Generate image URL based on latitude and longitude
    image_urls = get_image_urls(conform_coordinates(latitude, longitude))

    # Retrieve address corresponding to the coordinates from Nominatim
    address = get_address(latitude, longitude)

    # Generate summary of the location with Cohere
    summary = get_summary(address)

    # Create JSON response containing the image URL
    response_data = {
        'image_urls': image_urls,
        'address': address,
        'summary': summary
    }

    return JsonResponse(response_data)


def get_image_urls(coordinate: tuple[str, str]) -> list[str]:
    panos = search_panoramas(lat=float(coordinate[0]), lon=float(coordinate[1]))
    pano_ids = {x.pano_id: x.date for x in panos if x.date}
    results = []
    dir = f"images/{coordinate[0]},{coordinate[1]}/"
    if not os.path.isdir(f"./{dir}"):
        os.mkdir(f"./{dir}")
    for id in pano_ids.keys():
        name = f"{dir}{pano_ids[id]}.jpg"
        if not os.path.exists(f"./{name}"):
            image = get_streetview(pano_id=id, api_key="AIzaSyDpgOD3J5ZEeh8CWPTexxKqPY8kgxyZwB4")
            image.save(f"{name}", "jpeg")
        results.append(name)
    return results


def conform_coordinates(latitude: str, longitude: str) -> tuple[str, str]:
    try:
        # Convert the string to a float with 4 decimal points
        return '{:.4f}'.format(float(latitude)), '{:.4f}'.format(float(longitude))
    except ValueError:
        # Handle the case where the input string is not a valid number
        assert False


def get_address(latitude: str, longitude: str) -> str:
    response = requests.get('https://nominatim.openstreetmap.org/reverse', params={
        'format': 'json',
        'lat': latitude,
        'lon': longitude
    }).json()
    address = ','.join(response['display_name'].split(',')[0:5])
    # Remove special characters
    return re.sub(r'[^\x00-\x7F]+', '', address)


def get_summary(address: str) -> str:
    return ''
