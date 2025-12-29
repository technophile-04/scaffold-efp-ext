"use client";

import { useEffect, useState } from "react";
import "../efp/efp-overrides.css";
import {
  FollowersAndFollowing,
  FullWidthProfile,
  Notifications,
  TransactionModal,
  TransactionProvider,
} from "ethereum-identity-kit";
import "ethereum-identity-kit/css";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";

const EFPExample: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [inputAddress, setInputAddress] = useState("vitalik.eth");
  const [previewAddress, setPreviewAddress] = useState("vitalik.eth");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === "dark";

  const handlePreview = () => {
    if (inputAddress.trim()) {
      setPreviewAddress(inputAddress.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePreview();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Control Panel Section - Full width different background */}
      <div className="w-full bg-base-100 border-b border-base-content/10">
        <div className="flex flex-col items-center py-10 px-5">
          <div className="max-w-5xl w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Profile Preview</h1>
              <p className="text-base-content/70">
                Preview any EFP profile by entering an address or ENS name. See their social connections, followers,
                following, and notifications.
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="vitalik.eth or 0x..."
                className="input input-bordered flex-1"
                value={inputAddress}
                onChange={e => setInputAddress(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary" onClick={handlePreview}>
                Preview
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {["vitalik.eth", "caveman.eth", "cottons.eth", "austingriffith.eth", "brantly.eth", "barmstrong.eth"].map(
                name => (
                  <button
                    key={name}
                    className={`btn btn-sm ${previewAddress === name ? "btn-primary" : "btn-outline"}`}
                    onClick={() => {
                      setInputAddress(name);
                      setPreviewAddress(name);
                    }}
                  >
                    {name}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview Section */}
      <div className="flex flex-col items-center py-10 px-5 gap-10">
        {/* Profile Preview Header */}
        {previewAddress && (
          <div className="card bg-base-100 shadow-xl max-w-5xl w-full relative z-50 overflow-visible">
            <div className="card-body overflow-visible py-4">
              <div className="flex items-center justify-between">
                {/* Left: External link to EFP */}
                <a
                  href={`https://efp.app/${previewAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline gap-2"
                >
                  View on EFP
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>

                {/* Center: Title */}
                <h2 className="text-xl font-bold m-0 leading-none">{previewAddress}</h2>

                {/* Right: Theme toggle and Notifications */}
                <div className="flex items-center gap-4">
                  <SwitchTheme />
                  <Notifications addressOrName={previewAddress} darkMode={isDarkMode} position="left" align="bottom" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile and Followers/Following */}
        {previewAddress && (
          <TransactionProvider>
            <TransactionModal darkMode={isDarkMode} />
            <div className="flex flex-col items-center gap-10 w-full">
              <div className="max-w-5xl w-full relative z-10">
                <FullWidthProfile
                  addressOrName={previewAddress}
                  connectedAddress={connectedAddress as `0x${string}` | undefined}
                  darkMode={isDarkMode}
                  showFollowerState
                  showPoaps={false}
                />
              </div>

              <div className="max-w-5xl w-full">
                <FollowersAndFollowing
                  user={previewAddress}
                  connectedAddress={connectedAddress as `0x${string}` | undefined}
                  darkMode={isDarkMode}
                  defaultTab="following"
                  showProfileTooltip
                  onProfileClick={address => {
                    setInputAddress(address);
                    setPreviewAddress(address);
                  }}
                />
              </div>
            </div>
          </TransactionProvider>
        )}
      </div>
    </div>
  );
};

export default EFPExample;
