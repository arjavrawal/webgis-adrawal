# CW03: JavaScript Trail Report

**Arjav Rawal**

A simple trail report for a three-segment circuit in Papago Park (Phoenix), using City of Phoenix trail lengths.

JavaScript adds the segments and writes the total onto the page with `textContent`.

A station report form reads the site name, hours and temperature, compares the temperature to a 105°F threshold (specified in `app.js`), and builds a one-sentence report upon a button being clicked.

## Breaks

- Break 1 (removed `defer`): 
    - Predicted: the script would run before the page existed and fail.
    - Result: `Uncaught TypeError: Cannot set properties of null (setting 'textContent')` at app.js:6, and the total never appeared, because `#total` didn't exist yet when the script ran.
- Break 2 (duplicate button id):
    - Predicted: only one button would work.
    - Result: the first button built the report and the second did nothing, because `querySelector('#go')` returns only the first match, so the listener was attached to that one alone. No error appeared.
- Break 3 (removed `Number()` around hours):
    - Predicted: the hours would come out wrong.
    - Result: no error, but the report said "open 31 hours" instead of 4, because `.value` is a string and `+` joined "3" and 1 instead of adding them.