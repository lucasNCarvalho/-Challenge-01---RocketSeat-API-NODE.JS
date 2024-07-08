import { parse } from 'csv-parse';
import fs from 'fs';

const databasePath = new URL('../testeCSV.csv', import.meta.url);

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const parser = parse({ columns: true }, function (err, records) {
      if (err) {
        return reject(err);
      }
      resolve(records);
    });

    fs.createReadStream(filePath)
      .pipe(parser)
      .on('error', (error) => reject(error));
  });
};

readCSV(databasePath)
  .then((data) => {
   return data 
  })
  .then((data) => {
    data.forEach(element => {
        const {title, description} = element
        fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
            })
        })
    })
  })
  .catch((error) => {
    console.error('Error processing CSV:', error);
  });
