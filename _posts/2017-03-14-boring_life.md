---
layout: post
title:  "Is my life boring?"
date:   2017-03-14 14:21:08 +0010
categories: life
---




When my life is interesting I take a lot of photos. Lets see if I can plot these photos to see if my life is getting more interesting. 

In this post I will explore all of my photos that I have amassed over the years in my Dropbox account. 


# Get list of all pics:

```python
import glob
import os

base_dir = "/home/visgean/Dropbox/**/*"


def get_extension(filename):
    filename, file_extension = os.path.splitext(filename)
    return file_extension.lower()


picture_extensions = ['.jpg', '.jpeg', '.png']
pictures = list(filter(
    lambda f: get_extension(f) in picture_extensions,
    glob.iglob(base_dir, recursive=True)
))
```


```python
>>> print('# of pics:', len(pictures))
# of pics: 3136
```

# Read python exif data:

I am using ``exifread`` library. 


```python
>>> import exifread
>>> 
>>> with open(pictures[40], 'rb') as f:
>>>     tags = exifread.process_file(f)
>>>     
>>> print(tags.keys())

dict_keys(['MakerNote Tag 0x0001', 'Image Orientation', 'EXIF FlashPixVersion', 'Image YResolution', 'Image XResolution', 'GPS GPSLongitudeRef', 'GPS GPSImgDirectionRef', 'EXIF SensingMethod', 'Thumbnail ResolutionUnit', 'GPS GPSImgDirection', 'JPEGThumbnail', 'MakerNote Tag 0x0006', 'GPS GPSAltitudeRef', 'EXIF ColorSpace', 'EXIF ExposureBiasValue', 'EXIF SceneCaptureType', 'EXIF FocalLength', 'Image ResolutionUnit', 'Image Make', 'EXIF SubSecTimeOriginal', 'EXIF LensSpecification', 'EXIF BrightnessValue', 'Image DateTime', 'EXIF ApertureValue', 'MakerNote Tag 0x0005', 'EXIF FNumber', 'EXIF MeteringMode', 'GPS Tag 0x001F', 'GPS GPSLongitude', 'Thumbnail JPEGInterchangeFormat', 'EXIF LensMake', 'Image Software', 'MakerNote Tag 0x0003', 'EXIF ExposureTime', 'EXIF ShutterSpeedValue', 'Thumbnail Compression', 'MakerNote Tag 0x0008', 'Image ExifOffset', 'EXIF WhiteBalance', 'GPS GPSLatitude', 'EXIF ExifVersion', 'EXIF ExifImageWidth', 'EXIF DateTimeOriginal', 'Image Model', 'GPS GPSDestBearingRef', 'MakerNote Tag 0x0014', 'GPS GPSDestBearing', 'GPS GPSAltitude', 'EXIF SubSecTimeDigitized', 'GPS GPSSpeedRef', 'EXIF ComponentsConfiguration', 'EXIF FocalLengthIn35mmFilm', 'EXIF ExposureMode', 'Thumbnail JPEGInterchangeFormatLength', 'EXIF Flash', 'Image YCbCrPositioning', 'EXIF MakerNote', 'Image GPSInfo', 'GPS GPSSpeed', 'MakerNote Tag 0x0004', 'GPS GPSLatitudeRef', 'EXIF SceneType', 'EXIF ExifImageLength', 'EXIF ISOSpeedRatings', 'GPS GPSDate', 'EXIF LensModel', 'EXIF DateTimeDigitized', 'Thumbnail YResolution', 'MakerNote Tag 0x0007', 'GPS GPSTimeStamp', 'Thumbnail XResolution', 'EXIF ExposureProgram'])

```

As you can see there are quire a bit of meta tags. 


# Parse date from EXIF format


```python
date = tags['Image DateTime']
```


```python
>>> print(date.values)
2016:10:05 16:16:11
```




```python
>>> from datetime import datetime
>>> datetime.strptime(str(date.values), '%Y:%m:%d %H:%M:%S')
datetime.datetime(2016, 10, 5, 16, 16, 11)

```



```python
def parse_date(exif_info):
    if not exif_info:
        return None    
    date = exif_info.get('Image DateTime')
    if not date:
        return None
    try:
        return datetime.strptime(str(date.values), '%Y:%m:%d %H:%M:%S').date()
    except:
        print(date)
```


```python
def get_exif(filename):
    try:
        with open(filename, 'rb') as f:
            return exifread.process_file(f)
    except:
        return None
```


```python
>>> exif_data = list(map(get_exif, pictures)) # i want to iterate through these multiple times
MemoryError at position: 603312351, length: 3945995808
Possibly corrupted field DateTime in Image IFD
Possibly corrupted field DateTime in Image IFD
Possibly corrupted field DateTime in Image IFD
Possibly corrupted field DateTime in Image IFD
Possibly corrupted field DateTime in Image IFD
```




```python
>>> dates = list(map(parse_date, exif_data))
2013:12:03 19:12:81
```


# Count photos per day:



```python
from collections import Counter

photos_per_day = Counter(dates)
```

Lets see how many photos have no date and delete them from our data:

```python
>>> print('Missing dates', photos_per_day[None])
>>> del photos_per_day[None]
Missing dates 1247
```

Lets check that they are not there. (It fucks up our precious graphs)

```python
>>> print('Missing dates', photos_per_day[None])
Missing dates 0
```


## Graph it:


```python
from bokeh.plotting import figure, show, output_notebook
output_notebook()

time_graph = figure(
    title="Pics over time", 
    background_fill_color="#E8DDCB",
    y_axis_label='# of pics', 
    x_axis_label='Time',
    x_axis_type="datetime"
)

sorted_vals = photos_per_day.most_common()

time_graph.circle([x[0] for x in sorted_vals], [x[1] for x in sorted_vals])
show(time_graph)
```

![]({{ "/assets/boring_life/photos_per_day.png" | relative_url }})



As you can see that is a bit messy so lets try to collect it by month

# Photos per month:


```python
photos_per_month = Counter([datetime(d.year, d.month, 1) for d in dates if d])
```


```python
time_graph = figure(
    title="Pics per month", 
    background_fill_color="#E8DDCB",
    y_axis_label='# of pics', 
    x_axis_label='Time',
    x_axis_type="datetime"
)

sorted_vals = photos_per_month.most_common()

time_graph.circle([x[0] for x in sorted_vals], [x[1] for x in sorted_vals])
show(time_graph)
```




![]({{ "/assets/boring_life/photos_per_month.png" | relative_url }})


```python
>>> print(len(list(filter(None, dates))))
1889
```


## Conclusion

I was able to parse about sixty percent of the photos. And it seems that I am taking more more and more photos. I have recently went through all of my photos in Dropbox and deleted the duplicate photos - like when you take 3 photos of the same shit but you only need one. 

It does not appear that I have boring life or anything but it was fun to play with Metadata. I feel kind of sorry that I have lost all of my photos from my early life, I was able to retrieve some of them from Facebook but that scrapped metadata completely. 


Interactive version of graphs here: [here](https://nbviewer.jupyter.org/github/Visgean/boring_life/blob/master/Boring%20life.ipynb).
