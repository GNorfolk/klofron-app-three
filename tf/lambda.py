import json
import boto3

def lambda_handler(event, context):
    the_thing()
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def the_thing():
    rds = boto3.client('rds', region_name='eu-west-1')
    db = rds.describe_db_instances()['DBInstances'][0]
    if (db['DBInstanceStatus'] != 'stopped'):
        rds.stop_db_instance(DBInstanceIdentifier = db['DBInstanceIdentifier'])
