const { admin, rdb } = require('./admin');

const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
};

const isInValidCategory = (category) => {
    return !(category === 'BANK' || category === 'BROKER');
}

exports.validateLoginData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be  empty';
    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateSignUpData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
    if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty';
    if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';
    if (isEmpty(data.country)) errors.country = 'Must not be empty';

    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';
    if (isEmpty(data.username)) errors.username = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateNewLoanOfficer = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
    if (isEmpty(data.surname)) errors.surname = 'Must not be empty';
    if (isEmpty(data.profile.phoneNumber)) errors.phoneNumber = 'Must not be empty';

    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must be the same';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateUpdateLoanOfficer = async (data) => {
    let errors = {};

    const fiRef = rdb.ref(`/financialInstitutions/${data.profile.financialInstitutionID}`);
    const snapshot = await fiRef.once('value');
    const value = snapshot.val();
    if(value === null){
        errors.financialInstitutionID = 'Not a valid FI ID';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateNewFinancialInstitution = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isInValidCategory(data.category)){
        errors.category = 'Invalid category'
    }
    if (isEmpty(data.name)) errors.name = 'Must not be empty';
    if (isEmpty(data.address)) errors.address = 'Must not be empty';
    if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}