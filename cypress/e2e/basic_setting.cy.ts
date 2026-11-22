import BasicSetting from "../support/PageObjects/BasicSetting";

describe("BasicSetting page check", () => {
    const basicSetting = new BasicSetting();

    beforeEach(() => {
        cy.doLogin();

        cy.intercept({
            method: 'GET',
            url: 'api/v1/**',
            times: 2
        }).as('settingsApi');

        basicSetting.navigate();

        cy.wait('@settingsApi')
        cy.wait(300)
    })
    /**
     * This is for template, base structure for how tests should be implemented.
     */
    it("view basic setting page", () => {
        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getViewButtonAcceptanceLetter()
        .should('be.visible')
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getViewButtonVisaLetter()
        .should('be.visible')
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();
        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getViewButtonCancelPolicy()
        .should('be.visible')
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        cy.get('[type="text"]').clear() 
        const email = `test_${Math.random().toString(36).substring(5)}@email.com`
        basicSetting
        .getEmailInput()
        .should("be.visible")
        .should("be.enabled")
        .type(email, { force: true, delay: 100 });

        basicSetting
        .getSaveButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');
    });

    it("edit basic setting page", () => {
        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getEditButtonAcceptanceLetter()
        .should('be.visible')
        .click();

        cy.intercept({
            url: /.*cdn\.tiny\.cloud.*/,
            times: 10
        }).as('tinyMce');

        cy.wait('@tinyMce')
        cy.wait(3000)

        const content = `test_${Math.random().toString(36).substring(5)}`
        cy.get('iframe').should('exist').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body)
            .invoke('html', '')
            .type(content, { delay: 100 });
        });
        basicSetting
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getEditButtonVisaLetter()
        .should('be.visible')
        .click();

        // cy.wait(1000)
        cy.intercept({
            url: /.*cdn\.tiny\.cloud.*/,
            times: 10
        }).as('tinyMce');

        cy.wait('@tinyMce').then(() => {
            expect(true).to.be.true;
        })
        cy.wait(3000)
        cy.get('iframe').should('exist').then($iframe => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body)
            .invoke('html', '')
            .type(content, { delay: 100 });
        });

        basicSetting
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');

        cy.wait(500)

        basicSetting.getEditButtonCancelPolicy()
        .should('be.visible')
        .click();

        cy.wait(3000)

        cy.get('iframe').should('exist').then($iframe => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body)
            .invoke('html', '')
            .type(content, { delay: 100 });
        });

        basicSetting
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(500)

        basicSetting.getGoBackLink()
        .should('be.visible')
        .click();

        basicSetting.getBasicSettingPage()
        .should('be.visible');
    });
});
