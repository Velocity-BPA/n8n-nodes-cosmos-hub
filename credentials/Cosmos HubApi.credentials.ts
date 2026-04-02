import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CosmosHubApi implements ICredentialType {
	name = 'cosmosHubApi';
	displayName = 'Cosmos Hub API';
	documentationUrl = 'https://docs.cosmos.network/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://lcd-cosmoshub.blockapsis.com',
			required: true,
			description: 'The base URL for the Cosmos Hub LCD API',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: false,
			description: 'Private key for signing transactions (required only for transaction broadcasting)',
		},
	];
}