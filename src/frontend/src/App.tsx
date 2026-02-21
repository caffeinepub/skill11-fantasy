import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ProfileSetupModal from './components/ProfileSetupModal';
import MatchesPage from './pages/MatchesPage';
import CreateTeamPage from './pages/CreateTeamPage';
import ContestsPage from './pages/ContestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import PaymentSetup from './components/PaymentSetup';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      {showProfileSetup && <ProfileSetupModal />}
      <PaymentSetup />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MatchesPage
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches',
  component: MatchesPage
});

const createTeamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches/$matchId/create-team',
  component: CreateTeamPage
});

const contestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches/$matchId/contests',
  component: ContestsPage
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contests/$contestId/leaderboard',
  component: LeaderboardPage
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  matchesRoute,
  createTeamRoute,
  contestsRoute,
  leaderboardRoute,
  walletRoute,
  paymentSuccessRoute,
  paymentFailureRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
