<?php

/*
|--------------------------------------------------------------------------
| Product features
|--------------------------------------------------------------------------
|
| gainproperties.id runs on Sale (property-for-sale) and Auction only.
| Investment (lots) and Crowdfunding stay in the code but are hidden:
| their public pages, user payment routes, admin menus and landing copy
| answer 404 / disappear while the flag is off. Turn a flag back on to
| bring the product back without reverting code.
|
| Both default to off. Read via App\Support\Features, not config() directly.
|
*/

return [
    'investment' => (bool) env('FEATURE_INVESTMENT', false),
    'crowdfunding' => (bool) env('FEATURE_CROWDFUNDING', false),
];
