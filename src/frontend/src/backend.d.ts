import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: string;
    credits: bigint;
    name: string;
    team: string;
    position: string;
}
export interface Participant {
    owner: Principal;
    rank?: bigint;
    teamId: string;
    points: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface FantasyTeam {
    id: string;
    owner: Principal;
    matchId: string;
    players: Array<Player>;
    captain: string;
    totalCredits: bigint;
    viceCaptain: string;
}
export interface WalletTransaction {
    id: string;
    transactionType: string;
    timestamp: Time;
    amount: bigint;
}
export interface Match {
    id: string;
    status: string;
    team1: string;
    team2: string;
    venue: string;
    dateTime: Time;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Contest {
    id: string;
    participants: Array<Participant>;
    totalSpots: bigint;
    matchId: string;
    entryFee: bigint;
    spotsFilled: bigint;
    prizePool: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phoneNumber?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addContest(contest: Contest): Promise<void>;
    addFunds(amount: bigint): Promise<string>;
    addMatch(match: Match): Promise<void>;
    addPlayer(player: Player): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createFantasyTeam(matchId: string, playerIds: Array<string>, captainId: string, viceCaptainId: string): Promise<string>;
    getAllMatches(): Promise<Array<Match>>;
    getAllPlayers(): Promise<Array<Player>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContest(contestId: string): Promise<Contest>;
    getContestsForMatch(matchId: string): Promise<Array<Contest>>;
    getFantasyTeam(teamId: string): Promise<FantasyTeam | null>;
    getMatch(matchId: string): Promise<Match>;
    getMyFantasyTeams(): Promise<Array<FantasyTeam>>;
    getPlayer(playerId: string): Promise<Player | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(): Promise<bigint>;
    getWalletTransactions(): Promise<Array<WalletTransaction>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    joinContest(contestId: string, teamId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
