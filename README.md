# YouTube Auto DisLike

## Presentation
A plugin that dislikes videos from channels you subscribe to, so you never forget to criticize your least favorite content creators. No login required.

Available in the [Firefox Add-ons store](https://addons.mozilla.org/en/firefox/addon/enhanced_youtube_auto_dislike/)

## Issues
You can report an issue [here](https://github.com/PatrickWaweru/youtube-auto-dislike/issues/new) and check the current [issues](https://github.com/PatrickWaweru/youtube-auto-dislike/issues).

## Internationalization

Do you know another language? _I sure don't._ Feel free to contribute with a [pull request](https://github.com/PatrickWaweru/youtube-auto-dislike/pulls), or grab [the JSON file](https://raw.githubusercontent.com/PatrickWaweru/youtube-auto-dislike/master/app/_locales/en/messages.json), translate it and [send it back to me](mailto:pg.developper.fr@gmail.com).

## Developers
The debug mode option can be displayed in the addon popup by entering the konami code while the addon popup is opened.<br>
:warning: `browser.storage.sync` can cause issues when loaded temporarily, change it by `browser.storage.local` in **scripts/option-manager.js**.<br>
[PR](https://github.com/PatrickWaweru/youtube-auto-dislike/pulls) are welcomed :)

## Credits
- [Taknok](https://github.com/Taknok/youtube-auto-like.git)
- [Austencm](https://github.com/austencm/youtube-auto-like)
- [DeadSix27](https://github.com/DeadSix27) ~ DE translation
- [JKetelaar](https://github.com/JKetelaar) ~ NL translation
- [Szmyk](https://github.com/Szmyk) ~ PL translation
- [Hultan](https://github.com/Hultan) ~ SV translation
- [C4H7Cl2O4P](https://github.com/C4H7Cl2O4P) ~ UK translation
- [Alexandre Pennetier](https://github.com/alexandre-pennetier) ~ FR translation
- [msmafra](https://github.com/msmafra) ~ PT translation
- [Plunts](https://github.com/Plunts) ~ DE translation + bug fix
- [GitMoleo](https://github.com/GitMoleo) ~ DE translation
- [Babico](https://github.com/babico) ~ TR translation

## Build

```
REF: https://www.npmjs.com/package/web-ext
REF: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
REF: https://aydos.com/svgedit/

npm install --global web-ext

NB: Get key and secret: https://addons.mozilla.org/en-US/developers/addon/api/key/

$ cd app/
$ web-ext run

run

    Run the extension

lint

    Validate the extension source

sign

    Sign the extension so it can be installed in Firefox

build

    Create an extension package from source

// Customize

$ web-ext build --overwrite-dest
$ web-ext sign --api-key=user:xxxxxx --api-secret=xxxxxx --id="{xxxxxxx}"

```

## Upstream Changes

```
app/scripts/modules/liker-paper.js
app/scripts/modules/liker-material.js

1. Add new function named attemptDisLike()
    /*
	 * Clickity click the button
	 */
	attemptDisLike() {
		this.btns.dislike.click();
	}

2. Replace the use of attemptLike() with attemptDisLike()
```

## Optional add the extension id into the manifest.json

```
	"browser_specific_settings": {
	    "gecko": {
	        "id": "{xxxxxxx}",
	        "strict_min_version": "57.0"
	    }
	},
```

## Extra Changes

```
        modified:   README.md
        new file:   app/.web-extension-id
        modified:   app/_locales/de/messages.json
        modified:   app/_locales/en/messages.json
        modified:   app/_locales/es/messages.json
        modified:   app/_locales/fr/messages.json
        modified:   app/_locales/nl/messages.json
        modified:   app/_locales/pl/messages.json
        modified:   app/_locales/pt_BR/messages.json
        modified:   app/_locales/sv/messages.json
        modified:   app/_locales/tr/messages.json
        modified:   app/_locales/uk/messages.json
        modified:   app/images/icon-128.png
        modified:   app/images/icon-16.png
        modified:   app/images/icon-19.png
        modified:   app/images/icon-32.png
        modified:   app/images/icon-38.png
        modified:   app/images/icon-48.png
        new file:   app/images/icon.path
        modified:   app/manage.html
        modified:   app/manifest.json
        modified:   app/options.html
        modified:   app/scripts/content.js
        modified:   app/scripts/modules/liker-material.js
        modified:   app/scripts/modules/liker-paper.js
        modified:   app/update_info.html
        new file:   app/web-ext-artifacts/ebe98577f70e4d848ea0-3.7.6.xpi
        modified:   assets/icon-inverted.psd
        modified:   assets/icon.ai
        new file:   assets/icon.path
        modified:   assets/icon.psd
        modified:   assets/icon.svg
        modified:   assets/promo/promo-marquee.jpg
        modified:   assets/promo/promo-medium.jpg
        modified:   assets/promo/promo-small.jpg
```

## Continous Developement
```
0468c5f07f3b28784c3f1c843da10dba1117e039 - Feb 5 2023 - done
7f17aae27bd50b8e543046eecdebb5a5a1f08bd9 - Feb 6 2023 - done
48b2da72801a8f02ade78a9fedca0e26989f4147 - Feb 6 2023 - done
cdb00c11eda9b0c54bdecfa03005dee215c2745b - Feb 6 2023 - done
42f674561d1b32e5afcc8e91192fb87602e7775f - Mar 17 2023 - done
0d6790384c3983cec917abeefcd7b4477fb0a7a0 - Mar 18 2023 -
4e4d51f7b5b0025b3928d3ee2711c056fb343404 - Mar 18 2023 -

```
