/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-cosmoshub/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CosmosHub implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Cosmos Hub',
    name: 'cosmoshub',
    icon: 'file:cosmoshub.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Cosmos Hub API',
    defaults: {
      name: 'Cosmos Hub',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'cosmoshubApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Governance',
            value: 'governance',
          },
          {
            name: 'IBC Transfers',
            value: 'ibcTransfers',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Distribution',
            value: 'distribution',
          }
        ],
        default: 'transactions',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['transactions'] } },
	options: [
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get transaction by hash',
			action: 'Get transaction by hash',
		},
		{
			name: 'Get Transactions',
			value: 'getTransactions',
			description: 'Get transactions with filters',
			action: 'Get transactions with filters',
		},
		{
			name: 'Broadcast Transaction',
			value: 'broadcastTransaction',
			description: 'Broadcast a signed transaction',
			action: 'Broadcast a signed transaction',
		},
		{
			name: 'Simulate Transaction',
			value: 'simulateTransaction',
			description: 'Simulate transaction execution',
			action: 'Simulate transaction execution',
		},
	],
	default: 'getTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['staking'] } },
	options: [
		{
			name: 'Get Validators',
			value: 'getValidators',
			description: 'Get all validators',
			action: 'Get all validators',
		},
		{
			name: 'Get Validator',
			value: 'getValidator',
			description: 'Get validator details',
			action: 'Get validator details',
		},
		{
			name: 'Get Delegations',
			value: 'getDelegations',
			description: 'Get delegator\'s delegations',
			action: 'Get delegator\'s delegations',
		},
		{
			name: 'Get Validator Delegations',
			value: 'getValidatorDelegations',
			description: 'Get validator\'s delegations',
			action: 'Get validator\'s delegations',
		},
		{
			name: 'Get Delegator Validators',
			value: 'getDelegatorValidators',
			description: 'Get delegator\'s validators',
			action: 'Get delegator\'s validators',
		},
	],
	default: 'getValidators',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['governance'],
		},
	},
	options: [
		{
			name: 'Get Proposals',
			value: 'getProposals',
			description: 'Get all governance proposals',
			action: 'Get proposals',
		},
		{
			name: 'Get Proposal',
			value: 'getProposal',
			description: 'Get proposal by ID',
			action: 'Get proposal by ID',
		},
		{
			name: 'Get Proposal Votes',
			value: 'getProposalVotes',
			description: 'Get votes for proposal',
			action: 'Get proposal votes',
		},
		{
			name: 'Get Vote',
			value: 'getVote',
			description: 'Get specific vote',
			action: 'Get specific vote',
		},
		{
			name: 'Get Proposal Deposits',
			value: 'getProposalDeposits',
			description: 'Get proposal deposits',
			action: 'Get proposal deposits',
		},
	],
	default: 'getProposals',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['ibcTransfers'],
		},
	},
	options: [
		{
			name: 'Get Channels',
			value: 'getChannels',
			description: 'Get all IBC channels',
			action: 'Get all IBC channels',
		},
		{
			name: 'Get Channel',
			value: 'getChannel',
			description: 'Get specific IBC channel',
			action: 'Get specific IBC channel',
		},
		{
			name: 'Get Client States',
			value: 'getClientStates',
			description: 'Get IBC client states',
			action: 'Get IBC client states',
		},
		{
			name: 'Get Connections',
			value: 'getConnections',
			description: 'Get IBC connections',
			action: 'Get IBC connections',
		},
		{
			name: 'Get Denomination Traces',
			value: 'getDenomTraces',
			description: 'Get denomination traces for transferred tokens',
			action: 'Get denomination traces for transferred tokens',
		},
	],
	default: 'getChannels',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
		},
	},
	options: [
		{
			name: 'Get Account',
			value: 'getAccount',
			description: 'Get account information',
			action: 'Get account information',
		},
		{
			name: 'Get Account Balances',
			value: 'getAccountBalances',
			description: 'Get account balances',
			action: 'Get account balances',
		},
		{
			name: 'Get Account Balance',
			value: 'getAccountBalance',
			description: 'Get specific denomination balance',
			action: 'Get specific denomination balance',
		},
		{
			name: 'Get Total Supply',
			value: 'getTotalSupply',
			description: 'Get total token supply',
			action: 'Get total token supply',
		},
		{
			name: 'Get Supply by Denom',
			value: 'getSupplyByDenom',
			description: 'Get supply of specific denomination',
			action: 'Get supply of specific denomination',
		},
	],
	default: 'getAccount',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['distribution'],
		},
	},
	options: [
		{
			name: 'Get Delegator Rewards',
			value: 'getDelegatorRewards',
			description: 'Get all rewards for a delegator',
			action: 'Get delegator rewards',
		},
		{
			name: 'Get Delegator Rewards by Validator',
			value: 'getDelegatorRewardsByValidator',
			description: 'Get rewards from a specific validator for a delegator',
			action: 'Get delegator rewards by validator',
		},
		{
			name: 'Get Validator Commission',
			value: 'getValidatorCommission',
			description: 'Get commission for a validator',
			action: 'Get validator commission',
		},
		{
			name: 'Get Validator Outstanding Rewards',
			value: 'getValidatorOutstandingRewards',
			description: 'Get outstanding rewards for a validator',
			action: 'Get validator outstanding rewards',
		},
		{
			name: 'Get Community Pool',
			value: 'getCommunityPool',
			description: 'Get community pool funds',
			action: 'Get community pool',
		},
	],
	default: 'getDelegatorRewards',
},
{
	displayName: 'Transaction Hash',
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['getTransaction'],
		},
	},
	default: '',
	description: 'The transaction hash to retrieve',
},
{
	displayName: 'Events',
	name: 'events',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Filter transactions by events (e.g., transfer.recipient=cosmos1...)',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['getTransactions'],
		},
	},
	default: '',
	description: 'Pagination key for next page',
},
{
	displayName: 'Pagination Offset',
	name: 'paginationOffset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['getTransactions'],
		},
	},
	default: 0,
	description: 'Pagination offset',
},
{
	displayName: 'Pagination Limit',
	name: 'paginationLimit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['getTransactions'],
		},
	},
	default: 100,
	description: 'Maximum number of transactions to return',
},
{
	displayName: 'Transaction Bytes',
	name: 'txBytes',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['broadcastTransaction', 'simulateTransaction'],
		},
	},
	default: '',
	description: 'Base64 encoded signed transaction bytes',
},
{
	displayName: 'Broadcast Mode',
	name: 'mode',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['transactions'],
			operation: ['broadcastTransaction'],
		},
	},
	options: [
		{
			name: 'Sync',
			value: 'BROADCAST_MODE_SYNC',
			description: 'Return after CheckTx',
		},
		{
			name: 'Async',
			value: 'BROADCAST_MODE_ASYNC',
			description: 'Return immediately',
		},
		{
			name: 'Block',
			value: 'BROADCAST_MODE_BLOCK',
			description: 'Return after transaction is committed',
		},
	],
	default: 'BROADCAST_MODE_SYNC',
	description: 'Transaction broadcast mode',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getValidators'],
		},
	},
	options: [
		{
			name: 'All',
			value: '',
		},
		{
			name: 'Bonded',
			value: 'BOND_STATUS_BONDED',
		},
		{
			name: 'Unbonded',
			value: 'BOND_STATUS_UNBONDED',
		},
		{
			name: 'Unbonding',
			value: 'BOND_STATUS_UNBONDING',
		},
	],
	default: '',
	description: 'Filter validators by status',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getValidators', 'getDelegations', 'getValidatorDelegations', 'getDelegatorValidators'],
		},
	},
	default: '',
	description: 'Key for pagination (optional)',
},
{
	displayName: 'Pagination Limit',
	name: 'paginationLimit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getValidators', 'getDelegations', 'getValidatorDelegations', 'getDelegatorValidators'],
		},
	},
	default: 100,
	description: 'Number of results to return',
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
},
{
	displayName: 'Validator Address',
	name: 'validatorAddr',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getValidator', 'getValidatorDelegations'],
		},
	},
	default: '',
	required: true,
	description: 'Validator operator address',
},
{
	displayName: 'Delegator Address',
	name: 'delegatorAddr',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getDelegations', 'getDelegatorValidators'],
		},
	},
	default: '',
	required: true,
	description: 'Delegator account address',
},
{
	displayName: 'Proposal Status',
	name: 'proposalStatus',
	type: 'options',
	required: false,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals'],
		},
	},
	options: [
		{
			name: 'Unspecified',
			value: 'PROPOSAL_STATUS_UNSPECIFIED',
		},
		{
			name: 'Deposit Period',
			value: 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
		},
		{
			name: 'Voting Period',
			value: 'PROPOSAL_STATUS_VOTING_PERIOD',
		},
		{
			name: 'Passed',
			value: 'PROPOSAL_STATUS_PASSED',
		},
		{
			name: 'Rejected',
			value: 'PROPOSAL_STATUS_REJECTED',
		},
		{
			name: 'Failed',
			value: 'PROPOSAL_STATUS_FAILED',
		},
	],
	default: '',
	description: 'Filter proposals by status',
},
{
	displayName: 'Voter',
	name: 'voter',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals'],
		},
	},
	default: '',
	description: 'Filter proposals by voter address',
},
{
	displayName: 'Depositor',
	name: 'depositor',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals'],
		},
	},
	default: '',
	description: 'Filter proposals by depositor address',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals', 'getProposalVotes', 'getProposalDeposits'],
		},
	},
	default: '',
	description: 'Pagination key for getting next page of results',
},
{
	displayName: 'Pagination Limit',
	name: 'paginationLimit',
	type: 'number',
	required: false,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals', 'getProposalVotes', 'getProposalDeposits'],
		},
	},
	default: 100,
	description: 'Maximum number of items to return',
},
{
	displayName: 'Proposal ID',
	name: 'proposalId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposal', 'getProposalVotes', 'getVote', 'getProposalDeposits'],
		},
	},
	default: '',
	description: 'The ID of the proposal',
},
{
	displayName: 'Voter Address',
	name: 'voterAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getVote'],
		},
	},
	default: '',
	description: 'The address of the voter',
},
{
	displayName: 'Channel ID',
	name: 'channelId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibcTransfers'],
			operation: ['getChannel'],
		},
	},
	default: '',
	description: 'The IBC channel identifier',
},
{
	displayName: 'Port ID',
	name: 'portId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['ibcTransfers'],
			operation: ['getChannel'],
		},
	},
	default: 'transfer',
	description: 'The IBC port identifier',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['ibcTransfers'],
			operation: ['getChannels', 'getClientStates', 'getConnections', 'getDenomTraces'],
		},
	},
	default: '',
	description: 'Pagination key for retrieving the next page of results',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['ibcTransfers'],
			operation: ['getChannels', 'getClientStates', 'getConnections', 'getDenomTraces'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccount'],
		},
	},
	default: '',
	placeholder: 'cosmos1...',
	description: 'The account address to query',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccountBalances'],
		},
	},
	default: '',
	placeholder: 'cosmos1...',
	description: 'The account address to query balances for',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccountBalances'],
		},
	},
	default: '',
	description: 'Key for pagination',
},
{
	displayName: 'Pagination Limit',
	name: 'paginationLimit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccountBalances'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccountBalance'],
		},
	},
	default: '',
	placeholder: 'cosmos1...',
	description: 'The account address to query',
},
{
	displayName: 'Denomination',
	name: 'denom',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getAccountBalance'],
		},
	},
	default: 'uatom',
	description: 'The denomination to query balance for',
},
{
	displayName: 'Pagination Key',
	name: 'paginationKey',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getTotalSupply'],
		},
	},
	default: '',
	description: 'Key for pagination',
},
{
	displayName: 'Pagination Limit',
	name: 'paginationLimit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getTotalSupply'],
		},
	},
	default: 100,
	description: 'Maximum number of results to return',
},
{
	displayName: 'Denomination',
	name: 'denom',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['accounts'],
			operation: ['getSupplyByDenom'],
		},
	},
	default: 'uatom',
	description: 'The denomination to query supply for',
},
{
	displayName: 'Delegator Address',
	name: 'delegatorAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['distribution'],
			operation: ['getDelegatorRewards', 'getDelegatorRewardsByValidator'],
		},
	},
	default: '',
	placeholder: 'cosmos1...',
	description: 'The delegator address to query rewards for',
},
{
	displayName: 'Validator Address',
	name: 'validatorAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['distribution'],
			operation: ['getDelegatorRewardsByValidator', 'getValidatorCommission', 'getValidatorOutstandingRewards'],
		},
	},
	default: '',
	placeholder: 'cosmosvaloper1...',
	description: 'The validator address to query',
},
{
	displayName: 'Additional Parameters',
	name: 'additionalParameters',
	type: 'collection',
	placeholder: 'Add Parameter',
	default: {},
	displayOptions: {
		show: {
			resource: ['distribution'],
		},
	},
	options: [
		{
			displayName: 'Pagination Key',
			name: 'paginationKey',
			type: 'string',
			default: '',
			description: 'Key for pagination',
		},
		{
			displayName: 'Pagination Offset',
			name: 'paginationOffset',
			type: 'number',
			default: 0,
			description: 'Number of items to skip for pagination',
		},
		{
			displayName: 'Pagination Limit',
			name: 'paginationLimit',
			type: 'number',
			default: 100,
			description: 'Maximum number of items to return',
		},
		{
			displayName: 'Count Total',
			name: 'paginationCountTotal',
			type: 'boolean',
			default: false,
			description: 'Whether to count total number of items',
		},
		{
			displayName: 'Pagination Reverse',
			name: 'paginationReverse',
			type: 'boolean',
			default: false,
			description: 'Whether to reverse the order of results',
		},
	],
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'governance':
        return [await executeGovernanceOperations.call(this, items)];
      case 'ibcTransfers':
        return [await executeIBCTransfersOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'distribution':
        return [await executeDistributionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeTransactionsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTransaction': {
					const hash = this.getNodeParameter('hash', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/txs/${hash}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getTransactions': {
					const events = this.getNodeParameter('events', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationOffset = this.getNodeParameter('paginationOffset', i) as number;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: any = {};
					if (events) queryParams.events = events;
					if (paginationKey) queryParams['pagination.key'] = paginationKey;
					if (paginationOffset) queryParams['pagination.offset'] = paginationOffset;
					if (paginationLimit) queryParams['pagination.limit'] = paginationLimit;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/txs`,
						headers: {
							'Content-Type': 'application/json',
						},
						qs: queryParams,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'broadcastTransaction': {
					const txBytes = this.getNodeParameter('txBytes', i) as string;
					const mode = this.getNodeParameter('mode', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/txs`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: {
							tx_bytes: txBytes,
							mode: mode,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'simulateTransaction': {
					const txBytes = this.getNodeParameter('txBytes', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/cosmos/tx/v1beta1/simulate`,
						headers: {
							'Content-Type': 'application/json',
						},
						body: {
							tx_bytes: txBytes,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeStakingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getValidators': {
					const status = this.getNodeParameter('status', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (status) queryParams.push(`status=${encodeURIComponent(status)}`);
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/cosmos/staking/v1beta1/validators${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidator': {
					const validatorAddr = this.getNodeParameter('validatorAddr', i) as string;

					const url = `${credentials.baseUrl}/cosmos/staking/v1beta1/validators/${encodeURIComponent(validatorAddr)}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDelegations': {
					const delegatorAddr = this.getNodeParameter('delegatorAddr', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/cosmos/staking/v1beta1/delegations/${encodeURIComponent(delegatorAddr)}${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getValidatorDelegations': {
					const validatorAddr = this.getNodeParameter('validatorAddr', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/cosmos/staking/v1beta1/validators/${encodeURIComponent(validatorAddr)}/delegations${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDelegatorValidators': {
					const delegatorAddr = this.getNodeParameter('delegatorAddr', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
					const url = `${credentials.baseUrl}/cosmos/staking/v1beta1/delegators/${encodeURIComponent(delegatorAddr)}/validators${queryString}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeGovernanceOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getProposals': {
					const proposalStatus = this.getNodeParameter('proposalStatus', i) as string;
					const voter = this.getNodeParameter('voter', i) as string;
					const depositor = this.getNodeParameter('depositor', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const params = new URLSearchParams();
					if (proposalStatus) params.append('proposal_status', proposalStatus);
					if (voter) params.append('voter', voter);
					if (depositor) params.append('depositor', depositor);
					if (paginationKey) params.append('pagination.key', paginationKey);
					if (paginationLimit) params.append('pagination.limit', paginationLimit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/gov/v1beta1/proposals${params.toString() ? '?' + params.toString() : ''}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProposal': {
					const proposalId = this.getNodeParameter('proposalId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProposalVotes': {
					const proposalId = this.getNodeParameter('proposalId', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) params.append('pagination.key', paginationKey);
					if (paginationLimit) params.append('pagination.limit', paginationLimit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/votes${params.toString() ? '?' + params.toString() : ''}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getVote': {
					const proposalId = this.getNodeParameter('proposalId', i) as string;
					const voterAddress = this.getNodeParameter('voterAddress', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${voterAddress}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProposalDeposits': {
					const proposalId = this.getNodeParameter('proposalId', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) params.append('pagination.key', paginationKey);
					if (paginationLimit) params.append('pagination.limit', paginationLimit.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/gov/v1beta1/proposals/${proposalId}/deposits${params.toString() ? '?' + params.toString() : ''}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeIbcTransfersOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const baseUrl = credentials.baseUrl || 'https://lcd-cosmoshub.blockapsis.com';

			switch (operation) {
				case 'getChannels': {
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) {
						params.append('pagination.key', paginationKey);
					}
					if (limit) {
						params.append('pagination.limit', limit.toString());
					}

					const url = `${baseUrl}/ibc/core/channel/v1/channels${params.toString() ? '?' + params.toString() : ''}`;
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getChannel': {
					const channelId = this.getNodeParameter('channelId', i) as string;
					const portId = this.getNodeParameter('portId', i) as string;

					const url = `${baseUrl}/ibc/core/channel/v1/channels/${channelId}/ports/${portId}`;
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getClientStates': {
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) {
						params.append('pagination.key', paginationKey);
					}
					if (limit) {
						params.append('pagination.limit', limit.toString());
					}

					const url = `${baseUrl}/ibc/core/client/v1/client_states${params.toString() ? '?' + params.toString() : ''}`;
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getConnections': {
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) {
						params.append('pagination.key', paginationKey);
					}
					if (limit) {
						params.append('pagination.limit', limit.toString());
					}

					const url = `${baseUrl}/ibc/core/connection/v1/connections${params.toString() ? '?' + params.toString() : ''}`;
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDenomTraces': {
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params = new URLSearchParams();
					if (paginationKey) {
						params.append('pagination.key', paginationKey);
					}
					if (limit) {
						params.append('pagination.limit', limit.toString());
					}

					const url = `${baseUrl}/ibc/applications/transfer/v1/denom_traces${params.toString() ? '?' + params.toString() : ''}`;
					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Accept': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAccountsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAccount': {
					const address = this.getNodeParameter('address', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/auth/v1beta1/accounts/${address}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccountBalances': {
					const address = this.getNodeParameter('address', i) as string;
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/bank/v1beta1/balances/${address}${queryString}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAccountBalance': {
					const address = this.getNodeParameter('address', i) as string;
					const denom = this.getNodeParameter('denom', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${encodeURIComponent(denom)}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTotalSupply': {
					const paginationKey = this.getNodeParameter('paginationKey', i) as string;
					const paginationLimit = this.getNodeParameter('paginationLimit', i) as number;

					const queryParams: string[] = [];
					if (paginationKey) queryParams.push(`pagination.key=${encodeURIComponent(paginationKey)}`);
					if (paginationLimit) queryParams.push(`pagination.limit=${paginationLimit}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/bank/v1beta1/supply${queryString}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSupplyByDenom': {
					const denom = this.getNodeParameter('denom', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/bank/v1beta1/supply/by_denom?denom=${encodeURIComponent(denom)}`,
						headers: {
							'Content-Type': 'application/json',
						},
						json: true,
					};

					if (credentials.apiKey) {
						options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
					}

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeDistributionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('cosmoshubApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const additionalParameters = this.getNodeParameter('additionalParameters', i, {}) as any;

			// Build query parameters
			const queryParams: any = {};
			if (additionalParameters.paginationKey) {
				queryParams['pagination.key'] = additionalParameters.paginationKey;
			}
			if (additionalParameters.paginationOffset) {
				queryParams['pagination.offset'] = additionalParameters.paginationOffset.toString();
			}
			if (additionalParameters.paginationLimit) {
				queryParams['pagination.limit'] = additionalParameters.paginationLimit.toString();
			}
			if (additionalParameters.paginationCountTotal) {
				queryParams['pagination.count_total'] = additionalParameters.paginationCountTotal.toString();
			}
			if (additionalParameters.paginationReverse) {
				queryParams['pagination.reverse'] = additionalParameters.paginationReverse.toString();
			}

			const queryString = Object.keys(queryParams).length > 0 
				? '?' + new URLSearchParams(queryParams).toString() 
				: '';

			switch (operation) {
				case 'getDelegatorRewards': {
					const delegatorAddress = this.getNodeParameter('delegatorAddress', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards${queryString}`,
						headers: {
							'Accept': 'application/json',
							...(credentials.apiKey && { 'Authorization': `Bearer ${credentials.apiKey}` }),
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getDelegatorRewardsByValidator': {
					const delegatorAddress = this.getNodeParameter('delegatorAddress', i) as string;
					const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}${queryString}`,
						headers: {
							'Accept': 'application/json',
							...(credentials.apiKey && { 'Authorization': `Bearer ${credentials.apiKey}` }),
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getValidatorCommission': {
					const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/distribution/v1beta1/validators/${validatorAddress}/commission${queryString}`,
						headers: {
							'Accept': 'application/json',
							...(credentials.apiKey && { 'Authorization': `Bearer ${credentials.apiKey}` }),
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getValidatorOutstandingRewards': {
					const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/distribution/v1beta1/validators/${validatorAddress}/outstanding_rewards${queryString}`,
						headers: {
							'Accept': 'application/json',
							...(credentials.apiKey && { 'Authorization': `Bearer ${credentials.apiKey}` }),
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				case 'getCommunityPool': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/cosmos/distribution/v1beta1/community_pool${queryString}`,
						headers: {
							'Accept': 'application/json',
							...(credentials.apiKey && { 'Authorization': `Bearer ${credentials.apiKey}` }),
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
