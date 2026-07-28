"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  LogOut,
  Send,
  Wallet,
} from "lucide-react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const chainNames: Record<string, string> = {
  "0x1": "Ethereum",
  "0xaa36a7": "Sepolia",
  "0x89": "Polygon",
  "0xa": "Optimism",
  "0xa4b1": "Arbitrum",
  "0x2105": "Base",
};

const SAFE_CHAIN_ID = "0xaa36a7";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function ethToWeiHex(amount: string) {
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(amount)) {
    throw new Error("Enter a valid ETH amount.");
  }

  const [whole, fraction = ""] = amount.split(".");
  const wei =
    BigInt(whole) * BigInt("1000000000000000000") +
    BigInt(fraction.padEnd(18, "0") || "0");

  if (wei <= BigInt(0)) {
    throw new Error("Amount must be greater than zero.");
  }

  return `0x${wei.toString(16)}`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String(error.message).replace(/^MetaMask Tx Signature: /, "");
  }

  return "The wallet request could not be completed.";
}

export default function TransactionApp() {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    const updateAccounts = (...args: unknown[]) => {
      if (window.sessionStorage.getItem("wallet-disconnected") === "true") {
        return;
      }
      const accounts = args[0] as string[];
      setAccount(accounts?.[0] ?? "");
    };
    const updateChain = (...args: unknown[]) => {
      setChainId(String(args[0] ?? ""));
    };

    if (window.sessionStorage.getItem("wallet-disconnected") !== "true") {
      Promise.all([
        provider.request({ method: "eth_accounts" }),
        provider.request({ method: "eth_chainId" }),
      ])
        .then(([accounts, activeChain]) => {
          setAccount((accounts as string[])?.[0] ?? "");
          setChainId(String(activeChain));
        })
        .catch(() => undefined);
    }

    provider.on?.("accountsChanged", updateAccounts);
    provider.on?.("chainChanged", updateChain);

    return () => {
      provider.removeListener?.("accountsChanged", updateAccounts);
      provider.removeListener?.("chainChanged", updateChain);
    };
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Install MetaMask to connect a wallet.");
      return;
    }

    setIsPending(true);
    setStatus("");

    try {
      window.sessionStorage.removeItem("wallet-disconnected");
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const activeChain = await window.ethereum.request({
        method: "eth_chainId",
      });

      setAccount(accounts[0] ?? "");
      setChainId(String(activeChain));
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  function disconnectWallet() {
    window.sessionStorage.setItem("wallet-disconnected", "true");
    setAccount("");
    setTransactionHash("");
    setStatus("Wallet disconnected from this session.");
  }

  async function sendTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!window.ethereum || !account) {
      await connectWallet();
      return;
    }

    if (chainId !== SAFE_CHAIN_ID) {
      setStatus("Switch MetaMask to the Sepolia test network before sending.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setStatus("Enter a valid Ethereum recipient address.");
      return;
    }

    setIsPending(true);
    setStatus("Confirm the transaction in MetaMask.");
    setTransactionHash("");

    try {
      const hash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: recipient,
            value: ethToWeiHex(amount),
          },
        ],
      });

      setTransactionHash(String(hash));
      setStatus("Transaction submitted to the network.");
      setRecipient("");
      setAmount("");
    } catch (error) {
      setStatus(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  const network =
    chainNames[chainId] ?? (chainId ? `Chain ${chainId}` : "Network");

  return (
    <div className="transaction-app">
      <div className="transaction-app-bar">
        <div className="flex min-w-0 items-center gap-2">
          <span className="transaction-app-icon">
            <Wallet aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-medium text-text">Send test ETH</p>
            <p className="truncate font-mono text-[7px] text-faint">
              {account ? shortenAddress(account) : "Wallet not connected"}
            </p>
          </div>
        </div>
        <div className="transaction-app-actions">
          <span className="transaction-network">{network}</span>
          {account && (
            <button
              type="button"
              className="transaction-disconnect"
              onClick={disconnectWallet}
              aria-label="Disconnect wallet"
              title="Disconnect wallet"
            >
              <LogOut aria-hidden="true" className="h-3 w-3" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      <form className="transaction-app-form" onSubmit={sendTransaction}>
        <label className="transaction-field">
          <span>Recipient address</span>
          <input
            type="text"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value.trim())}
            placeholder="0x..."
            disabled={isPending}
            aria-label="Recipient address"
          />
        </label>

        <label className="transaction-field">
          <span>Amount</span>
          <div className="transaction-amount">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              disabled={isPending}
              aria-label="Amount in ETH"
            />
            <b>ETH</b>
          </div>
        </label>

        <div className="transaction-status-slot">
          {status && (
            <p className="transaction-status" role="status">
            {transactionHash && (
              <CheckCircle2
                aria-hidden="true"
                className="h-3 w-3 shrink-0 text-green"
              />
            )}
            <span className="truncate">{status}</span>
            {transactionHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noreferrer"
                aria-label="View transaction on Etherscan"
              >
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>
            )}
            </p>
          )}
        </div>

        <button type="submit" className="transaction-submit" disabled={isPending}>
          {isPending ? (
            <LoaderCircle
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin"
            />
          ) : (
            <Send aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {account ? "Send on Sepolia" : "Connect MetaMask"}
        </button>
      </form>
    </div>
  );
}
