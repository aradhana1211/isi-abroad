export default class SyncForm {
    navigate() {
        cy.visit("/admin/setting/form");
    }

    getFirstSubStepForm() {
        return cy.get("form[data-cy='0_sub_step_form']").first();
    }

    getGfFormInput() {
        return this.getFirstSubStepForm().find('input');
    }

    getSaveAndSyncButton() {
        return this.getFirstSubStepForm().find("button[data-cy='save-and-sync-btn']");
    }
}
