/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CosmosHub } from '../nodes/Cosmos Hub/Cosmos Hub.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CosmosHub Node', () => {
  let node: CosmosHub;

  beforeAll(() => {
    node = new CosmosHub();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Cosmos Hub');
      expect(node.description.name).toBe('cosmoshub');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Transactions Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getTransaction', () => {
		it('should get transaction by hash successfully', async () => {
			const mockResponse = { tx: { body: { messages: [] } }, tx_response: { txhash: 'ABC123' } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('ABC123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/tx/v1beta1/txs/ABC123',
				headers: { 'Content-Type': 'application/json' },
				json: true,
			});
		});

		it('should handle getTransaction errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('INVALID');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Transaction not found');
		});
	});

	describe('broadcastTransaction', () => {
		it('should broadcast transaction successfully', async () => {
			const mockResponse = { tx_response: { code: 0, txhash: 'DEF456' } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('broadcastTransaction')
				.mockReturnValueOnce('base64encodedtx')
				.mockReturnValueOnce('BROADCAST_MODE_SYNC');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/tx/v1beta1/txs',
				headers: { 'Content-Type': 'application/json' },
				body: { tx_bytes: 'base64encodedtx', mode: 'BROADCAST_MODE_SYNC' },
				json: true,
			});
		});
	});
});

describe('Staking Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getValidators operation', () => {
		it('should get validators successfully', async () => {
			const mockResponse = {
				validators: [
					{
						operator_address: 'cosmosvaloper123',
						consensus_pubkey: { type: 'tendermint/PubKeyEd25519' },
						jailed: false,
						status: 'BOND_STATUS_BONDED',
						tokens: '1000000',
						delegator_shares: '1000000.000000000000000000',
					},
				],
				pagination: { next_key: null, total: '1' },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidators')
				.mockReturnValueOnce('BOND_STATUS_BONDED')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED&pagination.limit=100',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getValidators error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidators')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getValidator operation', () => {
		it('should get validator details successfully', async () => {
			const mockResponse = {
				validator: {
					operator_address: 'cosmosvaloper123',
					consensus_pubkey: { type: 'tendermint/PubKeyEd25519' },
					jailed: false,
					status: 'BOND_STATUS_BONDED',
					tokens: '1000000',
					delegator_shares: '1000000.000000000000000000',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidator')
				.mockReturnValueOnce('cosmosvaloper123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/staking/v1beta1/validators/cosmosvaloper123',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getDelegations operation', () => {
		it('should get delegations successfully', async () => {
			const mockResponse = {
				delegation_responses: [
					{
						delegation: {
							delegator_address: 'cosmos1abc123',
							validator_address: 'cosmosvaloper123',
							shares: '1000000.000000000000000000',
						},
						balance: { denom: 'uatom', amount: '1000000' },
					},
				],
				pagination: { next_key: null, total: '1' },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDelegations')
				.mockReturnValueOnce('cosmos1abc123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/staking/v1beta1/delegations/cosmos1abc123?pagination.limit=100',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getValidatorDelegations operation', () => {
		it('should get validator delegations successfully', async () => {
			const mockResponse = {
				delegation_responses: [
					{
						delegation: {
							delegator_address: 'cosmos1abc123',
							validator_address: 'cosmosvaloper123',
							shares: '1000000.000000000000000000',
						},
						balance: { denom: 'uatom', amount: '1000000' },
					},
				],
				pagination: { next_key: null, total: '1' },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidatorDelegations')
				.mockReturnValueOnce('cosmosvaloper123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/staking/v1beta1/validators/cosmosvaloper123/delegations?pagination.limit=100',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getDelegatorValidators operation', () => {
		it('should get delegator validators successfully', async () => {
			const mockResponse = {
				validators: [
					{
						operator_address: 'cosmosvaloper123',
						consensus_pubkey: { type: 'tendermint/PubKeyEd25519' },
						jailed: false,
						status: 'BOND_STATUS_BONDED',
						tokens: '1000000',
						delegator_shares: '1000000.000000000000000000',
					},
				],
				pagination: { next_key: null, total: '1' },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDelegatorValidators')
				.mockReturnValueOnce('cosmos1abc123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(100);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/staking/v1beta1/delegators/cosmos1abc123/validators?pagination.limit=100',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Governance Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get proposals successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProposals')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			proposals: [{ id: '1', title: 'Test Proposal' }],
		});

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.proposals).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/gov/v1beta1/proposals',
			headers: { 'Content-Type': 'application/json' },
			json: true,
		});
	});

	it('should get proposal by ID successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProposal')
			.mockReturnValueOnce('1');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			proposal: { id: '1', title: 'Test Proposal' },
		});

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.proposal).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/gov/v1beta1/proposals/1',
			headers: { 'Content-Type': 'application/json' },
			json: true,
		});
	});

	it('should get proposal votes successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProposalVotes')
			.mockReturnValueOnce('1')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			votes: [{ voter: 'cosmos1abc...', option: 'VOTE_OPTION_YES' }],
		});

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.votes).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/gov/v1beta1/proposals/1/votes?pagination.limit=100',
			headers: { 'Content-Type': 'application/json' },
			json: true,
		});
	});

	it('should get specific vote successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getVote')
			.mockReturnValueOnce('1')
			.mockReturnValueOnce('cosmos1abc123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			vote: { voter: 'cosmos1abc123', option: 'VOTE_OPTION_YES' },
		});

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.vote).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/gov/v1beta1/proposals/1/votes/cosmos1abc123',
			headers: { 'Content-Type': 'application/json' },
			json: true,
		});
	});

	it('should get proposal deposits successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProposalDeposits')
			.mockReturnValueOnce('1')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			deposits: [{ depositor: 'cosmos1abc...', amount: [{ denom: 'uatom', amount: '1000000' }] }],
		});

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.deposits).toBeDefined();
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/gov/v1beta1/proposals/1/deposits?pagination.limit=100',
			headers: { 'Content-Type': 'application/json' },
			json: true,
		});
	});

	it('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProposal')
			.mockReturnValueOnce('invalid-id');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
			new Error('Proposal not found'),
		);

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeGovernanceOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Proposal not found');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(
			executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('IBC Transfers Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get channels successfully', async () => {
		const mockResponse = {
			channels: [
				{
					channel_id: 'channel-0',
					port_id: 'transfer',
					state: 'STATE_OPEN',
				},
			],
			pagination: {
				next_key: null,
				total: '1',
			},
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getChannels')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeIbcTransfersOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/ibc/core/channel/v1/channels?pagination.limit=100',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});
	});

	it('should get specific channel successfully', async () => {
		const mockResponse = {
			channel: {
				channel_id: 'channel-0',
				port_id: 'transfer',
				state: 'STATE_OPEN',
			},
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getChannel')
			.mockReturnValueOnce('channel-0')
			.mockReturnValueOnce('transfer');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeIbcTransfersOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/ibc/core/channel/v1/channels/channel-0/ports/transfer',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});
	});

	it('should get client states successfully', async () => {
		const mockResponse = {
			client_states: [
				{
					client_id: '07-tendermint-0',
					client_state: {
						chain_id: 'osmosis-1',
						trust_level: {
							numerator: '1',
							denominator: '3',
						},
					},
				},
			],
			pagination: {
				next_key: null,
				total: '1',
			},
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getClientStates')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(50);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeIbcTransfersOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{
				json: mockResponse,
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should handle errors and continue on fail', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getChannels');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

		const result = await executeIbcTransfersOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{
				json: { error: 'Network error' },
				pairedItem: { item: 0 },
			},
		]);
	});

	it('should throw error when continue on fail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getChannels');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API error'));

		await expect(
			executeIbcTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(
			executeIbcTransfersOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Accounts Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get account information successfully', async () => {
		const mockResponse = { account: { address: 'cosmos1test', account_number: '123' } };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccount')
			.mockReturnValueOnce('cosmos1test');

		const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/auth/v1beta1/accounts/cosmos1test',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer test-key',
			},
			json: true,
		});
	});

	it('should get account balances successfully', async () => {
		const mockResponse = { balances: [{ denom: 'uatom', amount: '1000000' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountBalances')
			.mockReturnValueOnce('cosmos1test')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(100);

		const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors when continue on fail is true', async () => {
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccount')
			.mockReturnValueOnce('cosmos1test');

		const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continue on fail is false', async () => {
		const error = new Error('API Error');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccount')
			.mockReturnValueOnce('cosmos1test');

		await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Distribution Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://lcd-cosmoshub.blockapsis.com',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getDelegatorRewards operation', () => {
		it('should get delegator rewards successfully', async () => {
			const mockResponse = {
				rewards: [
					{
						validator_address: 'cosmosvaloper1...',
						reward: [{ denom: 'uatom', amount: '1000000' }],
					},
				],
				total: [{ denom: 'uatom', amount: '1000000' }],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDelegatorRewards')
				.mockReturnValueOnce('cosmos1delegator123')
				.mockReturnValueOnce({});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/distribution/v1beta1/delegators/cosmos1delegator123/rewards',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getDelegatorRewards errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDelegatorRewards')
				.mockReturnValueOnce('cosmos1delegator123')
				.mockReturnValueOnce({});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getDelegatorRewardsByValidator operation', () => {
		it('should get delegator rewards by validator successfully', async () => {
			const mockResponse = {
				rewards: [{ denom: 'uatom', amount: '500000' }],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getDelegatorRewardsByValidator')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('cosmos1delegator123')
				.mockReturnValueOnce('cosmosvaloper1validator456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/distribution/v1beta1/delegators/cosmos1delegator123/rewards/cosmosvaloper1validator456',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getValidatorCommission operation', () => {
		it('should get validator commission successfully', async () => {
			const mockResponse = {
				commission: {
					commission: [{ denom: 'uatom', amount: '100000' }],
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidatorCommission')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('cosmosvaloper1validator456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/distribution/v1beta1/validators/cosmosvaloper1validator456/commission',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getValidatorOutstandingRewards operation', () => {
		it('should get validator outstanding rewards successfully', async () => {
			const mockResponse = {
				rewards: {
					rewards: [{ denom: 'uatom', amount: '2000000' }],
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getValidatorOutstandingRewards')
				.mockReturnValueOnce({})
				.mockReturnValueOnce('cosmosvaloper1validator456');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/distribution/v1beta1/validators/cosmosvaloper1validator456/outstanding_rewards',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getCommunityPool operation', () => {
		it('should get community pool successfully', async () => {
			const mockResponse = {
				pool: [
					{ denom: 'uatom', amount: '10000000000.123456789' },
					{ denom: 'ibc/token', amount: '5000000.987654321' },
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCommunityPool')
				.mockReturnValueOnce({});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://lcd-cosmoshub.blockapsis.com/cosmos/distribution/v1beta1/community_pool',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	it('should handle unknown operations', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(executeDistributionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
	});
});
});
