from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from streetview import search_panoramas
from streetview import get_streetview
import os
import requests
import regex as re
import cohere
import random



def get_location_view(request):
    # Retrieve latitude and longitude parameters from the request
    latitude = request.GET.get('lat')
    longitude = request.GET.get('lon')

    # Generate image URL based on latitude and longitude
    image_urls = get_image_urls(conform_coordinates(latitude, longitude))

    # Retrieve address corresponding to the coordinates from Nominatim
    address = get_address(latitude, longitude)

    # Generate summary of the location with Cohere
    lst = get_cards(address)

    # Create JSON response containing the image URL
    response_data = {
        'image_urls': image_urls,
        'address': address,
        'summary': lst[0],
        'card1': lst[1],
        'card2': lst[2]
    }

    return JsonResponse(response_data)


def get_image_urls(coordinate: tuple[str, str]) -> dict[str, str]:
    panos = search_panoramas(lat=float(coordinate[0]), lon=float(coordinate[1]))
    pano_ids = {x.pano_id: x.date for x in panos if x.date}
    results = {}
    dir = f"images/{coordinate[0]},{coordinate[1]}/"
    if not os.path.isdir(f"./{dir}"):
        os.mkdir(f"./{dir}")
    for id in pano_ids.keys():
        name = f"{dir}{pano_ids[id]}.jpg"
        if not os.path.exists(f"./{name}"):
            image = get_streetview(pano_id=id, api_key="AIzaSyDpgOD3J5ZEeh8CWPTexxKqPY8kgxyZwB4")
            image.save(f"{name}", "jpeg")
        results[pano_ids[id]] = name
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


def get_cards(address: str) -> list[str]:

    # Dynamic values provided by the google maps api.

    summaryDict = {}
    query1
    query2
    query3
    lst = []
    assert len(lst) == 3

    summaryPrompt = ["Give me a list of 1 historical fact/post about " + address + " or city bof this address: " + address + ". No filler sentences needed, list only the fact.",
                    "Generate 2 brief facts about the local traditions followed in this area" + address,
                    "Generate some information about the historical significance of following area:" + address
    ]

    query1 = get_response(summaryPrompt[0], 0.750)
    query2 = get_response(summaryPrompt[1], 0.750)
    query3 = get_response(summaryPrompt[2], 2 )

    summaryDict["historical facts"] =  query1
    summaryDict["Local Traditions"] = query2
    summaryDict["Historical Significance of area"] = query3
    


    finalSummary = "Write a short introductory hook for a blog post byrefining the data given in the 3 documents."

    # cohere api key, keep secret!!
    co = cohere.Client("")

    co.chat(
    model= "command",
    message= finalSummary,
    documents= [summaryDict])
    summary_paragraph = co.generations[0].text
    lst[0] = summary_paragraph
    


    prompt = ["Generate a short poem relating to " + address,
            "Generate a short story relating to the " + address,
            "Generate a haiku relating to the " + address,
            "Generate a short story of a person's experience on or near " + address,
            "Generate a movie quote/ related to this location: " + address + "List the year that movie was released." ,
            "Generate 1 trivia question relating to this area near this area/ country: " + address,
            "Generate a fact about this country in " + address + "'s national language"
            ]

    # setting for how accurate or creative you want the model to be.
    temperature = [ 3,
                    3,
                    3.5,
                    2,
                    2,
                    1.5,
                    1.0
    ]



    randomNum = random.randrange(len(prompt))

    promptt = prompt[randomNum]
    
    list[1] = get_response(promptt, temperature[randomNum])
    
    randomNum = random.randrange(len(prompt))
    promptt = prompt[randomNum]

    list[2] = get_response(promptt, temperature[randomNum])
    
    return lst

def get_response(param, param2):
    co = cohere.Client("")
    response = co.generate(
        model='command-nightly',
        prompt = param,
        max_tokens=200, # This parameter is optional.
        temperature=param2)

    intro_paragraph = response.generations[0].text
    print(intro_paragraph)
    return intro_paragraph