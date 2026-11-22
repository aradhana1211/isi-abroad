import Login from "../support/PageObjects/Login";

describe("Login Page", () => {
    const login = new Login();

    /**
     * This is for template, base structure for how tests should be implemented.
     * 
     */
    it("check login page", () => {
        login.navigate();
        cy.wait(800);

        cy.url().should("contain", "/login");

        login.getLoginPage().should("be.visible");

        login
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        login.getErrorMessage()
            .should("have.length.at.least", 2)

        // check for error
        const email = `test_${Math.random().toString(36).substring(5)}@email.com`
        login
            .getEmailInput()
            .should("be.visible")
            .should("be.enabled")
            .type(email, { delay: 100 });

        login
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        login.getErrorMessage()
            .should("exist")
            .should("be.visible")
            .invoke("text")
            .should("have.length.at.least", 10)

        login
            .getPasswordInput()
            .should("be.visible")
            .should("be.enabled")
            .type(Cypress.env("password"), { delay: 100 });

        login
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(1000)

        login.getErrorMessage()
            .should("exist")
            .should("be.visible")
            .invoke("text")
            .should("have.length.at.least", 15)

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

        login
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(1000)
        cy.url().then((url) => {
            expect(url).to.contain("/dashboard");
        });
    });
});
