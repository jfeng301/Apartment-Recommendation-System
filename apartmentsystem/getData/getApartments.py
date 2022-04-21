import json
import csv
import pandas as pd
import requests


# Using Yelp Fusion API
# https://www.yelp.com/developers/documentation/v3/business_search
# Request: GET https://api.yelp.com/v3/businesses/search
# parameters we query: location(string), latitude(decimal), longitude(decimal),
# name(string), city = "New York City", term = "restaurant/food"
# other info: url, transactions: pickup / delivery
class YelpUtils:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_location(self):
        api_key = self.api_key
        url = 'https://api.yelp.com/v3/businesses/search'
        headers = {
            'Authorization': 'Bearer %s' % api_key,
            'cache-control': "no-cache"
        }

        data = pd.DataFrame(columns=['name', 'id', 'latitude', 'longitude', 'zipcode', 'rating'])
        for num in range(20):
            offset = 50 * num
            params = {'term': 'apartments',
                      'limit': 50,
                      'location': 'NYC',
                      'offset': offset
                      # 'latitude': 40.70544486444615,
                      # 'longitude': -73.99429321289062,
                      # 'radius': 500
                      }
            response = requests.get(url=url, params=params, headers=headers)
            dataset = response.json()['businesses']
            for i in range(len(dataset)):
                data = data.append({'name': dataset[i]['name'], 'id': dataset[i]['id'],
                                    'latitude': dataset[i]['coordinates']['latitude'],
                                    'longitude': dataset[i]['coordinates']['longitude'],
                                    'zipcode': dataset[i]['location']['zip_code'],
                                    'rating': dataset[i]['rating']}, ignore_index=True)
        # print(dataset)
        # print(response.json()['total'])
        return data


if __name__ == "__main__":
    api_key = 'vw384-JX_2TPwqnUWswkOnaYfvko9nLXpp6ZK6zSgGRUDG0nDMPxzPrvb2NwQ6RkawaqmLJrSemNLSfbdJYlTpLzsXwZoze_H8kpuH4B0n54RHXVBFejvykt-SJGYnYx'
    utils = YelpUtils(api_key)
    data = utils.get_location()

    # print(len(data))
    # print(data)
    data.to_csv('apartments.csv', index=False)  # default: sep=','

