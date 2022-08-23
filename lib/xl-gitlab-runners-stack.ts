import {
  GitLabRunner,
  PearsonStack,
  PearsonStackProps,
  PearsonVpc,
} from "@pearson-cdk/constructs";
import { InstanceClass, InstanceSize } from "aws-cdk-lib/aws-ec2";

import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Tags } from "aws-cdk-lib";

interface XLGitlabRunnersStackProps extends PearsonStackProps {
  token: string;
  appName: string;
}

export class XLGitlabRunnersStack extends PearsonStack {
  constructor(scope: Construct, id: string, props: XLGitlabRunnersStackProps) {
    super(scope, id, props);

    // Gitlab Runner for XL Infra repository
    const vpc = new PearsonVpc(this, `XL-runners-vpc-${props.appName}`, {
      vpcName: `XL-${props.appName}-vpc`,
      cidr: "172.16.0.0/16",
      isNaasVPC: false,
    });

    const runner = GitLabRunner.CreateGitLabRunner(
      this,
      `XL-${props.appName}-runner`,
      {
        asgMin: 1,
        asgMax: 3,
        ec2class: InstanceClass.T3,
        ec2size: InstanceSize.LARGE,
        gitlabRunnerTokenSsmId: new StringParameter(
          this,
          `XL-${props.appName}-runner-parameter`,
          {
            stringValue: props.token,
          }
        ).parameterName,
        vpc: vpc,
        gitlabRunnerTags: [`XL-${props.appName}-${props.environment}`],
      }
    );
    Tags.of(this).add("t_AppID", "SVC00753");
    Tags.of(this).add("t_dcl", "3");
  }
}
