import { launchDocsBrowser } from './browser-harness.mjs';
const b = await launchDocsBrowser(); const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto('http://localhost:8081/components/filters/', { waitUntil: 'networkidle0' });
const measure = () => p.evaluate(() => {
  const trig = document.querySelector('[popovertarget="view-menu"]');
  const menu = document.getElementById('view-menu');
  const t = trig.getBoundingClientRect(), m = menu.getBoundingClientRect();
  return { open: menu.matches(':popover-open'), gap: Math.round(m.top - t.bottom),
           menuTop: Math.round(m.top), trigBottom: Math.round(t.bottom) };
});
const scroll = async (by) => {
  await p.evaluate((by) => { document.querySelector('.bo-app-shell__main').scrollTop += by; }, by);
  await new Promise(r => setTimeout(r, 250));   // let the scroll event dispatch
};
await p.click('[popovertarget="view-menu"]');
await new Promise(r=>setTimeout(r,200));
console.log('on open           ', JSON.stringify(await measure()));
await scroll(250);
console.log('after scroll +250 ', JSON.stringify(await measure()));
await scroll(-120);
console.log('after scroll -120 ', JSON.stringify(await measure()));
await p.setViewport({ width: 1100, height: 900 });
await new Promise(r=>setTimeout(r,250));
console.log('after resize      ', JSON.stringify(await measure()));
await b.close();
