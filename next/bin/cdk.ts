#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../cdk/stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {
  env: {
    account: '103348857345',
    region: 'us-east-1'
  },
});