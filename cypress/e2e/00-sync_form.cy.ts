import SyncForm from "../support/PageObjects/SyncForm";

/**
 * We have syncing the student admission form in the seeder it self,
 * so we do not have to manage form id (prod or stage) here in the frontend.
 */
describe.skip(`
    We have syncing the student admission form in the backend seeder it-self,
    so we do not have to manage form id (prod or stage) here in the frontend to sync the form."`,
() => {
    const syncForm = new SyncForm()

    it("sync student admission form", () => {
        cy.doLogin();
        syncForm.navigate();
        cy.wait(2000);

        syncForm.getFirstSubStepForm()
            .should('be.visible')

        syncForm.getGfFormInput()
            .should('be.visible')
            .should('be.enabled')
            .clear({ force: true })
            .type(Cypress.env('studentRegisterFormIds').stage, { delay: 500 })

        cy.intercept({
            method: 'POST',
            url: 'api/v1/setting/formSubStep/**',
        }).as('fomSaveAndSyncApi');

        syncForm.getSaveAndSyncButton()
            .should('be.visible')
            .should('be.enabled')
            .click({ force: true })

        cy.wait('@fomSaveAndSyncApi', { responseTimeout: 50000 }).then(() => {
            expect(true).to.be.true;
        })
    });
});
