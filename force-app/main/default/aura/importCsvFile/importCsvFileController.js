({
    showcsvdata: function (component, event, helper) {
        component.set("v.progress", 0);
        var fileInput = component.find("file").get("v.files");
        console.log("fileInput =======" + JSON.stringify(fileInput));
        console.log("file Input length=====" + fileInput.length);
        var fileName = "No File Selected..";
        var file = fileInput[0];
        console.log("file=====" + JSON.stringify(file));
        console.log("length===" + event.getSource().get("v.files").length);
        if (event.getSource().get("v.files").length > 0) {
            var fName = event.getSource().get("v.files")[0]["name"];
        }

        if (fName.indexOf(".csv") !== -1) {
            console.log("fileName=====" + fileName);

            component.set("v.fileName", fileName);
            console.log("filename====" + component.get("v.fileName"));

            if (file) {
                component.set("v.showcard", true);
                var tabledata = [];
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    var csv = evt.target.result;
                    console.log('typeof csvf::' + typeof (csv));
                    console.log("csv:::" + csv);
                    console.log('csv length===', csv.length);
                    if (csv.length > 4000000) {
                        helper.showToast(
                            "Info",
                            "Info!",
                            "Please upload smaller size of csv file"
                        );
                    } else {
                        var rows = csv.split("\n");
                        var trimrow = rows[0].split(",");
                        console.log("trimRow=====" + trimrow);
                        // ------------------------------------------- jenish gangani
                        // component.set("v.header", trimrow);
                        // ------------------------------------------- jenish gangani

                        //jenish gangani 3/2/23

                        console.log('trimrow' + trimrow.length);
                        trimrow[trimrow.length - 1] = trimrow[trimrow.length - 1].replace(/(\r\n|\n|\r)/gm, "");
                        console.log('trimrow value:::', { trimrow });
                        // console.log('trimrow value:::', isEmpty(trimrow[i]));
                        // trimrow.include('')
                        // let haystack = ["12345", "hello", "world"];
                        // let needle = ["world", "banana"];

                        // let result = needle.some(i => haystack.includes(i));

                        // console.log(result); // Output = true

                        // --------------------------------------------------jenish gangani5/2/23
                        // https://stackoverflow.com/questions/19325430/remove-double-quotes-from-the-strings-present-inside-the-arrays-using-javascript
                        // var array = ["apple","orange","pear"];
                        // let stringArray = ['"string1"', '"string2"', '"string3"'];
                        // let newArray = stringArray.map(str => str.replace(/"/, ''));
                        // let z = {trimrow};
                        // console.log('z:::'+ z);
                        let newArray = trimrow.map(str => str.replace('"', ''));
                        let newArray1 = newArray.map(str => str.replace('"', ''));
                        let newArray2 = newArray1.map(str => str.replace(/\s/g, ''));

                        console.log('newArray' + newArray2);
                        // console.log('string::::'+ array);
                        trimrow = newArray2;
                        console.log('new open :::' + trimrow);
                        component.set("v.header", trimrow);

                        // --------------------------------------------------jenish gangani5/2/23

                        if (trimrow.indexOf("") !== -1) {
                            helper.showToast(
                                "Info",
                                "Info!",
                                "Please remove your extra collum"
                            );
                            var compEvent1 = component.getEvent("disableNextButton");
                            console.log('component:::' + JSON.stringify(compEvent1));
                            compEvent1.setParams({ "checkButton": true });
                            compEvent1.fire();
                        } else if (trimrow.indexOf("") == (trimrow.length - 1)) {
                            helper.showToast(
                                "Info",
                                "Info!",
                                "Please remove your duplicat [] collum"
                            );
                            var compEvent1 = component.getEvent("disableNextButton");
                            compEvent1.setParams({ "checkButton": true });
                            compEvent1.fire();

                        }
                        else if (checkIfDuplicateExists(trimrow)) {
                            var compEvent = component.getEvent("disableNextButton");
                            compEvent.setParams({ "checkButton": true });
                            compEvent.fire();
                            helper.showToast("Info", "Info!", "Please remove same api Name in Header");
                        } else {
                            var compEvent1 = component.getEvent("disableNextButton");
                            compEvent1.setParams({ "checkButton": false });
                            compEvent1.fire();

                        }

                        function checkIfDuplicateExists(arr) {
                            return new Set(arr).size != arr.length;
                        }
                        //jenish gangani 3/2/23


                        for (var i = 1; i < rows.length; i++) {

                            //jenish gangani 2/2/2023
                            console.log('rows[i].trim() ==> ', rows[i].trim());
                            if (rows[i].trim() !== ",") {
                                tabledata.push(rows[i]);
                            }
                            //jenish gangani 2/2/2023
                        }

                        for (var j = 0; j <= 100; j++) {
                            task(j);
                        }
                        function task(j) {
                            setTimeout(function () {
                                component.set("v.progress", j);
                            }, 2 * j);
                        }
                        component.set("v.tabledata", tabledata);
                        console.log("tableData====" + tabledata.length);
                        console.log("tableData::::" + tabledata);
                        var fileName = fName;
                        component.set("v.fileName", fileName);
                        console.log("file Name After===" + fileName);
                    }
                };
            }
        } else {
            helper.showToast("Info", "Info!", "Please upload only CSV file");
        }
    },
    redirectToDrive: function (component, event, helper) {
        console.log('redirectToDrive');
        // <script type="text/javascript" src="https://apis.google.com/js/api.js"></script>
        var clientId = '743502205155-0empokv5a49fdhtf7lm38ucsk0d0eup6.apps.googleusercontent.com';
        // var clientSecret = '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';
        var key = 'AIzaSyDpqfCp4v5Ykc201OEUgscQPsZkKAtGRIQ';
        var project_ID = '743502205155';
        var oauthToken;
        var PickerApiLoaded = false;
        var scope = 'https://www.googleapis.com/auth/drive.file';
        pickerDialog();
        function pickerDialog() {
            console.log('h1');
            loadpicker();
        }
        function loadpicker() {
            console.log('h2');
            gapi.load('auth', { 'callback': onAuthApiLoad })
            gapi.load('picker', { 'callback': onPickerApiLoad })

        }
        function onAuthApiLoad() {
            console.log('h3');
            window.gapi.auth.authorize({

                'client_id': clientId,
                'scope': scope,
                'immediate': false
            },

                handleAuthResult
            )


        }
        function onPickerApiLoad() {
            console.log('h4');
            onPickerApiLoad = true
            createPicker()
        }
        function handleAuthResult() {
            console.log('h5');
            if (authResult && !authResult.error) {
                oauthToken = authResult.access_token
                createPicker()
            }
        }
        function createPicker() {
            console.log('h6');
            if (PickerApiLoaded && oauthToken) {
                var view = new google.picker.View(google.picker.ViewId.DOCS)
                view.setMimeTypes('image/png')
                var picker = new google.picker.PickerBuilder()
                    .enableFeature(google.picker.Feature.NAV_HIDDEN)
                    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                    .setAppId(project_ID)
                    .setOAuthToken(oauthToken)
                    .addView(view)
                    .addView(new google.picker.DocsUploadView())
                    .setDeveloperKey(key)
                    .setCallback(pickerCallback)
                    .build()

                picker.setVisible(true)
            }
        }
        function pickerCallBack(data) {
            console.log('h7');
            if (data.action == google.picker.Action.PICKED) {
                var field = data.docs[0].id
                alert('thissss:::' + field)
            }

        }



        // window.open("https://drive.google.com/drive/my-drive", "_blank");
        var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        var windowParams = "width=600,height=400";
        // var windowUrl = "https://www.googleapis.com/auth/drive.file";
        // var windowUrl = "https://drive.google.com/drive/my-drive";
        var windowUrl = "https://accounts.google.com/o/oauth2/auth/oauthchooseaccount";



        window.open(windowUrl, "Google Drive", windowFeatures + windowParams);
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            var csv = evt.target.result;
            console.log('csv file :::' + csv);
            // client - IdleDeadline; -743502205155 - 0empokv5a49fdhtf7lm38ucsk0d0eup6.apps.googleusercontent.com
            // secret = GOCSPX - rFGNruy9gKUBpQqMD4vv - nvXCfzm
            // api key = AIzaSyDpqfCp4v5Ykc201OEUgscQPsZkKAtGRIQ
            // project Number: -743502205155
        }
        // window.location("","_blank");

        window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "FILE_SELECTED") {
                var file = event.data.file;
                console.log('event enter');
                var appEvent = $A.get("e.c:GoogleDriveEvent");
                appEvent.setParams({ "files": [file] });
                appEvent.fire();
            }
        })
    },
    handleFileSelection: function (component, event, helper) {
        var fileInput = component.find("file");
        fileInput.set("v.files", event.getParam("files"));
    },

    scriptsLoaded: function (cmp, evetn, helper) {
        console.log('script loadeed ');
    }

});

// ({
//     showcsvdata :  function (component, event, helper){
//         component.set('v.progress', 0);
//         var fileInput = event.getParam("files");

//         console.log('length of file======'+fileInput.length);
//         console.log('fileInput ======='+JSON.stringify(fileInput));

//         var fileName = 'No File Selected..';
//         var file = fileInput[0];
//         console.log('file input[0]==='+file['name']);

//         // console.log('file====='+JSON.stringify(file));
//         if (fileInput.length > 0) {
//             var fName = fileInput[0]['name'];
//         }

//         console.log('fname===='+fName);
//         console.log('fName.indexOf(".csv")===='+fName.indexOf(".csv"));

//         if(fName.indexOf(".csv") !== -1){
//             component.set("v.fileName", fileName);

//         	if (file) {
//                 component.set("v.showcard", true);
//                 var tabledata=[];
//                 var reader = new FileReader();
//                 reader.readAsText(file, "UTF-8");
//                 reader.onload = function (evt) {
//                     var csv = evt.target.result;
//                     console.log('csv.length====='+csv.length);
//                     if(csv.length > 4000000){
//                         helper.showToast("Info", "Info!", "Please upload smaller size of csv file");
//                     }else{
//                         var rows = csv.split("\n");
//                         var trimrow = rows[0].split(",");
//                         component.set("v.header",trimrow);
//                         for (var i = 1; i < rows.length; i++) {
//                             tabledata.push(rows[i]);
//                         }
//                         for(var j=0;j<=100;j++){
//                             task(j);
//                         }
//                         function task(j) {
//                           setTimeout(function() {
//                         	component.set('v.progress',j);
//                           }, 2*j);
//                         }
//                         component.set("v.tabledata",tabledata);
//                         var fileName = fName;
//                         component.set("v.fileName",fileName);
//                         console.log('file Name After==='+fileName);
//                     }

//                 }
//             }
//         }else{
//             helper.showToast("Info", "Info!", "Please upload only CSV file");
//         }
//     },
// })