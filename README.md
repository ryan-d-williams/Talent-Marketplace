# Talent-Marketplace

Collection of scripts to automate talent marketplace operations

# Reorder your preferences

Reordering your preferences takes _forever_ if you drag it one-by-one. The following steps allow you to reorder them all at once

**NOTE: this script assumes you have already favorited all of the assignments you want ordered**

## Step 1: Get your position numbers in order

Each assignment has a position number. You can see the position number when you search for billets or when you are reordering your preferences.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/position_numbers_1.png?raw=true" width="350">
<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/position_numbers_2.png?raw=true" width="350">

<br/><br/>
I recommend using a spreadsheet to get your position numbers in order. To download all of the avaiable assignments as a spreadsheet, use the "Export To Excel" button from the "Search Billets" page.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/export_to_excel.png?raw=true">

## Step 2: Format the position numbers

The position numbers must be formatted in preference order with:

- Quotes around each position number (ex: "7769ABC")
- A comma separating each position number (ex: "7769ABC", "1234XYZ")
- Brackets around the first and last position number (ex: ["7769ABC", "1234XYZ", "7890RDW"])
- The highest preference (#1 preference) as the first number in the list

You can also use the [FormatPositionNumbers.xlsx](https://github.com/ryan-d-williams/Talent-Marketplace/raw/master/FormatPositionNumbers.xlsx) spreadsheet to do this for you. Just paste your ordered position numbers in the first column, and you can copy the formatted text from the third column.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/format_pos_nums_spreadsheet.png?raw=true">

NOTE: your position numbers must be in order. The script will rank the first position number as #1 in your preference list.

## Step 3: Run the script with your position numbers

Running the script consists of 6 steps (all very easy I promise):

1. Open the "Update Assignment Preferences" page on Talent Marketplace (**HIGHLY** recommend using Chrome - I have only tested this in Chrome)
2. Right click anywhere on the page, and click "Inspect" (a new window will appear)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/inspect.png?raw=true">

3. In the top row of buttons, click "Console"
4. Copy the below code into the console window, DON'T click enter yet

<details><summary>CLICK HERE TO UNHIDE CODE</summary>

https://github.com/ryan-d-williams/Talent-Marketplace/blob/d1deef4c2a943210586fa82b1918b061e8fceb0a/reorder_preferences.js

</details>

5. Change PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE to your formatted position numbers (line 2 of the code)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/code_paste.png?raw=true">

6. Click enter

You should now see text appear in the console to let you know how things are going (errors will appear with the description of what went wrong)

When it is done ("Done!" appears), refresh to see the changes

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/done.png?raw=true">
