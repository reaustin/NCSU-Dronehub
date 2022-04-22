import os, sys
import requests
import json
from folium import Map, TileLayer, GeoJson, Popup, LayerControl
from io import BytesIO
import rasterio
import geopandas as gdp

#%pylab inline

#titiler_endpoint = "http://127.0.0.1:8000"  
titiler_endpoint = "http://152.7.196.7:8000"

# Two sample COGs - one being a PSScene4Band analytic image and the other being a PSOrthoTile visual image
# from the Google Cloud storage bucket

#analytic_cog_url = os.path.normpath("G:/NCSU.Github/NCSU-Dronehub/data/test_cog.tif")
#visual_cog_url = os.path.normpath("G:/NCSU.Github/NCSU-Dronehub/data/test_cog.tif")
analytic_cog_url = 'http://152.7.196.7/cog/test_cog.tif'
visual_cog_url = 'http://152.7.196.7/cog/test_cog.tif'


def submit_request(BASE_URL, endpoint, url):    
    r = requests.get(
        f"{BASE_URL}/{endpoint}",
        params = {
            "url": url,
        }
    ).json()
    return r



tile_json_analytic = submit_request(titiler_endpoint, "cog/tilejson.json", analytic_cog_url)
#print(json.dumps(tile_json_analytic, indent=4))

tileset = tile_json_analytic["tiles"][0]
#print(tileset)


plots = gdp.read_file('./data/Plots_3857.shp')
print(plots.crs)

# save as static output
plot_path = 'X:/COG.Storage/cog/leaflet/plots.geojson'
#plots.to_file(plot_path, driver="GeoJSON")  



left, bottom, right, top = tile_json_analytic["bounds"][0], tile_json_analytic["bounds"][1], tile_json_analytic["bounds"][2], tile_json_analytic["bounds"][3]

m = Map(
    location=((bottom + top)/2, (left + right)/2),
    zoom_start=14,
    max_zoom=24,
    tiles=None
)
tile_layer = TileLayer(
    tiles= tileset,
    max_zoom=24,
    name='UAV Image',
    attr="Sample COG"
)

tile_layer.add_to(m)


GeoJson(data=plots["geometry"],name='Plots').add_to(m)

LayerControl().add_to(m)


out_map = 'X:/COG.Storage/cog/leaflet/index.html'
m.save(out_map)



