# Formik Devtools

Formik Developer Tools for debugging React form components.

## Installation

To add this extension to Chrome in developer mode:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** by toggling the switch in the top-right corner
3. Click **Load unpacked**
4. Select the directory containing this extension (the folder where `manifest.json` is located)
5. The extension will now appear in your extensions list and be active

## Usage

Once installed, open Chrome DevTools and look for the **Formik** tab to debug your Formik forms.

## Development

This extension uses Manifest V3 and includes:
- DevTools panel for form inspection
- Content scripts for form detection
- Background service worker

## Original Repository

This extension is based on the original code from [petrenkoVitaliy/formik-devtools](https://github.com/petrenkoVitaliy/formik-devtools), which provides the React Formik debugging tools.
