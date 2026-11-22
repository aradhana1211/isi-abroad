export default class BasicSetting
{
    navigate() {
        cy.get('header a[href="/admin/setting/basic"]').click()
    }

    getBasicSettingPage()
    {
        return cy.get('div[data-cy="default-page"]');
    }

    getViewButtonAcceptanceLetter() {
        return this.getBasicSettingPage().find('button[data-cy="view-btn"]').first();
    }

    getViewButtonVisaLetter() {
        return this.getBasicSettingPage().find('button[data-cy="view-btn"]').eq(1);
    }

    getViewButtonCancelPolicy() {
        return this.getBasicSettingPage().find('button[data-cy="view-btn"]').eq(2);
    }

    getEditButtonAcceptanceLetter() {
        return this.getBasicSettingPage().find('button[data-cy="edit-btn"]').first();
    }

    getEditButtonVisaLetter() {
        return this.getBasicSettingPage().find('button[data-cy="edit-btn"]').eq(1);
    }

    getEditButtonCancelPolicy() {
        return this.getBasicSettingPage().find('button[data-cy="edit-btn"]').eq(2);
    }

    getGoBackLink() {
        return this.getBasicSettingPage().find('button[data-cy="back-btn"]').first();
    }

    getEmailInput() {
        return this.getBasicSettingPage().find('input[ name="fromEmail"]'); 
    }

    getSaveButton() {
        return this.getBasicSettingPage().find('button[data-cy="save-btn"]');
    }

    getSubmitButton() {
        return this.getBasicSettingPage().find('button[data-cy="save-content"]');
    }
}