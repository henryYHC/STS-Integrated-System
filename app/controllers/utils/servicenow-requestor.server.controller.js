    'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    request = require('request'),
    soap = require('soap'),
    fs = require('fs'),
    async = require('async'),
    Walkin = mongoose.model('Walkin'),
    Checkin = mongoose.model('Checkin'),
    ContactLog = mongoose.model('ContactLog'),
    logger = require('./logger.server.controller.js');

// Get credentials (& reformat wsdl url)
var credentialFilePath = __dirname + '/../../credentials/ServiceNow.json',
    credentialFile = fs.readFileSync(credentialFilePath, 'utf8'),
    credential = JSON.parse(credentialFile);

if(credential.username){
    var index = credential.wsdl_url.indexOf('//') + '//'.length;
    credential.wsdl_url = credential.wsdl_url.substring(0, index) + credential.username + ':' + credential.password + '@' + credential.wsdl_url.substring(index);
}

var popOpt_walkin = [
    { path : 'user', model : 'User', select : 'username'},
    { path : 'lastUpdateTechnician', model : 'User', select : 'username'},
    { path : 'serviceTechnician', model : 'User', select : 'username'},
    { path : 'resoluteTechnician', model : 'User', select : 'username'}
];

var popOpt_checkin = [
    { path : 'user', model : 'User', select : 'firstName lastName displayName username phone location verified'},
    { path : 'walkin', model : 'Walkin', select : 'description resoluteTechnician deviceCategory deviceType os otherDevice'},
    { path : 'serviceLog', model : 'ServiceEntry', select : 'type description createdBy createdAt'},
    { path : 'completionTechnician', model : 'User', select : 'username displayName'},
    { path : 'verificationTechnician', model : 'User', select : 'username displayName'},
    { path : 'checkoutTechnician', model : 'User', select : 'username displayName'},
    { path : 'contactLog', model : 'ContactLog'}
];

var popOpt_checkin_walkin = [{ path : 'walkin.resoluteTechnician',  model : 'User', select : 'username displayName'}];

var getWalkinTemplateObj = function(walkin){
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
                case 'Computer': 		subject += os;				break;
                case 'Phone/Tablet': 	subject += 'Mobile ' + os;	break;
                default: 				subject += 'Unknown';
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

        case 'Printing':
            subject += 'Printing';

            obj.category1 = 'Print Management';
            obj.category2 = 'User Printing';
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

        default: subject += 'Unknown Template';
    }

    obj.short_description = subject;
    return obj;
};

var getCheckinTemplateObj = function(checkin){
	return {
        short_description: 'STS: CI: Diagnose and Repair',
		category1: 'Desktop Management',
		category2: 'OS/Firmware',
		category3: 'Error'
	};
};

var formulateWalkin = function(walkin, soapAction){
    var template = getWalkinTemplateObj(walkin);

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
        u_problem : 'Problem:\n' + walkin.description,
        u_liability_agreement : walkin.liabilityAgreement,
        u_short_description : template.short_description,
        u_resolution : walkin.resolution,
        u_work_note : 'Work Notes:\n' + walkin.workNote,

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

 var formulateCheckin = function(checkin, soapAction){
     var worknote = '', template = getCheckinTemplateObj(checkin);
     worknote += 'Device : ' + checkin.deviceManufacturer + ' ' + checkin.deviceModel + '\n';
     worknote += 'OS : ' + checkin.walkin.os + ' (' + checkin.deviceInfoOS.join(', ') + ')\n';
     worknote += 'Item received: ' + checkin.itemReceived.join(', ') + '\n\n';
     worknote += checkin.serviceLog.map(function(log){ return log.description; }).join('\n');

     if(!checkin.completionTime)
         checkin.completionTime = checkin.created.getTime() + (1000*60*60*24*4);

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

         // Check-in info
         u_correlation_id : 'CI'+checkin._id,
         u_record_type:  (template.type)? template.type :'Incident',
         u_reported_source :  'Tech Initiated',
         u_customer : checkin.user.username,
         u_problem : checkin.preDiagnostic,
         u_liability_agreement : checkin.liabilitySig !== '',
         u_short_description : template.short_description,
         u_resolution : 'Please see work notes for detailed description of resolution.',
         u_work_note : worknote,

         // Assignment info
         u_assigned_to : checkin.walkin.resoluteTechnician.username,
         u_last_update_tech : checkin.completionTechnician.username,
         u_assignment_group : 'LITS: Student Digital Life',

         // Time log
         u_duration : checkin.completionTime.getTime() - checkin.created.getTime(),
         u_time_worked : checkin.completionTime.getTime() - checkin.created.getTime(),
         u_last_update : checkin.updated.getTime(),
         u_actual_resolve_at : checkin.completionTime.getTime(),
         u_time_of_incident : checkin.created.getTime()
     };
 };

exports.CREATE = 'CREATE';	exports.UPDATE = 'UPDATE';
exports.WALKIN = 'WALKIN';	exports.CHECKIN = 'CHECKIN';

exports.syncIncident = function(action, type, ticket, next){
    var data;
    switch(type){
        case this.WALKIN:   data = formulateWalkin(ticket, action);     break;
        case this.CHECKIN:  data = formulateCheckin(ticket, action);    break;
        default:    return console.error('Invalid ticket type: ' + type);
    }

    soap.createClient(credential.wsdl_url, function(err, client){
        if(err) return console.error('Client Creation Error: ' + err);
        client.setSecurity(new soap.BasicAuthSecurity(credential.username, credential.password));

        client.insert(data, function(err, response){
            if(err) return console.error('Insert Request Error: ' + err);

            if(response.sys_id && response.display_value){
                switch(response.status){
                    case 'inserted':
                        ticket.snSysId = response.sys_id;
                        ticket.snValue = response.display_value;

                        ticket.save(function(err){
                            if(err) return console.error(err);
                            else{
                                console.log('INFO: ' + type + ' ' + ticket.snValue + ' inserted.');
                                logger.log('INSERTED ' + JSON.stringify(ticket));
                            }
                        });
                        break;
                    case 'updated':
                        if(!ticket.snValue || ticket.snSysId){
                            ticket.snSysId = response.sys_id;
                            ticket.snValue = response.display_value;
                        }

                        ticket.save(function(err){
                            if(err) return console.error('Ticket Save Error: ' + err);
                            else{
                                console.log('INFO: ' + type + ' ' + ticket.snValue + ' updated.');
                                logger.log('UPDATED ' + JSON.stringify(ticket));
                            }
                        });
                        break;
                    default:
                        console.error('Invalid Status Error:');
                        return console.error(response);
                }
            }
            else{
                console.error('Field(s) Missing Error:');
                console.error(response);
            } 

            if(next) return next(ticket);
            else     return ticket;
        });
    });
};

var syncUnsyncedTicketsAux = function(client, id, action, type, tickets){
    if(id < tickets.length){
        var data, ticket = tickets[id];

        switch(type){
            case exports.WALKIN:   data = formulateWalkin(ticket, action);     break;
            case exports.CHECKIN:  data = formulateCheckin(ticket, action);    break;
            default:    return console.error('Invalid ticket type: ' + type);
        }

        client.insert(data, function(err, response){
            if(err) return console.error(err);

            else if(response.sys_id && response.display_value){
                switch(response.status){
                    case 'inserted':
                        ticket.snSysId = response.sys_id; ticket.snValue = response.display_value;
                        ticket.save(function(err){
                            if(err) return console.log(err); 
                            else{
                                console.log('INFO: ' + type + ' ' + ticket.snValue + ' inserted. (scheduled)');
                                logger.log('INSERTED ' + JSON.stringify(ticket));
                            }
                        });
                        break;
                    case 'updated':
                        if(!ticket.snValue || ticket.snSysId){
                            ticket.snSysId = response.sys_id;
                            ticket.snValue = response.display_value;
                        }
                        ticket.save(function(err){
                            if(err) return console.error(err);
                            else{
                                console.log('INFO: '+ type + ' ' + ticket.snValue + ' updated. (scheduled)');
                                logger.log('UPDATED ' + JSON.stringify(ticket));
                            }
                        });
                        break;
                    default: 
                        console.error('Invalid Status Error:');
                        return console.error(response);
                }
                syncUnsyncedTicketsAux(client, id+1, action, type, tickets);
            }
            else{
                console.error('Field(s) Missing Error:');
                console.error(response);
            } 
        });
    }
};

exports.syncUnsyncedTickets = function(action, type){
    var query = {isActive : true, status : 'Completed', snValue : ''};

    async.waterfall([
        function(callback){
            switch(type){
                case exports.WALKIN:
                    Walkin.find(query).populate(popOpt_walkin).exec(function(err, walkins){
                        if(err) callback(console.error(err));
                        else return callback(null, walkins);
                    });
                    break;
                case exports.CHECKIN:
                    Checkin.find(query).populate(popOpt_checkin).exec(function(err, checkins){
                        if(err) callback(console.error(err));

                        Walkin.populate(checkins, popOpt_checkin_walkin, function(err, checkins){
                            if(err) callback(console.error(err));
                            else return callback(null, checkins);
                        });
                    });
                    break;
                default:    callback(console.error('Invalid ticket type: ' + type), null);
            }
        },
        function(tickets, callback){
            callback(null);
            soap.createClient(credential.wsdl_url, function(err, client){
                if(err) return console.error(err);
                client.setSecurity(new soap.BasicAuthSecurity(credential.username, credential.password));
                if(tickets.length)
                    syncUnsyncedTicketsAux(client, 0, action, type, tickets);
                callback(null);
            });
        }
    ]);
};
