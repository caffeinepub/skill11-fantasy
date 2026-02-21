import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Match, Player, Contest, FantasyTeam, WalletTransaction, ShoppingItem, StripeConfiguration } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useGetAllMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000
  });
}

export function useGetMatch(matchId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Match>({
    queryKey: ['match', matchId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMatch(matchId);
    },
    enabled: !!actor && !isFetching && !!matchId
  });
}

export function useGetAllPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching
  });
}

export function useCreateFantasyTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      playerIds,
      captainId,
      viceCaptainId
    }: {
      matchId: string;
      playerIds: string[];
      captainId: string;
      viceCaptainId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFantasyTeam(matchId, playerIds, captainId, viceCaptainId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myFantasyTeams'] });
    }
  });
}

export function useGetMyFantasyTeams() {
  const { actor, isFetching } = useActor();

  return useQuery<FantasyTeam[]>({
    queryKey: ['myFantasyTeams'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFantasyTeams();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetContestsForMatch(matchId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Contest[]>({
    queryKey: ['contests', matchId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContestsForMatch(matchId);
    },
    enabled: !!actor && !isFetching && !!matchId,
    refetchInterval: 10000
  });
}

export function useGetContest(contestId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Contest>({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContest(contestId);
    },
    enabled: !!actor && !isFetching && !!contestId,
    refetchInterval: 5000
  });
}

export function useJoinContest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contestId, teamId }: { contestId: string; teamId: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinContest(contestId, teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest'] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      queryClient.invalidateQueries({ queryKey: ['walletTransactions'] });
    }
  });
}

export function useGetWalletBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWalletBalance();
    },
    enabled: !!actor && !isFetching
  });
}

export function useGetWalletTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<WalletTransaction[]>({
    queryKey: ['walletTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWalletTransactions();
    },
    enabled: !!actor && !isFetching
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    }
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]) => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      return result;
    }
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching
  });
}
