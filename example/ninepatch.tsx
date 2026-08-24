import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NinePatchSkinView, nativeFrameSize, nativeScreenSlot, iosNinePatchSkin, androidNinePatchSkin } from '../src';

// Distinct screen resolutions from `aws devicefarm list-devices`.
const IOS_PRESETS: [string, number, number][] = [
  ['iPhone 16 Pro (1206x2622)', 1206, 2622],
  ['iPhone 16 Pro Max (1320x2868)', 1320, 2868],
  ['iPhone 15 / 16 (1179x2556)', 1179, 2556],
  ['iPhone 15 Plus (1290x2796)', 1290, 2796],
  ['iPhone Air (1260x2736)', 1260, 2736],
  ['iPhone 13 / 16e (1170x2532)', 1170, 2532],
  ['iPhone 13 Pro Max (1284x2778)', 1284, 2778],
  ['iPhone 12 mini (1080x2340)', 1080, 2340],
  ['iPhone X / 11 Pro (1125x2436)', 1125, 2436],
  ['iPhone XR / 11 (828x1792)', 828, 1792],
  ['iPhone 8 / SE (750x1334)', 750, 1334],
  ['iPad 9th gen (1620x2160)', 1620, 2160],
  ['iPad Air 11 (1640x2360)', 1640, 2360],
  ['iPad mini (1488x2266)', 1488, 2266],
  ['iPad Pro 11 (1668x2388)', 1668, 2388],
  ['iPad Pro 12.9 (2048x2732)', 2048, 2732],
  ['iPad Pro 13 (2064x2752)', 2064, 2752],
];

const ANDROID_PRESETS: [string, number, number][] = [
  ['Pixel 9 (1080x2424)', 1080, 2424],
  ['Pixel 9 Pro XL (1344x2992)', 1344, 2992],
  ['Pixel 7a / 8 / 8a (1080x2400)', 1080, 2400],
  ['Pixel 8 Pro (1344x2992)', 1344, 2992],
  ['Galaxy S24 Ultra (1440x3120)', 1440, 3120],
  ['Galaxy S22-S25 (1080x2340)', 1080, 2340],
  ['Galaxy S21 Ultra (1440x3200)', 1440, 3200],
  ['Galaxy S9 (1440x2960)', 1440, 2960],
  ['Galaxy A-series (1080x2400)', 1080, 2400],
  ['Galaxy Z Fold cover (1008x2244)', 1008, 2244],
  ['Pixel 5 (1080x2340)', 1080, 2340],
  ['Pixel 4a (1080x2340)', 1080, 2340],
  ['Budget 720p (720x1600)', 720, 1600],
  ['Pixel 9a (1080x2424)', 1080, 2424],
  ['Legacy 18:9 (1080x2160)', 1080, 2160],
];

const SKINS = {
  ios: { skin: iosNinePatchSkin, presets: IOS_PRESETS },
  android: { skin: androidNinePatchSkin, presets: ANDROID_PRESETS },
};

function App() {
  // Sliders set the rendered *screen* size in CSS px; the frame wraps around it.
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(650);
  const [platform, setPlatform] = useState<keyof typeof SKINS>('ios');
  const [isBooting, setIsBooting] = useState(false);
  const { skin, presets } = SKINS[platform];
  const screenSize = { width, height, scale: 1 };
  const frame = nativeFrameSize(skin, screenSize);
  // px per native unit so the screen slot is exactly width x height
  const scale = width / nativeScreenSlot(skin, screenSize).width;

  return (
    <>
      <div id="controls">
        <label>width <input type="range" min={100} max={900} value={width} onChange={(e) => setWidth(+e.target.value)} /> {width}</label>
        <label>height <input type="range" min={100} max={900} value={height} onChange={(e) => setHeight(+e.target.value)} /> {height}</label>
        <label>platform
          <select value={platform} onChange={(e) => setPlatform(e.target.value as keyof typeof SKINS)}>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </label>
        <label>preset
          <select onChange={(e) => { const [, w, h] = presets[+e.target.value]; setHeight(650); setWidth(Math.round(650 * w / h)); }}>
            {presets.map(([name], i) => <option key={name} value={i}>{name}</option>)}
          </select>
        </label>
        <label>booting <input type="checkbox" checked={isBooting} onChange={(e) => setIsBooting(e.target.checked)} /></label>
        <span>aspect {(width / height).toFixed(3)}</span>
      </div>
      <div id="stage">
        <div style={{ width: frame.width * scale, height: frame.height * scale }}>
          <NinePatchSkinView skin={skin} screenSize={screenSize} isBooting={isBooting}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#4facfe,#00f2fe)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 24 }}>
              {width}×{height}
            </div>
          </NinePatchSkinView>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
