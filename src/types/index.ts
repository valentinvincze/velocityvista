import { Dispatch, ReactNode, SetStateAction } from "react";

export type SignUpFormProps = {
  options: Option[];
};

export type Option = {
  name: string;
  id: string;
};

export interface ISignUpForm {
  fullName: string;
  jobTitle: string;
  emailAddress: string;
  password: string;
  role: string;
  division: string;
}

export interface ISignInForm {
  emailAddress: string;
  password: string;
}

export interface ILogSale {
  id?: number;
  amount: number;
  title: string;
  status: string;
  closing_date: string;
}

export interface ICreateDivision {
  div_name: string;
}

export interface ISendToken {
  emailAddress: string;
}

export type AuthState = {
  success: boolean;
  error: string;
} | null;

export type NavLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  icon?: ReactNode;
};

export type SignOutBtnProps = {
  icon: ReactNode;
};

export type NavbarProps = {
  avatar: ReactNode;
  name: string;
  jobtitle: string;
  role: string;
};

export type ModalProps = {
  trigger: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

export type StatCardProps = {
  title: string;
  icon: ReactNode;
  saleCount: number;
  rateStyle: { icon: ReactNode; style: string };
  currentRate: number;
  lastRate: number;
  overallRate: number;
  when: string;
};

export type PLChartProps = {
  label: string;
  currentDayCount: number;
  lastDayCount: number;
}[];

export type PanelControlProps = {
  role: string;
  divisions: Divisions;
  profiles: ProfileData;
  divProfiles: ProfileData;
};

export type PanelTableProps = {
  profiles: ProfileData;
  userRole: string;
  start: number;
  end: number;
  currentPageNum: number;
  setCurrentPageNum: Dispatch<SetStateAction<number>>;
  totalPageNum: number;
  totalUserCount: number;
};

export type TeamControlProps = {
  divisions: Divisions;
  role: string;
  id: string;
  profiles: RepData;
  divProfiles: RepData;
};

export type TeamGridProps = {
  profiles: RepData;
  worstFiveReps: RepData;
  userRole: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  qualifiedReps: RepData;
  profilesWithDivName: RepData;
};

export type TeamCardProps = {
  data: {
    avatar_url: string | null;
    full_name: string;
    job_title: string;
    division_name: string | undefined;
    email: string;
    sale: string | number;
  };
  cardStyle: string;
  avatarInitialsStyle: string;
  initials: string;
  positionPillStyle?: string;
  rankingNumbers?: string | boolean;
  textStyles: {
    full_name?: string;
    job_title: string;
    division_name: string;
    email: string;
    amount?: string;
  };
  userRole: string;
};

export type LeaderboardControlProps = {
  divisions: Divisions;
  role: string;
  userId: string;
  profiles: RepData;
  divProfiles: RepData;
};

export type LB5BChartProps = {
  label: string;
  amount: number;
  avatar_url: string | null;
}[];

export type LW5BChartProps = LB5BChartProps;

export type userData =
  | {
      full_name: string;
      job_title: string;
      avatar_url: string;
    }
  | undefined
  | null;

export type Sales = ILogSale[] | null;

export type ProfileData =
  | {
      division_name?: string;
      id: string;
      full_name: string;
      email: string;
      role: "coo" | "admin" | "rep";
      created_at: string;
      division_id: string | null;
    }[]
  | null
  | undefined;

export type Divisions =
  | {
      id: string;
      name: string;
    }[]
  | null
  | undefined;

export type RepData =
  | {
      id: string;
      full_name: string;
      email: string;
      job_title: string;
      avatar_url: string | null;
      division_id: string;
      sales: { sum: number | null }[];
      division_name?: string;
    }[]
  | null
  | undefined;
