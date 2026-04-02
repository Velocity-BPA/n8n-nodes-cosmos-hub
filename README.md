# n8n-nodes-cosmos-hub

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Cosmos Hub blockchain network, offering 6 core resources for transaction management, staking operations, governance participation, cross-chain transfers, account management, and reward distribution. Built for developers and organizations needing robust blockchain automation capabilities within their n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Cosmos](https://img.shields.io/badge/Cosmos-Hub-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-green)
![Staking](https://img.shields.io/badge/Staking-Enabled-orange)

## Features

- **Transaction Management** - Send, query, and monitor ATOM transactions with full metadata support
- **Staking Operations** - Delegate, undelegate, and redelegate ATOM tokens to validators
- **Governance Integration** - Submit proposals, vote on governance issues, and track proposal status
- **IBC Transfers** - Execute cross-chain transfers between Cosmos ecosystem blockchains
- **Account Operations** - Query balances, transaction history, and account information
- **Distribution Management** - Claim staking rewards and track validator commission
- **Real-time Monitoring** - Poll for transaction confirmations and network status
- **Error Handling** - Comprehensive error messages with transaction failure details

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-cosmos-hub`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-cosmos-hub
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-cosmos-hub.git
cd n8n-nodes-cosmos-hub
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-cosmos-hub
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Cosmos Hub API access key for authenticated operations | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional, defaults to public endpoints) | No |
| Chain ID | Cosmos Hub chain identifier (defaults to cosmoshub-4) | No |

## Resources & Operations

### 1. Transactions

| Operation | Description |
|-----------|-------------|
| Send | Transfer ATOM tokens between addresses |
| Get Transaction | Retrieve transaction details by hash |
| List Transactions | Query transactions by address or criteria |
| Get Transaction Status | Check confirmation status of pending transactions |

### 2. Staking

| Operation | Description |
|-----------|-------------|
| Delegate | Delegate ATOM tokens to a validator |
| Undelegate | Undelegate tokens from a validator (21-day unbonding) |
| Redelegate | Move delegation from one validator to another |
| Get Delegations | List all delegations for an address |
| Get Validators | Retrieve validator information and status |

### 3. Governance

| Operation | Description |
|-----------|-------------|
| Submit Proposal | Create new governance proposal |
| Vote | Cast vote on active proposals |
| Get Proposal | Retrieve proposal details and voting status |
| List Proposals | Query governance proposals by status |
| Get Vote | Check voting record for specific proposal |

### 4. IBC Transfers

| Operation | Description |
|-----------|-------------|
| Transfer | Send tokens across IBC-enabled chains |
| Get Transfer Status | Track IBC transfer packet status |
| List Channels | Query available IBC channels |
| Get Channel Info | Retrieve channel configuration details |

### 5. Accounts

| Operation | Description |
|-----------|-------------|
| Get Balance | Query ATOM and token balances |
| Get Account Info | Retrieve account details and sequence |
| List Transactions | Get transaction history for address |
| Get Unbonding | Check unbonding delegation status |

### 6. Distribution

| Operation | Description |
|-----------|-------------|
| Claim Rewards | Withdraw staking rewards from validators |
| Get Rewards | Query pending reward amounts |
| Claim Commission | Withdraw validator commission (for validators) |
| Get Distribution Params | Retrieve network distribution parameters |

## Usage Examples

```javascript
// Send ATOM tokens
{
  "recipient": "cosmos1abc123def456ghi789jkl012mno345pqr678st",
  "amount": "1000000",
  "denom": "uatom",
  "memo": "Payment for services"
}
```

```javascript
// Delegate to validator
{
  "validatorAddress": "cosmosvaloper1abc123def456ghi789jkl012mno345pqr678st",
  "amount": "5000000",
  "denom": "uatom"
}
```

```javascript
// Vote on governance proposal
{
  "proposalId": "42",
  "vote": "yes",
  "memo": "Supporting this improvement"
}
```

```javascript
// IBC transfer to Osmosis
{
  "recipient": "osmo1abc123def456ghi789jkl012mno345pqr678st",
  "amount": "2000000",
  "denom": "uatom",
  "sourceChannel": "channel-141",
  "timeoutHeight": "0",
  "timeoutTimestamp": "1640995200000000000"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Address | Malformed Cosmos address format | Verify address starts with 'cosmos' and has valid bech32 encoding |
| Insufficient Funds | Account balance too low for transaction | Check account balance and reduce transaction amount |
| Invalid Validator | Validator address not found or inactive | Verify validator address and check validator status |
| Proposal Not Found | Governance proposal ID doesn't exist | Confirm proposal ID and check if proposal is active |
| IBC Channel Closed | Target IBC channel is not operational | Use alternative channel or wait for channel to reopen |
| Transaction Failed | Blockchain rejected transaction | Check transaction parameters and network status |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-cosmos-hub/issues)
- **Cosmos Hub Documentation**: [docs.cosmos.network](https://docs.cosmos.network)
- **Cosmos SDK API Reference**: [cosmos.network/docs](https://cosmos.network/docs)