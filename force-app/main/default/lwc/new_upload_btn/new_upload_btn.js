import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import sheetjs from '@salesforce/resourceUrl/sheetjsNew';



export default class new_upload_btn extends LightningElement {
    @api myRecordId;
    parserInitialized = false;
    progress = 0;

    get acceptedFormats() {
        return ['.csv', '.xls', '.xlsx'];
    }

    renderedCallback() {
        try {
            if (!this.parserInitialized) {
                console.log('2nd steps in IF', this.parserInitialized);
                Promise.all([
                    loadScript(this, PARSER + '/PapaParse/papaparse.js'),
                    loadScript(this, sheetjs + '/sheetjs/xlsx.full.min.js'),
                ])
                    .then(() => {
                        console.log('script loaded', XLSX.version);
                        this.parserInitialized = true;
                    })
                    .catch(error => {
                        console.log('in catch ', error);
                        console.error(error)
                    });
            }
        } catch (error) {
            console.log('error mesg--> ' + error);
        }
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        try {
            if (event.detail.files.length > 0) {

                for (let j = 0; j < 100; j++) {
                    progress = j;                
                }
                
                const file = event.detail.files[0];
                var fileName = file.name;
                fileName = fileName.split('.').pop();

                if (fileName === 'csv') {
                    this.CsvToJSON(file);
                } else if (fileName === 'xls' || fileName === 'xlsx') {
                    this.ExcelToJSON(file);
                }
            }
        } catch (error) {
            console.log('error log --> ', error);
        }
    }

    ExcelToJSON(file) {
        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                let rowObject = XLSX.utils.sheet_to_row_object_array(worksheet);
                const keys = Object.keys(rowObject[0]);
                const flattenedArr = rowObject.flatMap(obj => Object.values(obj));
                flattenedArr.unshift(...keys);
                let jsonObject = JSON.stringify(flattenedArr);
                jsonObject = jsonObject.replace(/\[/g, '').replace(/"/g, '');
                console.log('Data: ', jsonObject);
            };

            reader.onerror = function (ex) {
                this.error = ex;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error while reding the file',
                        message: ex.message,
                        variant: 'error',
                    }),
                );
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.log('error except ', error);
        }
    }

    CsvToJSON(file){
        this.loading = true;
        Papa.parse(file, {
            quoteChar: '"',
            header: 'true',
            complete: (results) => {
                this._rows = results.data;
                this.loading = false;
                let rowObj = results.data;
                const headerName = Object.keys(rowObj[0]);
                const newArr = rowObj.flatMap(obj => Object.values(obj));
                newArr.unshift(...headerName);
                let jsonObj = JSON.stringify(newArr);
                jsonObj = jsonObj.replace(/\[/g, '').replace(/"/g, '');
                console.log('Data: ', jsonObj);
            },
            error: (error) => {
                console.log('result --: ', { error });
                console.error(error);
                this.loading = false;
            }
        })
    }
}