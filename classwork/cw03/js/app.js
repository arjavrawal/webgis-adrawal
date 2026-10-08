const westSegment = 67.0;
const canalSegment = 67.0;
const buttSegment = 67.0;
const totalMiles = westSegment + canalSegment + buttSegment;

document.querySelector('#total').textContent = 'The loop is ' + totalMiles + ' miles over three segments.';
console.log('total miles:', totalMiles);

const HEAT_THRESHOLD = 105;

document.querySelector('#go').addEventListener('click', function() {
    const site = document.querySelector('#site').value;
    const hours = document.querySelector('#hours').value;
    const temp = document.querySelector('#temp').value;
    const hoursOnHeatDay = hours + 1;
    const heat = temp >= HEAT_THRESHOLD;
    document.querySelector('#report').textContent = site + ': ' + temp + 'F. ' + (heat ? 'EXTREME HEAT, open ' + hoursOnHeatDay + ' hours today.' : 'Normal hours, open ' + hours + ' hours today.');
});