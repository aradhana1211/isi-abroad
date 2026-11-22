/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import Login from '../support/PageObjects/Login'

Cypress.Commands.add("doLogin" as any, () => {
    const login = new Login();
    login.navigate();
    cy.wait(800);

    cy.url().should("contain", "/login");

    login.getLoginPage().should("be.visible");

    login
        .getEmailInput()
        .clear({force: true})
        .should("be.visible")
        .should("be.enabled")
        .type(Cypress.env("username"), { delay: 100 });

    login
        .getPasswordInput()
        .clear({force: true})
        .should("be.visible")
        .should("be.enabled")
        .type(Cypress.env("password"), { delay: 100 });

    cy.intercept({
          method: 'POST',
          url: '/api/v1/auth/login',
    }).as('authLogin');

    login
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

    cy.wait(1500)

    cy.wait('@authLogin').then(() => {
      cy.url().then((url) => {
        expect(url).to.contain("/dashboard");
      })
    })
})

declare global {
  namespace Cypress {
    interface Chainable {
      doLogin(): Chainable<void>
    }
  }
}