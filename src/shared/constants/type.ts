export interface Config {
  auto_custom: boolean;
  auto_increment: boolean;
  extended_lobby: boolean;
  expanded_result: boolean;
  amount: RoleAmount;
  team: {
    first: Team;
    second: Team;
  };
  math: Math;
}
interface Math {
  balance_limit: number;
  alpha: number;
  beta: number;
  gamma: number;
  p: number;
  q: number;
  tank_weight: number;
  damage_weight: number;
  support_weight: number;
}
interface Team {
  name: string;
  color: string;
}
interface RoleAmount {
  tank: number;
  damage: number;
  support: number;
}
