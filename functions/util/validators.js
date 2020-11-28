const { admin, rdb } = require('./admin');

const isEmpty = (string) => {
    try {
        if (string.trim() === '') return true;
        else return false;
    } catch(err){
        return false;   //Happens if we try to trim an empty or non-string value
    }
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

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
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

exports.validateFinancialInstitution = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isInValidCategory(data.category)){
        errors.category = 'Invalid category'
    }
    if (data.category === 'BROKER'){
        if (isEmpty(data.paymentDetails.bic)) errors.paymentDetails.bic = 'Required for a Brokerage';
        if (isEmpty(data.paymentDetails.iban)) errors.paymentDetails.iban = 'Required for a Brokerage';
    }
    if (isEmpty(data.name)) errors.name = 'Must not be empty';
    if (isEmpty(data.address)) errors.address = 'Must not be empty';
    if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateNewLoanApplication = (data) => {
    let errors = {};

    if (isEmpty(data.clientId)) {
        errors.clientId = 'Must not be empty';
    }
    if (isEmpty(data.amount)) errors.amount = 'Must not be empty';
    if (isEmpty(data.term)) errors.term = 'Must not be empty';
    if (isEmpty(data.propertyArea)) errors.propertyArea = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}

exports.validateHousePriceQuery = (data) => {
    let errors = {};

    if(isEmpty(data.sale_yr) || !isNumeric(data.sale_yr)) errors.sale_yr = 'Must be a non-empty number';
    if(isEmpty(data.sale_month) || !isNumeric(data.sale_month)) errors.sale_month = 'Must be a non-empty number';
    if(isEmpty(data.sale_day) || !isNumeric(data.sale_day)) errors.sale_day = 'Must be a non-empty number';
    if(isEmpty(data.bedrooms) || !isNumeric(data.bedrooms)) errors.bedrooms = 'Must be a non-empty number';
    if(isEmpty(data.bathrooms) || !isNumeric(data.bathrooms)) errors.bathrooms = 'Must be a non-empty number';
    if(isEmpty(data.sqft_living) || !isNumeric(data.sqft_living)) errors.sqft_living = 'Must be a non-empty number';
    if(isEmpty(data.sqft_lot) || !isNumeric(data.sqft_lot)) errors.sqft_lot = 'Must be a non-empty number';
    if(isEmpty(data.floors) || !isNumeric(data.floors)) errors.floors = 'Must be a non-empty number';
    if(isEmpty(data.waterfront) || !isNumeric(data.waterfront)) errors.waterfront = 'Must be a non-empty number';
    if(isEmpty(data.view) || !isNumeric(data.view)) errors.view = 'Must be a non-empty number';
    if(isEmpty(data.condition) || !isNumeric(data.condition)) errors.condition = 'Must be a non-empty number';
    if(isEmpty(data.grade) || !isNumeric(data.grade)) errors.grade = 'Must be a non-empty number';
    if(isEmpty(data.sqft_above) || !isNumeric(data.sqft_above)) errors.sqft_above = 'Must be a non-empty number';
    if(isEmpty(data.sqft_basement) || !isNumeric(data.sqft_basement)) errors.sqft_basement = 'Must be a non-empty number';
    if(isEmpty(data.yr_built) || !isNumeric(data.yr_built)) errors.yr_built = 'Must be a non-empty number';
    if(!isNumeric(data.yr_renovated)) errors.yr_renovated = 'Must be empty or a number';
    if(isEmpty(data.zipcode) || !isNumeric(data.zipcode)) errors.zipcode = 'Must be a non-empty number';
    if(isEmpty(data.lat) || !isNumeric(data.lat)) errors.lat = 'Must be a non-empty number';
    if(isEmpty(data.long) || !isNumeric(data.long)) errors.long = 'Must be a non-empty number';
    if(isEmpty(data.sqft_living15) || !isNumeric(data.sqft_living15)) errors.sqft_living15 = 'Must be a non-empty number';
    if(isEmpty(data.sqft_lot15) || !isNumeric(data.sqft_lot15)) errors.sqft_lot15 = 'Must be a non-empty number';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
}