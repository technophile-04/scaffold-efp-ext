"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./efp-overrides.css";
import {
  Avatar,
  FollowButton,
  FollowerTag,
  FollowersAndFollowing,
  FollowersYouKnow,
  FullWidthProfile,
  Notifications,
  ProfileCard,
  ProfileSocials,
  ProfileStats,
  ProfileTooltip,
  TransactionModal,
  TransactionProvider,
  useProfileDetails,
} from "ethereum-identity-kit";
import "ethereum-identity-kit/css";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  CloudIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  LinkIcon,
  ServerStackIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

type HookInfo = {
  name: string;
  description: string;
  details: string;
  params: string[];
  returns: string[];
};

const hooksData: HookInfo[] = [
  {
    name: "useProfileDetails",
    description: "Fetch ENS records, avatar, bio, and social links for any address or ENS name.",
    details: "Returns comprehensive ENS data including name, records, avatar, and primary EFP list number.",
    params: ["addressOrName: string", "list?: number", "prefetchedData?: object"],
    returns: ["ens", "address", "primaryList", "detailsLoading", "refreshProfileDetails"],
  },
  {
    name: "useProfileStats",
    description: "Get follower and following counts for any address.",
    details: "Fetches the EFP statistics for followers and following counts.",
    params: ["addressOrName: string", "list?: number"],
    returns: ["followers", "following", "statsLoading", "refreshProfileStats"],
  },
  {
    name: "useFollowButton",
    description: "Handle follow/unfollow logic with pending states and transaction management.",
    details: "Complete follow button state management including pending transactions and optimistic updates.",
    params: ["lookupAddress: string", "connectedAddress?: string", "selectedList?: number"],
    returns: ["buttonText", "buttonState", "handleAction", "isLoading", "pendingState"],
  },
  {
    name: "useFollowerState",
    description: "Check if an address follows the connected user.",
    details: "Returns the follow state between two addresses from the perspective of who follows whom.",
    params: ["addressOrName: string", "connectedAddress: string"],
    returns: ["followState", "followerTag", "isFollowerStateLoading"],
  },
  {
    name: "useFollowingState",
    description: "Check if the connected user follows an address, including pending states.",
    details: "Includes pending transaction states for optimistic UI updates.",
    params: ["lookupAddressOrName: string", "connectedAddress: string"],
    returns: ["state", "isLoading"],
  },
  {
    name: "useFollowersAndFollowing",
    description: "Paginated lists of followers and following with search and sorting.",
    details: "Infinite scroll pagination with search, sort, and tag filtering capabilities.",
    params: ["addressOrName: string", "list?: number", "limit?: number"],
    returns: ["followers", "following", "isLoading", "fetchMore", "hasMore"],
  },
  {
    name: "useFollowersYouKnow",
    description: "Find mutual followers between two addresses.",
    details: "Shows common connections between the connected user and a profile they're viewing.",
    params: ["lookupAddress: string", "connectedAddress: string"],
    returns: ["followersYouKnow", "isLoading", "count"],
  },
  {
    name: "useRecommended",
    description: "Get personalized follow recommendations based on social graph.",
    details: "AI-powered recommendations based on who you follow and their connections.",
    params: ["addressOrName: string", "limit?: number"],
    returns: ["recommended", "isLoading", "fetchMore"],
  },
  {
    name: "useUserInfo",
    description: "Combined hook for profile details, stats, and lists in one call.",
    details: "Convenience hook that combines multiple data fetches into a single hook.",
    params: ["addressOrName: string"],
    returns: ["profile", "stats", "lists", "isLoading"],
  },
  {
    name: "useTransactions",
    description: "Access pending transactions and modal state from TransactionProvider.",
    details: "Must be used within TransactionProvider. Manages the transaction queue.",
    params: ["none (uses context)"],
    returns: ["txModalOpen", "pendingTxs", "addTransactions", "lists"],
  },
  {
    name: "useNotifications",
    description: "Fetch new followers, unfollows, and social activity notifications.",
    details: "Real-time notifications for social graph changes.",
    params: ["addressOrName: string", "interval?: string"],
    returns: ["notifications", "isLoading", "unreadCount"],
  },
  {
    name: "useSiwe",
    description: "Sign-In with Ethereum authentication flow and session management.",
    details: "Complete SIWE implementation with session persistence and verification.",
    params: ["verifySignature: function", "onSignInSuccess?: function"],
    returns: ["signIn", "signOut", "isSignedIn", "isLoading"],
  },
  {
    name: "useETHPrice",
    description: "Get current ETH price for displaying transaction costs in USD.",
    details: "Fetches live ETH price from price feeds.",
    params: ["none"],
    returns: ["ethPrice", "isLoading"],
  },
];

type SectionTab = "components" | "hooks" | "api" | "indexer";

const EFP: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedHook, setSelectedHook] = useState<HookInfo | null>(null);
  const [sectionTab, setSectionTab] = useState<SectionTab>("components");

  // Fetch profile details for ProfileSocials example
  const { ens } = useProfileDetails({ addressOrName: "0xa8b4756959e1192042fc2a8a103dfe2bddf128e8" });

  // Wait for client-side hydration before reading theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  return (
    <div className="flex flex-col items-center py-10 px-5 gap-10">
      {/* Header Section */}
      <div className="text-center max-w-3xl">
        <svg className="h-16 w-16 mx-auto mb-4 text-base-content" viewBox="100 80 350 400" fill="currentColor">
          <path d="M167.68 258.56L255.36 112.64L342.4 258.56L255.36 311.68L167.68 258.56Z" />
          <path d="M255.36 327.68L167.68 274.56L255.36 398.08L342.4 274.56L255.36 327.68Z" />
          <path d="M367.36 341.76H342.4V378.88H307.84V401.92H342.4V440.32H367.36V401.92H401.28V378.88H367.36V341.76Z" />
        </svg>
        <h1 className="text-4xl font-bold mb-4">Ethereum Follow Protocol</h1>
        <p className="text-lg text-base-content/70">The onchain social graph protocol for Ethereum accounts.</p>
        <p className="text-lg text-base-content/70">
          EFP enables native following functionality across EVM chains. fully decentralized and portable across any
          dApp.
        </p>
        <div className="mt-6">
          <a href="/efp-example" className="btn btn-primary">
            Try Profile Preview
          </a>
          <p className="text-sm text-base-content/50 mt-2">Preview EFP profiles and see the components in action</p>
        </div>
      </div>

      <div className="max-w-5xl w-full">
        <div className="divider my-2"></div>
      </div>

      {/* How EFP Works */}
      <div className="max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">How EFP Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <svg className="h-10 w-10 mx-auto mb-3 text-base-content" viewBox="100 80 350 400" fill="currentColor">
              <path d="M167.68 258.56L255.36 112.64L342.4 258.56L255.36 311.68L167.68 258.56Z" />
              <path d="M255.36 327.68L167.68 274.56L255.36 398.08L342.4 274.56L255.36 327.68Z" />
              <path d="M367.36 341.76H342.4V378.88H307.84V401.92H342.4V440.32H367.36V401.92H401.28V378.88H367.36V341.76Z" />
            </svg>
            <h3 className="font-bold text-lg mb-2">EFP List</h3>
            <p className="text-base-content/70 text-sm">
              lists are NFTs stored on Base, Optimism, or Mainnet. You own your social graph. No platform can take it
              away.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <svg className="h-10 w-10 mx-auto mb-3 text-base-content" viewBox="0 0 202 231" fill="currentColor">
              <path d="M98.3592 2.80337L34.8353 107.327C34.3371 108.147 33.1797 108.238 32.5617 107.505C26.9693 100.864 6.13478 72.615 31.9154 46.8673C55.4403 23.3726 85.4045 6.62129 96.5096 0.831705C97.7695 0.174847 99.0966 1.59007 98.3592 2.80337Z" />
              <path d="M94.8459 230.385C96.1137 231.273 97.6758 229.759 96.8261 228.467C82.6374 206.886 35.4713 135.081 28.9559 124.302C22.5295 113.67 9.88976 96.001 8.83534 80.8842C8.7301 79.3751 6.64332 79.0687 6.11838 80.4879C5.27178 82.7767 4.37045 85.5085 3.53042 88.6292C-7.07427 128.023 8.32698 169.826 41.7753 193.238L94.8459 230.386V230.385Z" />
              <path d="M103.571 228.526L167.095 124.003C167.593 123.183 168.751 123.092 169.369 123.825C174.961 130.465 195.796 158.715 170.015 184.463C146.49 207.957 116.526 224.709 105.421 230.498C104.161 231.155 102.834 229.74 103.571 228.526Z" />
              <path d="M107.154 0.930762C105.886 0.0433954 104.324 1.5567 105.174 2.84902C119.363 24.4301 166.529 96.2354 173.044 107.014C179.471 117.646 192.11 135.315 193.165 150.432C193.27 151.941 195.357 152.247 195.882 150.828C196.728 148.539 197.63 145.808 198.47 142.687C209.074 103.293 193.673 61.4905 160.225 38.078L107.154 0.930762Z" />
            </svg>
            <h3 className="font-bold text-lg mb-2">ENS Identity</h3>
            <p className="text-base-content/70 text-sm">
              Your ENS profile is your EFP profile. Name, avatar, bio, socials, all come from your ENS records.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <LinkIcon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">Onchain Actions</h3>
            <p className="text-base-content/70 text-sm">
              Follow, unfollow, block, and mute are all list operations stored onchain. Fully verifiable and
              censorship-resistant.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <GlobeAltIcon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">Portable Graph</h3>
            <p className="text-base-content/70 text-sm">
              One social graph, many apps. Your follows work everywhere where{" "}
              <a href="https://efp.app/integrations" target="_blank" rel="noopener noreferrer" className="link">
                EFP is integrated
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full">
        <div className="divider my-2"></div>
      </div>

      {/* What's in this Extension */}
      <div className="max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">What&apos;s in this Extension</h2>
        <p className="text-base-content/70 mb-6 text-center">
          Everything you need to add EFP to your Scaffold-ETH 2 project using{" "}
          <a href="https://ethidentitykit.com" target="_blank" rel="noopener noreferrer" className="link">
            Ethereum Identity Kit
          </a>
        </p>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <Squares2X2Icon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">Components</h3>
            <p className="text-base-content/70 text-sm">
              Profiles, follow buttons, notifications, followers lists, tooltips, and more.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <CodeBracketIcon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">React Hooks</h3>
            <p className="text-base-content/70 text-sm">
              Build custom UI with hooks for profile data, follow state, and transactions.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <CloudIcon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">Public API</h3>
            <p className="text-base-content/70 text-sm">
              Free REST API for followers, following, stats, notifications, and more.
            </p>
          </div>
          <div className="card bg-base-100 shadow-xl p-6 text-center">
            <ServerStackIcon className="h-10 w-10 mx-auto mb-3 text-base-content" />
            <h3 className="font-bold text-lg mb-2">Self-Host</h3>
            <p className="text-base-content/70 text-sm">
              Run your own indexer infrastructure with 1-click Railway deploy.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full">
        <div className="divider my-2"></div>
      </div>

      {/* Section Navigation */}
      <div className="max-w-5xl w-full bg-base-300 rounded-lg overflow-hidden">
        <div role="tablist" className="flex w-full">
          <button
            role="tab"
            className={`flex-1 py-4 text-xl font-bold gap-2 flex items-center justify-center transition-colors cursor-pointer ${sectionTab === "components" ? "bg-base-100" : "hover:bg-base-200"}`}
            onClick={() => setSectionTab("components")}
          >
            <Squares2X2Icon className="h-5 w-5" />
            Components
          </button>
          <button
            role="tab"
            className={`flex-1 py-4 text-xl font-bold gap-2 flex items-center justify-center transition-colors cursor-pointer ${sectionTab === "hooks" ? "bg-base-100" : "hover:bg-base-200"}`}
            onClick={() => setSectionTab("hooks")}
          >
            <CodeBracketIcon className="h-5 w-5" />
            Hooks
          </button>
          <button
            role="tab"
            className={`flex-1 py-4 text-xl font-bold gap-2 flex items-center justify-center transition-colors cursor-pointer ${sectionTab === "api" ? "bg-base-100" : "hover:bg-base-200"}`}
            onClick={() => setSectionTab("api")}
          >
            <CloudIcon className="h-5 w-5" />
            API
          </button>
          <button
            role="tab"
            className={`flex-1 py-4 text-xl font-bold gap-2 flex items-center justify-center transition-colors cursor-pointer ${sectionTab === "indexer" ? "bg-base-100" : "hover:bg-base-200"}`}
            onClick={() => setSectionTab("indexer")}
          >
            <ServerStackIcon className="h-5 w-5" />
            Indexer
          </button>
        </div>
      </div>

      {/* Components Tab Content */}
      {sectionTab === "components" && (
        <>
          {/* Component Examples Section */}
          <div className="card bg-base-100 shadow-xl max-w-5xl w-full p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Component Examples</h2>
                <p className="text-base-content/70 text-sm">
                  Premade React components - plug and play. Connect your wallet to interact.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm">Light</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={isDarkMode}
                  onChange={() => setTheme(isDarkMode ? "light" : "dark")}
                />
                <span className="text-sm">Dark</span>
              </label>
            </div>
          </div>

          <div className="max-w-5xl w-full px-4">
            <div className="divider my-0"></div>
          </div>

          {/* Profile Components */}
          <div className="max-w-5xl w-full">
            <TransactionProvider>
              <TransactionModal darkMode={isDarkMode} />

              {/* FullWidthProfile Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Full Width Profile</h2>
                <p className="text-base-content/70 mb-10">
                  A comprehensive profile component that displays avatar, bio, stats, and social links in a wide layout.
                </p>
                <div className="w-full flex flex-col gap-6">
                  <FullWidthProfile
                    addressOrName="vitalik.eth"
                    connectedAddress={connectedAddress as `0x${string}` | undefined}
                    darkMode={isDarkMode}
                    showFollowerState
                    showFollowButton
                    showPoaps={false}
                    showEmptySocials
                  />
                  <FullWidthProfile
                    addressOrName="caveman.eth"
                    connectedAddress={connectedAddress as `0x${string}` | undefined}
                    darkMode={isDarkMode}
                    showFollowerState
                    showFollowButton
                    showPoaps={false}
                    showEmptySocials
                  />
                </div>
                <a
                  href="https://playground.ethidentitykit.com/?path=/docs/organisms-full-width-profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm mt-10"
                >
                  View in EIK Playground
                </a>
              </div>

              <div className="divider my-10"></div>

              {/* ProfileCard Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Profile Card</h2>
                <p className="text-base-content/70 mb-10">
                  A compact profile card perfect for displaying user information in lists, grids, or sidebars.
                </p>
                <div className="flex flex-wrap justify-evenly gap-6">
                  <ProfileCard
                    addressOrName="caveman.eth"
                    connectedAddress={connectedAddress as `0x${string}` | undefined}
                    darkMode={isDarkMode}
                    showFollowerState
                    showFollowButton
                    showEmptySocials
                  />
                  <ProfileCard
                    addressOrName="vitalik.eth"
                    connectedAddress={connectedAddress as `0x${string}` | undefined}
                    darkMode={isDarkMode}
                    showFollowerState
                    showFollowButton
                    showEmptySocials
                  />
                </div>
                <a
                  href="https://playground.ethidentitykit.com/?path=/docs/organisms-profile-card"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm mt-10"
                >
                  View in EIK Playground
                </a>
              </div>

              <div className="divider my-10"></div>

              {/* FollowersAndFollowing Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Followers & Following</h2>
                <p className="text-base-content/70 mb-10">
                  A tabbed list showing followers and following for any address. Click on profiles to explore their
                  connections.
                </p>
                <div className="max-h-[900px] overflow-auto rounded-lg">
                  <FollowersAndFollowing
                    user="vitalik.eth"
                    connectedAddress={connectedAddress as `0x${string}` | undefined}
                    darkMode={isDarkMode}
                    defaultTab="following"
                    showTagsByDefault={false}
                    showProfileTooltip
                  />
                </div>
                <a
                  href="https://playground.ethidentitykit.com/?path=/docs/organisms-followers-and-following-table"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm mt-10"
                >
                  View in EIK Playground
                </a>
              </div>

              <div className="divider my-10"></div>

              {/* SmallComponents Section */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Small Components</h2>
                <p className="text-base-content/70 mb-10">
                  Building blocks that make up profiles. Use these individually for custom layouts.
                </p>
                <div className="flex flex-wrap justify-center gap-10 w-full">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">Avatar</span>
                    <Avatar name="vitalik.eth" style={{ width: 60, height: 60, minWidth: 60, minHeight: 60 }} />
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/molecules-avatar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Profile Stats */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">ProfileStats</span>
                    <div className={isDarkMode ? "dark" : ""}>
                      <ProfileStats addressOrName="vitalik.eth" />
                    </div>
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/molecules-profile-stats"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Profile Socials */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg">
                    <span className="text-sm font-bold text-base-content/70">ProfileSocials</span>
                    {ens?.records && <ProfileSocials records={ens.records} />}
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/molecules-profile-socials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Follower Tag */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">FollowerTag</span>
                    <FollowerTag
                      lookupAddressOrName="0x983110309620d911731ac0932219af06091b6744"
                      connectedAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                    />
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/molecules-follower-tag"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Followers You Know */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg">
                    <span className="text-sm font-bold text-base-content/70">FollowersYouKnow</span>
                    <FollowersYouKnow
                      lookupAddressOrName="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
                      connectedAddress="0xa8b4756959e1192042fc2a8a103dfe2bddf128e8"
                      darkMode={isDarkMode}
                    />
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/molecules-followers-you-know"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Follow Button */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">FollowButton</span>
                    <FollowButton
                      lookupAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      connectedAddress={connectedAddress as `0x${string}` | undefined}
                    />
                    <a
                      href="https://playground.ethidentitykit.com/?path=/story/organisms-follow-button-transaction-modal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Notifications */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">Notifications</span>
                    <Notifications addressOrName="vitalik.eth" darkMode={isDarkMode} />
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/organisms-notifications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>

                  {/* Profile Tooltip */}
                  <div className="flex flex-col items-center gap-3 p-4 border-2 border-base-content/10 rounded-lg min-w-32">
                    <span className="text-sm font-bold text-base-content/70">ProfileTooltip</span>
                    <div className={isDarkMode ? "dark" : ""}>
                      <ProfileTooltip
                        addressOrName="vitalik.eth"
                        darkMode={isDarkMode}
                        showFollowerState
                        showFollowButton
                        showSocials
                        inline
                      >
                        <span className="px-4 py-2 border border-base-content/20 rounded-lg cursor-pointer hover:bg-base-200">
                          Hover
                        </span>
                      </ProfileTooltip>
                    </div>
                    <a
                      href="https://playground.ethidentitykit.com/?path=/docs/organisms-profile-tooltip"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-xs mt-auto"
                    >
                      Playground
                    </a>
                  </div>
                </div>
              </div>
            </TransactionProvider>
          </div>
        </>
      )}

      {/* Hooks Tab Content */}
      {sectionTab === "hooks" && (
        <>
          {/* React Hooks Section */}
          <div className="card bg-base-100 shadow-xl max-w-5xl w-full p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">React Hooks</h2>
            <p className="text-base-content/70 mb-6 text-center">
              Build custom UI with these hooks. Click any hook for details.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hooksData.map(hook => (
                <button
                  key={hook.name}
                  onClick={() => setSelectedHook(hook)}
                  className="border border-base-content/10 rounded-lg p-4 text-left hover:bg-base-200 hover:border-primary transition-colors cursor-pointer"
                >
                  <h3 className="font-mono text-base font-bold mb-2">{hook.name}</h3>
                  <p className="text-base-content/70">{hook.description}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <a
                href="https://ethidentitykit.com/docs/hooks/useProfileDetails"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                View All Hooks in Docs →
              </a>
            </div>
          </div>

          {/* Hook Details Modal */}
          {selectedHook && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedHook(null)}
            >
              <div className="card bg-base-100 shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-mono text-xl font-bold">{selectedHook.name}</h3>
                  <button onClick={() => setSelectedHook(null)} className="btn btn-ghost btn-sm btn-circle">
                    ✕
                  </button>
                </div>
                <p className="text-base-content/70 mb-4">{selectedHook.details}</p>

                <div className="mb-4">
                  <h4 className="font-bold text-sm mb-2">Parameters</h4>
                  <ul className="text-sm text-base-content/70 space-y-1">
                    {selectedHook.params.map((param, i) => (
                      <li key={i} className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-sm mb-2">Returns</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedHook.returns.map((ret, i) => (
                      <span key={i} className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                        {ret}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://ethidentitykit.com/docs/hooks/${selectedHook.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm w-full"
                >
                  View Full Documentation
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* API Tab Content */}
      {sectionTab === "api" && (
        <div className="card bg-base-100 shadow-xl max-w-5xl w-full p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">EFP Public API</h2>
          <p className="text-base-content/70 mb-6 text-center">
            Free access to the EFP indexer via REST API. No authentication required.
          </p>

          {/* Base URL */}
          <div className="mb-8 p-4 bg-base-200 rounded-lg">
            <p className="text-sm font-mono text-center">Base URL: https://api.ethfollow.xyz/api/v1</p>
          </div>

          {/* User Endpoints */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Common Endpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/account</h4>
                <p className="text-base-content/70">Account data including ENS records.</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/details</h4>
                <p className="text-base-content/70">Same as /account but with EFP list number and protocol ranking.</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/stats</h4>
                <p className="text-base-content/70">Follower and following counts</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/followers</h4>
                <p className="text-base-content/70">Paginated list of followers with search and sorting</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/following</h4>
                <p className="text-base-content/70">Paginated list of accounts being followed</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/latestFollowers</h4>
                <p className="text-base-content/70">Most recent followers</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/notifications</h4>
                <p className="text-base-content/70">Activity notifications for follows, unfollows, blocks</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/searchFollowers</h4>
                <p className="text-base-content/70">Search within a user&apos;s followers</p>
              </div>
              <div className="border border-base-content/10 rounded-lg p-4">
                <h4 className="font-mono text-base font-bold mb-2">/users/:id/searchFollowing</h4>
                <p className="text-base-content/70">Search within a user&apos;s following</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <a
              href="https://ethidentitykit.com/docs/api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              View All Endpoints in Docs →
            </a>
          </div>
        </div>
      )}

      {/* Indexer Tab Content */}
      {sectionTab === "indexer" && (
        <div className="card bg-base-100 shadow-xl max-w-5xl w-full p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">EFP Indexer</h2>
          <p className="text-base-content/70 mb-6 text-center">
            For developers who don&apos;t want to rely on external APIs. Self-host the complete EFP infrastructure
            stack; indexers, database, caching, and API, giving you full control over your data pipeline from your app
            to the chain.
          </p>
          <div className="flex justify-center my-8">
            <Image
              src="/efp-infrastructure.png"
              alt="EFP Infrastructure Architecture"
              width={800}
              height={500}
              className="max-w-full rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border border-base-content/10 rounded-lg p-6 flex flex-col">
              <h3 className="font-bold text-lg mb-3">Infrastructure Components</h3>
              <p className="text-base-content/70 mb-6">The full EFP indexer stack includes:</p>
              <ul className="list-disc list-inside space-y-3 text-base-content/70 text-sm">
                <li>
                  <span className="font-semibold">Database (Postgres)</span> - Primary data storage
                </li>
                <li>
                  <span className="font-semibold">PGBouncer</span> - Connection pooler for Postgres
                </li>
                <li>
                  <span className="font-semibold">EFP Indexers</span> - For Base, Optimism and Ethereum Mainnet
                </li>
                <li>
                  <span className="font-semibold">EFP Services</span> - Updates ENS data, leaderboard, cache, mutuals
                  counts
                </li>
                <li>
                  <span className="font-semibold">EFP API</span> - Can be deployed as a Cloudflare worker
                </li>
                <li>
                  <span className="font-semibold">ENS Worker</span> - Can be deployed as a Cloudflare worker
                </li>
                <li>
                  <span className="font-semibold">Redis Cache</span> - For the API and ENS Worker
                </li>
              </ul>
              <div className="mt-auto pt-4 flex gap-2">
                <a
                  href="https://ethidentitykit.com/docs/services/infra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex-1 gap-2"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Docs
                </a>
                <a
                  href="https://github.com/ethereumfollowprotocol/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 gap-2"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
            <div className="border border-base-content/10 rounded-lg p-6 flex flex-col">
              <h3 className="font-bold text-lg mb-3">1-Click Railway Deploy</h3>
              <p className="text-base-content/70 mb-6">
                Deploy the entire EFP infrastructure stack with one click using the Railway template. Just add your RPC
                endpoints and you&apos;re ready to go.
              </p>
              <p className="text-base-content/70 mb-4 text-sm">
                <span className="font-semibold">Required RPC endpoints:</span>
              </p>
              <ul className="list-disc list-inside space-y-2 text-base-content/70 text-sm mb-6">
                <li>Primary & Secondary RPC for Ethereum Mainnet</li>
                <li>Primary & Secondary RPC for Base</li>
                <li>Primary & Secondary RPC for Optimism</li>
              </ul>
              <div className="mt-auto pt-4 flex gap-2">
                <a
                  href="https://ethidentitykit.com/docs/services/efp-silo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline flex-1 gap-2"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                  Docs
                </a>
                <a
                  href="https://railway.app/template/pDGEZm?referralCode=AavWEU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex-1 gap-2"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 1024 1024">
                    <path d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z" />
                    <path d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z" />
                  </svg>
                  Railway
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Links */}
      <div className="max-w-5xl w-full px-4">
        <div className="divider my-10"></div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="https://efp.app" target="_blank" rel="noopener noreferrer" className="btn btn-outline gap-2">
          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
          Visit EFP App
        </a>
        <a
          href="https://github.com/ethereumfollowprotocol/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline gap-2"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </a>
        <a
          href="https://docs.efp.app/intro/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline gap-2"
        >
          <DocumentTextIcon className="h-5 w-5" />
          Protocol Docs
        </a>
        <a
          href="https://ethidentitykit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline gap-2"
        >
          <BookOpenIcon className="h-5 w-5" />
          Library Docs
        </a>
      </div>
    </div>
  );
};

export default EFP;
