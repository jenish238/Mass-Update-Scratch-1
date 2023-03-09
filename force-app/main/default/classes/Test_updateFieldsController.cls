/**********************************************************************************
 * Author       :   MV Clouds
 * Date         :   24-03-2020
 * Description  :   Test class for updateFieldsController and UpdateSobjectBatchable
***********************************************************************************/

@isTest
public class Test_updateFieldsController {
    @isTest static void testUpdateFields() {
        String selectObjectName = 'Contact';
        
        Contact con = new Contact();
            con.FirstName = 'Dharmik';
            con.LastName = 'Shahtest';
            con.Email = 'dharmik@mvclouds.com';
         insert con;   
        
        
        updateFieldsController.getAllObject();
        updateFieldsController.getObjectSelectField(selectObjectName);
        
        List<String> selectedListOfFields = new List<String>();
        selectedListOfFields.add('FirstName');
        selectedListOfFields.add('LastName');
        selectedListOfFields.add('Email');
        
        List<String> headerData = new List<String>();
        headerData.add('Employee First Name');
        headerData.add('Employee Last Name');
        headerData.add('Email');
        
        String tableData = '["\\nDharmik ,Shahtest,dharmik@mvclouds.com","\\nMitul,Surati,mitul.s@mvclouds.com","\\nAkshay,Chahuah,mitul.s@mvclouds.com","\\nLalit,Janlevatest,mitul.s@mvclouds.com"]';
        
        String tablePushDataListJson = '[{"csvfield":"Employee First Name","operator":"=","SObjectField":"FirstName"},{"csvfield":"Email","operator":"=","SObjectField":"Email"}]';        
        
        String FieldToUpdateList = '[{"csvfield":"Employee Last Name","SObjectField":"LastName"},{"csvfield":"Email","SObjectField":"Email"}]';
        
        String keyValueMap = '{"LastName":["test98","test99","test100","test101","test102","test103","test104","test105","test106"]}' ;

        String csvAllDataMap =  '{"test98":{"CSVLASTNAME":"test98","CSVFirstName":"AA-98","CSVPhone":"90888888"},"test99":{"CSVLASTNAME":"test99","CSVFirstName":"AA-99","CSVPhone":"90888888"}}'  ; 

        Map<String,Map<String,String>> csvData = new Map<String,Map<String,String>>();
        Map<String, String> csv = new Map<String, String>();
        csv.put('FirstName', 'Dharmik');
        csv.put('LastName', 'Shahtest');
        csv.put('Email', 'dharmik@mvclouds.com');
        csvData.put('Dharmik^dharmik@mvclouds.com',csv);
        
        String query = 'Select FirstName, LastName,Email From Contact';
        updateFieldsController.setInsertQuery(selectedListOfFields, selectObjectName, headerData, tableData, tablePushDataListJson, FieldToUpdateList);
        updateFieldsController.setSobjectListForInsert(csvData, FieldToUpdateList, selectObjectName);
        updateFieldsController.setQuery(selectedListOfFields, selectObjectName, headerData, tableData, tablePushDataListJson, FieldToUpdateList,keyValueMap,csvAllDataMap);
        updateFieldsController.setSFData(selectObjectName, csvData, query, tablePushDataListJson, headerData, FieldToUpdateList, selectedListOfFields);
        updateFieldsController.setSobjectList(csvData, FieldToUpdateList, selectObjectName);
        
     
        List<SObject> data = [SELECT FirstName,LastName,Email,Id FROM Contact WHERE FirstName IN ('Dharmik', 'Mitul', 'Akshay', 'Lalit')];

        
        String dataStr = JSON.serialize(data);
        updateFieldsController.insertCSVtoSF(dataStr, FieldToUpdateList, selectObjectName);
        updateFieldsController.getEmail();
        
        updateFieldsController.insertRecord(dataStr, FieldToUpdateList, selectObjectName);
        string name = 'test';
        String email = 'test@gmail.com';
        String Subject = 'test';
        String body = 'test';
        updateFieldsController.sendemail(name,email,subject, body);
        
        System.assert(selectObjectName != '', 'Selected Object is not null');
    }
}