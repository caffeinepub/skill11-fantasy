import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phoneNumber : ?Text;
  };

  // Fantasy Cricket Types
  public type Player = {
    id : Text;
    name : Text;
    team : Text;
    position : Text; // wicketkeeper, batsman, allrounder, bowler
    credits : Nat;
  };

  public type Match = {
    id : Text;
    team1 : Text;
    team2 : Text;
    venue : Text;
    dateTime : Time.Time;
    status : Text; // upcoming, live, completed
  };

  public type FantasyTeam = {
    id : Text;
    owner : Principal;
    matchId : Text;
    players : [Player];
    captain : Text;
    viceCaptain : Text;
    totalCredits : Nat;
  };

  public type Contest = {
    id : Text;
    matchId : Text;
    entryFee : Nat;
    prizePool : Nat;
    totalSpots : Nat;
    spotsFilled : Nat;
    participants : [Participant];
  };

  public type Participant = {
    teamId : Text;
    owner : Principal;
    points : Nat;
    rank : ?Nat;
  };

  public type WalletTransaction = {
    id : Text;
    amount : Nat;
    transactionType : Text; // deposit, entry_fee, winnings
    timestamp : Time.Time;
  };

  public type UserBalance = {
    owner : Principal;
    balance : Nat;
    transactions : [WalletTransaction];
  };

  // Storage Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let players = Map.empty<Text, Player>();
  let matches = Map.empty<Text, Match>();
  let fantasyTeams = Map.empty<Text, FantasyTeam>();
  let contests = Map.empty<Text, Contest>();
  let userBalances = Map.empty<Principal, UserBalance>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Function to create a fantasy team
  public shared ({ caller }) func createFantasyTeam(matchId : Text, playerIds : [Text], captainId : Text, viceCaptainId : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can create teams");
    };

    let match = switch (matches.get(matchId)) {
      case (null) { Runtime.trap("Match does not exist") };
      case (?value) { value };
    };

    if (match.status != "upcoming") {
      Runtime.trap("Cannot create team for non-upcoming match");
    };

    if (playerIds.size() != 11) {
      Runtime.trap("Fantasy team must have 11 players");
    };

    let selectedPlayers = playerIds.map(
      func(pId) {
        switch (players.get(pId)) {
          case (null) { Runtime.trap("Invalid player id: " # pId) };
          case (?p) { p };
        };
      }
    );

    var totalCredits = 0;
    var wicketkeepers = 0;
    var batsmen = 0;
    var allrounders = 0;
    var bowlers = 0;

    for (p in selectedPlayers.values()) {
      totalCredits += p.credits;
      switch (p.position) {
        case ("wicketkeeper") { wicketkeepers += 1 };
        case ("batsman") { batsmen += 1 };
        case ("allrounder") { allrounders += 1 };
        case ("bowler") { bowlers += 1 };
        case (_) { Runtime.trap("Invalid position") };
      };
    };

    if (wicketkeepers < 1 or wicketkeepers > 4) {
      Runtime.trap("Must have 1-4 wicketkeepers");
    };
    if (batsmen < 3 or batsmen > 6) {
      Runtime.trap("Must have 3-6 batsmen");
    };
    if (allrounders < 1 or allrounders > 4) {
      Runtime.trap("Must have 1-4 allrounders");
    };
    if (bowlers < 3 or bowlers > 6) {
      Runtime.trap("Must have 3-6 bowlers");
    };
    if (totalCredits > 100) {
      Runtime.trap("Total credits exceed 100");
    };

    let fantasyTeamId = Time.now().toText();
    let fantasyTeam = {
      id = fantasyTeamId;
      owner = caller;
      matchId;
      players = selectedPlayers;
      captain = captainId;
      viceCaptain = viceCaptainId;
      totalCredits;
    };

    fantasyTeams.add(fantasyTeamId, fantasyTeam);
    fantasyTeamId;
  };

  // Function to join a contest
  public shared ({ caller }) func joinContest(contestId : Text, teamId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can join contests");
    };

    let contest = switch (contests.get(contestId)) {
      case (null) { Runtime.trap("Contest does not exist") };
      case (?value) { value };
    };

    if (contest.spotsFilled >= contest.totalSpots) {
      Runtime.trap("Contest is full");
    };

    let team = switch (fantasyTeams.get(teamId)) {
      case (null) { Runtime.trap("Fantasy team does not exist") };
      case (?value) { value };
    };

    if (team.owner != caller) {
      Runtime.trap("Cannot join contest with a team you don't own");
    };

    let userBalance = switch (userBalances.get(caller)) {
      case (null) { Runtime.trap("Please add funds to your wallet before joining contests") };
      case (?value) { value };
    };

    if (userBalance.balance < contest.entryFee) {
      Runtime.trap("Insufficient balance in wallet");
    };

    let newTransaction = {
      id = Time.now().toText();
      amount = contest.entryFee;
      transactionType = "entry_fee";
      timestamp = Time.now();
    };

    let updatedTransactions = userBalance.transactions.concat([newTransaction]);
    let updatedBalance = {
      owner = caller;
      balance = userBalance.balance - contest.entryFee;
      transactions = updatedTransactions;
    };
    userBalances.add(caller, updatedBalance);

    let updatedParticipants = contest.participants.concat([{ teamId; owner = caller; points = 0; rank = null }]);
    let updatedContest = {
      id = contest.id;
      matchId = contest.matchId;
      entryFee = contest.entryFee;
      prizePool = contest.prizePool;
      totalSpots = contest.totalSpots;
      spotsFilled = contest.spotsFilled + 1;
      participants = updatedParticipants;
    };
    contests.add(contestId, updatedContest);
  };

  // Stripe Integration for Wallet Top-Ups
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func addFunds(amount : Nat) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can add funds");
    };

    if (amount < 10 or amount > 10000) {
      Runtime.trap("Amount must be between ₹10 and ₹10,000");
    };

    let paymentSession = await Stripe.createCheckoutSession(
      getStripeConfiguration(),
      caller,
      [{
        currency = "INR";
        productName = "Funds";
        productDescription = "Deposit";
        priceInCents = amount * 100;
        quantity = 1;
      }],
      "success_url",
      "cancel_url",
      transform,
    );
    paymentSession;
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Admin functions for adding matches, players, contests
  public shared ({ caller }) func addMatch(match : Match) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add matches");
    };
    matches.add(match.id, match);
  };

  public shared ({ caller }) func addPlayer(player : Player) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add players");
    };
    players.add(player.id, player);
  };

  public shared ({ caller }) func addContest(contest : Contest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add contests");
    };
    contests.add(contest.id, contest);
  };

  // Queries for fetching matches, contests, teams, balances
  public query func getMatch(matchId : Text) : async Match {
    // Public data - no authorization needed
    switch (matches.get(matchId)) {
      case (null) { Runtime.trap("Match not found") };
      case (?match) { match };
    };
  };

  public query func getContest(contestId : Text) : async Contest {
    // Public data - no authorization needed
    switch (contests.get(contestId)) {
      case (null) { Runtime.trap("Contest not found") };
      case (?contest) { contest };
    };
  };

  public query ({ caller }) func getWalletBalance() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view wallet balance");
    };
    switch (userBalances.get(caller)) {
      case (null) { 0 };
      case (?balance) { balance.balance };
    };
  };

  public query ({ caller }) func getWalletTransactions() : async [WalletTransaction] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view transactions");
    };
    switch (userBalances.get(caller)) {
      case (null) { [] };
      case (?balance) { balance.transactions };
    };
  };

  public query ({ caller }) func getMyFantasyTeams() : async [FantasyTeam] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only registered users can view their teams");
    };
    let allTeams = fantasyTeams.values().toArray();
    allTeams.filter(func(team : FantasyTeam) : Bool { team.owner == caller });
  };

  public query func getFantasyTeam(teamId : Text) : async ?FantasyTeam {
    // Public data for leaderboard viewing - no authorization needed
    fantasyTeams.get(teamId);
  };

  public query func getAllMatches() : async [Match] {
    // Public data - no authorization needed
    matches.values().toArray();
  };

  public query func getContestsForMatch(matchId : Text) : async [Contest] {
    // Public data - no authorization needed
    let allContests = contests.values().toArray();
    allContests.filter(func(contest : Contest) : Bool { contest.matchId == matchId });
  };

  public query func getPlayer(playerId : Text) : async ?Player {
    // Public data - no authorization needed
    players.get(playerId);
  };

  public query func getAllPlayers() : async [Player] {
    // Public data - no authorization needed
    players.values().toArray();
  };
};
