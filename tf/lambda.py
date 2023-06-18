import json
import boto3

def handler(event, context):
    body = the_thing()
    return {
        'statusCode': 200,
        'body': body
    }

def the_thing():
    rds = boto3.client('rds', region_name='eu-west-1')
    db = rds.describe_db_instances()['DBInstances'][0]
    if (db['DBInstanceStatus'] != 'stopped'):
        rds.stop_db_instance(DBInstanceIdentifier = db['DBInstanceIdentifier'])
        return json.dumps('RDS stopping!')
    else:
        return json.dumps('RDS already stopped!')
