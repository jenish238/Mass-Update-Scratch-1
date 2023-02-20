import { LightningElement ,api,track} from 'lwc';
import gapiLibrary from '@salesforce/resourceUrl/Google_account_library';
import { loadScript } from 'lightning/platformResourceLoader';
export default class GoogleFilePickerComponent extends LightningElement {


    @track CLIENT_ID = '816521585707-lvdkgvro4cmi69rnuu2308p7hkbqoeg4.apps.googleusercontent.com';
    //const API_KEY = 'AIzaSyDpqfCp4v5Ykc201OEUgscQPsZkKAtGRIQ';
    @track API_KEY = 'AIzaSyDYiocNeen_vyPPA8Au3gnPdrhpcxupQlM';

    // TODO(developer): Replace with your own project number from console.developers.google.com.
    @track APP_ID = '816521585707-lvdkgvro4cmi69rnuu2308p7hkbqoeg4.apps.googleusercontent.com';

    @track tokenClient;
    @track accessToken = null;
    @track pickerInited = false;
    @track gisInited = false;
    
    renderedCallBackCalled = false;

    renderedCallback() {

        if (this.renderedCallBackCalled) {
            return;
        }

        try {
            this.renderedCallBackCalled = true;
    
            loadScript(this, gapiLibrary)
                .then(() => {
                  //  this.handleClientLoad();
                    this.tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    scope: SCOPES,
                    callback: '', // defined later
                    });
                })
                .catch(error => {
                    console.log('oauth.renderedCallback: error: ' + error);
                });

        } catch (error) {
            console.log('oauth.renderedCallback: error: ' + error);
        }
    }


    handleClick(){
        this.tokenClient.callback = async (response) => {
                if (response.error !== undefined) {
                throw (response);
            }
            accessToken = response.access_token;
            //document.getElementById('signout_button').style.visibility = 'visible';
            //document.getElementById('authorize_button').innerText = 'Refresh';
            
            window.gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                //discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(()=>{
                const authInstance = window.gapi.auth2.getAuthInstance();
                authInstance.grantOfflineAccess()
                .then((res) => {
                console.log(res);
                var refreshToken = res.code;
                console.log('refreshToken=='+refreshToken);
            });
        });
        await createPicker(); 
    }
    // On load, called to load the auth2 library and API client library.
    // handleClientLoad() {
    // try {
    //     // Initializes the API client library and sets up sign-in state listeners
    //     gapi.load('client:auth2', function() {

    //         // Console Error: Access to XMLHttpRequest at 'https://apis.google.com/_/scs/apps-static/_/js/k=oz.gapi.en.FQMyBOWbNKQ.O/m=auth2,client/rt=j/sv=1/d=1/ed=1/am=wQ/rs=AGLTcCN26pA1ff1pmP_btrYNbcyVNWJGOQ/cb=gapi.loaded_0' from origin 'https://10724769canadainc-dev-ed.lightning.force.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

    //         });
    // } catch (error) {
    //     console.log('oauth.handleClientLoad: error: ' + error);
    // }
    }
}