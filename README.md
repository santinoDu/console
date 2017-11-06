# console.js

a console panel for mobile phone, replace alert.
https://www.npmjs.com/package/mobile-console.js

Preview
-------

### close status
<div align="center">
    <img src="images/close.png" />
</div>

### open status
<div align="center">
    <img src="images/open.png" />
</div>

### Build

``` bash
npm run build
```

### Install

``` bash
npm i mobile-console.js --save-dev
```

### ES6

```
import 'mobile-console.js';
new MobileConsole();
```

### Demo

open `tests/index.html`

### Feature

- Support showing console.log api output. (info, warn, error, debug)
- Support showing js error.
- Support showing xhr and fetch's request and response info. (default off)
