import { HouseIcon } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { CurrencyInrIcon } from '@phosphor-icons/react/dist/ssr';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { ChatsCircleIcon } from '@phosphor-icons/react/dist/ssr/ChatsCircle';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'currency': CurrencyInrIcon,
  user: UserIcon,
  users: UsersIcon,
  home: HouseIcon,
  chat: ChatsCircleIcon
} as Record<string, Icon>;
