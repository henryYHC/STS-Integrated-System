    'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    request = require('request'),
    soap = require('soap'),
    fs = require('fs'),
    Walkin = mongoose.model('Walkin');

// Get credentials (& reformat wsdl url)
var credentialFilePath = __dirname + '/../../credentials/ServiceNow.json',
    credentialFile = fs.readFileSync(credentialFilePath, 'utf8'),
    credential = JSON.parse(credentialFile);

if(credential.username){
    var index = credential.wsdl_url.indexOf('//') + '//'.length;
    credential.wsdl_url = credential.wsdl_url.substring(0, index) + credential.username + ':' + credential.password + '@' + credential.wsdl_url.substring(index);
}

var popOpt = [
    { path : 'user', model : 'User', select : 'username'},
    { path : 'lastUpdateTechnician', model : 'User', select : 'username'},
    { path : 'serviceTechnician', model : 'User', select : 'username'},
    { path : 'resoluteTechnician', model : 'User', select : 'username'}
];

var getTemplateObj = function(walkin){
    var subject = 'STS: ', os = walkin.os;
    var obj = { short_description: '', category1 : '', category2 : '', category3 : '' };

    switch(walkin.resolutionType){
        case 'DooleyNet':
            subject += 'DN ' + walkin.deviceType;
            if(walkin.deviceType === 'Other') subject += ' ' + walkin.otherDevice;

            obj.type = 'Service Request';
            obj.category1 = 'Application Management';
            obj.category2 = 'Access';
            obj.category3 = 'Inaccessible';
            break;

        case 'EmoryUnplugged':
            subject += 'EU ';
            if(os === 'N/A') os = walkin.otherDevice;
            else if(os.indexOf('(') >= 0) os = os.substring(0, os.indexOf('(')).trim();

            switch(walkin.deviceCategory){
                case 'Computer':
                    subject += os;
                    break;

                case 'Phone/Tablet':
                    subject += 'Mobile ' + os;
                    break;

                default:
                    subject += 'Unknown';
            }

            obj.category1 = 'Desktop Management';
            obj.category2 = 'Software';
            obj.category3 = 'Error';
            break;

        case 'Hardware':
            subject += 'HW';
            obj.category1 = 'Desktop Management';
            obj.category2 = 'Hardware';
            obj.category3 = 'Failure';
            break;

        case 'Office365':
            subject += 'O365';
            obj.category1 = 'Application Management';
            obj.category2 = 'Software';
            obj.category3 = 'Error';
            break;

        case 'OS Troubleshooting':
            if(os === 'N/A') os = walkin.otherDevice;
            else if(os.indexOf('(') >= 0) os = os.substring(0, os.indexOf('(')).trim();
            subject += 'OS TblSh ' + os;

            obj.category1 = 'Desktop Management';
            obj.category2 = 'OS/Firmware';
            obj.category3 = 'Error';
            break;

        case 'Password Resets':
            subject += 'PwdReset';

            obj.category1 = 'Application Management';
            obj.category2 = 'Access';
            obj.category3 = 'Inaccessible';
            break;

        case 'Check-in':
            subject += 'Converted to CI';

            obj.category1 = 'Desktop Management';
            obj.category2 = 'OS/Firmware';
            obj.category3 = 'Error';
            break;

        case 'Other':
            subject += 'Other ' + walkin.otherResolution;

            obj.category1 = 'Desktop Management';
            obj.category2 = 'Software';
            obj.category3 = 'Error';
            break;

        default:
            subject += 'Unknown Template';
    }

    obj.short_description = subject;
    return obj;
};

var formulateWalkin = function(walkin, soapAction){
    var template = getTemplateObj(walkin);

    return {
        // Request info
        u_soap_action : soapAction,
        u_incident_state : 'Resolved',
        u_resolution_code : 'Configure',

        // Static info
        u_category_1 : template.category1,
        u_category_2 : template.category2,
        u_category_3 : template.category3,
        u_configuration_item : 'Student Technology',
        u_impact : '4 – Minor/Localized',
        u_suppress_notification : 'Yes',
        u_urgency : '4 - Low',

        // Walk-in info
        u_correlation_id : walkin._id,
        u_record_type:  (template.type)? template.type :'Incident',
        u_reported_source :  'Walk In',
        u_customer : walkin.user.username,
        u_problem : walkin.description,
        u_liability_agreement : walkin.liabilityAgreement,
        u_short_description : template.short_description,
        u_resolution : walkin.resolution,
        u_work_note : walkin.workNote,

        // Assignment info
        u_assigned_to : walkin.serviceTechnician.username,
        u_last_update_tech : walkin.resoluteTechnician.username,
        u_assignment_group : 'LITS: Student Digital Life',

        // Time log
        u_duration : walkin.resolutionTime.getTime() - walkin.created.getTime(),
        u_time_worked : walkin.resolutionTime.getTime() - walkin.serviceStartTime.getTime(),
        u_last_update : walkin.updated.getTime(),
        u_actual_resolve_at : walkin.resolutionTime.getTime(),
        u_time_of_incident : walkin.created.getTime()
    };
};

exports.CREATE = 'CREATE';
exports.UPDATE = 'UPDATE';

exports.syncWalkinIncident = function(action, walkin, next){
    var data = formulateWalkin(walkin, action);

    soap.createClient(credential.wsdl_url, function(err, client){
        if(err) return console.log('Client Creation Error: ' + err);
        client.setSecurity(new soap.BasicAuthSecurity(credential.username, credential.password));

        client.insert(data, function(err, response){
            if(err) return console.log('Insert Request Error: ' + err);

            if(response.sys_id && response.display_value){
                switch(response.status){
                    case 'inserted':
                        walkin.snSysId = response.sys_id; walkin.snValue = response.display_value;
                        walkin.save(function(err){ 
                            if(err) return console.log(err); 
                            else console.log('INFO: ' + walkin.snValue + ' inserted.');
                        });
                        break;
                    case 'updated':
                        if(!walkin.snValue || walkin.snSysId){
                            walkin.snSysId = response.sys_id;
                            walkin.snValue = response.display_value;
                        }
                        walkin.save(function(err){ 
                            if(err) return console.log('Walk-in Save Error: ' + err); 
                            else console.log('INFO: ' + walkin.snValue + ' updated.');
                        });
                        break;
                    default:
                        return console.error('Invalid Status Error: ' + response);
                }
            }
            else console.log('Field(s) Missing Error: '+response);

            if(next) return next(walkin);
            else     return walkin;
        });
    });
};

var syncUnsyncedWalkinIncidentAux = function(client, id, action, walkins){
    if(id < walkins.length){
        var walkin = walkins[id],
            data = formulateWalkin(walkin, action);

        client.insert(data, function(err, response){
            if(err) return console.error(err);

            else if(response.sys_id && response.display_value){
                switch(response.status){
                    case 'inserted':
                        walkin.snSysId = response.sys_id; walkin.snValue = response.display_value;
                        walkin.save(function(err){ 
                            if(err) return console.log(err); 
                            else console.log('INFO: ' + walkin.snValue + ' inserted. (scheduled)');
                        });
                        break;
                    case 'updated':
                        if(!walkin.snValue || walkin.snSysId){
                            walkin.snSysId = response.sys_id;
                            walkin.snValue = response.display_value;
                        }
                        walkin.save(function(err){ 
                            if(err) return console.error(err);
                            else console.log('INFO: ' + walkin.snValue + ' updated. (scheduled)');
                        });
                        break;
                    default: return console.error(response);
                }
                syncUnsyncedWalkinIncidentAux(client, id+1, action, walkins);
            }
            else return console.error(response);
        });
    }
};

exports.syncUnsyncedWalkinIncidents = function(action, next){
    Walkin.find({isActive : true, status : 'Completed', snValue : ''})
        .populate(popOpt).exec(function(err, walkins){
        if(err) return console.error(err);

        soap.createClient(credential.wsdl_url, function(err, client){
            if(err) return console.error(err);
            client.setSecurity(new soap.BasicAuthSecurity(credential.username, credential.password));
            if(walkins.length)  syncUnsyncedWalkinIncidentAux(client, 0, action, walkins);

            if(next) return next();
        });
    });
};
