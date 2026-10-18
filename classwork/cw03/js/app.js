// Segment lengths (miles) from the City of Phoenix Papago Park trail map:
// Big Butte Loop 0.8, Little Butte Loop 0.5, Ranger Office Loop 0.6.

const bigButteSegment = 0.8;
const littleButteSegment = 0.5;
const rangerOfficeSegment = 0.6;
const totalMiles = bigButteSegment + littleButteSegment + rangerOfficeSegment;

document.querySelector('#total').textContent = 'The circuit is ' + totalMiles + ' miles over three segments.';
console.log('total miles:', totalMiles);

/* Heat threshold: 105°F is the temperature above which Phoenix Fire's
   Technical Rescue Team asked the City to restrict trail access,
   after a dozen rescuers suffered heat injuries in June 2021. */
const HEAT_THRESHOLD = 105;

document.querySelector('#go').addEventListener('click', function () {
    const site = document.querySelector('#site').value;
    const hours = Number(document.querySelector('#hours').value);
    const temp = Number(document.querySelector('#temp').value);
    const hoursOnHeatDay = hours + 1;
    const heat = temp >= HEAT_THRESHOLD;

    document.querySelector('#report').textContent =
        site + ': ' + temp + 'F. ' +
        (heat ? 'EXTREME HEAT, open ' + hoursOnHeatDay + ' hours today.'
              : 'Normal hours, open ' + hours + ' hours today.');
});