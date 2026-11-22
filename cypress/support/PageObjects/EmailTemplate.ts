export default class EmailTemplate {
    navigate() {
        cy.visit("/admin/setting/template");
    }

    getEmailTemplatePage() {
        return cy.get('div[data-cy="email-template-page"]');
    }

    getTableLength() {
        return this.getEmailTemplatePage().find('table[data-cy="email-template-table"] tbody tr').its('length')
    }

    getAddEditEmailTemplatePage() {
        return cy.get('[data-cy="email-template-add-edit-page"]')
    }

    getGoBackLink() {
        return this.getAddEditEmailTemplatePage().find('[data-cy="go-back"]');
    }

    getKeyInput() {
        return this.getAddEditEmailTemplatePage().find('[data-cy="key"]');
    }

    getSubjectInput() {
        return this.getAddEditEmailTemplatePage().find('input[data-cy="name"]');
    }

    getErrorMessage() {
        return cy.get('[data-cy="error"]');
    }

    getSubmitButton() {
        return this.getAddEditEmailTemplatePage().find('button[data-cy="save-btn"]');
    }

    getEmailTemplateEditPage() {
        return this.getEmailTemplatePage().find('table[data-cy="email-template-table"] tbody').find('tr').first().find('[data-cy="email-template-edit"]');
    }

    getEmailTemplateViewPage() {
        return this.getEmailTemplatePage().find('table[data-cy="email-template-table"] tbody').find('tr').first().find('[data-cy="email-template-view"]');
    }
}
