(() => {
    const POS_NUMS = PASTE_YOUR_FORMATTED_POSITION_NUMBERS_HERE

    const VERBOSE = false;
    let page_data = $("#searchGrid").data("kendoGrid");
    let all_els = page_data.dataSource.data();

    let first_el = all_els[0];
    const VML_CYCLE_ID = first_el.VmlCycleId;
    let all_promises = [];
    let unchanged_count = 0, success_count = 0, error_count = 0;
    POS_NUMS.forEach((pos_num) => {
        let assignment = all_els.find(assignment => assignment.AirForcePositionNumber === pos_num);
        if (assignment) {

            if (VERBOSE) {
                console.log(`Position Number: ${pos_num}`)
                console.log(`Location: ${assignment.PositionLocation}`)
            }

            if (!assignment.IsFavorite) {
                let position_ids = JSON.parse(JSON.stringify(assignment.PositionIds))

                let deferred = $.post({
                    url: $("#talentMarketplaceSearchApp").data("update-favorite-url"),
                    cache: !1,
                    data: {
                        vmlCycleId: VML_CYCLE_ID,
                        positionIds: position_ids,
                        isFavored: false,
                        __RequestVerificationToken: $("#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]").val()
                    }
                }).fail(function () {
                    error_count++;
                    console.log(`Error: there was a problem favoriting ${pos_num}`);
                }).done(function () {
                    success_count++;
                    console.log(`Successfully favorited ${pos_num}`);
                });
                all_promises.push(deferred);
            } else {
                unchanged_count++;
                console.log(`${pos_num} is already favorited`);
            }
        } else {
            console.log(`Error: could not find assignment for position number: ${pos_num}`);
            error_count++;
        }
    });

    $.when(...all_promises).always(() => {
        console.log("\n\nDone!");
        console.log(`Successfully favorited ${success_count} assignments with ${unchanged_count} assignments already favorited`);
        console.log(`Total number that failed to favorite: ${error_count}`);
    });
})();