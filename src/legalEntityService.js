import Nedb from 'nedb';
import $q from 'q';

class LegalEntityService {
    constructor() {        
        this.$q = $q;
        this.legalEntities = new Nedb({ filename: __dirname + '/db/legalentities', autoload: true });

        // init the db once with sample data 
        // let leList = this.getLegalEntities();

        this.getLegalEntities().then(legalEntities => {
            console.log('number of le in db: ' + legalEntities.length);
            if(legalEntities.length == 0){
                // nothing in db yet. fill in with some sample data
                this.addSampleLegalEntitiesToDB();
                console.log('added samples le to database.');
            }
        });
    }

    // return a list of all legal entities
    getLegalEntities() {        
        let deferred = this.$q.defer();
        this.legalEntities.find({}, function (err, rows) {
            if (err) deferred.reject(err);
            deferred.resolve(rows);
        });      
        return deferred.promise;  
    }
    
    // return a list of legal entities in role of 'Regulatory Authority'
    getRegulatoryAuthorities() {        
        let deferred = this.$q.defer();
        this.legalEntities.find({'LEGALENTITY_TYPE.VALUE': 'Regulatory Authority'}, function (err, rows) {
            if (err) deferred.reject(err);
            deferred.resolve(rows);
        });      
        return deferred.promise;  
    }
    
    // return a list of legal entities NOT in role of 'Regulatory Authority'
    getNonRALegalEntities() {        
        let deferred = this.$q.defer();
        this.legalEntities.find({'LEGALENTITY_TYPE.VALUE': {$ne : 'Regulatory Authority'}}, function (err, rows) {
            if (err) deferred.reject(err);
            deferred.resolve(rows);
        });      
        return deferred.promise;  
    }
        
    getLegalEntityById(id) {
        let deferred = this.$q.defer();
        this.legalEntities.find({'_id': id }, function (err, result) {
            if (err) deferred.reject(err);
            deferred.resolve(result);
        });       
        return deferred.promise;
    }
    
    getLegalEntityByLEId(leId) {
        let deferred = this.$q.defer();
        this.legalEntities.find({'_identifier': leId }, function (err, result) {
            if (err) deferred.reject(err);
            deferred.resolve(result);
        });       
        return deferred.promise;
    }
        
    getLegalEntityByName(name) {
        let deferred = this.$q.defer();
        var re = new RegExp(name, 'i');
        let condition = { $regex: re };
        this.legalEntities.find({'LEGALENTITY_NAME': condition }, function (err, result) {
            if (err) deferred.reject(err);
            deferred.resolve(result);
        });  
        return deferred.promise;        
    }
    
    createLegalEntity(legalEntity) { 
        let deferred = this.$q.defer();
        this.legalEntities.insert(legalEntity, function (err, result) {
            console.log(err)
            if (err) deferred.reject(err);
            deferred.resolve(result);
        });
        return deferred.promise;
    }
    
    deleteLegalEntity(id) {            
        let deferred = this.$q.defer();
        this.legalEntities.remove({'_id': id}, function (err, res) {
            if (err) deferred.reject(err);
            console.log(res);
            deferred.resolve(res.affectedRows);
        });                
        return deferred.promise;
    }
    
    updateLegalEntity(legalEntity) {
        let deferred = this.$q.defer();
        this.legalEntities.update({_id: legalEntity._id}, legalEntity, {}, function (err, numReplaced) {
            if (err) { 
                deferred.reject(err);
                console.log(err);
            }
            deferred.resolve(numReplaced);
        });
        return deferred.promise;
    }

    addSampleLegalEntitiesToDB(){  
        // add sample legal entities to database
        let legalEntities =  [
            {"_identifier":"LE_ID_PPPWW_AU","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:54C8D6A7-30AC-46F0-BA9C-B4F63D51B132","LEGALENTITY_NAME":"Plant Protection Products Worlwide Australia","LEGALENTITY_TYPE":{"VALUE":"Company","VALUE_DECODE":"Company"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Plant Protection Products Worlwide Australia","DEPARTMENT":"Global Regulatory Affairs","TITLE":"Dr.","FIRSTNAME":"Marc","LASTNAME":"Planter","PHONE":"+61-2-9354-4000-463","MOBILE":"+61-0410499665","FAX":null,"EMAIL":"marc.planter@pppww.com"}],"CONTACT_ADDRESS":{"STREET1":"601 Pacific Highway","STREET2":"-/-","ZIPCODE":"2065","CITY":"St Leonards","STATE":"NSW","COUNTRY":{"VALUE":"AU","VALUE_DECODE":"Australia"},"PHONE":"+61-2-9354-4000","FAX":"+61-2-9354-4000-99","EMAIL":"info@pppww.au","WEBSITE":"http://www.pppww.com/au"}},
            {"_identifier":"LE_ID_PPPWW_CA","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:60BF5221-9BC5-47C3-A6E6-EC2AD872172B","LEGALENTITY_NAME":"Plant Protection Products Worlwide Canada","LEGALENTITY_TYPE":{"VALUE":"Company","VALUE_DECODE":"Company"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Plant Protection Products Worlwide Canada","DEPARTMENT":"Global Regulatory Affairs","TITLE":null,"FIRSTNAME":"Peter","LASTNAME":"Walshe","PHONE":"+1 905-763-0560","MOBILE":"+1 379-453-2228","FAX":"+1 905-763-0560-11","EMAIL":"peter.walshe@pppww.com"}],"CONTACT_ADDRESS":{"STREET1":"125 Commerce Valley Drive West","STREET2":"-/-","ZIPCODE":"L3T 7W4","CITY":"Markham","STATE":"ON","COUNTRY":{"VALUE":"CA","VALUE_DECODE":"Canada"},"PHONE":"+1 905-763-0560","FAX":"+41 905-763-0560-11","EMAIL":"info@pppww.ca","WEBSITE":"http://www.pppww.com/ca"}},
            {"_identifier":"LE_ID_BVL","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:1AB3B93C-4920-4F3A-BE4B-9298E09CC5CC","LEGALENTITY_NAME":"Bundesanstalt für Verbraucherschutz und Landwirtschaft","LEGALENTITY_TYPE":{"VALUE":"Regulatory Authority","VALUE_DECODE":"Regulatory Authority"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Unit 204: EC Procedures","DEPARTMENT":"Department 2: Plant Protection Products","TITLE":"Mr.","FIRSTNAME":"Hermann","LASTNAME":"Köppen","PHONE":"+49 531 299 4567","MOBILE":"-/-","FAX":"+49 531 299 3003","EMAIL":"hermann.koeppen@bvl.bund.de"}],"CONTACT_ADDRESS":{"STREET1":"Messeweg 11/12","STREET2":"-/-","ZIPCODE":"38104","CITY":"Braunschweig","STATE":"...","COUNTRY":{"VALUE":"DE","VALUE_DECODE":"Germany"},"PHONE":"+49 (0)531 299 5","FAX":"+49 (0)531 299 3002","EMAIL":"info@bvl.de","WEBSITE":"ttp://www.bvl.de"}},
            {"_identifier":"LE_ID_IBAMA","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:legal:9F60237F-7445-4BAA-9235-3B6FF1FDA271","LEGALENTITY_NAME":"Instituto Brasileiro do Meio Ambiente","LEGALENTITY_TYPE":{"VALUE":"Regulatory Authority","VALUE_DECODE":"Regulatory Authority"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"IBAMA","DEPARTMENT":null,"TITLE":null,"FIRSTNAME":"João","LASTNAME":"Gilberto","PHONE":"+55 61-3316-1212-265","MOBILE":"+55 21-99635-9499","FAX":null,"EMAIL":"joao.gilberto@ibama.gov.br"}],"CONTACT_ADDRESS":{"STREET1":"SCEN Trecho 2","STREET2":"Ed. Sede - Cx. Postal n° 09566","ZIPCODE":"70818-900","CITY":"Brasília","STATE":"DF","COUNTRY":{"VALUE":"BR","VALUE_DECODE":"Brasil"},"PHONE":"+55 61-3316-1212","FAX":"+55 61-3316-1212-433","EMAIL":"sic@ibama.gov.br","WEBSITE":"http://www.ibama.gov.br/"}},
            {"_identifier":"LE_ID_PMRA","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:5B39944B-E7CD-4BC9-BFA0-9316D1A9592E","LEGALENTITY_NAME":"Pest Management Regulatory Agency ","LEGALENTITY_TYPE":{"VALUE":"Regulatory Authority","VALUE_DECODE":"Regulatory Authority"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Chemicals","DEPARTMENT":"Submissions","TITLE":"Mr.","FIRSTNAME":"Marcus","LASTNAME":"Miller","PHONE":"613-736-3602","MOBILE":"613-612-0554","FAX":"-/-","EMAIL":"marcus.miller@hc-sc.gc.ca"}],"CONTACT_ADDRESS":{"STREET1":"2720 Riverside Drive","STREET2":"B2720 Riverside Drive","ZIPCODE":"6606D2 / K1A 0K9","CITY":"6606D2 / K1A 0K9","STATE":"Ontario","COUNTRY":{"VALUE":"CA","VALUE_DECODE":"Canada"},"PHONE":"1-613-736-3799 or 1-800-267-6315","FAX":"1-613-736-3798","EMAIL":"info@hc-sc.gc.ca","WEBSITE":"http://www.hc-sc.gc.ca/contact/cps-spc/pmra-arla/infoserv-eng.php"}},
            {"_identifier":"LE_ID_PPPWW_BR","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:C9910E3B-8B6E-41ED-AADA-A4E516211866","LEGALENTITY_NAME":"Plant Protection Products Worlwide Brasil","LEGALENTITY_TYPE":{"VALUE":"Company","VALUE_DECODE":"Company"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Plant Protection Products Worlwide Brasil","DEPARTMENT":"Regulatory Department","TITLE":null,"FIRSTNAME":"Ary","LASTNAME":"Barroso","PHONE":"+55 11 3444-3500","MOBILE":"+55 11 9 7307 1799","FAX":"+55 11 3444-3500","EMAIL":"ary.barroso@pppww.com"}],"CONTACT_ADDRESS":{"STREET1":"Avenida Alfredo Egídio de Souza Aranha, 100","STREET2":null,"ZIPCODE":"04726-170","CITY":"Vila Cruzeiro, São Paulo","STATE":"SP","COUNTRY":{"VALUE":"BR","VALUE_DECODE":"Brasil"},"PHONE":"+55 11 3444-3500","FAX":"+55 11 3444-3501","EMAIL":"info@pppww.br","WEBSITE":"http://www.pppww.com/br"}},
            {"_identifier":"LE_ID_APVMA","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:F68B42B5-F54B-4E14-A859-B36F487E42C2","LEGALENTITY_NAME":"Australian Pesticides and Veterinary Medicines Authority","LEGALENTITY_TYPE":{"VALUE":"Regulatory Authority","VALUE_DECODE":"Regulatory Authority"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"APVMA","DEPARTMENT":"Regulatory Affairs","TITLE":null,"FIRSTNAME":"Susan","LASTNAME":"Miller","PHONE":"+61 2 6210 4701 3544","MOBILE":"+61 413 025 837","FAX":"-/-","EMAIL":"susan.miller@apvma.gov.au"}],"CONTACT_ADDRESS":{"STREET1":"18 Wormald Street","STREET2":null,"ZIPCODE":"2609","CITY":"Symonston","STATE":"ACT","COUNTRY":{"VALUE":"AU","VALUE_DECODE":"Australia"},"PHONE":"+61 2 6210 4701","FAX":"+61 2 6210 4701 234","EMAIL":"enquiries@apvma.gov.au","WEBSITE":"http://apvma.gov.au"}},
            {"_identifier":"LE_ID_PPPWW_DE","METADATA_STATUS":{"VALUE":"New","VALUE_DECODE":"New"},"LEGALENTITY_PID":"urn:ghsts:6440A2D4-2733-4E40-A632-81FC7681DC89","LEGALENTITY_NAME":"Plant Protection Products Worlwide GmbH Germany","LEGALENTITY_TYPE":{"VALUE":"Company","VALUE_DECODE":"Company"},"OTHER_NAME":[],"LEGALENTITY_IDENTIFIER":[],"CONTACT_PERSON":[{"ORGANISATION":"Plant Protection Products Worlwide GmbH Germany","DEPARTMENT":"Global Regulatory Affairs","TITLE":"Dr.","FIRSTNAME":"Franz","LASTNAME":"Bundschuh","PHONE":"+49 43665 764-123","MOBILE":"+49 176 34576233","FAX":"+49 43665 764-11","EMAIL":"franz.bundschuh@pppww.com"},{"ORGANISATION":"Plant Protection Productsxxxxxxxxxxxxxxx Worlwide GmbH Germany","DEPARTMENT":"Global Regulatory Affairs","TITLE":"Dr.","FIRSTNAME":"Buntsen","LASTNAME":"Honeydue","PHONE":"+49 4366xxx5 764-123","MOBILE":"+49 17xxxx6 34576344","FAX":"+49 4366xxxxx5 764-11","EMAIL":"buntsen.honeydue@pppww.com"}],"CONTACT_ADDRESS":{"STREET1":"Hans-Klawitter-Str. 23-25","STREET2":null,"ZIPCODE":"35442","CITY":"Buxtehude","STATE":"-/-","COUNTRY":{"VALUE":"DE","VALUE_DECODE":"Germany"},"PHONE":"+49 43665 764-0","FAX":"+49 43665 764-11","EMAIL":"info@pppww.de","WEBSITE":"http://www.pppww.com/de"}}
        ]; 
        this.createLegalEntity(legalEntities);     
    }     
}

export { LegalEntityService }


