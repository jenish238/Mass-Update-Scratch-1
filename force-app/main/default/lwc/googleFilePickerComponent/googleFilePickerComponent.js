import { LightningElement ,api,track} from 'lwc';
export default class GoogleFilePickerComponent extends LightningElement {

    receivedMessage = '';
     @track isShowModal = false;
    
    connectedCallback() {
        console.log('connectedCallback called ');
        // var VfOrigin = "https://power-drive-2498-dev-ed.scratch.lightning.force.com";
        var VfOrigin = "https://power-drive-2498-dev-ed--c.scratch.vf.force.com";
        console.log('vd origin-'+VfOrigin);
        window.addEventListener("message", (message) => {
            console.log('message.origin==',message.origin);
            if (message.origin !== VfOrigin) {
                console.log('message origin is not equal');
               
            //Not the expected origin
                return;
            }

            //handle the message
            console.log('message 2===',message);
            console.log('message 11===',message.data.payload);
            console.log('message===',message.data.name);
            if (message.data.name === "SampleVFToLWCMessage") {
                console.log('message equals');
                this.receivedMessage = message.data.payload;
                this.isShowModal = true;
            }
        });
    }
    
  

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    // receivedMessage(payload) {
    //     console.log('handleVFData called==');
    //     // Process the data received from VF
    //     console.log(payload);
    //     receivedMessage = payload;        
    // }




    // connectedCallback() {
    //     console.log('connectedCallback called');
    //     // Binding EventListener here when Data received from VF
    //     window.addEventListener("message", this.handleVFResponse.bind(this));
    // }

    //  handleVFResponse(message) {
    //     if (message.origin === this.vfOrigin.data) {
    //         console.log('data received from VF '+this.receivedMessage);
    //         this.receivedMessage = message.data;
    //     }
    // }
    // vfPageLoaded() {
    //     console.log('vfPageLoaded called');
    //     // const vfFrame = this.template.querySelector('#vfFrame');
    //     // vfFrame.contentWindow.doSomethingInVFPage();
    // }
}