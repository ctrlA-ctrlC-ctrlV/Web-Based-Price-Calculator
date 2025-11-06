const defaults = {
    currency: 'EUR',
    baseRatePerM2: 1200,       // base build €/m²
    fixedCharge: 6000,
    height: 2.4,
    cladRate: 80,
    bathTypeOneCharge: 2500,
    bathTypeTwoCharge: 4500,
    windowCharge: 500,
    windowRate: 400,
    exDoorCharge: 500,
    exDoorRate: 400,
    skylightCharge: 900,
    skylightRate: 750,
    switch: 50,
    doubleSocket: 60,
    innerDoorChar: 500,
    innerWallType: { none: 0, inner_wall_type_p: 200, inner_wall_type_s:300 },
    floor: { none: 0, wooden: 40, tile: 60},
    deliveryFreeKm: 30,
    deliveryRatePerKm: 2.2,    // €/km beyond free radius
    ex_ESPInstRate: 40,
    ex_renderRate: 120,
    ex_steelDoorCharge: 500,
    vatPct: 0,
    discountPct: 0
};
