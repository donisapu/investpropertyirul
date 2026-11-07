<?php

namespace App\Support;

use InvalidArgumentException;

/**
 * Product feature flags (config/features.php).
 *
 * Investment and Crowdfunding are hidden on gainproperties.id until the
 * client brings them back. Every place that shows or serves them asks here.
 */
final class Features
{
    public const INVESTMENT = 'investment';

    public const CROWDFUNDING = 'crowdfunding';

    public const ALL = [self::INVESTMENT, self::CROWDFUNDING];

    public static function enabled(string $feature): bool
    {
        if (! in_array($feature, self::ALL, true)) {
            throw new InvalidArgumentException("Unknown feature [{$feature}].");
        }

        return (bool) config("features.{$feature}", false);
    }

    /** True when at least one investing product (lots or crowdfunding) is on. */
    public static function investing(): bool
    {
        return self::enabled(self::INVESTMENT) || self::enabled(self::CROWDFUNDING);
    }

    /** @return array<string, bool> shared with the frontend as `features`. */
    public static function toArray(): array
    {
        return collect(self::ALL)->mapWithKeys(fn ($f) => [$f => self::enabled($f)])->all();
    }
}
