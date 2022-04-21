"""
import googlemaps
import pandas as pd

gmaps = googlemaps.Client(key='AIzaSyAEVHv4-4mGSpSz1a_MpnPQclFVuoJicAo')
place_name = "AVA DoBro"
place_result = gmaps.places(place_name)
print(place_result)
"""
import pandas as pd
import requests

class YelpUtils:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_reviews(self):
        api_key = self.api_key
        aptData = pd.read_csv('apartments.csv')
        headers = {
            'Authorization': 'Bearer %s' % api_key,
            'cache-control': "no-cache"
        }
        data = pd.DataFrame(columns=['id', 'rating', 'text'])
        for i in range(len(aptData)):
            business_id = aptData['id'][i]
            url = 'https://api.yelp.com/v3/businesses/' + business_id + '/reviews'
            response = requests.get(url=url, headers=headers)
            dataset = response.json()['reviews']
            for j in range(len(dataset)):
                data = data.append({'id': business_id, 'rating': dataset[j]['rating'],
                                      'text': dataset[j]['text']}, ignore_index=True)
            # print(data)
        return data


if __name__ == "__main__":
    api_key = 'vw384-JX_2TPwqnUWswkOnaYfvko9nLXpp6ZK6zSgGRUDG0nDMPxzPrvb2NwQ6RkawaqmLJrSemNLSfbdJYlTpLzsXwZoze_H8kpuH4B0n54RHXVBFejvykt-SJGYnYx'
    utils = YelpUtils(api_key)
    data = utils.get_reviews()

    # print(len(data))
    # print(data)
    data.to_csv('aptReviews.csv', index=False)  # default: sep=','
