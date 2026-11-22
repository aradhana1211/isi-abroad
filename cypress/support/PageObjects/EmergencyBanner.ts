export default class EmergencyBanner {
    navigate() {
        cy.visit("/admin/setting/emergency-banner");
    }

    getEmergencyBannerPage() {
        return cy.get('div[data-cy="emergency-banner-page"]');
    }

    getAddEmergencyBannerLink() {
        return this.getEmergencyBannerPage().find('[data-cy="add-emergency-banner-link"]');
    }

    getAddEditEmergencyBannerPage() {
        return cy.get('[data-cy="emergency-banner-add-edit-page"]')
    }

    getGoBackLink() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="go-back"]');
    }

    getTitleInput() {
        return this.getAddEditEmergencyBannerPage().find('input[data-cy="title"]');
    }

    getStartDateInput() {
        return this.getAddEditEmergencyBannerPage().find('div[data-cy="start-date"]');
    }

    getEndDateInput() {
        return this.getAddEditEmergencyBannerPage().find('div[data-cy="end-date"]');
    }

    getInstituteSelect() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="institute"]');
    }

    getInstituteOptions() {
        return cy.get('.MuiModal-root ul li');
    }

    getSessionSelect() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="sessions"]');
    }

    getSessionOptions() {
        return cy.get('.MuiModal-root ul li');
    }
    
    getProgramSelect() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="programs"]');
    }

    getProgramOptions() {
        return cy.get('.MuiModal-root ul li');
    }
    
    getStudentSelect() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="students"]');
    }

    getStudentOptions() {
        return cy.get('.MuiModal-root ul li');
    }

    getErrorMessage() {
        return this.getAddEditEmergencyBannerPage().find('[data-cy="error"]');
    }

    getSubmitButton() {
        return this.getAddEditEmergencyBannerPage().find('button[data-cy="save-btn"]');
    }

    getEmergencyBannerEditPage() {
        return this.getEmergencyBannerPage().find('table[data-cy="emergency-banner-table"] tbody').find('tr').first().find('[data-cy="emergency-banner-edit"]');
    }
}