import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@heroui/react";
import type {
    CoachContract,
    CoachContractTabKey,
} from "../../utils/Interfaces/Contracts/coachContracts";
import {
    acceptCoachContract,
    getAllCoachContracts,
    rejectCoachContract,
    terminateCoachContract,
} from "../../services/Contracts/coachContractService";
import { splitContractsByStatus } from "../../utils/coachContracts/coachContractHelpers";
import CoachContractsHeader from "../../components/CoachContracts/coachContractsHeader";
import CoachContractsTabs from "../../components/CoachContracts/coachContractsTabs";
import CoachContractCard from "../../components/CoachContracts/coachContractCard";

const CoachContractsPage = () => {
    const [contracts, setContracts] = useState<CoachContract[]>([]);
    const [selectedTab, setSelectedTab] =
        useState<CoachContractTabKey>("pending");
    const [isLoading, setIsLoading] = useState(true);
    const [actionContractId, setActionContractId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const loadContracts = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const data = await getAllCoachContracts();
            setContracts(data);
        } catch (error) {
            console.error("Failed to fetch coach contracts:", error);
            setErrorMessage("Unable to load coaching contracts right now.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadContracts();
    }, []);

    const groupedContracts = useMemo(
        () => splitContractsByStatus(contracts),
        [contracts]
    );

    const visibleContracts = useMemo(() => {
        return groupedContracts[selectedTab];
    }, [groupedContracts, selectedTab]);

    const handleAccept = async (contractId: number) => {
        try {
            setActionContractId(contractId);
            await acceptCoachContract(contractId, 0);
            await loadContracts();
            setSelectedTab("active");
        } catch (error) {
            console.error("Failed to accept contract:", error);
            setErrorMessage("Unable to accept that contract.");
        } finally {
            setActionContractId(null);
        }
    };

    const handleDecline = async (contractId: number) => {
        try {
            setActionContractId(contractId);
            await rejectCoachContract(contractId, 0);
            await loadContracts();
            setSelectedTab("history");
        } catch (error) {
            console.error("Failed to decline contract:", error);
            setErrorMessage("Unable to decline that contract.");
        } finally {
            setActionContractId(null);
        }
    };

    const handleTerminate = async (contractId: number) => {
        try {
            setActionContractId(contractId);
            await terminateCoachContract(contractId);
            await loadContracts();
            setSelectedTab("history");
        } catch (error) {
            console.error("Failed to terminate contract:", error);
            setErrorMessage("Unable to terminate that contract.");
        } finally {
            setActionContractId(null);
        }
    };

    return (
        <section className="px-6 py-8 md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <CoachContractsHeader pendingCount={groupedContracts.pending.length} />

                <CoachContractsTabs
                    selectedKey={selectedTab}
                    pendingCount={groupedContracts.pending.length}
                    activeCount={groupedContracts.active.length}
                    historyCount={groupedContracts.history.length}
                    onSelectionChange={setSelectedTab}
                />

                {errorMessage && (
                    <div className="rounded-2xl border border-[#F4C3C3] bg-[#FFF5F5] px-4 py-3">
                        <p style={{ fontSize: "13.125px", color: "#E03B3B" }}>
                            {errorMessage}
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-[#E7E7EE]">
                        <Spinner color="accent" />
                    </div>
                ) : visibleContracts.length === 0 ? (
                    <div className="rounded-3xl border border-[#E7E7EE] bg-white px-6 py-10 text-center">
                        <p style={{ fontSize: "18.75px", color: "#0F0F14" }}>
                            No contracts found.
                        </p>
                        <p
                            className="mt-2"
                            style={{ fontSize: "13.125px", color: "#72728A" }}
                        >
                            There are no contracts in the {selectedTab} section yet.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {visibleContracts.map((contract) => (
                            <CoachContractCard
                                key={contract.contract_id}
                                contract={contract}
                                view={selectedTab}
                                isLoading={actionContractId === contract.contract_id}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                                onTerminate={handleTerminate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CoachContractsPage;