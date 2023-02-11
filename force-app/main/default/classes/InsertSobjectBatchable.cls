global class InsertSobjectBatchable implements Database.Batchable<sObject>, Database.Stateful  {
    public List<sObject> lstSobject;
    public String strcsv;
    public String sObjectName;
    public List<String> csvfield;

    public InsertSobjectBatchable(List<sObject> dataList, String strcsvfield, String selectObjectName, List<String> csvF){
        lstSobject = dataList;
        strcsv = strcsvfield;
        sObjectName = selectObjectName;
        csvfield = csvF;
    }
    global List<sObject> start(Database.BatchableContext bc) {
        return lstSobject;
    }
    global void execute(Database.BatchableContext bc, List<sObject> scope){

        if(scope.getSObjectType().getDescribe().isAccessible() && scope.getSObjectType().getDescribe().isUpdateable()){
            Database.SaveResult[] resultList = database.insert(scope, false);

        }
    }
    global void finish(Database.BatchableContext bc){

    }
}






 
    // public static void insertRecords(List<Map<String, Object>> recordsData, String selectObjectName) {
    //     List<SObject> recordsToInsert = new List<SObject>();
    //     selectObjectName = 'contact';
    //     for (Map<String, Object> recordData : recordsData) {
    //         SObject record = Type.forName('Contact').newInstance();
    //         record.put('FirstName', recordData.get('CSVFirstName'));
    //         record.put('LastName', recordData.get('CSVLastName'));
    //         record.put('Email', recordData.get('CSVEmail'));
    //         recordsToInsert.add(record);
    //     }
    //     insert recordsToInsert;
    // }