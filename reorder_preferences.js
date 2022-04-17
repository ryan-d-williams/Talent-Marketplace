(() => {
    const POS_NUMS = PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE

    const VERBOSE = false;
    let page_data = $("#preferencesList").data("kendoListView");
    let all_els = page_data.dataSource.data()
    let all_weights = $.map(all_els, (n) => {
        return n.PreferenceOrder
    });

    let first_el = all_els[0];
    const VML_CYCLE_ID = first_el.VmlCycleId;
    const PERSON_ID = first_el.PersonId;
    let all_promises = [];
    let unchanged_count = 0, success_count = 0, error_count = 0;
    POS_NUMS.forEach((pos_num, ndx) => {
        let assignment = all_els.find(assignment => assignment.AirForcePositionNumber === pos_num);
        if (assignment) {
            let position_ids = JSON.parse(JSON.stringify(assignment.PositionIds))
            let order = BidsAndPrefsOrderModule.GetOrderNumberAsDecimal(ndx, all_weights);

            if (VERBOSE) {
                console.log(`Position Number: ${pos_num}`)
                console.log(`Location: ${assignment.PositionLocation}`)
                console.log(`Current order: ${assignment.Order}`)
                console.log(`Desired order: ${ndx + 1}`)
                console.log(position_ids);
                console.log(`Decimal order: ${order}`);
            }

            if (assignment.Order !== ndx + 1) {
                all_weights[ndx] = order;

                let deferred = $.post({
                    url: $("#preferencesApp").data("update-preference-url"),
                    cache: !1,
                    data: {
                        VmlCycleId: VML_CYCLE_ID,
                        PersonId: PERSON_ID,
                        PositionIds: position_ids,
                        Order: order,
                        __RequestVerificationToken: $("#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]").val()
                    }
                }).fail(function () {
                    error_count++;
                    console.log(`Error: there was a problem reordering ${pos_num} to ${ndx + 1}`);
                }).done(function () {
                    success_count++;
                    console.log(`Successfully reordered ${pos_num} to ${ndx + 1}`);
                });
                all_promises.push(deferred);
            } else {
                unchanged_count++;
                console.log(`${pos_num} is already in the correct order (#${ndx + 1})`);
            }
        } else {
            console.log(`Error: could not find assignment for position number: ${pos_num}`);
            error_count++;
        }
    });

    $.when(...all_promises).always(() => {
        console.log("\n\nDone!");
        console.log(`Successfully reordered ${success_count} assignments with ${unchanged_count} assignments already in the correct order`);
        console.log(`Total number that failed to reorder: ${error_count}`);
    });
})();