export default class Advisor {
    navigate() {
        cy.visit("/admin/advisors");
    }

    getAdvisorPage() {
        return cy.get('div[data-cy="advisor-page"]');
    }

    getAddAdvisorLink() {
        return this.getAdvisorPage().find('[data-cy="add-advisor-link"]');
    }

    getAddEditAdvisorPage() {
        return cy.get('[data-cy="advisor-add-edit-page"]')
    }

    getGoBackLink() {
        return this.getAddEditAdvisorPage().find('[data-cy="go-back"]');
    }

    getNameInput() {
        return this.getAddEditAdvisorPage().find('input[data-cy="name"]');
    }

    getEmailInput() {
        return this.getAddEditAdvisorPage().find('input[ data-cy="email"]'); 
    }

    getPhoneNumberInput() {
        return this.getAddEditAdvisorPage().find('input[data-cy="phone-number"]');
    }

    getPasswordInput() {
        return this.getAddEditAdvisorPage().find('input[data-cy="password"]');
    }

    getErrorMessage() {
        return cy.get('[data-cy="error"]');
    }

    getSubmitButton() {
        return this.getAddEditAdvisorPage().find('button[data-cy="save-btn"]');
    }

    getAdvisorEditPage() {
        return this.getAdvisorPage().find('table[data-cy="advisors-table"] tbody').find('tr').first().find('[data-cy="advisor-edit"]');
    }

    getAdvisorViewPage() {
        return this.getAdvisorPage().find('table[data-cy="advisors-table"] tbody').find('tr').first().find('[data-cy="advisor-view"]');
    }

}
