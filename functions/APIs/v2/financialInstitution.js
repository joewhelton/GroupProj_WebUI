const { rdb } = require('../../util/admin');

const { validateFinancialInstitution } = require('../../util/validators');

exports.getAllFinancialInstitutions = (request, response) => {
    const fiRef = rdb.ref('/financialInstitutions');
    fiRef.once("value")
        .then( (data) => {
            const fiData = data.val();
            return response.status(201).json({fiData});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

exports.getFinancialInstitution = (request, response) => {
    const fiID = request.params.fiID;
    const fiRef = rdb.ref(`/financialInstitutions/${fiID}`);
    fiRef.once("value")
        .then( (data) => {
            const fiData = data.val();
            return response.status(201).json({fiData});
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ error });
        });
}

exports.newFinancialInstitution = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const newInstitution = {
        name: request.body.name,
        address: request.body.address,
        phoneNumber: request.body.phoneNumber,
        email: request.body.email,
        category: request.body.category,
    }

    newInstitution.paymentDetails = (newInstitution.category === 'BROKER')
        ? {
            bic: request.body.paymentDetails.bic,
            iban: request.body.paymentDetails.iban
        }
        : {};

    const { valid, errors } = validateFinancialInstitution(newInstitution);
    if (!valid) return response.status(400).json(errors);

    const fiRef = rdb.ref('/financialInstitutions');
    const newFiRef = fiRef.push();
    newFiRef
        .set(newInstitution)
        .then(()=>{
            let key = newFiRef.key;
            return response.status(201).json({key});
        }).catch((error) => {
        console.log(error);
        response.status(500).json({ error });
    });
}

exports.updateFinancialInstitution = (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const fiID = request.params.fiID;
    const updateInstitution = {
        name: request.body.name,
        address: request.body.address,
        phoneNumber: request.body.phoneNumber,
        email: request.body.email,
        category: request.body.category,
        paymentDetails: {
            bic: request.body.bic,
            iban: request.body.iban
        }
    }

    const { valid, errors } = validateFinancialInstitution(updateInstitution);
    if (!valid) return response.status(400).json(errors);

    const fiRef = rdb.ref(`/financialInstitutions/${fiID}`);
    fiRef.update(updateInstitution)
        .then(() => {
            return response.json({message: 'Updated successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot Update the value"
            });
        });
}

exports.deleteFinancialInstitution = async (request, response) => {
    if(!request.user.userRoles.sysAdmin){
        return response.status(403).json({ error: 'Unauthorized operation' });
    }
    const fiID = request.params.fiID;
    const fiRef = rdb.ref(`/financialInstitutions/${fiID}`);
    fiRef.remove()
        .then( async () => {
            const snapshot = await getLoanOfficers(fiID);
            await snapshot.forEach(async (loanOfficer) => {
                const userRef = rdb.ref(`/users/${loanOfficer.key}/profile`);
                await userRef.update({financialInstitutionID: ''});
            });
            return response.json({message: 'Deleted successfully'});
        })
        .catch((error) => {
            return response.status(500).json({
                message: "Cannot delete the record"
            });
        });
    return response.json({message: 'Deleted successfully'});
}

const getLoanOfficers = async (fiID) => {
    const fiRef = rdb.ref('/users');
    const query = fiRef.orderByChild("profile/financialInstitutionID").equalTo(fiID);
    return await query.once('value');
}

exports.getLoanOfficersByFiID = async (request, response) => {
    const fiID = request.params.fiID;
    const snapshot = await getLoanOfficers(fiID);
    return response.status(201).json(snapshot.val() || {});
}