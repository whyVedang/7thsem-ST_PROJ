<?php

declare(strict_types=1);

use Carbon\Carbon;
use HiEvents\DomainObjects\CheckInListDomainObject;
use HiEvents\DomainObjects\OrderDomainObject;

$autoload = getenv('HIEVENTS_AUTOLOAD') ?: '/app/backend/vendor/autoload.php';
require $autoload;

$timezone = 'Asia/Kolkata';
$now = Carbon::parse('2026-11-25T12:00:00+05:30');
Carbon::setTestNow($now);

$cases = [
    'WB-01 No activation time: active' => [null, true, 'activation'],
    'WB-02 Activation in the future: inactive' => ['2026-11-25T12:00:01+05:30', false, 'activation'],
    'WB-03 Activation exactly now: inactive' => ['2026-11-25T12:00:00+05:30', false, 'activation'],
    'WB-04 Activation in the past: active' => ['2026-11-25T11:59:59+05:30', true, 'activation'],
    'WB-05 No expiration time: not expired' => [null, false, 'expiration'],
    'WB-06 Expiration in the future: not expired' => ['2026-11-25T12:00:01+05:30', false, 'expiration'],
    'WB-07 Expiration exactly now: not expired' => ['2026-11-25T12:00:00+05:30', false, 'expiration'],
    'WB-08 Expiration in the past: expired' => ['2026-11-25T11:59:59+05:30', true, 'expiration'],
    'WB-09 Zero order total: no payment required' => [0.00, false, 'payment'],
    'WB-10 Positive order total: payment required' => [0.01, true, 'payment'],
];

$passed = 0;
try {
    foreach ($cases as $label => [$input, $expected, $decision]) {
        $actual = match ($decision) {
            'activation' => (new CheckInListDomainObject)->setActivatesAt($input)->isActivated($timezone),
            'expiration' => (new CheckInListDomainObject)->setExpiresAt($input)->isExpired($timezone),
            'payment' => (new OrderDomainObject)->setTotalGross($input)->isPaymentRequired(),
        };
        $ok = $actual === $expected;
        $passed += (int) $ok;
        printf("%s | %s | expected=%s actual=%s\n", $ok ? 'PASS' : 'FAIL', $label,
            $expected ? 'true' : 'false', $actual ? 'true' : 'false');
    }
} finally {
    Carbon::setTestNow();
}

printf("%d/%d white-box checks passed.\n", $passed, count($cases));
exit($passed === count($cases) ? 0 : 1);
