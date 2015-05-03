# Spritey SVG

Simple SVG sprite generator. No fallbacks, no css; just pure SVG goodness. This makes `symbol` like sprites out of svgs.

## Usage

Spritey svg has a cli so you can install it globally and use it anywhere.

```shell
npm i spritey-svg -g
```

Then all you need to pass sprity is a glob path to your svg files.

```shell
spritey --files assets/icons/*.svg
```

Now you should see the data streaming out to your terminal. You can also output to a file.

```shell
spritey --files assets/icons/*.svg --output assets/icons.svg
```

This will output the sprite to the svg file.

### Javascript API

Spritey SVG also has a Javascript API.

```javascript
const spritey = require('spritey-svg');

sprity({
  files: [...],
  output: fs.createWriteStream('assets/icons.svg')
});
```
