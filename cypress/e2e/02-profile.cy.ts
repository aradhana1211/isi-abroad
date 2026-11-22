import Profile from "../support/PageObjects/Profile";

describe("Profile check",() => {
    const profile = new Profile();

    beforeEach(() =>{
        cy.doLogin();

        profile.navigate();
        cy.wait(300);
    });

    it("check login page", () => {
        profile
            .getProfilePage()
            .should("be.visible");

        cy.wait(500);

        cy.get('[type="text"]').clear()
        cy.get('[type="email"]').clear()
        
        profile
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500);
        // check for error

        const name = 'superadmin'

        profile
            .getNameInput()
            .should("be.visible")
            .should("be.enabled")
            .type(name,{delay: 100});

        profile
            .getEmailInput()
            .should("be.visible")
            .should("be.enabled")
            .type(Cypress.env("username"), { delay: 100 })
        
        profile
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500);


       cy.url().should('contain', '/admin/profile')

    });

    it("check change password", () => {
        profile
            .getChangePasswordButton()
            .should("be.visible")
            .should("be.enabled")
            .click()
        
    })

});
