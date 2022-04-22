### install windows binaries for geopandas

- pip install GDAL-3.4.1-cp39-cp39-win_amd64.whl
- pip install Fiona-1.8.21-cp39-cp39-win_amd64.whl
- pip install pyproj-3.3.0-cp39-cp39-win_amd64.whl
- pip install Rtree-0.9.7-cp39-cp39-win_amd64.whl
- pip install geopandas


- pip install rasterio-1.2.10-cp39-cp39-win_amd64.whl
- pip install rasterstats

- pip install rio_color-1.0.4-cp39-cp39-win_amd64.whl

- pip install rio-tiler
- pip install rio-cogeo
- pip install rio-viz

- pip install titiler.application
- pip install uvicorn

- pip install folium 

FOR INTERACTIVE NOTEBOOKS
 - pip install matplotlib


### set nodata value - should be 3857 not 4356
rio edit-info --nodata 0 .\data\01182022_p4p_rgb_ortho_gcp_4356.tif
rio info .\data\01182022_p4p_rgb_ortho_gcp_4356.tif

### create a COG
rio cogeo create .\data\01182022_p4p_rgb_ortho_gcp_4356.tif .\data\test_cog.tif
rio cogeo info .\data\test_cog.tif

rio cogeo create "Q:\Shared drives\UAV_Imagery\CRS\Murphy.Paul\Wheat_2022\UAV\03232022\export\f1_03242022_i2_re_ortho_gcp_4326.tif" "Q:\Shared drives\UAV_Imagery\CRS\Murphy.Paul\Wheat_2022\UAV\03232022\export\f1_03242022_i2_re_ortho_gcp_4326_cog.tif"



http://152.7.196.7/cog/murphy/f1_03242022_i2_re_ortho_gcp_4326_cog.tif



### compress to jpg
rio cogeo create .\data\01182022_p4p_rgb_ortho_gcp_4356.tif .\data\test_cog_jpeg.tif -p jpeg

rio viz .\data\test_cog.tif



## need to try out https://github.com/mapbox/rio-glui
