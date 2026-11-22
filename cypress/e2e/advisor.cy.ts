import Advisor from "../support/PageObjects/Advisor";
// import { generateRandomNumber as gRN } from "../support/helpers"

describe("Advisor crud check", () => {
    const advisor = new Advisor();

    beforeEach(() => {
        cy.doLogin();

        advisor.navigate();
        cy.wait(300)
    })
    /**
     * This is for template, base structure for how tests should be implemented.
     */
    it("create advisor page", () => {
        advisor.getAdvisorPage()
        .should('be.visible');

        advisor.getAddAdvisorLink()
            .should('be.visible')
            .click();

        cy.wait(500);

        cy.url().should('contain', '/admin/advisors/add')

        cy.wait(800);

        advisor
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(500)

        //check errors
        advisor.getErrorMessage()
            .should("have.length.at.least", 3)

        cy.wait(500)

        const name = `test_${Math.random().toString(36).substring(5)}`
        advisor
        .getNameInput()
        .should("be.visible")
        .should("be.enabled")   
        .type(name, { delay: 100 });

        advisor
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        advisor.getErrorMessage()
        .should("exist")
        .should("be.visible")
        .invoke("text")
        .should("have.length.at.least", 10)

        cy.wait(500)

        const email = `test_${Math.random().toString(36).substring(5)}@email.com`
        advisor
            .getEmailInput()
            .should("be.visible")
            .should("be.enabled")
            .type(email, { delay: 100 });
        advisor
            .getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        advisor.getErrorMessage()
        .should("exist")
        .should("be.visible")
        .invoke("text")
        .should("have.length.at.least", 10)

        cy.wait(500)

        // const number = ("9" + gRN({min: 8, max: 9, length:1}) + gRN({min: 2, max: 9, length:8}))
        // TODO: fix and generate random number instead
        const  number = "9876543210"

        advisor
        .getPhoneNumberInput()
        .should("be.visible")
        .should("be.enabled")
        .type(number, { delay: 100 });

        advisor
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(500)

        advisor.getErrorMessage()
        .should("exist")
        .should("be.visible")
        .invoke("text")
        .should("have.length.at.least", 10)

        const password = `'Fn@'.${Math.floor(Math.random()*100000000)}`

        advisor
        .getPasswordInput()
        .should("be.visible")
        .should("be.enabled")
        .type(password, { force: true, delay: 100 });

        advisor
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(2500)

        cy.url().then((url) => {
            if(url.includes('/advisors/add'))
            {
                advisor.getErrorMessage()
                .should("not.exist")
            }
        } )
        cy.url().should("contain", "/admin/advisors");
    });

    //edit advisor
    it("edit advisor page", () => {
        advisor.getAdvisorPage()
        .should('be.visible');

        advisor.getAdvisorEditPage()
            .should('be.visible')
            .click();
        cy.wait(500)
        
        cy.get('[type="text"]').clear() 
        const name = `test_${Math.random().toString(36).substring(5)}`
        const email = `test_${Math.random().toString(36).substring(5)}@email.com`
        const password = `'Fn@'.${Math.floor(Math.random()*100000000)}`
        // const  number = ("9"+ gRN({min: 8, max: 9, length:1}) + gRN({min: 10000000, max: 99999999, length: 8}))
        // TODO: fix and generate random number instead
        const  number = "9876543210"

        advisor
        .getNameInput()
        .should("be.visible")
        .should("be.enabled")
        .type(name, { delay: 100 });

        cy.get('[type="email"]').clear() 
        advisor
        .getEmailInput()
        .should("be.visible")
        .should("be.enabled")
        .type(email, { delay: 100 });

        cy.get('input[name="phoneNumber"]').clear()
        advisor
        .getPhoneNumberInput()
        .should("be.visible")
        .should("be.enabled")
        .type(number, { delay: 100 });

        advisor
        .getPasswordInput()
        .should("be.visible")
        .should("be.enabled")
        .type(password, { force: true });

        advisor
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(2500)

        cy.url().then((url) => {
            if(url.includes('/advisors/edit'))
            {
                advisor.getErrorMessage()
                .should("not.exist")
                .should("not.be.visible")
            }
        } )
        cy.url().should("contain", "/admin/advisors");
    });

    //view advisor
    it("view advisor page", () => {
        advisor.getAdvisorPage()
        .should('be.visible');

        advisor.getAdvisorViewPage()
            .should('be.visible')
            .click();

        cy.wait(500)

        advisor.getGoBackLink()
        .should('be.visible')
        .click();
    });

});
