---
layout: post
title:  "Is my life boring?"
date:   2017-03-14 14:21:08 +0010
categories: life
---


When my life is interesting I take a lot of photos. Lets see if I can plot these photos to see if my life is getting more interesting. 


```python
base_dir = "/home/visgean/Dropbox/**/*"
```


```python
import glob
import os

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




```python
>>> import exifread
>>> 
>>> with open(pictures[40], 'rb') as f:
>>>     tags = exifread.process_file(f)
>>>     
>>> print(tags.keys())

dict_keys(['MakerNote Tag 0x0001', 'Image Orientation', 'EXIF FlashPixVersion', 'Image YResolution', 'Image XResolution', 'GPS GPSLongitudeRef', 'GPS GPSImgDirectionRef', 'EXIF SensingMethod', 'Thumbnail ResolutionUnit', 'GPS GPSImgDirection', 'JPEGThumbnail', 'MakerNote Tag 0x0006', 'GPS GPSAltitudeRef', 'EXIF ColorSpace', 'EXIF ExposureBiasValue', 'EXIF SceneCaptureType', 'EXIF FocalLength', 'Image ResolutionUnit', 'Image Make', 'EXIF SubSecTimeOriginal', 'EXIF LensSpecification', 'EXIF BrightnessValue', 'Image DateTime', 'EXIF ApertureValue', 'MakerNote Tag 0x0005', 'EXIF FNumber', 'EXIF MeteringMode', 'GPS Tag 0x001F', 'GPS GPSLongitude', 'Thumbnail JPEGInterchangeFormat', 'EXIF LensMake', 'Image Software', 'MakerNote Tag 0x0003', 'EXIF ExposureTime', 'EXIF ShutterSpeedValue', 'Thumbnail Compression', 'MakerNote Tag 0x0008', 'Image ExifOffset', 'EXIF WhiteBalance', 'GPS GPSLatitude', 'EXIF ExifVersion', 'EXIF ExifImageWidth', 'EXIF DateTimeOriginal', 'Image Model', 'GPS GPSDestBearingRef', 'MakerNote Tag 0x0014', 'GPS GPSDestBearing', 'GPS GPSAltitude', 'EXIF SubSecTimeDigitized', 'GPS GPSSpeedRef', 'EXIF ComponentsConfiguration', 'EXIF FocalLengthIn35mmFilm', 'EXIF ExposureMode', 'Thumbnail JPEGInterchangeFormatLength', 'EXIF Flash', 'Image YCbCrPositioning', 'EXIF MakerNote', 'Image GPSInfo', 'GPS GPSSpeed', 'MakerNote Tag 0x0004', 'GPS GPSLatitudeRef', 'EXIF SceneType', 'EXIF ExifImageLength', 'EXIF ISOSpeedRatings', 'GPS GPSDate', 'EXIF LensModel', 'EXIF DateTimeDigitized', 'Thumbnail YResolution', 'MakerNote Tag 0x0007', 'GPS GPSTimeStamp', 'Thumbnail XResolution', 'EXIF ExposureProgram'])

```




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

    



```python
from collections import Counter

photos_per_day = Counter(dates)
```


```python
>>> print('Missing dates', photos_per_day[None])
>>> del photos_per_day[None]
Missing dates 1247

```

```python
>>> print('Missing dates', photos_per_day[None])
Missing dates 0
```

    



```python
from bokeh.plotting import figure, show, output_notebook
output_notebook()
```



<div class="bk-root">
    <a href="http://bokeh.pydata.org" target="_blank" class="bk-logo bk-logo-small bk-logo-notebook"></a>
    <span id="08df9cb6-309b-45a4-a95e-bc9e2665e25c">Loading BokehJS ...</span>
</div>





```python
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




<div class="bk-root">
    <div class="bk-plotdiv" id="410736d5-1a85-4d12-84bb-ed6fd5179284"></div>
</div>


As you can see that is a bit messy so lets try to collect it by month


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




<div class="bk-root">
    <div class="bk-plotdiv" id="8772e140-5a33-44e1-bdf0-151cc9c6e979"></div>
</div>


```python
>>> print(len(list(filter(None, dates))))
1889
```

    


I was only able to parse about 60% of my photos - rest of them comes from facebook or dont have dates at all :/ But its still nice to see that I am taking more and more photos.




<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">

</script>


<script type="text/javascript">

  (function(global) {
    function now() {
      return new Date();
    }
  
    var force = false;
  
    if (typeof (window._bokeh_onload_callbacks) === "undefined" || force === true) {
      window._bokeh_onload_callbacks = [];
      window._bokeh_is_loading = undefined;
    }
  
  
    
    if (typeof (window._bokeh_timeout) === "undefined" || force === true) {
      window._bokeh_timeout = Date.now() + 0;
      window._bokeh_failed_load = false;
    }
  
    var NB_LOAD_WARNING = {'data': {'text/html':
       "<div style='background-color: #fdd'>\n"+
       "<p>\n"+
       "BokehJS does not appear to have successfully loaded. If loading BokehJS from CDN, this \n"+
       "may be due to a slow or bad network connection. Possible fixes:\n"+
       "</p>\n"+
       "<ul>\n"+
       "<li>re-rerun `output_notebook()` to attempt to load from CDN again, or</li>\n"+
       "<li>use INLINE resources instead, as so:</li>\n"+
       "</ul>\n"+
       "<code>\n"+
       "from bokeh.resources import INLINE\n"+
       "output_notebook(resources=INLINE)\n"+
       "</code>\n"+
       "</div>"}};
  
    function display_loaded() {
      if (window.Bokeh !== undefined) {
        document.getElementById("410736d5-1a85-4d12-84bb-ed6fd5179284").textContent = "BokehJS successfully loaded.";
      } else if (Date.now() < window._bokeh_timeout) {
        setTimeout(display_loaded, 100)
      }
    }
  
    function run_callbacks() {
      window._bokeh_onload_callbacks.forEach(function(callback) { callback() });
      delete window._bokeh_onload_callbacks
      console.info("Bokeh: all callbacks have finished");
    }
  
    function load_libs(js_urls, callback) {
      window._bokeh_onload_callbacks.push(callback);
      if (window._bokeh_is_loading > 0) {
        console.log("Bokeh: BokehJS is being loaded, scheduling callback at", now());
        return null;
      }
      if (js_urls == null || js_urls.length === 0) {
        run_callbacks();
        return null;
      }
      console.log("Bokeh: BokehJS not loaded, scheduling load and callback at", now());
      window._bokeh_is_loading = js_urls.length;
      for (var i = 0; i < js_urls.length; i++) {
        var url = js_urls[i];
        var s = document.createElement('script');
        s.src = url;
        s.async = false;
        s.onreadystatechange = s.onload = function() {
          window._bokeh_is_loading--;
          if (window._bokeh_is_loading === 0) {
            console.log("Bokeh: all BokehJS libraries loaded");
            run_callbacks()
          }
        };
        s.onerror = function() {
          console.warn("failed to load library " + url);
        };
        console.log("Bokeh: injecting script tag for BokehJS library: ", url);
        document.getElementsByTagName("head")[0].appendChild(s);
      }
    };var element = document.getElementById("410736d5-1a85-4d12-84bb-ed6fd5179284");
    if (element == null) {
      console.log("Bokeh: ERROR: autoload.js configured with elementid '410736d5-1a85-4d12-84bb-ed6fd5179284' but no matching script tag was found. ")
      return false;
    }
  
    var js_urls = [];
  
    var inline_js = [
      function(Bokeh) {
        (function() {
          var fn = function() {
            var docs_json = {"7d09fd8c-3280-4d37-ab26-b737942c6559":{"roots":{"references":[{"attributes":{"max_interval":500.0,"num_minor_ticks":0},"id":"76de7922-9566-41da-9ce4-e15cb2aaf380","type":"AdaptiveTicker"},{"attributes":{},"id":"33fcfea2-1e11-4362-aa30-341ca345f045","type":"BasicTickFormatter"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"5a959a40-189b-46fd-9226-71ac24b1d947","type":"HelpTool"},{"attributes":{},"id":"80ba28e4-6cad-4d1b-8569-a66a4da99cd5","type":"BasicTicker"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"845052b7-b3c2-4f16-9482-320339fc52ab","type":"ResetTool"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"210d488a-cc23-4cb3-a15b-a07a5b047bfc","type":"SaveTool"},{"attributes":{"months":[0,2,4,6,8,10]},"id":"e0a1e360-1528-4242-b6cd-61da63ce3870","type":"MonthsTicker"},{"attributes":{"plot":null,"text":"Pics over time"},"id":"ff4a3919-a50b-46ef-96d4-271662a5aeaa","type":"Title"},{"attributes":{"days":[1,15]},"id":"deec2d7b-8963-458e-97be-01c6d699b7d0","type":"DaysTicker"},{"attributes":{"overlay":{"id":"38238651-9353-4eab-9e92-5cf49b2ace0f","type":"BoxAnnotation"},"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"d705c1be-c728-4343-a528-00eda3399224","type":"BoxZoomTool"},{"attributes":{"active_drag":"auto","active_scroll":"auto","active_tap":"auto","tools":[{"id":"eb77ea58-3565-4fdf-8a55-341a7e5b4ec0","type":"PanTool"},{"id":"c7f63124-5091-4fbf-977e-e885a1ba7f62","type":"WheelZoomTool"},{"id":"d705c1be-c728-4343-a528-00eda3399224","type":"BoxZoomTool"},{"id":"210d488a-cc23-4cb3-a15b-a07a5b047bfc","type":"SaveTool"},{"id":"845052b7-b3c2-4f16-9482-320339fc52ab","type":"ResetTool"},{"id":"5a959a40-189b-46fd-9226-71ac24b1d947","type":"HelpTool"}]},"id":"d42b6bf4-32e8-4189-9514-09ab182dec93","type":"Toolbar"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"c7f63124-5091-4fbf-977e-e885a1ba7f62","type":"WheelZoomTool"},{"attributes":{"axis_label":"# of pics","formatter":{"id":"33fcfea2-1e11-4362-aa30-341ca345f045","type":"BasicTickFormatter"},"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"},"ticker":{"id":"80ba28e4-6cad-4d1b-8569-a66a4da99cd5","type":"BasicTicker"}},"id":"dd14704b-2fff-4e4e-98c5-8d263a5ea571","type":"LinearAxis"},{"attributes":{},"id":"2ee4510a-cc6b-4356-a5fb-e8f91bcc850c","type":"YearsTicker"},{"attributes":{"fill_color":{"value":"#1f77b4"},"line_color":{"value":"#1f77b4"},"x":{"field":"x"},"y":{"field":"y"}},"id":"3af56cf2-85f8-478d-9b0e-17b5643789d2","type":"Circle"},{"attributes":{"days":[1,8,15,22]},"id":"18055234-04cc-47db-abe6-021584c42be6","type":"DaysTicker"},{"attributes":{"data_source":{"id":"c61b7091-033b-4bc8-a1a8-14f7f1876f47","type":"ColumnDataSource"},"glyph":{"id":"3af56cf2-85f8-478d-9b0e-17b5643789d2","type":"Circle"},"hover_glyph":null,"nonselection_glyph":{"id":"3d0bab81-dfd3-410f-b73e-f0775b789337","type":"Circle"},"selection_glyph":null},"id":"5d2da22e-9f06-4b15-9bc7-b080f0a31422","type":"GlyphRenderer"},{"attributes":{"callback":null},"id":"ca3b9d1e-5f94-441e-b8d4-70e91b9b88dd","type":"DataRange1d"},{"attributes":{"base":60,"mantissas":[1,2,5,10,15,20,30],"max_interval":1800000.0,"min_interval":1000.0,"num_minor_ticks":0},"id":"70ee7ec0-e381-4a78-9c19-82b33c20997f","type":"AdaptiveTicker"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"}},"id":"eb77ea58-3565-4fdf-8a55-341a7e5b4ec0","type":"PanTool"},{"attributes":{},"id":"ebc0b741-0f3b-44bc-8ded-827ecef83be2","type":"DatetimeTickFormatter"},{"attributes":{"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"},"ticker":{"id":"574f3fec-0a54-40f4-ab5b-96c8b9352ce8","type":"DatetimeTicker"}},"id":"204d56d1-84d0-401e-9732-0d94230a0665","type":"Grid"},{"attributes":{"num_minor_ticks":5},"id":"574f3fec-0a54-40f4-ab5b-96c8b9352ce8","type":"DatetimeTicker"},{"attributes":{"base":24,"mantissas":[1,2,4,6,8,12],"max_interval":43200000.0,"min_interval":3600000.0,"num_minor_ticks":0},"id":"30aaf6bc-398a-496d-afc4-432fa600f246","type":"AdaptiveTicker"},{"attributes":{"months":[0,4,8]},"id":"0b392838-c5a8-4494-b8c3-f33f29b56b19","type":"MonthsTicker"},{"attributes":{"callback":null,"column_names":["x","y"],"data":{"x":[1340146800000.0,1372028400000.0,1475881200000.0,1487721600000.0,1340060400000.0,1475276400000.0,1481587200000.0,1472770800000.0,1449878400000.0,1472943600000.0,1384560000000.0,1336258800000.0,1405983600000.0,1446768000000.0,1446681600000.0,1473721200000.0,1474671600000.0,1446595200000.0,1469574000000.0,1483315200000.0,1465513200000.0,1474498800000.0,1464735600000.0,1460588400000.0,1468018800000.0,1471734000000.0,1419552000000.0,1430089200000.0,1480464000000.0,1488585600000.0,1484352000000.0,1415404800000.0,1446854400000.0,1482537600000.0,1473030000000.0,1483056000000.0,1459638000000.0,1472857200000.0,1471474800000.0,1486425600000.0,1476486000000.0,1476399600000.0,1485907200000.0,1480032000000.0,1467932400000.0,1426896000000.0,1461279600000.0,1481241600000.0,1339196400000.0,1468105200000.0,1464994800000.0,1475622000000.0,1473289200000.0,1460502000000.0,1459119600000.0,1485043200000.0,1430694000000.0,1457136000000.0,1479772800000.0,1486771200000.0,1409958000000.0,1480118400000.0,1484265600000.0,1481500800000.0,1467846000000.0,1473894000000.0,1483574400000.0,1470006000000.0,1426032000000.0,1455926400000.0,1462575600000.0,1443913200000.0,1474066800000.0,1485648000000.0,1483488000000.0,1458000000000.0,1477004400000.0,1462921200000.0,1335999600000.0,1478044800000.0,1468623600000.0,1470351600000.0,1481932800000.0,1475017200000.0,1471820400000.0,1428793200000.0,1485216000000.0,1420675200000.0,1435359600000.0,1336172400000.0,1472684400000.0,1446422400000.0,1468796400000.0,1449964800000.0,1487030400000.0,1461970800000.0,1471388400000.0,1462662000000.0,1466982000000.0,1409785200000.0,1470092400000.0,1481760000000.0,1467759600000.0,1483401600000.0,1462489200000.0,1473548400000.0,1463180400000.0,1479945600000.0,1484697600000.0,1387843200000.0,1474412400000.0,1384473600000.0,1473634800000.0,1461193200000.0,1402009200000.0,1426809600000.0,1461452400000.0,1480982400000.0,1477350000000.0,1379545200000.0,1466463600000.0,1488326400000.0,1336777200000.0,1473807600000.0,1426636800000.0,1405206000000.0,1460156400000.0,1474844400000.0,1475535600000.0,1462057200000.0,1425081600000.0,1486166400000.0,1421452800000.0,1339110000000.0,1477695600000.0,1478822400000.0,1419379200000.0,1488153600000.0,1475190000000.0,1460934000000.0,1471647600000.0,1473980400000.0,1452211200000.0,1410649200000.0,1456444800000.0,1431212400000.0,1450483200000.0,1468710000000.0,1442012400000.0,1440198000000.0,1417478400000.0,1463007600000.0,1486944000000.0,1434754800000.0,1476918000000.0,1459724400000.0,1469487600000.0,1443826800000.0,1420243200000.0,1391299200000.0,1474930800000.0,1380150000000.0,1484870400000.0,1387411200000.0,1483920000000.0,1396738800000.0,1477090800000.0,1477522800000.0,1482364800000.0,1454284800000.0,1488412800000.0,1447545600000.0,1482451200000.0,1457913600000.0,1413673200000.0,1460242800000.0,1400108400000.0,1467154800000.0,1477436400000.0,1476658800000.0,1427500800000.0,1447718400000.0,1396306800000.0,1453161600000.0,1430262000000.0,1441407600000.0,1470610800000.0,1470178800000.0,1450915200000.0,1469142000000.0,1438556400000.0,1430780400000.0,1423872000000.0,1428274800000.0,1415059200000.0,1431990000000.0,1467327600000.0,1443654000000.0,1467414000000.0,1422576000000.0,1418688000000.0,1474153200000.0,1443567600000.0,1447372800000.0,1475794800000.0,1459292400000.0,1453852800000.0,1485129600000.0,1391040000000.0,1475362800000.0,1461366000000.0,1470265200000.0,1421366400000.0,1485820800000.0,1487289600000.0,1461106800000.0,1484956800000.0,1396911600000.0,1340924400000.0,1448755200000.0,1406156400000.0,1436914800000.0,1466809200000.0,1418947200000.0,1450310400000.0,1476831600000.0,1487376000000.0,1417996800000.0,1457308800000.0,1469660400000.0,1388534400000.0,1486684800000.0,1410217200000.0,1404428400000.0,1417824000000.0,1452124800000.0,1421539200000.0,1446508800000.0,1406415600000.0,1487808000000.0,1468537200000.0,1390262400000.0,1446940800000.0,1399330800000.0,1441839600000.0,1468882800000.0,1443222000000.0,1419465600000.0,1385337600000.0,1395792000000.0,1419984000000.0,1469228400000.0,1458345600000.0,1431817200000.0,1458432000000.0,1461798000000.0,1380063600000.0,1441321200000.0,1405292400000.0,1483142400000.0,1485475200000.0,1472598000000.0,1478476800000.0,1474326000000.0,1483228800000.0,1454976000000.0,1433026800000.0,1484611200000.0,1393891200000.0,1412982000000.0,1461538800000.0,1445817600000.0,1484179200000.0,1485388800000.0,1384300800000.0,1417392000000.0,1474758000000.0,1458691200000.0,1475103600000.0,1346281200000.0,1456790400000.0,1394582400000.0,1422662400000.0,1439766000000.0,1422489600000.0,1409439600000.0,1432162800000.0,1413759600000.0,1434063600000.0,1341615600000.0,1335222000000.0,1374274800000.0,1420070400000.0,1343775600000.0,1425168000000.0,1487635200000.0,1421020800000.0,1331942400000.0,1409871600000.0,1365375600000.0,1463439600000.0,1452902400000.0,1415232000000.0,1481068800000.0,1393545600000.0,1435878000000.0,1482883200000.0,1455667200000.0,1379804400000.0,1401318000000.0,1430607600000.0,1438988400000.0,1470697200000.0,1398207600000.0,1398294000000.0,1389139200000.0,1464562800000.0,1446336000000.0,1442617200000.0,1423440000000.0,1458604800000.0,1457740800000.0,1421280000000.0,1477872000000.0,1457395200000.0,1379458800000.0,1424217600000.0,1436828400000.0,1430175600000.0,1387670400000.0,1482192000000.0,1414018800000.0,1480636800000.0,1406242800000.0,1471042800000.0,1436742000000.0,1437346800000.0,1448150400000.0,1481846400000.0,1336604400000.0,1445295600000.0,1476572400000.0,1442962800000.0,1417219200000.0,1396652400000.0,1342825200000.0,1389744000000.0,1420329600000.0,1391644800000.0,1395187200000.0,1390608000000.0,1431903600000.0,1475708400000.0,1386633600000.0,1447804800000.0,1349910000000.0,1410044400000.0,1482969600000.0,1467500400000.0,1473202800000.0,1431644400000.0,1404687600000.0,1443740400000.0,1478649600000.0,1450137600000.0,1482710400000.0,1484784000000.0,1458777600000.0,1482105600000.0,1443135600000.0,1403391600000.0,1412722800000.0,1412031600000.0,1396220400000.0,1479254400000.0,1394064000000.0,1486339200000.0,1435532400000.0,1400540400000.0,1444863600000.0,1434668400000.0,1337727600000.0,1470524400000.0,1421712000000.0,1427756400000.0,1420761600000.0,1349218800000.0,1332716400000.0,1452988800000.0,1459378800000.0,1430348400000.0,1480377600000.0,1487116800000.0,1456358400000.0,1429052400000.0,1427670000000.0,1397084400000.0,1465426800000.0,1481155200000.0,1432681200000.0,1450742400000.0,1445122800000.0,1397257200000.0,1379977200000.0,1450828800000.0,1389916800000.0,1452729600000.0,1444345200000.0,1427587200000.0,1413846000000.0,1428015600000.0,1433718000000.0,1462143600000.0,1345158000000.0,1422316800000.0,1462402800000.0,1332547200000.0,1447632000000.0,1472166000000.0,1400713200000.0,1443308400000.0,1471215600000.0,1351468800000.0,1429743600000.0,1354147200000.0,1340665200000.0,1476313200000.0,1455321600000.0,1335826800000.0,1424563200000.0,1386892800000.0,1435014000000.0,1460761200000.0,1469055600000.0,1453420800000.0,1417564800000.0,1472338800000.0,1459810800000.0,1385424000000.0,1410735600000.0,1478908800000.0,1347750000000.0,1447891200000.0,1335135600000.0,1393632000000.0,1487980800000.0,1380236400000.0,1441753200000.0,1426982400000.0,1476054000000.0,1455235200000.0,1425772800000.0,1447027200000.0,1397170800000.0,1462316400000.0,1347922800000.0,1430866800000.0,1424908800000.0,1488067200000.0,1439593200000.0,1387238400000.0,1403737200000.0,1451520000000.0,1351814400000.0,1406674800000.0,1461020400000.0,1447286400000.0,1478563200000.0,1385510400000.0,1455840000000.0,1337295600000.0,1451606400000.0,1331078400000.0,1435964400000.0,1479168000000.0,1402441200000.0,1334444400000.0,1345330800000.0,1482019200000.0,1385164800000.0,1351033200000.0,1461625200000.0,1488499200000.0,1470956400000.0,1427842800000.0,1482278400000.0,1416700800000.0,1385596800000.0,1459897200000.0,1484092800000.0,1397775600000.0,1485302400000.0,1408057200000.0,1410303600000.0,1443394800000.0,1405465200000.0,1336086000000.0,1413327600000.0,1447200000000.0,1423958400000.0,1406329200000.0,1411254000000.0,1466550000000.0,1481328000000.0,1355011200000.0,1432335600000.0,1379631600000.0,1448496000000.0,1486512000000.0,1457222400000.0,1440457200000.0,1477609200000.0,1454630400000.0,1411599600000.0,1464822000000.0,1464217200000.0,1438383600000.0,1424736000000.0,1487548800000.0,1379890800000.0,1330300800000.0,1474239600000.0,1460070000000.0,1340319600000.0,1480291200000.0,1330646400000.0,1454371200000.0],"y":[131,96,57,56,46,33,22,22,20,18,17,15,14,13,13,12,12,12,11,11,11,11,11,11,11,11,10,10,10,10,10,9,9,9,9,9,9,9,9,8,8,8,8,8,8,8,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}},"id":"c61b7091-033b-4bc8-a1a8-14f7f1876f47","type":"ColumnDataSource"},{"attributes":{"callback":null},"id":"ee08cfc3-25a3-4276-b0a9-d12d35421496","type":"DataRange1d"},{"attributes":{"bottom_units":"screen","fill_alpha":{"value":0.5},"fill_color":{"value":"lightgrey"},"left_units":"screen","level":"overlay","line_alpha":{"value":1.0},"line_color":{"value":"black"},"line_dash":[4,4],"line_width":{"value":2},"plot":null,"render_mode":"css","right_units":"screen","top_units":"screen"},"id":"38238651-9353-4eab-9e92-5cf49b2ace0f","type":"BoxAnnotation"},{"attributes":{"dimension":1,"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"},"ticker":{"id":"80ba28e4-6cad-4d1b-8569-a66a4da99cd5","type":"BasicTicker"}},"id":"4d68772f-ea84-436d-8de3-b3d3bbe47f20","type":"Grid"},{"attributes":{"background_fill_color":{"value":"#E8DDCB"},"below":[{"id":"1eeb9e66-c287-4c5e-b4ae-fd98afdd20f5","type":"DatetimeAxis"}],"left":[{"id":"dd14704b-2fff-4e4e-98c5-8d263a5ea571","type":"LinearAxis"}],"renderers":[{"id":"1eeb9e66-c287-4c5e-b4ae-fd98afdd20f5","type":"DatetimeAxis"},{"id":"204d56d1-84d0-401e-9732-0d94230a0665","type":"Grid"},{"id":"dd14704b-2fff-4e4e-98c5-8d263a5ea571","type":"LinearAxis"},{"id":"4d68772f-ea84-436d-8de3-b3d3bbe47f20","type":"Grid"},{"id":"38238651-9353-4eab-9e92-5cf49b2ace0f","type":"BoxAnnotation"},{"id":"5d2da22e-9f06-4b15-9bc7-b080f0a31422","type":"GlyphRenderer"}],"title":{"id":"ff4a3919-a50b-46ef-96d4-271662a5aeaa","type":"Title"},"tool_events":{"id":"2ae43d25-1e63-4acf-92c8-a94a6d75fa7f","type":"ToolEvents"},"toolbar":{"id":"d42b6bf4-32e8-4189-9514-09ab182dec93","type":"Toolbar"},"x_range":{"id":"ee08cfc3-25a3-4276-b0a9-d12d35421496","type":"DataRange1d"},"y_range":{"id":"ca3b9d1e-5f94-441e-b8d4-70e91b9b88dd","type":"DataRange1d"}},"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"#1f77b4"},"line_alpha":{"value":0.1},"line_color":{"value":"#1f77b4"},"x":{"field":"x"},"y":{"field":"y"}},"id":"3d0bab81-dfd3-410f-b73e-f0775b789337","type":"Circle"},{"attributes":{},"id":"2ae43d25-1e63-4acf-92c8-a94a6d75fa7f","type":"ToolEvents"},{"attributes":{"months":[0,1,2,3,4,5,6,7,8,9,10,11]},"id":"fb21e44c-ff1d-4346-8e54-80edb7f0754a","type":"MonthsTicker"},{"attributes":{"days":[1,4,7,10,13,16,19,22,25,28]},"id":"f75a99d6-db18-4955-a4bb-c0fc1b08c3a5","type":"DaysTicker"},{"attributes":{"days":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]},"id":"1ccd9199-ff01-4503-ab18-afb4fb73e12a","type":"DaysTicker"},{"attributes":{"months":[0,6]},"id":"17bdb072-f663-48b4-9696-06986d490bc1","type":"MonthsTicker"},{"attributes":{"axis_label":"Time","formatter":{"id":"ebc0b741-0f3b-44bc-8ded-827ecef83be2","type":"DatetimeTickFormatter"},"plot":{"id":"cadcc77a-f648-42aa-a55b-668dacefbb18","subtype":"Figure","type":"Plot"},"ticker":{"id":"574f3fec-0a54-40f4-ab5b-96c8b9352ce8","type":"DatetimeTicker"}},"id":"1eeb9e66-c287-4c5e-b4ae-fd98afdd20f5","type":"DatetimeAxis"}],"root_ids":["cadcc77a-f648-42aa-a55b-668dacefbb18"]},"title":"Bokeh Application","version":"0.12.4"}};
            var render_items = [{"docid":"7d09fd8c-3280-4d37-ab26-b737942c6559","elementid":"410736d5-1a85-4d12-84bb-ed6fd5179284","modelid":"cadcc77a-f648-42aa-a55b-668dacefbb18"}];
            
            Bokeh.embed.embed_items(docs_json, render_items);
          };
          if (document.readyState != "loading") fn();
          else document.addEventListener("DOMContentLoaded", fn);
        })();
      },
      function(Bokeh) {
      }
    ];
  
    function run_inline_js() {
      
      if ((window.Bokeh !== undefined) || (force === true)) {
        for (var i = 0; i < inline_js.length; i++) {
          inline_js[i](window.Bokeh);
        }if (force === true) {
          display_loaded();
        }} else if (Date.now() < window._bokeh_timeout) {
        setTimeout(run_inline_js, 100);
      } else if (!window._bokeh_failed_load) {
        console.log("Bokeh: BokehJS failed to load within specified timeout.");
        window._bokeh_failed_load = true;
      } else if (force !== true) {
        var cell = $(document.getElementById("410736d5-1a85-4d12-84bb-ed6fd5179284")).parents('.cell').data().cell;
        cell.output_area.append_execute_result(NB_LOAD_WARNING)
      }
  
    }
  
    if (window._bokeh_is_loading === 0) {
      console.log("Bokeh: BokehJS loaded, going straight to plotting");
      run_inline_js();
    } else {
      load_libs(js_urls, function() {
        console.log("Bokeh: BokehJS plotting callback run at", now());
        run_inline_js();
      });
    }
  }(this));
</script>


<script type="text/javascript">

  (function(global) {
    function now() {
      return new Date();
    }
  
    var force = false;
  
    if (typeof (window._bokeh_onload_callbacks) === "undefined" || force === true) {
      window._bokeh_onload_callbacks = [];
      window._bokeh_is_loading = undefined;
    }
  
  
    
    if (typeof (window._bokeh_timeout) === "undefined" || force === true) {
      window._bokeh_timeout = Date.now() + 0;
      window._bokeh_failed_load = false;
    }
  
    var NB_LOAD_WARNING = {'data': {'text/html':
       "<div style='background-color: #fdd'>\n"+
       "<p>\n"+
       "BokehJS does not appear to have successfully loaded. If loading BokehJS from CDN, this \n"+
       "may be due to a slow or bad network connection. Possible fixes:\n"+
       "</p>\n"+
       "<ul>\n"+
       "<li>re-rerun `output_notebook()` to attempt to load from CDN again, or</li>\n"+
       "<li>use INLINE resources instead, as so:</li>\n"+
       "</ul>\n"+
       "<code>\n"+
       "from bokeh.resources import INLINE\n"+
       "output_notebook(resources=INLINE)\n"+
       "</code>\n"+
       "</div>"}};
  
    function display_loaded() {
      if (window.Bokeh !== undefined) {
        document.getElementById("8772e140-5a33-44e1-bdf0-151cc9c6e979").textContent = "BokehJS successfully loaded.";
      } else if (Date.now() < window._bokeh_timeout) {
        setTimeout(display_loaded, 100)
      }
    }
  
    function run_callbacks() {
      window._bokeh_onload_callbacks.forEach(function(callback) { callback() });
      delete window._bokeh_onload_callbacks
      console.info("Bokeh: all callbacks have finished");
    }
  
    function load_libs(js_urls, callback) {
      window._bokeh_onload_callbacks.push(callback);
      if (window._bokeh_is_loading > 0) {
        console.log("Bokeh: BokehJS is being loaded, scheduling callback at", now());
        return null;
      }
      if (js_urls == null || js_urls.length === 0) {
        run_callbacks();
        return null;
      }
      console.log("Bokeh: BokehJS not loaded, scheduling load and callback at", now());
      window._bokeh_is_loading = js_urls.length;
      for (var i = 0; i < js_urls.length; i++) {
        var url = js_urls[i];
        var s = document.createElement('script');
        s.src = url;
        s.async = false;
        s.onreadystatechange = s.onload = function() {
          window._bokeh_is_loading--;
          if (window._bokeh_is_loading === 0) {
            console.log("Bokeh: all BokehJS libraries loaded");
            run_callbacks()
          }
        };
        s.onerror = function() {
          console.warn("failed to load library " + url);
        };
        console.log("Bokeh: injecting script tag for BokehJS library: ", url);
        document.getElementsByTagName("head")[0].appendChild(s);
      }
    };var element = document.getElementById("8772e140-5a33-44e1-bdf0-151cc9c6e979");
    if (element == null) {
      console.log("Bokeh: ERROR: autoload.js configured with elementid '8772e140-5a33-44e1-bdf0-151cc9c6e979' but no matching script tag was found. ")
      return false;
    }
  
    var js_urls = [];
  
    var inline_js = [
      function(Bokeh) {
        (function() {
          var fn = function() {
            var docs_json = {"0907e6f2-8dcd-40ed-91c0-b9bb8777e717":{"roots":{"references":[{"attributes":{"max_interval":500.0,"num_minor_ticks":0},"id":"9a19a3d1-ad52-4a78-a823-f17f33b7696c","type":"AdaptiveTicker"},{"attributes":{"days":[1,8,15,22]},"id":"d50a516d-f990-430f-97e9-9f014b0fc080","type":"DaysTicker"},{"attributes":{"base":60,"mantissas":[1,2,5,10,15,20,30],"max_interval":1800000.0,"min_interval":1000.0,"num_minor_ticks":0},"id":"72ef9b6b-8714-4675-8230-555845e5d16a","type":"AdaptiveTicker"},{"attributes":{"axis_label":"Time","formatter":{"id":"563daa89-db89-44c8-a4fb-8cbbd03c1e5a","type":"DatetimeTickFormatter"},"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"},"ticker":{"id":"67f2287e-4965-4643-9ded-3a48955d2289","type":"DatetimeTicker"}},"id":"6ec990ef-1a60-441d-84d8-7df5aadf0bd9","type":"DatetimeAxis"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"532a5711-1655-4c77-aa2d-be21311a94bf","type":"PanTool"},{"attributes":{"months":[0,6]},"id":"86b62c05-6026-4784-8bfd-3fbaa10ac256","type":"MonthsTicker"},{"attributes":{"base":24,"mantissas":[1,2,4,6,8,12],"max_interval":43200000.0,"min_interval":3600000.0,"num_minor_ticks":0},"id":"db0eb25c-e99f-41cb-ba82-47d578badbe7","type":"AdaptiveTicker"},{"attributes":{"dimension":1,"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"},"ticker":{"id":"fc6ce39e-8e98-4595-ac58-1f3674e8452e","type":"BasicTicker"}},"id":"882965e5-5017-4313-82f2-1c9bba7b06fb","type":"Grid"},{"attributes":{"months":[0,4,8]},"id":"83ce2ab9-e6be-44fa-b472-6f0ce6a671f9","type":"MonthsTicker"},{"attributes":{"months":[0,1,2,3,4,5,6,7,8,9,10,11]},"id":"a040ecad-b06f-4528-8fbc-b9f2672d4b9b","type":"MonthsTicker"},{"attributes":{},"id":"4245bcaf-c40a-4268-8611-c2ee9ae8a385","type":"BasicTickFormatter"},{"attributes":{"axis_label":"# of pics","formatter":{"id":"4245bcaf-c40a-4268-8611-c2ee9ae8a385","type":"BasicTickFormatter"},"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"},"ticker":{"id":"fc6ce39e-8e98-4595-ac58-1f3674e8452e","type":"BasicTicker"}},"id":"d00ff6ad-3f6f-48fb-b9c5-97959a26abe4","type":"LinearAxis"},{"attributes":{},"id":"6feb6ccc-2422-4f34-afa9-d497da6808c7","type":"YearsTicker"},{"attributes":{"callback":null,"column_names":["x","y"],"data":{"x":[1338505200000.0,1472684400000.0,1475276400000.0,1485907200000.0,1370041200000.0,1483228800000.0,1480550400000.0,1467327600000.0,1446336000000.0,1459465200000.0,1470006000000.0,1477958400000.0,1464735600000.0,1456790400000.0,1448928000000.0,1462057200000.0,1335826800000.0,1417392000000.0,1425168000000.0,1404169200000.0,1383264000000.0,1420070400000.0,1427842800000.0,1430434800000.0,1409526000000.0,1454284800000.0,1441062000000.0,1488326400000.0,1443654000000.0,1451606400000.0,1396306800000.0,1377990000000.0,1414800000000.0,1433113200000.0,1438383600000.0,1422748800000.0,1385856000000.0,1412118000000.0,1393632000000.0,1388534400000.0,1398898800000.0,1401577200000.0,1435705200000.0,1330560000000.0,1343775600000.0,1391212800000.0,1349046000000.0,1406847600000.0,1333234800000.0,1341097200000.0,1351728000000.0,1346454000000.0,1328054400000.0,1354320000000.0,1364770800000.0,1372633200000.0],"y":[191,157,155,106,96,87,86,78,74,72,62,51,45,39,35,35,33,31,30,30,29,28,25,24,22,21,19,18,18,15,15,15,14,13,11,11,11,10,10,10,8,7,7,5,5,5,4,3,3,2,2,2,1,1,1,1]}},"id":"f80ea01a-9d38-4377-9fc0-f06ab4223524","type":"ColumnDataSource"},{"attributes":{},"id":"f3e779b3-71a4-4d8e-9905-ce0c2f134ea1","type":"ToolEvents"},{"attributes":{"overlay":{"id":"f13baa0d-c049-4921-b628-fe5c204229b6","type":"BoxAnnotation"},"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"c214e482-02d8-45b6-a0f0-192e5e74129e","type":"BoxZoomTool"},{"attributes":{"bottom_units":"screen","fill_alpha":{"value":0.5},"fill_color":{"value":"lightgrey"},"left_units":"screen","level":"overlay","line_alpha":{"value":1.0},"line_color":{"value":"black"},"line_dash":[4,4],"line_width":{"value":2},"plot":null,"render_mode":"css","right_units":"screen","top_units":"screen"},"id":"f13baa0d-c049-4921-b628-fe5c204229b6","type":"BoxAnnotation"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"d4a9ecf9-6ab8-4cd2-a310-9b440903361a","type":"ResetTool"},{"attributes":{},"id":"563daa89-db89-44c8-a4fb-8cbbd03c1e5a","type":"DatetimeTickFormatter"},{"attributes":{"days":[1,15]},"id":"d9cb586d-41c4-4c02-a260-fbe0b018aad9","type":"DaysTicker"},{"attributes":{"callback":null},"id":"12e044f6-e650-4ca5-9d63-f132c572ed3f","type":"DataRange1d"},{"attributes":{"background_fill_color":{"value":"#E8DDCB"},"below":[{"id":"6ec990ef-1a60-441d-84d8-7df5aadf0bd9","type":"DatetimeAxis"}],"left":[{"id":"d00ff6ad-3f6f-48fb-b9c5-97959a26abe4","type":"LinearAxis"}],"renderers":[{"id":"6ec990ef-1a60-441d-84d8-7df5aadf0bd9","type":"DatetimeAxis"},{"id":"009952b1-fbac-4901-aaae-a15dfae57afe","type":"Grid"},{"id":"d00ff6ad-3f6f-48fb-b9c5-97959a26abe4","type":"LinearAxis"},{"id":"882965e5-5017-4313-82f2-1c9bba7b06fb","type":"Grid"},{"id":"f13baa0d-c049-4921-b628-fe5c204229b6","type":"BoxAnnotation"},{"id":"1dea694e-7597-4319-9bd1-3b5a9e04e2a0","type":"GlyphRenderer"}],"title":{"id":"f1e9823b-beb3-44e2-b86a-31e4065a954e","type":"Title"},"tool_events":{"id":"f3e779b3-71a4-4d8e-9905-ce0c2f134ea1","type":"ToolEvents"},"toolbar":{"id":"b4b1b50d-ab60-4786-961d-8767aab307ad","type":"Toolbar"},"x_range":{"id":"242186e7-bea5-43dc-9676-83e7a17e775d","type":"DataRange1d"},"y_range":{"id":"12e044f6-e650-4ca5-9d63-f132c572ed3f","type":"DataRange1d"}},"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"},{"attributes":{"fill_color":{"value":"#1f77b4"},"line_color":{"value":"#1f77b4"},"x":{"field":"x"},"y":{"field":"y"}},"id":"9ddf4835-9520-43f8-b310-2223dfa8f396","type":"Circle"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"6209186c-1243-470e-a94e-c9b1642bb277","type":"HelpTool"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"c4ebd928-f105-4c47-a9dc-e34e1586e3cc","type":"WheelZoomTool"},{"attributes":{"months":[0,2,4,6,8,10]},"id":"23436028-b57e-4e71-a1c4-42c18fa04215","type":"MonthsTicker"},{"attributes":{"active_drag":"auto","active_scroll":"auto","active_tap":"auto","tools":[{"id":"532a5711-1655-4c77-aa2d-be21311a94bf","type":"PanTool"},{"id":"c4ebd928-f105-4c47-a9dc-e34e1586e3cc","type":"WheelZoomTool"},{"id":"c214e482-02d8-45b6-a0f0-192e5e74129e","type":"BoxZoomTool"},{"id":"e067d5b1-713c-49be-9ec0-64c2b4825f9c","type":"SaveTool"},{"id":"d4a9ecf9-6ab8-4cd2-a310-9b440903361a","type":"ResetTool"},{"id":"6209186c-1243-470e-a94e-c9b1642bb277","type":"HelpTool"}]},"id":"b4b1b50d-ab60-4786-961d-8767aab307ad","type":"Toolbar"},{"attributes":{"plot":null,"text":"Pics per month"},"id":"f1e9823b-beb3-44e2-b86a-31e4065a954e","type":"Title"},{"attributes":{"num_minor_ticks":5},"id":"67f2287e-4965-4643-9ded-3a48955d2289","type":"DatetimeTicker"},{"attributes":{},"id":"fc6ce39e-8e98-4595-ac58-1f3674e8452e","type":"BasicTicker"},{"attributes":{"fill_alpha":{"value":0.1},"fill_color":{"value":"#1f77b4"},"line_alpha":{"value":0.1},"line_color":{"value":"#1f77b4"},"x":{"field":"x"},"y":{"field":"y"}},"id":"374d6699-6101-4cf8-86fb-d8a77d7f5c22","type":"Circle"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"},"ticker":{"id":"67f2287e-4965-4643-9ded-3a48955d2289","type":"DatetimeTicker"}},"id":"009952b1-fbac-4901-aaae-a15dfae57afe","type":"Grid"},{"attributes":{"days":[1,4,7,10,13,16,19,22,25,28]},"id":"0c6e87b1-7707-4f7a-bd8d-ca409633bce5","type":"DaysTicker"},{"attributes":{"callback":null},"id":"242186e7-bea5-43dc-9676-83e7a17e775d","type":"DataRange1d"},{"attributes":{"plot":{"id":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce","subtype":"Figure","type":"Plot"}},"id":"e067d5b1-713c-49be-9ec0-64c2b4825f9c","type":"SaveTool"},{"attributes":{"days":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]},"id":"3f89dd3c-210e-40b0-871e-287a87fdfa18","type":"DaysTicker"},{"attributes":{"data_source":{"id":"f80ea01a-9d38-4377-9fc0-f06ab4223524","type":"ColumnDataSource"},"glyph":{"id":"9ddf4835-9520-43f8-b310-2223dfa8f396","type":"Circle"},"hover_glyph":null,"nonselection_glyph":{"id":"374d6699-6101-4cf8-86fb-d8a77d7f5c22","type":"Circle"},"selection_glyph":null},"id":"1dea694e-7597-4319-9bd1-3b5a9e04e2a0","type":"GlyphRenderer"}],"root_ids":["a9baf0e3-930a-4f76-9400-5ad0893bf1ce"]},"title":"Bokeh Application","version":"0.12.4"}};
            var render_items = [{"docid":"0907e6f2-8dcd-40ed-91c0-b9bb8777e717","elementid":"8772e140-5a33-44e1-bdf0-151cc9c6e979","modelid":"a9baf0e3-930a-4f76-9400-5ad0893bf1ce"}];
            
            Bokeh.embed.embed_items(docs_json, render_items);
          };
          if (document.readyState != "loading") fn();
          else document.addEventListener("DOMContentLoaded", fn);
        })();
      },
      function(Bokeh) {
      }
    ];
  
    function run_inline_js() {
      
      if ((window.Bokeh !== undefined) || (force === true)) {
        for (var i = 0; i < inline_js.length; i++) {
          inline_js[i](window.Bokeh);
        }if (force === true) {
          display_loaded();
        }} else if (Date.now() < window._bokeh_timeout) {
        setTimeout(run_inline_js, 100);
      } else if (!window._bokeh_failed_load) {
        console.log("Bokeh: BokehJS failed to load within specified timeout.");
        window._bokeh_failed_load = true;
      } else if (force !== true) {
        var cell = $(document.getElementById("8772e140-5a33-44e1-bdf0-151cc9c6e979")).parents('.cell').data().cell;
        cell.output_area.append_execute_result(NB_LOAD_WARNING)
      }
  
    }
  
    if (window._bokeh_is_loading === 0) {
      console.log("Bokeh: BokehJS loaded, going straight to plotting");
      run_inline_js();
    } else {
      load_libs(js_urls, function() {
        console.log("Bokeh: BokehJS plotting callback run at", now());
        run_inline_js();
      });
    }
  }(this));
</script>

