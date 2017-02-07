import express from 'express';
import {LegalEntityService} from './legalEntityService';
import {DrugService} from './drugService';
import bodyParser from 'body-parser';

let port = 3000;
let app = express();
let router = express.Router();   
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', function(req, res) {
    res.send('Welcome to the service. To get legal entities, use /legal_entities for your query.');
});

// Drugs
router.get('/drugs', function(req, res) {
    let drugService = new DrugService();
    drugService.getDrugs().then(drugs => {        
        let drugList = [].concat(drugs);
        res.json(drugList);
    });        
});

router.get('/drugs/brand_name/:name', function(req, res) {
    let drugService = new DrugService();
    drugService.getDrugByBrandName(req.params.name).then(drugs => {
        console.log('checking number of drugs for getDrugByBrandName: ' + req.params.name);
       let drugList = [].concat(drugs);
        res.json(drugList);
    });        
});

router.get('/drugs/drug_code/:code', function(req, res) {
    let drugService = new DrugService();
    drugService.getDrugByDrugCode(req.params.code).then(drugs => {
        console.log('checking number of drugs for getDrugByDrugCode: ' + req.params.code);
       let drugList = [].concat(drugs);
        res.json(drugList);
    });        
});

router.get('/drugs/mfg_code/:code', function(req, res) {
    let drugService = new DrugService();
    drugService.getDrugByMFGCode(req.params.code).then(drugs => {
        console.log('checking number of drugs for getDrugByMFGCode: ' + req.params.code);
       let drugList = [].concat(drugs);
        res.json(drugList);
    });        
});

router.get('/drugs/din/:din', function(req, res) {
    let drugService = new DrugService();
    drugService.getDrugByDIN(req.params.din).then(drugs => {
        console.log('checking number of drugs for getDrugByDIN: ' + req.params.din);
        let drugList = [].concat(drugs);
        res.json(drugList);
    });        
});

// Legal Entities
router.get('/legal_entities', function(req, res) {
    let leService = new LegalEntityService();
    leService.getLegalEntities().then(legalEntities => {
        // console.log('checking number of le in db: ' + legalEntities.length);
        let leList = [].concat(legalEntities);
        res.json(leList);
    });        
});

router.get('/legal_entities/name/:name', function(req, res) {
    let leService = new LegalEntityService();
    leService.getLegalEntityByName(req.params.name).then(legalEntities => {
        console.log('checking number of le for getLEByName: ' + req.params.name);
       let leList = [].concat(legalEntities);
        res.json(leList);
    });        
});

router.get('/legal_entities/:id', function(req, res) {
    let leService = new LegalEntityService();
    leService.getLegalEntityById(req.params.id).then(legalEntities => {
        console.log('checking number of le for getLEByID: ' + req.params.id);
        let leList = [].concat(legalEntities);
        res.json(leList);
    });        
});

router.get('/legal_entities/identifier/:identifier', function(req, res) {
    let leService = new LegalEntityService();
    leService.getLegalEntityByLEId(req.params.identifier).then(legalEntities => {
        console.log('checking number of le for getLEByLEID: ' + req.params.identifier);
        let leList = [].concat(legalEntities);
        res.json(leList);
    });        
});

router.put('/legal_entities', function(req, res) {
    let leService = new LegalEntityService();
    leService.updateLegalEntity(req.body).then((numReplaced) => {
        console.log('updated: ' + numReplaced + ' content: '  + JSON.stringify(req.body));
        res.json(numReplaced);
    });  
});

router.post('/legal_entities', function(req, res) {
    let leService = new LegalEntityService();
    leService.createLegalEntity(req.body).then((affectedRows) => {
        console.log('added: ' + affectedRows + ' content: '  + JSON.stringify(req.body));
        res.json(affectedRows);
    });  
});

router.delete('/legal_entities/:id', function(req, res) {
    let leService = new LegalEntityService();
    leService.deleteLegalEntity(req.params.id).then((affectedRows) => {
        console.log('deleted: ' + affectedRows);
        res.json(affectedRows);
    });  
});

app.use('/api', router);
app.listen(port);
console.log('Server running at localhost:' + port);


