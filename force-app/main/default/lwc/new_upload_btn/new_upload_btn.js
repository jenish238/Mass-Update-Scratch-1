import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import PARSER from '@salesforce/resourceUrl/PapaParse';
import sheetjs from '@salesforce/resourceUrl/sheetjsNew';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';




export default class new_upload_btn extends LightningElement {
    @api myRecordId;
    parserInitialized = false;
    @api progress;
    @api fileName;



    get acceptedFormats() {
        return ['.csv', '.xls', '.xlsx'];
    }

    renderedCallback() {
        try {
            if (!this.parserInitialized) {
                Promise.all([
                    loadScript(this, PARSER + '/PapaParse/papaparse.js'),
                    loadScript(this, sheetjs + '/sheetjs/xlsx.full.min.js'),
                ])
                    .then(() => {
                        this.parserInitialized = true;
                    })
                    .catch(error => {
                        console.error(error)
                    });
            }
        } catch (error) {
        }
    }


    handleUploadFinished(event) {
        try {
            let filelength = event.detail.files.length;
            if (filelength > 0) {
                const file = event.detail.files[0];
                this.progress = 0;
                let disableNext = false;
                if (file.size > 3000000) {
                    disableNext = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'File is too Large',
                            message: 'Please upload smaller file',
                            variant: 'Info',
                        }),
                    );
                } else if (filelength > 1) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Select One file',
                            message: 'Please Select One file',
                            variant: 'Info',
                        }),
                    );
                }
                else {
                    this.fileName = file.name;
                    //*    for progress bar start
                    this.progressBar();
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
                this.passEvent(disableNext);

            }
        } catch (error) {
            const toastEvent = new ShowToastEvent({
                title: 'Error',
                message: error.message,
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
        }

        this.sendFileName(this.fileName);
    }

    ExcelToJSON(file) {
        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                let rowObject = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName], { defval: "" });
                var data1 = Papa.parse(rowObject, {
                    header: true,
                    skipEmptyLines: 'greedy'
                });
                var headerValue = data1.meta.fields;
                const rowData = data1.data;
                this.headerCheck(headerValue);
                this.dataStoreTable(rowData);
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
        }
    }

    CsvToJSON(file) {
        try {
            this.loading = true;
            Papa.parse(file, {
                quoteChar: '"',
                header: 'true',
                skipEmptyLines: 'greedy', // Add this line to skip empty lines
                complete: (results) => {
                    this._rows = results.data;
                    this.loading = false;
                    let rowObj = results.data;
                    let headerName = results.meta.fields;
                    this.headerCheck(headerName);
                    this.dataStoreTable(rowObj);
                },
                error: (error) => {
                    console.error(error);
                    this.loading = false;
                }
            })
        } catch (error) {
        }

    }

    headerCheck(headerName) {
        try {
            var trimrow = headerName;

            trimrow[trimrow.length - 1] = trimrow[trimrow.length - 1].replace(/(\r\n|\n|\r)/gm, "");

            trimrow = trimrow.map(str => str.replace('"', ''));
            trimrow = trimrow.map(str => str.replace('"', ''));
            trimrow = trimrow.map(str => str.replace(/\s/g, ''));


            if (trimrow.indexOf("") !== -1) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Info',
                        message: 'Please remove your extra column',
                        variant: 'Info',
                    }),
                );
                this.passEvent('true');
            } else if (trimrow.indexOf("") == (trimrow.length - 1)) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Info',
                        message: 'Please remove your duplicate [] column',
                        variant: 'Info',
                    }),
                );
                this.passEvent('true');

            }
            else if (checkIfDuplicateExists(trimrow)) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Info',
                        message: 'Please delete the same header api name.',
                        variant: 'Info',
                    }),
                );
                this.passEvent('true');

            } else {
                this.passEvent('false');
            }

            function checkIfDuplicateExists(arr) {
                return new Set(arr).size != arr.length;
            }
            let value = trimrow;
            const event = new CustomEvent('header', { detail: { value } });
            this.dispatchEvent(event);

        } catch (error) {
        }


    }
    dataStoreTable(rowObj) {
        try {
            var arr2 = [];
            for (let i = 0; i < rowObj.length; i++) {
                arr2.push(Object.values(rowObj[i]));
            }
            let value = arr2.map(subarray => subarray.join(','));
            const event = new CustomEvent('tabledata', { detail: { value } });
            this.dispatchEvent(event);
        } catch (error) {
        }


    }

    parseExcelFile(filedata) {
        try {
            const reader = new FileReader();
            reader.readAsArrayBuffer(filedata);
            reader.onload = function () {
                const binaryData = reader.result;
                const workbook = XLSX.read(binaryData, { type: 'binary' });
                const csvDataString = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
                var data1 = Papa.parse(csvDataString, {
                    header: true,
                    skipEmptyLines: 'greedy'
                });
                var headerValue = data1.meta.fields;
                const rowData = data1.data;
                this.headerCheck(headerValue);
                this.dataStoreTable(rowData);
            };
        } catch (error) {
        }
    }
    progressBar() {
        let progress = 0;
        const animate = () => {
            progress += 5;
            if (progress <= 100) {
                this.progress = progress;
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);

    }
    passEvent(valueofEvent) {
        let value = valueofEvent;
        const event = new CustomEvent('passvalue', { detail: { value } });
        this.dispatchEvent(event);

    }
    sendFileName(filName) {
        let value = filName;
        const event = new CustomEvent('filevalue', { detail: { value } });
        this.dispatchEvent(event);
    }

}