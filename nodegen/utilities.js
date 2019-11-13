const fs = require('fs');
const pluralize = require('pluralize');
const dbconn = require('.././dbconn');

const writeToFile = (fileName, fileContent) => {
  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
};


const getTable = () => {
  dbconn.query('SELECT * FROM pg_catalog.pg_tables', (error, results) => {
    if (error) {
      throw error;
    }
    const recs = results.rows;
    recs.forEach((item, pos) => {
      if (item.schemaname === 'public') {
        if (item.tablename != 'gifs' || item.tablename != 'user') {
          if (item.tablename == 'comments') {
            makeTesting(item.tablename);
            makeRoute(item.tablename);
            makeController(item.tablename);
            // descTable(item.tablename);
          }
        }
      }
    });
  });
};


async function descTable(currTable) {
  return await dbconn.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${currTable}'`)
    .then((data) => {
      const recs = data.rows;
      const tabcols = [];
      recs.forEach((item, pos) => {
        if (item.column_name != 'id') {
          const curval = item.column_name;
          tabcols.push(item.column_name);
        }
      });
      return tabcols;
    })
    .catch((error) => ({ error }));
}


async function descTable2(currTable) {
  return await dbconn.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${currTable}'`)
    .then((data) => {
      const recs = data.rows;
      const tabcols = [];
      recs.forEach((item, pos) => { // table_schema
        if (item.column_name != 'id' && item.table_schema == 'public') {
          const curval = item.column_name;
          tabcols.push(item);
        }
      });
      return tabcols;
    })
    .catch((error) => ({ error }));
}


const makeController = (tableName) => {
  const tableDesc = descTable(tableName);

  const prouteName = pluralize.singular(tableName);
  const routeName = prouteName.charAt(0).toUpperCase() + prouteName.substring(1);
  const routeNames = tableName.charAt(0).toUpperCase() + tableName.substring(1);

  tableDesc.then((data) => {
    let to_write = '';

    if (data.includes('createdon')) data.splice(data.indexOf('createdon'), 1);
    if (data.includes('updatedon')) data.splice(data.indexOf('updatedon'), 1);

    // RESOLVE PARAMETERIZE VALS
    const valCount = data.length;
    let paramStr = '';
    let updPrmStr = '';
    for (let j = 1; j <= valCount; j += 1) {
      paramStr += (paramStr == '') ? `$${j}` : `, $${j}`;
      updPrmStr += (updPrmStr == '') ? `${data[j - 1]}=\$${j}` : `, ${data[j - 1]}=\$${j}`;
    }

    // RESOLVE VALUES
    let formVals = '';
    let paramVals = '';
    const valCount2 = valCount - 1;
    data.forEach((itm, pos) => {
      formVals += `  let ${itm} = request.body.${itm};\n`;
      if (pos < valCount2) {
        paramVals += `    ${itm},\n`;
      } else {
        paramVals += `    ${itm}\n`;
      }
    });

    const valStr = data.join(',');

    to_write += 'const dbconn = require(\'.././dbconn\');\n';
    if (data.includes('password')) to_write += 'const bcrypt = require(\'bcrypt\')\n';
    to_write += '\n\n';

    to_write += `exports.getAll${routeNames} = (request, response, next) => {\n`;
    to_write += `  dbconn.query('SELECT * FROM ${tableName}')\n`;
    to_write += '  .then((data) => {\n';
    to_write += `    const ${tableName} = data.rows\n`;
    to_write += `    response.status(200).json(${tableName});\n`;
    to_write += '  })\n';
    to_write += '  .catch(error => {\n';
    to_write += '    response.status(500).json({\n';
    to_write += '      error:error\n';
    to_write += '    });\n';
    to_write += '  });\n';
    to_write += '};\n\n';

    to_write += `exports.create${routeName} = (request, res, next) => {\n`;
    to_write += `${formVals}\n`;
    to_write += `  dbconn.query('INSERT INTO ${tableName} (${valStr}) VALUES (${paramStr}) RETURNING id', [\n`;
    to_write += `${paramVals}`;
    to_write += '  ])\n';
    to_write += '  .then((data) => {\n';
    to_write += '    res.status(201).json({\n';
    to_write += '      "status":"success",\n';
    to_write += '      "data":data.rows\n';
    to_write += '    });\n';
    to_write += '  })\n';
    to_write += '  .catch((error) => {\n';
    to_write += '    res.status(500).json({\n';
    to_write += '      error: error\n';
    to_write += '    });\n';
    to_write += '  });\n';
    to_write += '};\n\n\n';

    to_write += `exports.getOne${routeName} = (request, response, next) => {\n`;
    to_write += `  dbconn.query('SELECT * FROM ${tableName} WHERE id = $1', [request.params.id])\n`;
    to_write += '  .then((data) => {\n';
    to_write += '    response.status(201).json({\n';
    to_write += '      "status":"success",\n';
    to_write += '      "data":data.rows[0]\n';
    to_write += '    });\n';
    to_write += '  })\n';
    to_write += '  .catch((error) => {\n';
    to_write += '    response.status(500).json({\n';
    to_write += '      error:error\n';
    to_write += '    });\n';
    to_write += '  });\n';
    to_write += '};\n\n\n';

    to_write += `exports.modify${routeName} = (request, response, next) => {\n`;
    to_write += `${formVals}`;
    to_write += '  let id = request.params.id;\n\n';
    to_write += `  dbconn.query('UPDATE ${tableName} SET ${updPrmStr} WHERE id=\$${valCount + 1}', [\n`;
    to_write += `${paramVals},\n`;
    to_write += '    id\n';
    to_write += '  ])\n';
    to_write += '  .then((data) => {\n';
    to_write += '    response.status(201).json({\n';
    to_write += '      "status":"success",\n';
    to_write += '      "data":data.rows\n';
    to_write += '    });\n';
    to_write += '  })\n';
    to_write += '  .catch((error) => {\n';
    to_write += '    response.status(500).json({\n';
    to_write += '      error: error\n';
    to_write += '    });\n';
    to_write += '  });\n';
    to_write += '};\n\n\n';

    to_write += `exports.delete${routeName} = (request, response, next) => {\n`;
    to_write += `  dbconn.query('DELETE FROM ${tableName} WHERE id = $1', [request.params.id])\n`;
    to_write += '  .then((data) => {\n';
    to_write += '    response.status(201).json({\n';
    to_write += '      "status":"success",\n';
    to_write += '      "data":data.rows[0]\n';
    to_write += '    });\n';
    to_write += '  })\n';
    to_write += '  .catch((error) => {\n';
    to_write += '    response.status(500).json({\n';
    to_write += '      error:error\n';
    to_write += '    });\n';
    to_write += '  });\n';
    to_write += '};\n\n\n';

    writeToFile(`controllers/${tableName}Controller.js`, to_write);
  })
    .catch((error) => {});
};


const makeRoute = (tableName) => {
  let addMulter = false;
  let embedMulter = '';
  let to_write = '';

  const prouteName = pluralize.singular(tableName);
  const routeName = prouteName.charAt(0).toUpperCase() + prouteName.substring(1);
  const routeNames = tableName.charAt(0).toUpperCase() + tableName.substring(1);

  // IMAGE PRESENCE SHOULD BE DYNAMICALLY DETECTED
  if (tableName === 'gifs') addMulter = true;

  to_write += 'const express   = require(\'express\')\n';
  to_write += 'const router    = express.Router();\n';
  to_write += 'const auth      = require(\'../middleware/auth\');\n';

  if (addMulter) {
    to_write += 'const multer    = require(\'../middleware/multer-config\');\n\n';
    embedMulter = ' multer,';
  } else {
    to_write += '\n';
  }

  to_write += `const ${tableName}Controller = require('../controllers/${tableName}Controller');\n\n`;

  to_write += `router.get('/', auth, ${tableName}Controller.getAll${routeNames});\n`;
  to_write += `router.post('/', auth,${embedMulter} ${tableName}Controller.create${routeName});\n`;
  to_write += `router.get('/:id', auth, ${tableName}Controller.getOne${routeName});\n`;
  to_write += `router.put('/:id', auth,${embedMulter} ${tableName}Controller.modify${routeName});\n`;
  to_write += `router.delete('/:id', auth, ${tableName}Controller.delete${routeName});\n\n`;
  to_write += 'module.exports = router;\n\n';

  writeToFile(`routes/${tableName}.js`, to_write);
};


const makeTesting = (tableName) => {
  const testDesc = tableName.charAt(0).toUpperCase() + tableName.substring(1);
  const testItemDesc = tableName;
  let to_write = '';

  const tableDesc = descTable2(tableName);

  tableDesc.then((data) => {
    const tabSingular = pluralize.singular(tableName);
    const noNullcols = [];
    const tabcols = [];
    const dataTypeArr = [];
    data.forEach((item, pos) => {
      const { is_nullable } = item;
      const colNameDEsc = item.column_name;
      if (is_nullable == 'NO') noNullcols.push(`${item.column_name}====${item.udt_name}`);
      tabcols.push(`${item.column_name}====${item.udt_name}`);
      dataTypeArr.push(item.udt_name);
    });

    // FILES INCLUSIONS
    to_write += 'let dbconn = require("../dbconn");\n';
    //to_write += 'let assert = require("assert");\n';
    to_write += 'let chai = require("chai");\n';
    to_write += 'let chaiHttp = require("chai-http");\n';
    to_write += 'let server = require("../server");\n';
    to_write += 'let should = chai.should();\n';
    to_write += 'chai.use(chaiHttp);\n\n\n';

    to_write += `server = "https://teamwork-heroku-staging.herokuapp.com";\n\n`;

    to_write += `describe ("Setup Test User", function() {\n`;
    to_write += `  it("Should Create A New Test User", (done) => {\n`;
    to_write += `    chai.request(server)\n`;
    to_write += `    .post("/api/v1/auth/create-user")\n`;
    to_write += `    .send({\n`;
    to_write += `      "firstName": "testcase",\n`;
    to_write += `      "lastName": "testcase",\n`;
    to_write += `      "email": "testcase@gmail.com",\n`;
    to_write += `      "password": "testcase",\n`;
    to_write += `      "gender": "MALE",\n`;
    to_write += `      "jobRole": "ADMIN",\n`;
    to_write += `      "department": "ACCOUNT",\n`;
    to_write += `      "address": "123, testcase Avenue"\n`;
    to_write += `    })\n`;
    to_write += `    .end((err, res) => {\n\n`;

    to_write += `      //Test User Token\n`;
    to_write += `      const token = res.body.data.token;\n\n`;

    to_write += `      //${testDesc} Testing Start\n`;
    to_write += `      describe ("Testing ${testDesc}", function() {\n\n`;

    to_write += `        //${testDesc} /GET Testing\n`;
    to_write += `        describe('/GET ${tableName}', () => {\n`;
    to_write += `          it('it should GET all the ${testItemDesc}', (done) => {\n`;
    to_write += '            chai.request(server)\n';
    to_write += `            .get('/api/v1/${tableName}')\n`;
    to_write += '            .set({"Authorization" : "Bearer " + token})\n';
    to_write += '            .end((err, res) => {\n';
    to_write += '              res.should.have.status(200);\n';
    to_write += '              res.body.should.be.a(\'array\');\n';
    to_write += `              //res.body.length.should.be.eql(0);\n`;
    to_write += '              done();\n';
    to_write += '            });\n';
    to_write += '          });\n';
    to_write += '        });\n\n\n';


    to_write += `        //${testDesc} /POST Testing Start\n`;
    to_write += `        describe('/POST ${tableName}', () => {\n\n`;

    // NOT NULL FIELDS
    for (let j = 0; j < noNullcols.length; j++) {
      tabcols.splice(tabcols.indexOf(noNullcols[j]), 1);
      const testColSplit = noNullcols[j].split('====');

      to_write += `          //${testDesc} /POST Testing without ${testColSplit[0]}\n`;
      to_write += `          it('it should not POST a ${tabSingular} without ${testColSplit[0]} field', (done) => {\n`;
      to_write += `            let ${tabSingular} = {\n`;
      for (let p = 0; p < tabcols.length; p++) {
        const column_desc = tabcols[p].split('====');
        const colDesc = column_desc[0];
        const colType = column_desc[1];
        let colVal = "  'Testing'";
        const curDataType = colType;

        if (curDataType == 'timestamp') {
          colVal = "  '2019-11-04 22:56:48'";
        } else if (curDataType == 'int4') {
          colVal = '  1';
        } else {
          colVal = "  'Testing'";
        }

        if (p < tabcols.length - 1) {
          to_write += `              ${colDesc}:${colVal},\n`;
        } else {
          to_write += `              ${colDesc}:${colVal}\n`;
        }
      }
      to_write += '            };\n';
      to_write += '            chai.request(server)\n';
      to_write += `            .post('/api/v1/${tableName}')\n`;
      to_write += '            .set({"Authorization" : "Bearer " + token})\n';
      to_write += `            .send(${tabSingular})\n`;
      to_write += '            .end((err, res) => {\n';
      to_write += '              res.should.have.status(500);\n';
      to_write += '              res.body.should.be.a(\'object\');\n';
      // to_write += `           res.body.should.eql({});\n`;
      // to_write += `           //res.body.should.have.property('errors');\n`;
      // to_write += `           //res.body.errors.should.have.property('${noNullcols[j]}');\n`;
      // to_write += `           //res.body.errors.${noNullcols[j]}.should.have.property('kind').eql('required');\n`;
      to_write += '              done();\n';
      to_write += '            });\n';
      to_write += '          });\n\n\n';
      tabcols.push(noNullcols[j]);
    }

    to_write += `          //Final ${testDesc} /POST Testing\n`;
    to_write += `          it('it should POST a ${tabSingular} ', (done) => {\n`;
    to_write += `            let ${tabSingular} = {\n`;
    for (let p = 0; p < tabcols.length; p++) {
      const column_desc = tabcols[p].split('====');
      const colDesc = column_desc[0];
      const colType = column_desc[1];
      let colVal = "'Testing'";
      const curDataType = colType;

      if (curDataType == 'timestamp') {
        colVal = "'2019-11-04 22:56:48'";
      } else if (curDataType == 'int4') {
        colVal = '1';
      } else {
        colVal = "'Testing'";
      }

      if (p < tabcols.length - 1) {
        to_write += `              ${colDesc}:${colVal},\n`;
      } else {
        to_write += `              ${colDesc}:${colVal}\n`;
      }
    }
    to_write += '            };\n';
    to_write += '            chai.request(server)\n';
    to_write += `            .post('/api/v1/${tableName}')\n`;
    to_write += `            .send(${tabSingular})\n`;
    to_write += '            .set({"Authorization" : "Bearer " + token})\n';
    to_write += '            .end((err, res) => {\n';
    to_write += '              res.should.have.status(201);\n';
    to_write += '              res.body.should.be.a(\'object\');\n';
    to_write += '              res.body.should.have.property(\'status\').eql(\'success\');\n';
    for (let p = 0; p < tabcols.length; p++) {
      const column_desc = tabcols[p].split('====');
      const colDesc = column_desc[0];
      // to_write += `        //res.body.${tableName}.should.have.property('${colDesc}');\n`;
    }

    to_write += '              \n';
    to_write += `              let ${tabSingular}ID = res.body.data[0].id;\n\n`;


    to_write += `              //${testDesc} /GET/:id Testing Start\n`;
    to_write += `              describe('/GET/:id ${tabSingular}', () => {\n`;
    to_write += `                it('it should GET a ${tabSingular} by the given id', (done) => {\n`;
    to_write += `                  //let ${tabSingular}ID = 10;\n`;
    to_write += '                  chai.request(server)\n';
    to_write += `                  .get('/api/v1/${tableName}/'+${tabSingular}ID)\n`;
    to_write += '                  .set({"Authorization" : "Bearer " + token})\n';
    to_write += '                  .end((err, res) => {\n';
    to_write += '                    res.should.have.status(201);\n';
    to_write += '                    res.body.should.be.a(\'object\');\n';
    to_write += '                    res.body.should.have.property(\'status\').eql(\'success\');\n';

    for (let p = 0; p < tabcols.length; p++) {
      const column_desc = tabcols[p].split('====');
      const colDesc = column_desc[0];
      // to_write += `                 //res.body.should.have.property('${colDesc}');\n`;
    }

    // to_write += `                 //res.body.should.have.property('id').eql(${tabSingular}ID);\n`;
    to_write += '                    done();\n';
    to_write += '                  });\n';
    to_write += '                });\n';
    to_write += '              });\n';
    to_write += `              //${testDesc} /GET/:id Testing End\n\n\n`;


    to_write += `              //${testDesc} /PUT/:id Testing Start\n`;
    to_write += `              describe('/PUT/:id ${tabSingular}', () => {\n`;
    to_write += `                it('it should UPDATE a ${tabSingular} given the id', (done) => {\n`;
    to_write += `                  //let ${tabSingular}ID = 10;\n`;
    to_write += `                  let ${tabSingular} = {\n`;
    for (let p = 0; p < tabcols.length; p++) {
      const column_desc = tabcols[p].split('====');
      const colDesc = column_desc[0];
      const colType = column_desc[1];
      let colVal = "'Testing'";
      const curDataType = colType;

      if (curDataType == 'timestamp') {
        colVal = "'2019-11-04 22:56:48'";
      } else if (curDataType == 'int4') {
        colVal = '1';
      } else {
        colVal = "'Testing'";
      }

      if (p < tabcols.length - 1) {
        to_write += `                    ${colDesc}:${colVal},\n`;
      } else {
        to_write += `                    ${colDesc}:${colVal}\n`;
      }
    }
    to_write += '                  }\n';
    to_write += '                  chai.request(server)\n';
    to_write += `                  .put('/api/v1/${tableName}/'+${tabSingular}ID)\n`;
    to_write += '                  .set({"Authorization" : "Bearer " + token})\n';
    to_write += `                  .send(${tabSingular})\n`;
    to_write += '                  .end((err, res) => {\n';
    to_write += '                    res.should.have.status(201);\n';
    to_write += '                    res.body.should.be.a(\'object\');\n';
    to_write += '                    res.body.should.have.property(\'status\').eql(\'success\');\n';
    to_write += '                    done();\n';
    to_write += '                  });\n';
    to_write += '                });\n';
    to_write += '              });\n';
    to_write += `              //${testDesc} /PUT/:id Testing End\n\n\n`;

    to_write += `              //${testDesc} /DELETE/:id Testing Start\n`;
    to_write += `              describe('/DELETE/:id ${tabSingular}', () => {\n`;
    to_write += `                it('it should DELETE a ${tabSingular} given the id', (done) => {\n`;
    to_write += `                  //let ${tabSingular}ID = 10;\n`;
    to_write += '                  chai.request(server)\n';
    to_write += `                  .delete('/api/v1/${tableName}/'+${tabSingular}ID)\n`;
    to_write += '                  .set({"Authorization" : "Bearer " + token})\n';
    to_write += '                  .end((err, res) => {\n';
    to_write += '                    res.should.have.status(201);\n';
    to_write += '                    res.body.should.be.a(\'object\');\n';
    to_write += '                    res.body.should.have.property(\'status\').eql(\'success\');\n';
    to_write += '                    done();\n';
    to_write += '                  });\n';
    to_write += '                });\n';
    to_write += '              });\n';
    to_write += `              //${testDesc} /DELETE/:id Testing End\n\n\n`;

    to_write += '              done();\n';
    to_write += '            });\n';
    to_write += '          });\n\n';
    to_write += '        });\n';
    to_write += `        //${testDesc} /POST Testing End\n\n`;

    to_write += '      });\n';
    to_write += `      //${testDesc} Testing End\n\n\n`;

    /*to_write += `      //Delete Test User\n`;
    to_write += `      describe('Delete Test User', () => {\n`;
    to_write += `        it('it should DELETE a test user given the id', (done) => {\n`;
    to_write += `          chai.request(server)\n`;
    to_write += `          .delete('/api/v1/auth/deleteAdminTestUser/'+res.body.data.userId)\n`;
    to_write += `          .set({"Authorization" : "Bearer " + token})\n`;
    to_write += `          .end((err, res) => {\n`;
    to_write += `            res.should.have.status(201);\n`;
    to_write += `            res.body.should.be.a('object');\n`;
    to_write += `            res.body.should.have.property('status').eql('success');\n`;
    to_write += `            console.log("TestUser Deleted");\n`;
    to_write += `            done();\n`;
    to_write += `          });\n`;
    to_write += `        });\n`;
    to_write += `      });\n\n\n`;*/

    to_write += `      done();\n`;
    to_write += `    });\n`;
    to_write += `  });\n`;
    to_write += `});\n`;

    writeToFile(`test/${tableName}.js`, to_write);
  });
};

getTable();