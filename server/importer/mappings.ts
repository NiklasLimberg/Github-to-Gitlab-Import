export const mappings = {
    platform: {
        jiraIssueKey: 'NEXT',
        gitlabProjectID: 1,
        gitlabCloneURL: 'git@gitlab.shopware.com:shopware/6/product/platform.git',
    },
    development: {
        jiraIssueKey: 'NEXT',
        gitlabProjectID: 8,
        gitlabCloneURL: 'git@gitlab.shopware.com:shopware/6/product/development.git',
    },
    production: {
        jiraIssueKey: 'NEXT',
        gitlabProjectID: 184,
        gitlabCloneURL: 'git@gitlab.shopware.com:shopware/6/product/production.git',
    },
    shopware: {
        jiraIssueKey: 'SW',
        gitlabProjectID: 54,
        gitlabCloneURL: 'git@gitlab.shopware.com:shopware/5/product/shopware.git',
    },
};

export type mappingKeys = 'platform' | 'development' | 'production' | 'shopware';
