import { Config } from "./type";

export default {
  auto_custom: false,
  auto_increment: false,
  extended_lobby: true,
  expanded_result: true,
  amount: {
    tank: 1,
    damage: 2,
    support: 2,
  },
  team: {
    first: { name: "Team 1", color: "#1e90ff" },
    second: { name: "Team 2 ", color: "#ff6347" },
  },
  math: {
    balance_limit: 2500,
    alpha: 3,
    beta: 1,
    gamma: 80,
    p: 2,
    q: 2,
    tank_weight: 1.1,
    damage_weight: 1.0,
    support_weight: 0.9,
  },
} as Config;
