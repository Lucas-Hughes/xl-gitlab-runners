#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { XLGitlabRunnersStack } from '../lib/xl-gitlab-runners-stack';

const app = new cdk.App();

new XLGitlabRunnersStack(app, 'XlGitlabRunnersStack', {
  environment: "DEV",
  token: "GR1348941AmqH_BjyPJNQYuN8FhrT",
  env: {
    account: "177807608173",
    region: "us-east-1",
  },
  appName: "gitlab-runner",
});