({
    onChangeOperation: function (component, event, helper) {
        try {
            component.set("v.operation", component.find('select').get('v.value'));
        } catch (error) {

        }
    },
    doinit: function (component, event, helper) {
        component.set("v.IsSpinner", true);
        try {
            helper.searchHelper(component, event, helper);
            helper.getUserEmail(component, event, helper);
        } catch (error) {

        }
        component.set("v.IsSpinner", false);

    },
    onblurMethod: function (component, event, helper) {
        // component.set("v.listOfSearchRecords", null);
        try {
            var forclose = component.find("searchRes");
            $A.util.addClass(forclose, 'slds-is-close');
            $A.util.removeClass(forclose, 'slds-is-open');
        } catch (error) {

        }
    },



    onChangeObject: function (component, event, helper) {
        try {
            helper.onChangeObject(component, event, helper);
        } catch (error) {

        }
    },
    //    first next button
    callNexthandle: function (component, event, helper) {
        try {
            helper.callNexthandle(component, event, helper);
        } catch (error) {

        }
    },

    onSelectAllChange: function (component, event, helper) {
        try {
            helper.onSelectAllChange(component, event, helper);
        } catch (error) {

        }
    },



    previousClikButton: function (component, event, helper) {
        try {
            var selectedStep = event.getSource().get("v.value");
            var toggleIndicatorNext = component.find("step2Indicator");
            $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
            $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');
            var toggleIndicatorCurrent = component.find("step1Indicator");
            var secoundColour = component.find("secoundColour");
            $A.util.removeClass(secoundColour, 'secoundColour');
            $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
            $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');

            var nextStep = selectedStep == 'Step2' ? 'Step1' : 'finished';
            component.set("v.progress", '100');

            if (nextStep == 'finished') {
                component.set("v.finished", nextStep);
            } else {
                helper.deleteRowRecord(component, event, helper);
                component.set("v.currentStep", nextStep);

            }
        } catch (error) {

        }

    },

    PreviousStep2: function (component, event, helper) {
        try {
            var selectedStep = event.getSource().get("v.value");
            var toggleIndicatorNext = component.find("step3Indicator");
            $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
            $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');
            var toggleIndicatorCurrent = component.find("step2Indicator");
            $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
            $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');
            var toggleIndicatorCurrent = component.find("thirdColour");
            $A.util.removeClass(toggleIndicatorCurrent, 'thirdColour');

            var nextStep = selectedStep == 'Step3' ? 'Step2' : 'finished';

            if (nextStep == 'finished') {
                component.set("v.finished", nextStep);
            } else {
                component.set("v.currentStep", nextStep);
            }
        } catch (error) {

        }


    },

    addRow: function (component, event, helper) {
        helper.addRowRecord(component, event, helper);
    },

    addMapRow: function (component, event, helper) {
        helper.addRowMapRecord(component, event, helper);
    },

    deleteRow: function (component, event, helper) {
        helper.deleteRowRecord(component, event, helper);
    },

    deleteMapRow: function (component, event, helper) {
        helper.deleteMapRowRecord(component, event, helper);
    },
    // second next button
    callNextButton: function (component, event, helper) {
        try {
            var validateSelect;
            if (component.find("selectDropValues") != undefined) {
                validateSelect = component.find("selectDropValues").reduce(function (validSoFar, inputCmp) {
                    inputCmp.showHelpMessageIfInvalid();
                    return validSoFar && inputCmp.get('v.validity').valid;
                }, true);
            }

            var tablePushDataList = component.get('v.tableListData');
            var sfPushData = component.get('v.FieldToUpdateList');
            var toggleIndicatorCurrent = component.find("step2Indicator");
            $A.util.removeClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-current');
            $A.util.addClass(toggleIndicatorCurrent, 'slds-tabs--path__item slds-is-complete');
            var thirdColour = component.find("thirdColour");
            $A.util.addClass(thirdColour, 'thirdColour');

            var toggleIndicatorNext = component.find("step3Indicator");
            $A.util.removeClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-incomplete');
            $A.util.addClass(toggleIndicatorNext, 'slds-tabs--path__item slds-is-current');


            if (tablePushDataList.length < 1 && sfPushData.length < 1) {
                helper.showToast(component, "Info", "Info!", "Please Select Atleast One Condition and One Mapping Field");
            } else if (tablePushDataList.length < 1) {
                helper.showToast(component, "Info", "Info!", "Please Select Atleast One Condition");
            } else if (sfPushData.length < 1) {
                helper.showToast(component, "Info", "Info!", "Please Select Atleast One Mapping Field");
            } else if (!validateSelect) {
                helper.showToast(component, "Error", "Error!", "Please Select All Fields");
            } else if (validateSelect) {
                var selectedStep = event.getSource().get("v.value");

                var nextStep = selectedStep == 'Step2' ? 'Step3' : 'finished';
                var operation = component.get('v.operation');

                if (nextStep == 'finished') {
                    component.set("v.finished", nextStep);
                }
                // ---------------- jenish gangani 9/2
                else if (operation == 'insert') {
                    helper.insertRecord(component, event, helper);
                    component.set("v.currentStep", nextStep);
                }
                else {
                    helper.nextWriteQuery(component, event, helper);
                    component.set("v.currentStep", nextStep);
                }
            }

        } catch (error) {

        }

    },

    saveRecordsToSF: function (component, event, helper) {
        try {
            var selectedStep = event.getSource().get("v.value");
            var nextStep = selectedStep == 'Step3' ? 'finished' : 'finished';

            if (nextStep == 'finished') {
                helper.saveRecordData(component, event, helper);
                component.set("v.currentStep", nextStep);
                component.set("v.finished", true);
            }

        } catch (error) {

        }

    },
    saveRecordsToSFForInsert: function (component, event, helper) {
        try {
            var selectedStep = event.getSource().get("v.value");
            var nextStep = selectedStep == 'Step3' ? 'finished' : 'finished';

            if (nextStep == 'finished') {
                helper.saveRecordsToSFForToInsert(component, event, helper);
                component.set("v.currentStep", nextStep);
                component.set("v.finished", true);
            }

        } catch (error) {

        }

    },
    // jenish gangani 11/02

    nextPageRecord: function (component, event, helper) {
        try {
            var pageNumber = component.get('v.pageNumber');
            if (pageNumber >= 1) {
                component.set('v.pageNumber', pageNumber + 1);
                helper.pageRecord(component, event, helper);
            }
        } catch (error) {

        }

    },

    prevPageRecord: function (component, event, helper) {
        try {
            var pageNumber = component.get('v.pageNumber');
            if (pageNumber > 1) {
                component.set('v.pageNumber', pageNumber - 1);
                helper.pageRecord(component, event, helper);
            }
        } catch (error) {

        }

    },

    showSelectObjectHelp: function (component, event, helper) {
        try {
            if (component.get('v.selectObjectHelp')) {
                component.set('v.selectObjectHelp', false);
            } else {
                component.set('v.selectObjectHelp', true);
            }
        } catch (error) {

        }
    },

    showSelectFieldHelp: function (component, event, helper) {
        try {
            component.set('v.SelectFieldHelp', true);
        } catch (error) {

        }
    },


    handleNextButton: function (component, event, helper) {
        component.set("v.stepOneNextButton", event.getParam('value'));
    },
    handleHeader: function (component, event, helper) {
        try {
            component.set("v.header", event.getParam('value'));
        } catch (error) {

        }
    },
    handleTableData: function (component, event, helper) {
        try {
            component.set("v.tabledata", event.getParam('value'));

        } catch (error) {

        }
    },
    handlefileValue: function (component, event, helper) {
        try {
            component.set("v.fileName", event.getParam('value'));

        } catch (error) {

        }
    },
    getValueFromLwc: function (component, event, helper) {
        try {
            component.set("v.inputValue", event.getParam('value'));

        } catch (error) {

        }
    },
    openLWC: function (component, event, helper) {
        try {
            var q = !(component.get("v.inputValue"));
            component.set("v.inputValue", q);
        } catch (error) {

        }

    }

})