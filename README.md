# LS-Plugin

This is a Google Chrome extension to make life a little easier for PBHS's Support Team when creating Launch Survey forms.
It will scan the site for procedure pages and provide the relevant code snippet for the back-end and short-codes for the front-end, reducing the time needed for these labor-intensive setups by ~50%.

## How to use

- [Enable developer mode and install the plugin](https://developer.chrome.com/extensions/faq#:~:text=You%20can%20start%20by%20turning,a%20packaged%20extension%2C%20and%20more.)
  - I am stll deciding if I want to have a packed extention in this repo, but at the very least, you will be able to load it as an un-packed extention as-is.

### First Steps

- Navigate to a modern PBHS WordPress Website
- Check which menu items contain lists of procedures.
- Click the extension's icon to launch the application
- Check to ensure all procedure lists are included in the Procedure Lists section.

### Using the Forms

- All text form entries must be separated by a comma and space.
  - i.e. Thing1, Thing2, Thing3

**Add Form**

- If any lists are missing, type them in the "Procedure Lists" box in the Update Form section.
- If specific items need to be excluded from the list, they can be selected from the Exclusions List section.
  - Please note, some exclusions may be added automatically.
- If specific items need to be included, they can be added under Misc Items to Include.
- Click Update

**Removal Form**

Select items to be removed from the list
Click Update.

<hr>

_Code is written in HTML, CSS, and vanilla JS_

_LS-Plugin is purely a passion project, created to satisfy my creative urges while automating a task I found monotonous and time-consuming during my time employed at PBHS. This project is in no way sponsored or endorsed by PBHS, Inc._
