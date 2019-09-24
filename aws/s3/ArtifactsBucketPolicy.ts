import { S3, Fn } from "cloudform";

const Resource = [
    Fn.GetAtt("ArtifactsBucket", "Arn"),
    Fn.Join("", [Fn.GetAtt("ArtifactsBucket", "Arn"), "/*"])
];

export const ArtifactsBucketPolicy = new S3.BucketPolicy({
    Bucket: Fn.Ref("ArtifactsBucket"),
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "Allow CI/CD read access",
                Effect: "Allow",
                Action: [
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:GetBucketVersioning"
                ],
                Resource,
                Principal: {
                    AWS: [
                        Fn.GetAtt("CloudFormationRole", "Arn"),
                        Fn.GetAtt("CodePipelineRole", "Arn"),
                        Fn.GetAtt("CodeBuildRole", "Arn")
                    ]
                }
            },
            {
                Sid: "Allow CI/CD write access",
                Effect: "Allow",
                Action: ["s3:PutObject"],
                Resource,
                Principal: {
                    AWS: [
                        Fn.GetAtt("CodePipelineRole", "Arn"),
                        Fn.GetAtt("CodeBuildRole", "Arn")
                    ]
                }
            }
        ]
    }
});
