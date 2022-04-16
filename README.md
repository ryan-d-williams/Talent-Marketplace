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

```javascript
(() => {
  const POS_NUMS = PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE;

  const VERBOSE = false;
  let page_data = $("#preferencesList").data("kendoListView");
  let all_els = page_data.dataSource.data();
  let all_weights = $.map(all_els, (n) => {
    return n.PreferenceOrder;
  });

  let first_el = all_els[0];
  const VML_CYCLE_ID = first_el.VmlCycleId;
  const PERSON_ID = first_el.PersonId;
  let all_promises = [];
  let unchanged_count = 0,
    success_count = 0,
    error_count = 0;
  POS_NUMS.forEach((pos_num, ndx) => {
    let assignment = all_els.find(
      (assignment) => assignment.AirForcePositionNumber === pos_num
    );
    if (assignment) {
      if (VERBOSE) {
        console.log(`Position Number: ${pos_num}`);
        console.log(`Location: ${assignment.PositionLocation}`);
        console.log(`Current order: ${assignment.Order}`);
        console.log(`Desired order: ${ndx + 1}`);
        console.log(position_ids);
        console.log(`Decimal order: ${order}`);
      }

      if (assignment.Order !== ndx + 1) {
        let position_ids = JSON.parse(JSON.stringify(assignment.PositionIds));
        let order = BidsAndPrefsOrderModule.GetOrderNumberAsDecimal(
          ndx,
          all_weights
        );
        all_weights[ndx] = order;

        let deferred = $.post({
          url: $("#preferencesApp").data("update-preference-url"),
          cache: !1,
          data: {
            VmlCycleId: VML_CYCLE_ID,
            PersonId: PERSON_ID,
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
    }
  });

  $.when(...all_promises).done(() => {
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

You should now see text appear in the console to let you know how things are going (errors will appear with the description of what went wrong)

When it is done ("Done!" appears), refresh to see the changes
