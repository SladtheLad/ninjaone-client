# NinjaOne Client React Showcase

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Open `.env.local` file and change the base URI to local or remote backend. Leave as is if locally serving on port 3000.

3. Run `npm run dev`.

4. Open `http://localhost:3000` in your browser.

5. Enjoy!

## Usage

While general navigation and usage is mostly intuitive, I prefer apps being fully keyboard accessible and used `react-aria` components to get this level of accessibility out of the box.
Everything is tab and arrow key navigable. The idea is to make an app as close to screen reader and non-mouse friendly as possible.

## Things I'd like to add

- I would ideally like to have form validations and error handling in place.
- Prepopulate various forms with available data.
- I was annoyed that `react-aria` `TextField`s would take significant effort to add the search bar icon (although this is a pretty common issue since `input` elements famously don't accept children elements!).
- Fix a visual bug with `react-aria` `Select`s not displaying selected values when reset.
- Make more mobile responsive.
