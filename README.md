This is bunch of JS scripts I wrote to help me what type of monitor I should get next.
I was mostly concerned about phisical screen dimensions as well as display resolution
and all this is can be visually compared.

Note, this is tool I wrote just for my own purpse, so no fancy configs, nice looking
UI, sophisticated error handling nor other usual stuff. If you want to play with it,
you need to add specitfication of the displays you are comparing by directly editing
`compare.js` script. The `monitors_src` array holds monitors as separate objects, i.e.

```json
    {
        label: "Dell U3219Q",
        model: "b96b14f5",
        display: {w: 713, h: 415},
        resolution: {w: 3840, h: 2160, freq: 60},
    },
```

where
* `label` is any string you want to be used as display label (ensure it's unique though),
* `model` is display model ID from [www.displayspecifications.com](https://www.displayspecifications.com/) site I was using,
* `display` specifies `w`idth and `h`eight (in my case in milimeters, but units are irrelevant really) of the display,
* `resolution` specifies `w`idth, `h`eight (in pixles) and refresh `freq`uency of the display.

Once you set it all up, just use any web browser and open `index.html` file and that's it. You do **NOT** need any webserver
installed nor running. It's all local. Just type `file://<PATH TO WHERE YOU GOT THESE FILES STORED>/index.html` in your 
browser address bar and you should be good.

