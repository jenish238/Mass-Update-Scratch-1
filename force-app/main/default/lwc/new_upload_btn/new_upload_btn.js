import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import sheetjs from '@salesforce/resourceUrl/sheetjsNew';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class new_upload_btn extends LightningElement {
    @api myRecordId;
    parserInitialized = false;
    @track progress = 0;
    @track fileName = 'No Files Selected..';

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
                const file = event.detail.files[0];
                this.fileName = file.name;
                this.progress = 0;
                let disableNext = false;

                if (file.size > 400000) {
                    disableNext = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'File is too Large',
                            message: 'Please upload smaller file',
                            variant: 'Info',
                        }),
                    );
                }else{
                    //*    for progress bar start
                    let progress = 0;
                    const animate = () => {
                        progress += 5;
                        if (progress <= 100) {
                            this.progress = progress;
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    //*    for progress bar end

                    let extension = this.fileName.split('.').pop();
    
                    if (extension === 'csv') {
                        this.CsvToJSON(file);
                    } else if (extension === 'xls' || extension === 'xlsx') {
                        this.ExcelToJSON(file);
                    } else {
                        const toastEvent = new ShowToastEvent({
                            title: 'Unsupported file type',
                            message: 'Please upload a CSV, XLS, or XLSX file',
                            variant: 'info'
                        });
                        this.dispatchEvent(toastEvent);
                        return;
                    }
                }

                event.preventDefault();
                const selectEvent = new CustomEvent('disablenextbutton', {
                    detail: { disableNext }
                });
                this.dispatchEvent(selectEvent);
            }
        } catch (error) {
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: error.message,
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
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
                jsonObject = jsonObject.replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '');
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
                jsonObj = jsonObj.replace(/\[/g, '').replace(/\]/g, '').replace(/"/g, '');
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