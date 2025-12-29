# EFP Extension for Scaffold-ETH 2

Add **Ethereum Follow Protocol (EFP)** social graph functionality to your Scaffold-ETH 2 project. EFP is the onchain social graph protocol for Ethereum accounts - like Twitter follows, but fully decentralized and portable across any dApp.

## Installation

```bash
npx create-eth@latest -e ethereumfollowprotocol/scaffold-efp-ext
```

Or add to an existing SE-2 project:

```bash
# Add the dependency
yarn add ethereum-identity-kit

# Copy the extension files from this repo
```

## What's Included

### Pages

- **`/efp`** - Introduction to EFP with component examples, React hooks, API documentation, and self-hosting info
- **`/efp-example`** - Interactive profile preview page to explore EFP profiles

### Components

This extension uses [Ethereum Identity Kit (EIK)](https://ethidentitykit.com) components:

- `FullWidthProfile` - Comprehensive profile with avatar, bio, stats, and social links
- `ProfileCard` - Compact profile card for lists and grids
- `FollowButton` - Follow/unfollow button with transaction handling
- `FollowersAndFollowing` - Tabbed list of followers and following
- `Notifications` - Activity feed for social events
- `ProfileTooltip` - Hover tooltip with profile info
- And more...

## Configuration

### Enable L2 Networks (Recommended)

EFP transactions happen on L2s (Base, Optimism). To enable chain switching in the transaction modal, add these networks to your `scaffold.config.ts`:

```typescript
import * as chains from "viem/chains";

const scaffoldConfig = {
  targetNetworks: [chains.mainnet, chains.base, chains.optimism],
  // ... rest of config
};
```

### Dark Mode

Components automatically detect dark mode from the SE-2 theme. You can also pass `darkMode={true/false}` to individual components.

## Usage Examples

### Basic Profile Card

```tsx
import { ProfileCard, TransactionProvider, TransactionModal } from "ethereum-identity-kit";
import "ethereum-identity-kit/css";

export default function MyPage() {
  return (
    <TransactionProvider>
      <TransactionModal />
      <ProfileCard 
        addressOrName="vitalik.eth" 
        showFollowerState 
        showFollowButton 
      />
    </TransactionProvider>
  );
}
```

### Follow Button

```tsx
import { FollowButton, TransactionProvider, TransactionModal } from "ethereum-identity-kit";
import { useAccount } from "wagmi";

export default function MyPage() {
  const { address } = useAccount();
  
  return (
    <TransactionProvider>
      <TransactionModal />
      <FollowButton 
        lookupAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        connectedAddress={address}
      />
    </TransactionProvider>
  );
}
```

### Using Hooks

```tsx
import { useProfileStats, useFollowerState } from "ethereum-identity-kit";

export default function Stats({ address }) {
  const { followers, following, statsLoading } = useProfileStats({ 
    addressOrName: address 
  });
  
  if (statsLoading) return <span>Loading...</span>;
  
  return (
    <div>
      <span>{followers} followers</span>
      <span>{following} following</span>
    </div>
  );
}
```

## Resources

- [EFP App](https://efp.app) - The official EFP app
- [Ethereum Identity Kit Docs](https://ethidentitykit.com) - Component library documentation
- [EIK Playground](https://playground.ethidentitykit.com) - Interactive component playground
- [EFP Protocol Docs](https://docs.efp.app) - Protocol documentation
- [EFP GitHub](https://github.com/ethereumfollowprotocol) - Source code and infrastructure

## How EFP Works

1. **EFP List NFT** - Mint a list NFT on Base, Optimism, or Mainnet. You own your social graph.
2. **ENS Identity** - Your ENS name is your profile. Avatar, bio, and socials come from ENS records.
3. **Onchain Actions** - Follow, unfollow, block, and mute are stored onchain.
4. **Portable Graph** - Your follows work everywhere EFP is integrated.

## Self-Hosting

For full control, you can self-host the EFP infrastructure stack:
- [Railway 1-Click Deploy](https://railway.app/template/pDGEZm)
- [Infrastructure Docs](https://ethidentitykit.com/docs/services/infra)

---

Built with ❤️ by the [EFP team](https://github.com/ethereumfollowprotocol)

