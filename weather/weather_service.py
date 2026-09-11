# This file will handle weather-related data for the Environmental Risk module.
# For now, get_weather_data() returns sample weather values so we can test the connection between the weather module and our risk engine. Later, this function can be replaced with a real weather-data source without changing the risk calculation logic.





# def get_weather_data():
#     """
#     Return sample weather data.

#     This is a prototype version.
#     Later, this function can be connected to a real weather API.
#     """

#     weather_data = {
#         "rainfall_mm": 10,
#         "temperature_c": 28,
#         "humidity_percent": 75,
#         "wind_speed_kmph": 12
#     }

#     return weather_data




# get_weather_data() now accepts the latitude (lat) and longitude (lng) of a field. In the real system, these coordinates will be used to fetch weather information for that specific field. For now, we are only storing/returning sample values, so no real weather API is being called yet.


def get_weather_data(
    lat,
    lng,
    rainfall_mm=10,
    temperature_c=28,
    humidity_percent=75,
    wind_speed_kmph=12
):
    """
    Return weather data for a field location.

    Default values are sample weather values.
    Later, these values can come from a real weather API.
    """

    weather_data = {
        "lat": lat,
        "lng": lng,
        "rainfall_mm": rainfall_mm,
        "temperature_c": temperature_c,
        "humidity_percent": humidity_percent,
        "wind_speed_kmph": wind_speed_kmph
    }

    return weather_data