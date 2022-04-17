# Talent-Marketplace

Collection of scripts to automate talent marketplace operations

There are 2 scripts (as of right now).

1. The first (and most common) is if you have already favorited your assignments and just want an automated way to reorder them. [Click here for those instructions](#reorder-your-preferences)
2. The second is if you haven't already favorited your assignments and want a script to both favorite them and put them in the right order. [Click here for those instructions](#favorite-and-reorder-your-preferences)

Both should be able to be accomplished in just a few minutes (rather than a few hours of dragging and dropping)

Want more automation? Add your request as an issue!

[FAQ](#faq)

# Reorder your preferences

Reordering your preferences takes _forever_ if you drag it one-by-one. The following steps allow you to reorder them all at once

### **NOTE: this script assumes you have already favorited all of the assignments you want ordered. If you have not, see [this section](#favorite-and-reorder-your-preferences) for an automated way to favorite**

## Step 1: Get your position numbers in order

Each assignment has a position number. You can see the position number when you search for billets or when you are reordering your preferences.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/position_numbers_1.png?raw=true" width="350">
<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/position_numbers_2.png?raw=true" width="350">

<br/><br/>
I recommend using a spreadsheet to get your position numbers in order. To download all of the available assignments as a spreadsheet, use the "Export To Excel" button from the "Search Billets" page.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/export_to_excel.png?raw=true">

## Step 2: Format the position numbers

The position numbers must be formatted in preference order with:

- Quotes around each position number (ex: "7769ABC")
- A comma separating each position number (ex: "7769ABC", "1234XYZ")
- Brackets around the first and last position number (ex: ["7769ABC", "1234XYZ", "7890RDW"])
- The highest preference (#1 preference) as the first number in the list

(optional, but helpful) You can also use the [FormatPositionNumbers.xlsx](https://github.com/ryan-d-williams/Talent-Marketplace/raw/master/FormatPositionNumbers.xlsx) spreadsheet to do this for you. Just paste your ordered position numbers in the first column, and you can copy the formatted text from the third column.

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

```javascript
(() => {
  const POS_NUMS = PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE;

  const VERBOSE = false;
  let page_data = $("#preferencesList").data("kendoListView");
  let all_els = page_data.dataSource.data();
  let all_weights = $.map(all_els, (n) => {
    return n.PreferenceOrder;
  });

  let all_promises = [];
  let unchanged_count = 0,
    success_count = 0,
    error_count = 0;
  POS_NUMS.forEach((pos_num, ndx) => {
    let assignment = all_els.find(
      (assignment) => assignment.AirForcePositionNumber === pos_num
    );
    if (assignment) {
      let position_ids = JSON.parse(JSON.stringify(assignment.PositionIds));
      let order = BidsAndPrefsOrderModule.GetOrderNumberAsDecimal(
        ndx,
        all_weights
      );

      if (VERBOSE) {
        console.log(`Position Number: ${pos_num}`);
        console.log(`Location: ${assignment.PositionLocation}`);
        console.log(`Current order: ${assignment.Order}`);
        console.log(`Desired order: ${ndx + 1}`);
        console.log(position_ids);
        console.log(`Decimal order: ${order}`);
      }

      if (assignment.Order !== ndx + 1) {
        all_weights[ndx] = order;

        let deferred = $.post({
          url: $("#preferencesApp").data("update-preference-url"),
          cache: !1,
          data: {
            VmlCycleId: assignment.VmlCycleId,
            PersonId: assignment.PersonId,
            PositionIds: position_ids,
            Order: order,
            __RequestVerificationToken: $(
              "#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]"
            ).val(),
          },
        })
          .fail(function () {
            error_count++;
            console.log(
              `Error: there was a problem reordering ${pos_num} to ${ndx + 1}`
            );
          })
          .done(function () {
            success_count++;
            console.log(`Successfully reordered ${pos_num} to ${ndx + 1}`);
          });
        all_promises.push(deferred);
      } else {
        unchanged_count++;
        console.log(`${pos_num} is already in the correct order (#${ndx + 1})`);
      }
    } else {
      console.log(
        `Error: could not find assignment for position number: ${pos_num}`
      );
      error_count++;
    }
  });

  $.when(...all_promises).always(() => {
    console.log("\n\nDone!");
    console.log(
      `Successfully reordered ${success_count} assignments with ${unchanged_count} assignments already in the correct order`
    );
    console.log(`Total number that failed to reorder: ${error_count}`);
  });
})();
```

</details>

5. Change PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE to your formatted position numbers (line 2 of the code)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/code_paste.png?raw=true">

6. Click enter

You should now see text appear in the console to let you know how things are going (if there are problems, you will see "Error" with the description of what went wrong for that position number)

When it is done ("Done!" appears), **refresh** to see the changes.

Questions? Check out the [FAQ](#faq)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/done.png?raw=true">

# Favorite (and reorder) your preferences

If you haven't already favorited your preferences and want to automate that too (and reorder them at the same time) then the following steps are for you

### **NOTE: this script assumes you have NOT already favorited your assignments. If you have already favorited your assignments, see [the section above](#reorder-your-preferences) for reordering only**

## Step 1: Get your position numbers

Each assignment has a position number. You can see the position number when you search for billets.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/position_numbers_2.png?raw=true" width="350">

<br/><br/>
I recommend using a spreadsheet to get your position numbers in order. To download all of the available assignments as a spreadsheet, use the "Export To Excel" button from the "Search Billets" page.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/export_to_excel.png?raw=true">

## Step 2: Format the position numbers

The position numbers must be formatted in preference order with:

- Quotes around each position number (ex: "7769ABC")
- A comma separating each position number (ex: "7769ABC", "1234XYZ")
- Brackets around the first and last position number (ex: ["7769ABC", "1234XYZ", "7890RDW"])
- The highest preference (#1 preference) as the first number in the list
  - If you don't put them in order, it will still favorite them as expected, but you will have to reorder them yourself or follow the previous section for how to reorder them.

(optional, but helpful) You can also use the [FormatPositionNumbers.xlsx](https://github.com/ryan-d-williams/Talent-Marketplace/raw/master/FormatPositionNumbers.xlsx) spreadsheet to do this for you. Just paste your ordered position numbers in the first column, and you can copy the formatted text from the third column.

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/format_pos_nums_spreadsheet.png?raw=true">

NOTE: The order you have the position numbers in determines what order they will initially appear in your preferences.

## Step 3: Run the script with your position numbers

Running the script consists of 6 steps (all very easy I promise):

1. Open the "Search Billets" page on Talent Marketplace (**HIGHLY** recommend using Chrome - I have only tested this in Chrome)
2. Right click anywhere on the page, and click "Inspect" (a new window will appear)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/inspect2.png?raw=true">

3. In the top row of buttons, click "Console"
4. Copy the below code into the console window, DON'T click enter yet

<details><summary>CLICK HERE TO UNHIDE CODE</summary>

```javascript
(() => {
  const POS_NUMS = PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE;

  const VERBOSE = false;
  let page_data = $("#searchGrid").data("kendoGrid");
  let all_els = page_data.dataSource.data();

  let all_promises = [];
  let unchanged_count = 0,
    success_count = 0,
    error_count = 0;
  POS_NUMS.forEach((pos_num) => {
    let assignment = all_els.find(
      (assignment) => assignment.AirForcePositionNumber === pos_num
    );
    if (assignment) {
      if (VERBOSE) {
        console.log(`Position Number: ${pos_num}`);
        console.log(`Location: ${assignment.PositionLocation}`);
      }

      if (!assignment.IsFavorite) {
        let position_ids = JSON.parse(JSON.stringify(assignment.PositionIds));

        let deferred = $.post({
          url: $("#talentMarketplaceSearchApp").data("update-favorite-url"),
          cache: !1,
          data: {
            vmlCycleId: assignment.VmlCycleId,
            positionIds: position_ids,
            isFavored: false,
            __RequestVerificationToken: $(
              "#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]"
            ).val(),
          },
        })
          .fail(function () {
            error_count++;
            console.log(`Error: there was a problem favoriting ${pos_num}`);
          })
          .done(function () {
            success_count++;
            console.log(`Successfully favorited ${pos_num}`);
          });
        all_promises.push(deferred);
      } else {
        unchanged_count++;
        console.log(`${pos_num} is already favorited`);
      }
    } else {
      console.log(
        `Error: could not find assignment for position number: ${pos_num}`
      );
      error_count++;
    }
  });

  $.when(...all_promises).always(() => {
    console.log("\n\nDone!");
    console.log(
      `Successfully favorited ${success_count} assignments with ${unchanged_count} assignments already favorited`
    );
    console.log(`Total number that failed to favorite: ${error_count}`);
  });
})();
```

</details>

5. Change PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE to your formatted position numbers (line 2 of the code)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/code_paste.png?raw=true">

6. Click enter

You should now see text appear in the console to let you know how things are going (if there are problems, you will see "Error" with the description of what went wrong for that position number)

When it is done ("Done!" appears), **refresh** to see the changes.

Questions? Check out the [FAQ](#faq)

<img src="https://github.com/ryan-d-williams/Talent-Marketplace/blob/master/images/done2.png?raw=true">

# FAQ

Q. Why?

A. Talent Marketplace is slow. It takes an unacceptable amount of time to reorder assignment preferences. Thousands of people use this system every year. The hope is this will help someone save a few hours of their life dragging and dropping.

<br/><br/>
Q. How long does this take?

A. After determining what order you want your assignments in, this should only take you a few minutes to accomplish. Reordering themselves (usually) takes much, much longer.

<br/><br/>
Q. Why JQuery?

A. The website by default uses JQuery, I'm just piggy-backing off what they are already using to make the script as minimal as possible.

<br/><br/>
Q. It says: Error: could not find assignment for position number. What do I do?

A. That means if could not find an assignment matching that position number. Check the spelling of the position number, and make sure you haven't accidentally filtered anything out.

<br/><br/>
Q. Something went wrong, what do I do now?

A. Open an issue in this repository and I'll help you debug.
