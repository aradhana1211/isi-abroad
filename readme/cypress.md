### Cypress test guideline

-   create a new spec (`.cy.ts` file) for each page/functionality in `cypress/e2e/` folder
-   each spec file can have `cypress/support/PageObjects/` file
-   to select the element `cy.get`, define getter function for each individual element in `cypress/support/PageObjects/*.ts`
-   `PageObjects/*.ts` can be reused in multiple spec files if required.
-   for test do not use class or id selector, you must create new custom attribute `data-cy` on element and use that in `PageObjects/*.ts`
-   define data in `cypress.config.ts` in under `env` object. for example `username` and `password` for login page.

### To open cypress in the interactive gui

```
yarn cypress:test
```

### To run cypress all specs

```
./node_modules/.bin/cypress run
```

- [Cypress api documentation](https://docs.cypress.io/api/table-of-contents)