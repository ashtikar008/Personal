export enum userRoles {
    BCP = "BCP",
    ESP ="ESP",
}

export enum enum_scenarioStates {
    AWAITING_PREAPPROVAL = 'AWAITING_PREAPPROVAL',
    REJECTED_PREAPPROVAL = 'REJECTED_PREAPPROVAL',
    APPROVED_PREAPPROVAL = 'APPROVED_PREAPPROVAL',
    PREPARING_CONAPPROVAL = 'PREPARING_CONAPPROVAL',
    PASSEDPRELIM_CONAPPROVAL = 'PASSEDPRELIM_CONAPPROVAL',
    FAILEDPRELIM_CONAPPROVAL = 'FAILEDPRELIM_CONAPPROVAL',
    PASSEDKYC_CONAPPROVAL = 'PASSEDKYC_CONAPPROVAL',
    FAILEDKYC_CONAPPROVAL = 'FAILEDKYC_CONAPPROVAL',
    ESP_STEP4_COMPLETED = 'ESP_STEP4_COMPLETED',
    APPROVED_CONAPPROVAL = 'APPROVED_CONAPPROVAL',
    REJECTED_CONAPPROVAL = 'REJECTED_CONAPPROVAL',
    PURCHASED = 'PURCHASED',
    INVALIDATED = 'INVALIDATED',
    LOAN_OFFER_COMPLETED = 'LOAN_OFFER_COMPLETED',
    FORMALISED = 'FORMALISED'
}

export enum enum_progressStatus {
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
}

export enum kycStatus{
    KYC_APPROVE = 'Approve',
    KYC_REJECT = 'Reject',
}

export enum enum_fileNames{
    F_AND_F_ODF_SUPPLE_IM = "F_AND_F_ODF_SUPPLE_IM",
    DEED_OF_GURANTEE = "DEED_OF_GURANTEE",
    PRE_APPROVAL_LETTER = "PRE_APPROVAL_LETTER",
    CONDITIONAL_LOAN_OFFER = "CONDITIONAL_LOAN_OFFER",
    OPF_SUBSCRIPTION = "OPF_SUBSCRIPTION"
}

export enum scenarioDetailEspSteps {
    STEP_4 = 'STEP-4',
    STEP_6 = 'STEP-6',
    STEP_8 = 'STEP-8',
    STEP_9 = 'STEP-9',
}

export enum scenarioDetailBcpSteps {
    STEP_1 = 'Step 1',
    STEP_2 = 'Step 2',
    STEP_3 = 'Step 3',
    STEP_4 = 'Step 4',
    STEP_5 = 'Step 5',
    STEP_6 = 'Step 6',
    STEP_7 = 'Step 7',
    STEP_8 = 'Step 8',
    STEP_9 = 'Step 9',
    STEP_10 = 'Step 10',
    STEP_11 = 'Step 11',
    STEP_12 = 'Step 12',
}

export enum enum_propertyType {
APARTMENT = 'Apartment',
UNIT = 'Unit',
HOUSE = 'House',
}
export enum enum_numberOfBeds {
ONE = '1',
TWO = '2',
THREE = '3',
FOUR_PLUS = '4+',
}