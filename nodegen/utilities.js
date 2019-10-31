const dbconn    = require(".././dbconn");
const fs        = require('fs');
const pluralize = require('pluralize')


const writeToFile = (fileName, fileContent) => {
    fs.writeFile(fileName, fileContent, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
};


const makeController = (tableName) => {
    let to_write = "";

    const pcontrlName = pluralize.singular(tableName);
    const contrlName  = pcontrlName.charAt(0).toUpperCase() + pcontrlName.substring(1);
    const contrlNames = tableName.charAt(0).toUpperCase() + tableName.substring(1);

    to_write    += `const dbconn = require('.././dbconn');\n`;
    to_write    += `const fs = require("fs");\n\n`;

    to_write    += `exports.getAll${contrlNames} = (request, response, next) => {\n`;
    to_write    += `  dbconn.query('SELECT * FROM ${tableName}')\n`;
    to_write    += `  .then((data) => {\n`;
    to_write    += `    const ${tableName} = data.rows\n`;
    to_write    += `    response.status(200).json(${tableName});\n`;
    to_write    += `  })\n`;
    to_write    += `  .catch(error => {\n`;
    to_write    += `    response.status(500).json({\n`;
    to_write    += `      error:error\n`;
    to_write    += `    });\n`;   
    to_write    += `  });\n`;
    to_write    += `};\n\n`;


    to_write    += `exports.createThing = (req, res, next) => {\n`;
    to_write    += `  dbconn.query('INSERT INTO users(firstName, lastName, email, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [\n`;
    to_write    += `    req.body.firstName,\n`;
    to_write    += `    req.body.lastName,\n`;
    to_write    += `    req.body.email,\n`;
    to_write    += `    hash,\n`;
    to_write    += `    req.body.gender,\n`;
    to_write    += `    req.body.jobRole,\n`; 
    to_write    += `    req.body.department,\n`; 
    to_write    += `    req.body.address\n`;
    to_write    += `  ])\n`;
    to_write    += `  .then((data) => {\n`;
    to_write    += `    const userId = data.rows[0].id;\n`;
    to_write    += `    const token  = jwt.sign({userId:userId},'RANDOM_TOKEN_SECRET',{expiresIn:'24h'});\n`;
    to_write    += `    res.status(201).json({\n`;
    to_write    += `      "status":"success",\n`;
    to_write    += `      "data":{\n`;
    to_write    += `        "message":"User account successfully created",\n`;
    to_write    += `        \"token\":token,\n`;
    to_write    += `        \"userId\":userId\n`;
    to_write    += `      }\n`;
    to_write    += `    });\n`;
    to_write    += `  })\n`;
    to_write    += `  .catch((error) => {\n`;
    to_write    += `    res.status(500).json({\n`;
    to_write    += `      error: error\n`;
    to_write    += `    });\n`;
    to_write    += `  });\n`;
    to_write    += `};\n`;
      
    writeToFile(`controllers/${tableName}Controller.js`, to_write);
};


const makeRoute = (tableName) => {
    let addMulter    = false;
    let embedMulter  = "";
    let to_write     = "";

    const prouteName = pluralize.singular(tableName);
    const routeName  = prouteName.charAt(0).toUpperCase() + prouteName.substring(1);
    const routeNames = tableName.charAt(0).toUpperCase() + tableName.substring(1);

    if (tableName === 'gifs') addMulter = true;
    /*addMulter = dbconn.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${tableName}'`, (error, results) => {
        if (error) {
            throw error
        }
        let recs = results.rows;
        recs.forEach((item) => {
            if ((tableName === 'gifs' || tableName === 'image') && (!addMulter)) {
                return true;
            }
        });
    });*/

    to_write += `const express   = require('express')\n`;
    to_write += `const router    = express.Router();\n`;
    to_write += `const auth      = require('../middleware/auth');\n`;

    if (addMulter) {
        to_write += `const multer    = require('../middleware/multer-config');\n\n`;
        embedMulter = " multer,";
    } else {
        to_write += `\n`;
    }

    to_write += `const ${tableName}Controller = require('../controllers/${tableName}');\n\n`;

    to_write += `router.get('/', auth, ${tableName}Controller.getAll${routeNames});\n`;
    to_write += `router.post('/', auth,${embedMulter} ${tableName}Controller.create${routeName});\n`;
    to_write += `router.get('/:id', auth, ${tableName}Controller.getOne${routeName});\n`;
    to_write += `router.put('/:id', auth,${embedMulter} ${tableName}Controller.modify${routeName});\n`;
    to_write += `router.delete('/:id', auth, ${tableName}Controller.delete${routeName});\n\n`;
    to_write += `module.exports = router;\n\n`;

    writeToFile(`routes/${tableName}.js`, to_write);
};


const descTable = (currTable) => {
    dbconn.query(`SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '${currTable}'`, (error, results) => {
        if (error) {
            throw error
        }
        let tabcols = []
        let recs = results.rows;
        recs.forEach((item, pos) => {
            if (item.column_name != "id")
            tabcols.push(item.column_name);
        });

        console.log(tabcols);
    });
};


const getTable = () => {
    dbconn.query("SELECT * FROM pg_catalog.pg_tables", (error, results) => {
        if (error) {
            throw error
        }
        let recs = results.rows;
        recs.forEach((item, pos) => {
            if (item.schemaname === "public") {
                if (item.tablename != "users") {
                    makeRoute(item.tablename);
                    //makeController(item.tablename);
                    descTable(item.tablename);
                }
            }
        });
    });
};

getTable();