# Chrome Extension

## About 

Getting the ICAO 8643 ACFT Types as a usable JSON file involves navigating to the correct section on the ICAO homepage, opening the network tab in the developer tools and copy the response object from the appropriate request, as the frontend of the ICAO homepage only displays paginated tabular data.

This extension simplifies this in three easy steps:

1. Navigates to the correct ICAO homepage section
2. Requests the desired object
3. Provides a timestamped downloadable JSON file ready for use

## Installation

1. Clone repo
2. Enable Developer Mode in the Extension Settings of your Chromium Browser
3. Load Unpacked
4. Follow Steps in Popup

## Notes

- You need to be within the active tab of the relevant ICAO homepage section for the fetch request to work
- You do not need to wait for the data table on the ICAO homepage to load

