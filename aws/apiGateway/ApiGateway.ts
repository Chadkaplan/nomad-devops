import { Fn } from "cloudform";

export const ApiGateway = {
    Type: "AWS::Serverless::Api",
    Properties: {
        EndpointConfiguration: "EDGE",
        StageName: Fn.Ref("GitHubBranch"),
        // Auth: {
        //     Authorizers: {
        //         PassNinjaCognitoAuthorizer: {
        //             UserPoolArn: Fn.ImportValue("UserPoolArn")
        //         }
        //     }
        // },
        MethodSettings: [
            {
                ResourcePath: "/*",
                HttpMethod: "*",
                LoggingLevel: "INFO",
                DataTraceEnabled: true,
                MetricsEnabled: true,
                CachingEnabled: false
                // CacheTtlInSeconds : 'Integer',
                // CacheDataEncrypted : 'Boolean',
                // ThrottlingBurstLimit: 'Integer',
                // ThrottlingRateLimit: 'Double'
            }
        ],
        AccessLogSetting: {
            DestinationArn: Fn.GetAtt("LogGroup", "Arn"),
            Format:
                '{ "requestId": "$context.requestId", "requestTime": "$context.requestTime", "ip": "$context.identity.sourceIp", "apiKey": "$context.identity.apiKey", "apiKeyId": "$context.identity.apiKeyId", "path": "$context.path", "httpMethod": "$context.httpMethod", "resourcePath": "$context.resourcePath", "errorMessage": "$context.error.message", "params": $input.params()}'
        }
    }
};
