"use client";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type {
  TransactionError,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";
import type { Address, ContractFunctionParameters } from "viem";
import {
  BASE_SEPOLIA_CHAIN_ID,
  createPolicyABI,
  createPolicyContractAddress,
} from "../constants";

interface WeatherCondition {
  conditionType: string;
  threshold: string;
  operator: string;
}

interface TransactionWrapperProps {
  address: Address;
  basename: string;
  policyName: string;
  latitude: number;
  longitude: number;
  weatherCondition: WeatherCondition;
  premium: bigint;
  maxCoverage: bigint;
  startDate: number;
  endDate: number;
  onSuccess: () => void;
}

export default function TransactionWrapper({
  address,
  basename,
  policyName,
  latitude,
  longitude,
  weatherCondition,
  premium,
  maxCoverage,
  startDate,
  endDate,
  onSuccess,
}: TransactionWrapperProps) {
  const contracts = [
    {
      address: createPolicyContractAddress,
      abi: createPolicyABI,
      functionName: "createpolicy",
      args: [
        basename,
        policyName,
        {
          latitude: Math.floor(latitude * 1e6),
          logitude: Math.floor(longitude * 1e6),
        },
        weatherCondition,
        premium,
        "ETH",
        maxCoverage,
        "ETH",
        startDate,
        endDate,
      ],
      value: premium,
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    onSuccess();
  };

  return (
    <div className="flex w-[450px]">
      <Transaction
        contracts={contracts}
        className="w-[450px]"
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton
          className="mt-0 mr-auto ml-auto max-w-full text-[white]"
          text="Create Policy"
        />
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
