<?php

use Illuminate\Console\Scheduling\Schedule;

it('does not distribute profit on a schedule', function () {
    $commands = collect(app(Schedule::class)->events())->map(fn ($event) => $event->command)->implode("\n");

    expect($commands)->not->toContain('profit:distribute')
        ->and($commands)->toContain('xendit:sync-transactions');
});
