import { api, track, LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import QuickBotLogo from '@salesforce/resourceUrl/QuickBotLogo';
import QuickBotBody from '@salesforce/resourceUrl/QuickBotBody';
import QuickBot_Cross from '@salesforce/resourceUrl/QuickBot_Cross';
import QuickBotCSS from '@salesforce/resourceUrl/QuickBotCSS';
// import quickbotheader from '@salesforce/label/c.QuickBot_Header';
import sendemail from '@salesforce/apex/updateFieldsController.sendemail';
export default class QuickBot extends LightningElement {
    // @track spinnerdatatable = true;
    Logo = QuickBotLogo;
    Body = QuickBotBody;
    Cross = QuickBot_Cross;
    @track spinnerdatatable = false;
    @track first_icon = false;
    @track wel_message = false;
    @track feedback_form = false;
    @track showquickbot = false;
    @track showComponent = true;


    quickbotname;
    quickbotemail;
    quickbotmessage;
    quickbotsubject;
    email_msg = true;
    name_msg = true;
    subject_msg = true;
    Message_msg = true;

    // header = quickbotheader;
    get bgimg() {
        return `background-image:url(${QuickBotBody});background-repeat: no-repeat; background-size: cover;`;
    }

    connectedCallback() {
        this.spinnerdatatable = true;
        window.setTimeout(() => { this.spinnerdatatable = false; }, 4000);
        this.first_icon = true;
        window.setTimeout(() => { this.first_icon = true; }, 4000);
        this.wel_message = false;
        window.setTimeout(() => { this.wel_message = true; }, 4000);
        this.feedback_form = false;
        window.setTimeout(() => { this.feedback_form = true; }, 5500);
    }

    renderedCallback() {
        Promise.all([
            loadStyle(this, QuickBotCSS)
        ]).then(() => {
        })
            .catch(error => {
            });
    }
    Quickbot_name(event) {
        this.quickbotname = event.target.value;
        this.name_msg = true;
    }
    Quickbot_email(event) {
        this.quickbotemail = event.target.value;
        this.email_msg = true;
    }
    Quickbot_message(event) {
        this.quickbotmessage = event.target.value;
        this.Message_msg = true;

    }
    Quickbot_subject(event) {
        this.quickbotsubject = event.target.value;
        this.subject_msg = true;

    }
    emailsend;
    quickbot_Submit() {
        var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var validation = pattern.test(this.quickbotemail);


        if (this.quickbotname == undefined) {
            this.name_msg = false;
        }
        else if (validation == false) {
            this.email_msg = false;
        } else if (this.quickbotsubject == undefined) {
            this.subject_msg = false;
        }
        else if (this.quickbotmessage == undefined) {
            this.Message_msg = false;
        } else {
            this.email_msg = true;
            const value = false;
            const valueChangeEvent = new CustomEvent("valuechange", {
                detail: { value }
            });
            // Fire the custom event
            this.dispatchEvent(valueChangeEvent);
            sendemail({ name: this.quickbotname, email: this.quickbotemail, subject: this.quickbotsubject, body: this.quickbotmessage })
                .then(result => {
                    this.emailsend = true;
                    this.dispatchEvent(new CustomEvent('botclose', { detail: this.emailsend }));
                    this.dispatchEvent(new CustomEvent('success'));
                }).catch(error => {
                    this.emailsend = false;
                    this.dispatchEvent(new CustomEvent('botclose', { detail: this.emailsend }));
                    this.dispatchEvent(new CustomEvent('error'));
                });
        }

    }

    quickboe_close(event) {
        this.showComponent = !this.showComponent;
        const value = false;
        const valueChangeEvent = new CustomEvent("valuechange", {
            detail: { value }
        });
        // Fire the custom event
        this.dispatchEvent(valueChangeEvent);

    }
}