#  🎼 Drumbot

Drumbot is a fork from [noops-challenge/drumbot](https://github.com/noops-challenge/drumbot). The idea is to create a drum computer which is available in the browser. It should help students learn new rhythms and improve their timing. It uses the [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). The frontend is written in [React](https://reactjs.org/) and uses the [Mantine component library](https://mantine.dev/).

## How to use it

```
yarn install
yarn start
```

## Future outlook

* allow pattern changes in the UI
* allow custom sample sounds
* make the BPM configurable
* dynamic sounds for each track ([AudioContext.createGain](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createGain))
* move the sounds between left and right or provide better experience with 3D sound
    * [AudioContext.createStereoPanner()](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createStereoPanner)
    * [PannerNode](https://developer.mozilla.org/en-US/docs/Web/API/PannerNode)
    * [Linn LM-1](https://en.wikipedia.org/wiki/Linn_LM-1)
* improve the design continuously
* provide a pattern API
* add visualizations
    * sound meter ([AudioContext.createAnalyser](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser))


## Further reading

https://github.com/cwilso/metronome/blob/master/js/metronome.js
https://www.html5rocks.com/en/tutorials/audio/scheduling/
https://toolstud.io/music/bpm.php?bpm=120&bpm_unit=4%2F4
