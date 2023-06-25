import json
import boto3

def handler(event, context):
    body = the_thing()
    return {
        'statusCode': 200,
        'body': body
    }

def the_thing():
    client = boto3.client('ec2', region_name='eu-west-1')
    ec2s = client.describe_instances()['Reservations']
    for ec2 in ec2s:
        print(ec2['Instances'][0]['State']['Name'])
        if (ec2['Instances'][0]['State']['Name'] == "running"):
            client.terminate_instances(InstanceIds = [ec2['Instances'][0]['InstanceId']])
        else:
            print("EC2 not running!")
    return json.dumps('EC2 job run!')