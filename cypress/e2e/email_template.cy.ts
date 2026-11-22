import EmailTemplate from "../support/PageObjects/EmailTemplate"

describe("Email Template crud check", () => {

    const emailTemplate = new EmailTemplate();

    beforeEach(() => {
        cy.doLogin();
        emailTemplate.navigate();
        cy.wait(300)
    })

    it("list of email templates", () => {
        emailTemplate.getEmailTemplatePage()
        .should('be.visible');
        emailTemplate.getTableLength().should('be.at.least',10);
    })

    it("view email template", () => {
        emailTemplate.getEmailTemplatePage()
        .should('be.visible');

        emailTemplate.getEmailTemplateViewPage()
            .should('be.visible')
            .click();

        cy.wait(500)
        
        emailTemplate.getKeyInput().should('be.visible').should('be.disabled')

        emailTemplate
        .getSubmitButton()
        .should('not.exist')
        emailTemplate.getGoBackLink()
        .should('be.visible')
        .click();
    });

    it("Edit Email Template", () => {
        emailTemplate.getEmailTemplatePage()
        .should('be.visible');

        emailTemplate.getEmailTemplateEditPage()
            .should('be.visible')
            .click()

        cy.wait(1500)
        
        emailTemplate.getKeyInput().should('be.visible').should('be.disabled')
    
        emailTemplate.getSubjectInput().clear() 
        const subject = `test_${Math.random().toString(36).substring(5)}`
        emailTemplate.getSubjectInput().should("be.visible").should("be.enabled").type(subject, { delay: 100 });

        const content = `test_${Math.random().toString(36).substring(5)}`
        cy.get('iframe').should('exist').then($iframe => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body)
            .invoke('html', '')
            .type(content, { delay: 100 });
        });

        emailTemplate
        .getSubmitButton()
        .should("be.visible")
        .should("be.enabled")
        .click();

        cy.wait(1000)

        cy.url().then((url) => {
            if(url.includes('admin/setting/template/edit'))
            {
                emailTemplate.getErrorMessage()
                .should("not.exist")
                .should("not.be.visible")
            }
        })
        cy.url().should("contain", "/admin/setting/template");
    });
})